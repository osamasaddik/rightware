import request from "supertest";
import createApp from "../app";
import Captain from "../models/Captain";
import Admin from "../models/Admin";
import { getAdminToken } from "./helpers/auth";

const app = createApp();

describe("Captain CRUD", () => {
  let adminToken: string;
  let adminId: string;

  beforeAll(async () => {
    const admin = await Admin.create({
      name: "Captain Admin",
      email: "captainadmin@test.com",
      password: "Password123",
    });
    adminId = admin._id.toString();
    adminToken = getAdminToken(adminId, admin.email, admin.name);
  });

  it("should create a new captain", async () => {
    const captainData = {
      name: "John Doe",
      phone: "+1234567890",
      vehicleType: "bike",
    };

    const response = await request(app)
      .post("/api/admin/captains")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(captainData);

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe(captainData.name);
    expect(response.body.data.phone).toBe(captainData.phone);
  });

  it("should list all captains", async () => {
    const response = await request(app)
      .get("/api/admin/captains")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("should update a captain", async () => {
    const captain = await Captain.findOne({ name: "John Doe" });
    const updateData = { name: "John Updated" };

    const response = await request(app)
      .put(`/api/admin/captains/${captain!._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(updateData.name);
  });

  it("should deactivate a captain", async () => {
    const captain = await Captain.findOne({ name: "John Updated" });

    const response = await request(app)
      .patch(`/api/admin/captains/${captain!._id}/deactivate`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("inactive");
    expect(response.body.data.availability).toBe("offline");
  });

  it("should delete a captain", async () => {
    const captain = await Captain.findOne({ name: "John Updated" });

    const response = await request(app)
      .delete(`/api/admin/captains/${captain!._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    const deleted = await Captain.findById(captain!._id);
    expect(deleted).toBeNull();
  });
});
