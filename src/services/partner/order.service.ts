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
}

export default new PartnerOrderService();
