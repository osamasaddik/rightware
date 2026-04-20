import captainOrderRepository from "../../repositories/captain/order.repository";
import { OrderStatus } from "../../utils/constants";
import { APP_MESSAGES } from "../../utils/app-messages";

export class CaptainOrderService {
  async getOrders(captainId: string) {
    const orders = await captainOrderRepository.getOrdersByCaptain(captainId);
    return { orders, total: orders.length };
  }

  async updateOrderStatus(orderId: string, captainId: string, status: OrderStatus) {
    const order = await captainOrderRepository.getOrderById(orderId, captainId);

    if (!order) {
      throw new Error("Order not found or not assigned to you");
    }

    // Validate status transitions
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.CREATED]: [],
      [OrderStatus.ASSIGNED]: [OrderStatus.PICKED_UP, OrderStatus.CANCELLED],
      [OrderStatus.PICKED_UP]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      throw new Error(`Cannot change status from ${order.status} to ${status}`);
    }

    const updatedOrder = await captainOrderRepository.updateOrderStatus(orderId, captainId, status);
    return updatedOrder;
  }
}

export default new CaptainOrderService();
