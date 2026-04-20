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

  async getOrders(
    partnerId: string,
    filters: any = {},
    sort: any = { createdAt: -1 },
    page: number = 1,
    limit: number = 20,
  ) {
    const mongoFilters = { partnerId, ...filters };
    const { items, total } = await orderRepository.findWithFilters(mongoFilters, sort, page, limit);
    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
