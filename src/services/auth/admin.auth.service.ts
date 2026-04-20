import jwt from "jsonwebtoken";
import Admin from "../../models/Admin";
import { UserRole } from "../../utils/constants";
import { APP_MESSAGES } from "../../utils/app-messages";

export class AdminAuthService {
  async login(email: string, password: string) {
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin || !(await admin.comparePassword(password))) {
      throw new Error(APP_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name, role: UserRole.ADMIN },
      process.env.JWT_SECRET!,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "8h") as any }
    );

    return {
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    };
  }
}

export default new AdminAuthService();
