import { Model, Document, QueryOptions } from "mongoose";

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: any): Promise<T> {
    return await this.model.create(data);
  }

  async findById(id: string, options?: QueryOptions): Promise<T | null> {
    return await this.model.findById(id, null, options);
  }

  async findOne(filter: any, options?: QueryOptions): Promise<T | null> {
    return await this.model.findOne(filter, null, options);
  }

  async find(
    filter: any,
    options?: QueryOptions,
    sort: any = { createdAt: -1 },
    skip: number = 0,
    limit: number = 20,
  ): Promise<T[]> {
    return await this.model.find(filter, null, options).sort(sort).skip(skip).limit(limit);
  }

  async update(id: string, data: any, options: QueryOptions = { returnDocument: "after" }): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, options);
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }

  async count(filter: any): Promise<number> {
    return await this.model.countDocuments(filter);
  }
}
