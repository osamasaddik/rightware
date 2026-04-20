import { Server, Socket } from "socket.io";
import { UserRole } from "../utils/constants";
import { APP_MESSAGES } from "../utils/app-messages";
import { SocketListenEvents, SocketEmitEvents } from "./socket.constants";
import locationService from "./location.service";
import { validateRole, validateToken } from "../utils/jwt.utils";

export const setupLocationSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected:", socket.id);

    // Captain Authentication
    socket.on(SocketListenEvents.CAPTAIN_AUTHENTICATE, async (data: { token: string }) => {
      console.log(`[Socket ${socket.id}] Captain authentication attempt`);
      try {
        if (!data || typeof data !== "object") {
          console.log(`[Socket ${socket.id}] Authentication failed: Invalid data format`);
          socket.emit(SocketEmitEvents.AUTH_ERROR, { message: "Invalid data format", success: false });
          return;
        }

        const tokenValidation = validateToken(data.token);
        if (!tokenValidation.valid) {
          console.log(`[Socket ${socket.id}] Authentication failed: ${tokenValidation.error?.message}`);
          socket.emit(SocketEmitEvents.AUTH_ERROR, tokenValidation.error);
          return;
        }

        const decoded = tokenValidation.decoded!;
        console.log(`[Socket ${socket.id}] Token decoded for user ID: ${decoded.id}, role: ${decoded.role}`);

        const roleValidation = validateRole(decoded.role, UserRole.CAPTAIN);
        if (!roleValidation.valid) {
          console.log(`[Socket ${socket.id}] Authentication failed: Invalid role ${decoded.role}`);
          socket.emit(SocketEmitEvents.AUTH_ERROR, roleValidation.error);
          return;
        }

        const captain = await locationService.verifyCaptain(decoded.id);

        socket.join(`captain:${captain._id}`);
        // @ts-ignore
        socket.captainId = captain._id.toString();
        console.log(`[Socket ${socket.id}] Captain ${captain._id} authenticated successfully`);
        socket.emit(SocketEmitEvents.AUTHENTICATED, { success: true, captainId: captain._id });
      } catch (err: any) {
        console.error(`[Socket ${socket.id}] Authentication error:`, err);
        socket.emit(SocketEmitEvents.AUTH_ERROR, {
          message: err.message || APP_MESSAGES.AUTH.INVALID_TOKEN,
          success: false,
        });
      }
    });

    // Captain Location Update
    socket.on(SocketListenEvents.CAPTAIN_LOCATION_UPDATE, async (data: { lat: number; lng: number }) => {
      console.log(`[Socket ${socket.id}] Location update received:`, data);
      try {
        // @ts-ignore
        const captainId = socket.captainId;
        if (!captainId) {
          console.log(`[Socket ${socket.id}] Location update failed: Not authenticated`);
          socket.emit(SocketEmitEvents.AUTH_ERROR, { message: APP_MESSAGES.AUTH.NOT_AUTHORIZED, success: false });
          return;
        }

        const locationValidation = locationService.validateLocation(data);
        if (!locationValidation.valid) {
          console.log(`[Socket ${socket.id}] Location update failed: ${locationValidation.error?.message}`);
          socket.emit(SocketEmitEvents.VALIDATION_ERROR, locationValidation.error);
          return;
        }

        const { lat, lng } = locationValidation.location!;
        const result = await locationService.updateCaptainLocation(captainId, lat, lng);

        console.log(`[Socket ${socket.id}] Location updated for captain ${captainId}: (${lat}, ${lng})`);

        // Broadcast to admins
        io.to("admins").emit(SocketEmitEvents.LOCATION_UPDATED, {
          captainId,
          ...result,
        });
        console.log(`[Socket ${socket.id}] Location broadcast to admins for captain ${captainId}`);

        // Send success confirmation to captain
        socket.emit(SocketEmitEvents.LOCATION_UPDATE_SUCCESS, {
          success: true,
          ...result,
        });
      } catch (err: any) {
        console.error(`[Socket ${socket.id}] Location update error:`, err);
        socket.emit(SocketEmitEvents.ERROR, {
          message: err.message || "Failed to update location",
          success: false,
        });

        if (err.message.includes("Captain not found") || err.message.includes("inactive")) {
          socket.disconnect();
        }
      }
    });

    // Admin Join
    socket.on(SocketListenEvents.ADMIN_JOIN, async () => {
      console.log(`[Socket ${socket.id}] Admin join attempt`);
      try {
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;

        if (!token) {
          console.log(`[Socket ${socket.id}] Admin join failed: No token provided`);
          socket.emit(SocketEmitEvents.AUTH_ERROR, { message: APP_MESSAGES.AUTH.NOT_AUTHORIZED, success: false });
          return;
        }

        const tokenValidation = validateToken(token);
        if (!tokenValidation.valid) {
          console.log(`[Socket ${socket.id}] Admin join failed: ${tokenValidation.error?.message}`);
          socket.emit(SocketEmitEvents.AUTH_ERROR, tokenValidation.error);
          return;
        }

        const decoded = tokenValidation.decoded!;
        const roleValidation = validateRole(decoded.role, UserRole.ADMIN);
        if (!roleValidation.valid) {
          console.log(`[Socket ${socket.id}] Admin join failed: Invalid role ${decoded.role}`);
          socket.emit(SocketEmitEvents.AUTH_ERROR, roleValidation.error);
          return;
        }

        socket.join("admins");
        console.log(`[Socket ${socket.id}] Admin joined successfully`);
        socket.emit(SocketEmitEvents.ADMIN_JOINED, { success: true });
      } catch (err: any) {
        console.error(`[Socket ${socket.id}] Admin join error:`, err);
        socket.emit(SocketEmitEvents.AUTH_ERROR, {
          message: err.message || "Admin join failed",
          success: false,
        });
      }
    });

    socket.on(SocketListenEvents.DISCONNECT, () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
