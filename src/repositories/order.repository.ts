import Order, { IOrder } from "../models/Order";

export class OrderRepository {
  private model = Order;

  async create(data: any) {
    return await this.model.create(data);
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }

  async findOne(filter: any) {
    return await this.model.findOne(filter);
  }

  async findByOrderNumber(orderNumber: string) {
    return await this.model.findOne({ orderNumber });
  }

  async findWithFilters(filters: any, sort: any, page: number = 1, limit: number = 20) {
    const pipeline: any[] = [
      { $match: filters },
      {
        $lookup: {
          from: "captains",
          localField: "captainId",
          foreignField: "_id",
          as: "captainId",
        },
      },
      { $unwind: { path: "$captainId", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "partners",
          localField: "partnerId",
          foreignField: "_id",
          as: "partnerId",
        },
      },
      { $unwind: { path: "$partnerId", preserveNullAndEmptyArrays: true } },
      {
        $facet: {
          data: [{ $sort: sort }, { $skip: (page - 1) * limit }, { $limit: limit }],
          metadata: [{ $count: "total" }],
        },
      },
    ];

    const result = await this.model.aggregate(pipeline);
    const items = result[0].data;
    const total = result[0].metadata[0]?.total || 0;

    return { items, total };
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

  async update(id: string, data: any) {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async updateOrderStatus(orderId: string, captainId: string, status: string) {
    return this.model.findOneAndUpdate({ _id: orderId, captainId }, { status }, { new: true });
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id);
  }
}

export default new OrderRepository();
