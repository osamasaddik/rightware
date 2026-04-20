import Captain from "../models/Captain";
import { APP_MESSAGES } from "../utils/app-messages";
import { TokenPayload, ValidationError } from "../utils/jwt.utils";

export type { TokenPayload, ValidationError };

export class LocationService {
  async updateCaptainLocation(captainId: string, lat: number, lng: number) {
    const captain = await Captain.findById(captainId);

    if (!captain) {
      throw new Error("Captain not found");
    }

    if (captain.status !== "active") {
      throw new Error(APP_MESSAGES.AUTH.CAPTAIN_INACTIVE);
    }

    await Captain.findByIdAndUpdate(captainId, {
      currentLocation: { lat, lng, updatedAt: new Date() },
    });

    return { lat, lng, updatedAt: new Date() };
  }

  async verifyCaptain(captainId: string) {
    const captain = await Captain.findById(captainId);

    if (!captain) {
      throw new Error("Captain not found");
    }

    if (captain.status !== "active") {
      throw new Error(APP_MESSAGES.AUTH.CAPTAIN_INACTIVE);
    }

    return captain;
  }

  validateLocation(data: any): { valid: boolean; error?: ValidationError; location?: { lat: number; lng: number } } {
    if (!data || typeof data !== "object") {
      return {
        valid: false,
        error: {
          message: "Invalid data format",
          success: false,
        },
      };
    }

    const { lat, lng } = data;

    if (lat === undefined || lat === null || typeof lat !== "number" || isNaN(lat)) {
      return {
        valid: false,
        error: {
          message: "Latitude is required and must be a valid number",
          success: false,
        },
      };
    }

    if (lng === undefined || lng === null || typeof lng !== "number" || isNaN(lng)) {
      return {
        valid: false,
        error: {
          message: "Longitude is required and must be a valid number",
          success: false,
        },
      };
    }

    if (lat < -90 || lat > 90) {
      return {
        valid: false,
        error: {
          message: "Latitude must be between -90 and 90",
          success: false,
        },
      };
    }

    if (lng < -180 || lng > 180) {
      return {
        valid: false,
        error: {
          message: "Longitude must be between -180 and 180",
          success: false,
        },
      };
    }

    return { valid: true, location: { lat, lng } };
  }
}

export default new LocationService();
