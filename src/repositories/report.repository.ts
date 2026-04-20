import Order from "../models/Order";
import { BaseRepository } from "./base.repository";

export class ReportRepository extends BaseRepository<any> {
  constructor() {
    super(Order as any);
  }

  async getOrderVolumeDrop(params: {
    previousFrom: Date;
    previousTo: Date;
    currentFrom: Date;
    currentTo: Date;
    minPreviousOrders: number;
    minDropPercentage: number;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
  }) {
    const {
      previousFrom,
      previousTo,
      currentFrom,
      currentTo,
      minPreviousOrders,
      minDropPercentage,
      page,
      limit,
      sortBy,
      sortOrder,
    } = params;

    const pipeline: any[] = [
      // Stage 1: Match orders with captains
      { $match: { captainId: { $ne: null } } },

      // Stage 2: Facet to calculate previous and current order counts
      {
        $facet: {
          previous: [
            { $match: { createdAt: { $gte: previousFrom, $lte: previousTo } } },
            { $group: { _id: "$captainId", previousOrders: { $sum: 1 } } },
          ],
          current: [
            { $match: { createdAt: { $gte: currentFrom, $lte: currentTo } } },
            { $group: { _id: "$captainId", currentOrders: { $sum: 1 } } },
          ],
        },
      },

      // Stage 3: Project to merge both facets
      {
        $project: {
          allCaptains: { $setUnion: ["$previous._id", "$current._id"] },
          previous: 1,
          current: 1,
        },
      },
      { $unwind: "$allCaptains" },

      // Stage 4: Merge previous and current orders for each captain
      {
        $project: {
          captainId: "$allCaptains",
          previousOrders: {
            $let: {
              vars: {
                prev: {
                  $filter: {
                    input: "$previous",
                    as: "p",
                    cond: { $eq: ["$$p._id", "$allCaptains"] },
                  },
                },
              },
              in: { $ifNull: [{ $arrayElemAt: ["$$prev.previousOrders", 0] }, 0] },
            },
          },
          currentOrders: {
            $let: {
              vars: {
                curr: {
                  $filter: {
                    input: "$current",
                    as: "c",
                    cond: { $eq: ["$$c._id", "$allCaptains"] },
                  },
                },
              },
              in: { $ifNull: [{ $arrayElemAt: ["$$curr.currentOrders", 0] }, 0] },
            },
          },
        },
      },

      // Stage 5: Lookup Captain name
      {
        $lookup: {
          from: "captains",
          localField: "captainId",
          foreignField: "_id",
          as: "captain",
        },
      },
      { $unwind: "$captain" },

      // Stage 6: Calculate dropCount and dropPercentage
      {
        $project: {
          captainId: 1,
          captainName: "$captain.name",
          previousOrders: 1,
          currentOrders: 1,
          dropCount: { $subtract: ["$previousOrders", "$currentOrders"] },
          dropPercentage: {
            $cond: [
              { $eq: ["$previousOrders", 0] },
              0,
              {
                $multiply: [
                  { $divide: [{ $subtract: ["$previousOrders", "$currentOrders"] }, "$previousOrders"] },
                  100,
                ],
              },
            ],
          },
        },
      },

      // Stage 7: Filter by minPreviousOrders and minDropPercentage
      {
        $match: {
          previousOrders: { $gte: minPreviousOrders },
          dropPercentage: { $gte: minDropPercentage },
          dropCount: { $gt: 0 },
        },
      },

      // Stage 8: Final Facet for data and count
      {
        $facet: {
          data: [
            { $sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
          total: [{ $count: "count" }],
        },
      },
    ];

    const result = await this.model.aggregate(pipeline);

    return {
      items: result[0].data,
      total: result[0].total[0]?.count || 0,
    };
  }
}

export default new ReportRepository();
