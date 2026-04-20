import orderRepository from "../../repositories/admin/order.repository";
import captainRepository from "../../repositories/captain/captain.repository";

export class AssignmentService {
  async assignCaptain(orderId: string, captainId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (["delivered", "cancelled"].includes(order.status)) {
      throw new Error("Cannot assign to delivered or cancelled orders");
    }

    const captain = await captainRepository.findById(captainId);
    if (!captain) throw new Error("Captain not found");

    if (captain.status !== "active") {
      throw new Error("Captain is not active");
    }

    if (captain.availability !== "online") {
      throw new Error("Captain is not online");
    }

    return await orderRepository.update(orderId, {
      captainId,
      status: "assigned",
    });
  }

  async unassignCaptain(orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (["delivered", "cancelled"].includes(order.status)) {
      throw new Error("Cannot unassign from delivered or cancelled orders");
    }

    return await orderRepository.update(orderId, {
      captainId: null,
      status: "created",
    });
  }
}

export default new AssignmentService();
