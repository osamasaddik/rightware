import orderRepository from "../../repositories/order.repository";
import captainRepository from "../../repositories/captain.repository";
import { APP_MESSAGES } from "../../utils/app-messages";
import { OrderStatus } from "../../utils/constants";

export class AssignmentService {
  async assignCaptain(orderId: string, captainId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new Error(APP_MESSAGES.ORDER.NOT_FOUND);

    if ([OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)) {
      throw new Error(APP_MESSAGES.ORDER.CANNOT_REASSIGN);
    }

    const captain = await captainRepository.findById(captainId);
    if (!captain) throw new Error(APP_MESSAGES.CAPTAIN.NOT_FOUND);

    if (captain.status !== "active") {
      throw new Error(APP_MESSAGES.AUTH.CAPTAIN_INACTIVE);
    }

    if (captain.availability !== "online") {
      throw new Error("Captain is not online");
    }

    const updated = await orderRepository.update(orderId, {
      captainId,
      status: OrderStatus.ASSIGNED,
    });
    console.log(`📦 ${APP_MESSAGES.ORDER.ASSIGNED} - Order ID: ${orderId}, Captain: ${captain.name} (${captainId})`);
    return updated;
  }

  async unassignCaptain(orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new Error(APP_MESSAGES.ORDER.NOT_FOUND);

    if ([OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)) {
      throw new Error("Cannot unassign from delivered or cancelled orders");
    }

    const updated = await orderRepository.update(orderId, {
      captainId: null,
      status: OrderStatus.CREATED,
    });
    console.log(`🔄 ${APP_MESSAGES.ORDER.UNASSIGNED} - Order ID: ${orderId}`);
    return updated;
  }
}

export default new AssignmentService();
