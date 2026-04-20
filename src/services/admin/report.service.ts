import reportRepository from "../../repositories/report.repository";

export class AdminReportService {
  async getOrderVolumeDrop(query: any) {
    const {
      previousFrom,
      previousTo,
      currentFrom,
      currentTo,
      minPreviousOrders = 1,
      minDropPercentage = 0,
      page = 1,
      limit = 20,
      sortBy = "dropPercentage",
      sortOrder = "desc",
    } = query;

    const params = {
      previousFrom: new Date(previousFrom),
      previousTo: new Date(previousTo),
      currentFrom: new Date(currentFrom),
      currentTo: new Date(currentTo),
      minPreviousOrders: Number(minPreviousOrders),
      minDropPercentage: Number(minDropPercentage),
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy as string,
      sortOrder: sortOrder as "asc" | "desc",
    };

    const result = await reportRepository.getOrderVolumeDrop(params);

    return {
      items: result.items,
      meta: {
        total: result.total,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(result.total / params.limit),
      },
    };
  }
}

export default new AdminReportService();
