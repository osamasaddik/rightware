import Partner from "../../models/Partner";
import { BaseRepository } from "../base.repository";

export class PartnerRepository extends BaseRepository<any> {
  constructor() {
    super(Partner as any);
  }

  async findByRawApiKey(rawKey: string) {
    return (Partner as any).findByRawApiKey(rawKey);
  }
}

export default new PartnerRepository();
