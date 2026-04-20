import orderRepository from "../../repositories/order.repository";
import { APP_MESSAGES } from "../../utils/app-messages";

export class AdminOrderService {
  async createOrder(data: any, partnerId?: string) {
    const orderData = {
      ...data,
      orderNumber: `ORD-${Date.now()}`,
      partnerId: partnerId || data.partnerId,
    };
    return await orderRepository.create(orderData);
  }

  async getOrders(filters: any, sort: any = { createdAt: -1 }, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const items = await orderRepository.findWithFilters(filters, sort, skip, limit);
    const total = await orderRepository.count(filters);
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

  async getOrderById(id: string) {
    const order = await orderRepository.findById(id);
    if (!order) throw new Error("Order not found");
    return order;
  }

  async updateOrder(id: string, data: any) {
    const order = await orderRepository.findById(id);
    if (!order) throw new Error("Order not found");

    if (["delivered", "cancelled"].includes(order.status)) {
      throw new Error("Cannot update delivered or cancelled orders");
    }

    return await orderRepository.update(id, data);
  }

  async deleteOrder(id: string) {
    const order = await orderRepository.delete(id);
    if (!order) throw new Error("Order not found");
    return order;
  }
}

export default new AdminOrderService();
