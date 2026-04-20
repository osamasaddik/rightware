import orderRepository from "../../repositories/order.repository";

export class PartnerOrderService {
  async createPartnerOrder(data: any, partnerId: string) {
    if (data.externalReference) {
      const existing = await orderRepository.findOne({
        partnerId,
        externalReference: data.externalReference,
      });
      if (existing) return { order: existing, isNew: false };
    }

    const orderData = {
      ...data,
      orderNumber: `ORD-${Date.now()}`,
      partnerId,
    };
    const order = await orderRepository.create(orderData);
    return { order, isNew: true };
  }

  async getOrders(partnerId: string) {
    const orders = await orderRepository.find({ partnerId }, {}, { createdAt: -1 });
    return { orders, total: orders.length };
  }

  async getOrderById(orderId: string, partnerId: string) {
    const order = await orderRepository.findOne({ _id: orderId, partnerId });
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }
}

export default new PartnerOrderService();
