import Admin from "../../src/models/Admin";

export const seedAdmin = async () => {
  console.log("Seeding Admin...");

  await Admin.deleteMany({});

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@delivery.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@1234";

  await Admin.create({
    name: "Super Admin",
    email: adminEmail,
    password: adminPassword, // Will be hashed by pre-save hook
  });

  console.log(`Admin seeded: ${adminEmail} / ${adminPassword}`);
};
