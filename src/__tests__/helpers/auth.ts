import jwt from "jsonwebtoken";
import config from "../../config";
import { UserRole } from "../../utils/constants";

export const getAdminToken = (id: string, email: string, name: string) => {
  return jwt.sign(
    { id, email, name, role: UserRole.ADMIN },
    config.JWT_SECRET,
    { expiresIn: "1h" }
  );
};
