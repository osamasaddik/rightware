import { IAdmin } from "../models/Admin";
import { IPartner } from "../models/Partner";
import { ICaptain } from "../models/Captain";
import { UserRole } from "../utils/constants";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      role?: UserRole;
      admin?: IAdmin;
      partner?: IPartner;
      captain?: ICaptain;
    }
  }
}

export interface TokenPayload {
  id: string;
  email?: string;
  name: string;
  role: UserRole;
}
