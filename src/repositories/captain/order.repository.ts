import Order, { IOrder } from "../../models/Order";
import { BaseRepository } from "../base.repository";

export class CaptainOrderRepository extends BaseRepository<IOrder> {
  constructor() {
    super(Order);
  }

  async getOrdersByCaptain(captainId: string) {
    return Order.find({ captainId }).sort({ createdAt: -1 });
  }

  async getOrderById(orderId: string, captainId: string) {
    return Order.findOne({ _id: orderId, captainId });
  }

  async updateOrderStatus(orderId: string, captainId: string, status: string) {
    return Order.findOneAndUpdate({ _id: orderId, captainId }, { status }, { returnDocument: "after" });
  }
}

export default new CaptainOrderRepository();
