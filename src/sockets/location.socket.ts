import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import Captain from "../models/Captain";
import config from "../config";
import { UserRole } from "../utils/constants";
import { APP_MESSAGES } from "../utils/app-messages";

export const setupLocationSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected:", socket.id);

    // Captain Authentication
    socket.on("captain:authenticate", async (data: { token: string }) => {
      try {
        const decoded = jwt.verify(data.token, config.JWT_SECRET) as any;
        if (decoded.role !== UserRole.CAPTAIN) {
          socket.emit("auth_error", { message: APP_MESSAGES.AUTH.INVALID_ROLE });
          return;
        }

        const captain = await Captain.findById(decoded.id);
        if (!captain || captain.status !== "active") {
          socket.emit("auth_error", { message: APP_MESSAGES.AUTH.CAPTAIN_INACTIVE });
          return;
        }
        socket.join(`captain:${captain._id}`);
        // @ts-ignore
        socket.captainId = captain._id.toString();
        socket.emit("authenticated", { success: true, captainId: captain._id });
      } catch (err) {
        socket.emit("auth_error", { message: APP_MESSAGES.AUTH.INVALID_TOKEN });
      }
    });

    // Captain Location Update
    socket.on("captain:location_update", async (data: { lat: number; lng: number }) => {
      try {
        // @ts-ignore
        const captainId = socket.captainId;
        if (!captainId) {
          socket.emit("auth_error", { message: APP_MESSAGES.AUTH.NOT_AUTHORIZED });
          return;
        }

        const { lat, lng } = data;
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          socket.emit("validation_error", { message: "Invalid coordinates" });
          return;
        }

        const captain = await Captain.findById(captainId);
        if (!captain || captain.status !== "active") {
          socket.emit("auth_error", { message: APP_MESSAGES.AUTH.CAPTAIN_INACTIVE });
          socket.disconnect();
          return;
        }

        await Captain.findByIdAndUpdate(captainId, {
          currentLocation: { lat, lng, updatedAt: new Date() },
        });

        // Broadcast to admins
        io.to("admins").emit("location:updated", {
          captainId,
          lat,
          lng,
          updatedAt: new Date(),
        });
      } catch (err) {
        console.error("Location update error:", err);
      }
    });

    // Admin Join
    socket.on("admin:join", async () => {
      try {
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;
        if (!token) {
          socket.emit("auth_error", { message: APP_MESSAGES.AUTH.NOT_AUTHORIZED });
          return;
        }

        jwt.verify(token as string, config.JWT_SECRET, (err: any, decoded: any) => {
          if (err || decoded.role !== UserRole.ADMIN) {
            socket.emit("auth_error", { message: APP_MESSAGES.AUTH.INVALID_TOKEN });
            return;
          }
          socket.join("admins");
          socket.emit("admin:joined", { success: true });
        });
      } catch (err) {
        socket.emit("auth_error", { message: "Admin join failed" });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
