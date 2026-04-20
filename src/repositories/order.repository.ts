import Order, { IOrder } from "../models/Order";
import { BaseRepository } from "./base.repository";

export class OrderRepository extends BaseRepository<IOrder> {
  constructor() {
    super(Order);
  }

  async findByOrderNumber(orderNumber: string) {
    return await this.model.findOne({ orderNumber });
  }

  async findWithFilters(filters: any, sort: any, skip: number, limit: number) {
    return await this.model
      .find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("captainId")
      .populate("partnerId");
  }

  async getOrdersByCaptain(captainId: string) {
    return this.model.find({ captainId }).sort({ createdAt: -1 });
  }

  async getOrderById(orderId: string, captainId?: string) {
    const filter: any = { _id: orderId };
    if (captainId) {
      filter.captainId = captainId;
    }
    return this.model.findOne(filter);
  }

  async updateOrderStatus(orderId: string, captainId: string, status: string) {
    return this.model.findOneAndUpdate({ _id: orderId, captainId }, { status }, { returnDocument: "after" });
  }
}

export default new OrderRepository();
