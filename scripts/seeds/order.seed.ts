import Order from "../../src/models/Order";

export const seedOrders = async (captains: any[]) => {
  console.log("Seeding Orders...");

  await Order.deleteMany({});

  const regions = ["Downtown", "Uptown", "Suburbs", "Industrial"];
  const statuses = ["created", "assigned", "picked_up", "delivered", "cancelled"];

  const ordersData = [];
  const now = new Date();

  for (let i = 1; i <= 30; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];

    // Simulate historical data for report
    const createdAt = new Date(now);
    createdAt.setDate(now.getDate() - Math.floor(Math.random() * 60)); // Random date in last 60 days

    let captainId = null;
    if (["assigned", "picked_up", "delivered"].includes(status!)) {
      captainId = captains[Math.floor(Math.random() * captains.length)]._id;
    }

    ordersData.push({
      orderNumber: `ORD-${Date.now()}-${i}`,
      customerName: `Customer ${i}`,
      customerPhone: `+198765432${i % 10}`,
      region,
      fullAddress: `${i} Main St, ${region}`,
      location: {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.006 + (Math.random() - 0.5) * 0.1,
      },
      status,
      captainId,
      createdAt,
    });
  }

  await Order.insertMany(ordersData);

  console.log(`${ordersData.length} orders seeded`);
};
