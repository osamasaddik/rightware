import Captain from "../../models/Captain";
import { BaseRepository } from "../base.repository";

export class CaptainRepository extends BaseRepository<any> {
  constructor() {
    super(Captain as any);
  }

  async findByPhone(phone: string) {
    return await this.model.findOne({ phone });
  }
}

export default new CaptainRepository();
