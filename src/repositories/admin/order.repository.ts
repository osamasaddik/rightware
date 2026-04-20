import Order from "../../models/Order";
import { BaseRepository } from "../base.repository";

export class OrderRepository extends BaseRepository<any> {
  constructor() {
    super(Order as any);
  }

  async findByOrderNumber(orderNumber: string) {
    return await this.model.findOne({ orderNumber });
  }

  async findWithFilters(
    filters: any,
    sort: any,
    skip: number,
    limit: number
  ) {
    return await this.model
      .find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('captainId')
      .populate('partnerId');
  }
}

export default new OrderRepository();
