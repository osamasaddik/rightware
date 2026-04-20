export const APP_MESSAGES = {
  AUTH: {
    NOT_AUTHORIZED: "Not authorized, no token or API key",
    ADMIN_NOT_FOUND: "Admin not found",
    CAPTAIN_NOT_FOUND: "Captain not found",
    INVALID_ROLE: "Invalid role in token",
    INVALID_API_KEY: "Invalid API key",
    INVALID_TOKEN: "Not authorized, invalid token",
    TOKEN_EXPIRED: "Not authorized, token expired",
    INVALID_CREDENTIALS: "Invalid credentials",
    ROLE_NOT_AUTHORIZED: (role: string) => `User role ${role} is not authorized to access this route`,
    PROVIDE_VALID_EMAIL: "Please provide a valid email",
    PASSWORD_REQUIRED: "Password is required",
  },
  ERROR: {
    VALIDATION_ERROR: "Validation Error",
    TOKEN_INVALID: "Invalid token",
    TOKEN_EXPIRED: "Token expired",
    INTERNAL_SERVER_ERROR: "Internal server error",
    DUPLICATE_FIELD: (field: string) => `Duplicate field value: ${field}`,
  },
  HEALTH: {
    OK: "ok",
  },
};
