import crypto from "crypto";
import bcrypt from "bcryptjs";
import Partner from "../../src/models/Partner";

export const seedPartners = async () => {
  console.log("Seeding Partners...");

  await Partner.deleteMany({});

  const partners = [{ name: "Acme Corp" }, { name: "Global Logistics" }];

  for (const p of partners) {
    const rawKey = crypto.randomBytes(16).toString("hex");
    const apiKeyPrefix = rawKey.slice(0, 8);
    const hashedKey = await bcrypt.hash(rawKey, 10);

    const partner = await Partner.create({
      name: p.name,
      apiKey: hashedKey,
      apiKeyPrefix,
      isActive: true,
    });

    console.log(`Partner: ${partner.name}`);
    console.log(`Raw API Key: ${rawKey} (SAVE THIS!)`);
  }
};
