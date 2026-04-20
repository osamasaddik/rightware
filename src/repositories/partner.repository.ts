import Partner from "../models/Partner";

export class PartnerRepository {
  private model = Partner;

  async create(data: any) {
    return await this.model.create(data);
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }

  async findOne(filter: any) {
    return await this.model.findOne(filter);
  }

  async findByRawApiKey(rawKey: string) {
    return (Partner as any).findByRawApiKey(rawKey);
  }

  async update(id: string, data: any) {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id);
  }
}

export default new PartnerRepository();
