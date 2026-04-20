import captainRepository from "../../repositories/captain/captain.repository";
import { APP_MESSAGES } from "../../utils/app-messages";

export class AdminCaptainService {
  async createCaptain(data: any) {
    const existing = await captainRepository.findByPhone(data.phone);
    if (existing) {
      throw new Error(APP_MESSAGES.AUTH.CAPTAIN_EXISTS);
    }
    return await captainRepository.create(data);
  }

  async getCaptains(filters: any, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const items = await captainRepository.find(filters, {}, { createdAt: -1 }, skip, limit);
    const total = await captainRepository.count(filters);
    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCaptainById(id: string) {
    const captain = await captainRepository.findById(id);
    if (!captain) throw new Error("Captain not found");
    return captain;
  }

  async updateCaptain(id: string, data: any) {
    const captain = await captainRepository.update(id, data);
    if (!captain) throw new Error("Captain not found");
    return captain;
  }

  async deleteCaptain(id: string) {
    const captain = await captainRepository.delete(id);
    if (!captain) throw new Error("Captain not found");
    return captain;
  }

  async activateCaptain(id: string) {
    const captain = await captainRepository.findById(id);
    if (!captain) throw new Error("Captain not found");
    if (captain.status === "active") throw new Error("Captain is already active");

    return await captainRepository.update(id, { status: "active" });
  }

  async deactivateCaptain(id: string) {
    const captain = await captainRepository.findById(id);
    if (!captain) throw new Error("Captain not found");
    if (captain.status === "inactive") throw new Error("Captain is already inactive");

    return await captainRepository.update(id, {
      status: "inactive",
      availability: "offline",
    });
  }
}

export default new AdminCaptainService();
