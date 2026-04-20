import Admin from "../../src/models/Admin";
import { config } from "../../src/config";

export const seedAdmin = async () => {
  console.log("Seeding Admin...");

  await Admin.deleteMany({});

  await Admin.create({
    name: "Super Admin",
    email: config.SEED_ADMIN_EMAIL,
    password: config.SEED_ADMIN_PASSWORD, // Will be hashed by pre-save hook
  });

  console.log(`Admin seeded: ${config.SEED_ADMIN_EMAIL} / ${config.SEED_ADMIN_PASSWORD}`);
};
