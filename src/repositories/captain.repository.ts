import Captain from "../models/Captain";

export class CaptainRepository {
  private model = Captain;

  async create(data: any) {
    return await this.model.create(data);
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }

  async findOne(filter: any) {
    return await this.model.findOne(filter);
  }

  async findByPhone(phone: string) {
    return await this.model.findOne({ phone });
  }

  async findAll(filter: any, sort: any = { createdAt: -1 }, page: number = 1, limit: number = 20) {
    const pipeline: any[] = [
      { $match: filter },
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

  async update(id: string, data: any) {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id);
  }
}

export default new CaptainRepository();
