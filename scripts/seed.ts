import { connectDB } from "../src/config/db";
import { seedAdmin } from "./seeds/admin.seed";
import { seedPartners } from "./seeds/partner.seed";
import { seedCaptains } from "./seeds/captain.seed";
import { seedOrders } from "./seeds/order.seed";
import config from "../src/config";

const seed = async () => {
  try {
    await connectDB();
    console.log("Starting database seeding...\n");

    await seedAdmin();
    await seedPartners();
    const captains = await seedCaptains();
    await seedOrders(captains);

    console.log("\nSeed complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seed();
