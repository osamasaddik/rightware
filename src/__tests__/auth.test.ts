import request from "supertest";
import createApp from "../app";
import Admin from "../models/Admin";

const app = createApp();

describe("Auth Endpoints", () => {
  const adminEmail = "test@admin.com";
  const adminPassword = "Password123";

  beforeAll(async () => {
    await Admin.create({
      name: "Test Admin",
      email: adminEmail,
      password: adminPassword,
    });
  });

  it("should login with valid credentials", async () => {
    const response = await request(app)
      .post("/api/admin/auth/login")
      .send({
        email: adminEmail,
        password: adminPassword,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
    expect(response.body.data.admin.email).toBe(adminEmail);
  });

  it("should return 401 for invalid password", async () => {
    const response = await request(app)
      .post("/api/admin/auth/login")
      .send({
        email: adminEmail,
        password: "WrongPassword",
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should return 401 for unknown email", async () => {
    const response = await request(app)
      .post("/api/admin/auth/login")
      .send({
        email: "unknown@admin.com",
        password: adminPassword,
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
