import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import Captain from "../models/Captain";

export const setupLocationSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected:", socket.id);

    // Captain Authentication
    socket.on("captain:authenticate", async (data: { captainId: string }) => {
      try {
        const captain = await Captain.findById(data.captainId);
        if (!captain || captain.status !== "active") {
          socket.emit("auth_error", { message: "Invalid or inactive captain" });
          return;
        }
        socket.join(`captain:${data.captainId}`);
        socket.emit("authenticated", { success: true, captainId: data.captainId });
      } catch (err) {
        socket.emit("auth_error", { message: "Authentication failed" });
      }
    });

    // Captain Location Update
    socket.on("captain:location_update", async (data: { captainId: string; lat: number; lng: number }) => {
      try {
        const { captainId, lat, lng } = data;
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          socket.emit("validation_error", { message: "Invalid coordinates" });
          return;
        }

        const captain = await Captain.findById(captainId);
        if (!captain || captain.status !== "active") {
          socket.emit("auth_error", { message: "Captain is no longer active" });
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
          socket.emit("auth_error", { message: "Token required" });
          return;
        }

        jwt.verify(token as string, process.env.JWT_SECRET!, (err: any, decoded: any) => {
          if (err) {
            socket.emit("auth_error", { message: "Invalid token" });
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
