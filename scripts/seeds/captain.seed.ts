import Captain from "../../src/models/Captain";

export const seedCaptains = async () => {
  console.log("Seeding Captains...");

  await Captain.deleteMany({});

  const captainsData = [
    { name: "John Doe", phone: "+1234567890", vehicleType: "bike", status: "active", availability: "online" },
    { name: "Jane Smith", phone: "+1234567891", vehicleType: "car", status: "active", availability: "online" },
    { name: "Bob Wilson", phone: "+1234567892", vehicleType: "van", status: "active", availability: "offline" },
    { name: "Alice Brown", phone: "+1234567893", vehicleType: "bike", status: "inactive", availability: "offline" },
    { name: "Charlie Davis", phone: "+1234567894", vehicleType: "car", status: "active", availability: "online" },
  ];

  const captains = await Captain.insertMany(captainsData);

  console.log(`${captains.length} captains seeded`);

  return captains;
};
