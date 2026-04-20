export const APP_ROUTES = {
  ADMIN: {
    BASE: "/api/admin",
    AUTH: "/auth",
    CAPTAINS: "/captains",
    ORDERS: "/orders",
    ASSIGNMENT: "/orders/:id", // For /orders/:id/assign and /orders/:id/unassign
    REPORTS: "/reports",
  },
  CAPTAIN: {
    BASE: "/api/captain",
    AUTH: "/auth",
    ORDERS: "/orders",
  },
  PARTNER: {
    BASE: "/api/partner/v1",
    ORDERS: "/orders",
  },
  HEALTH: "/health",
};
