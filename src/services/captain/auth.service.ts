import jwt from "jsonwebtoken";
import Captain from "../../models/Captain";
import { UserRole } from "../../utils/constants";
import { APP_MESSAGES } from "../../utils/app-messages";
import config from "../../config";

export class CaptainAuthService {
  async login(phone: string) {
    const captain = await Captain.findOne({ phone });

    if (!captain) {
      throw new Error(APP_MESSAGES.AUTH.CAPTAIN_NOT_FOUND);
    }

    if (captain.status === "inactive") {
      throw new Error(APP_MESSAGES.AUTH.CAPTAIN_INACTIVE);
    }

    const token = jwt.sign(
      { id: captain._id, phone: captain.phone, name: captain.name, role: UserRole.CAPTAIN },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN as any },
    );

    return {
      token,
      captain: {
        id: captain._id,
        phone: captain.phone,
        name: captain.name,
        vehicleType: captain.vehicleType,
      },
    };
  }
}

export default new CaptainAuthService();
