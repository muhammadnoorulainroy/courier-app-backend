const PromoCode = require("../models/promocodeModel");
const Seller = require("../models/sellerModel");
const Shipment = require("../models/shipmentModel");
const Wallet = require("../models/walletModel");
const Courier = require("../models/courierModel");
const Penalty = require("../models/penaltyModel");
const Transaction = require("../models/transactionModel");
const Review = require("../models/reviewModel");
const Incident = require("../models/incidentModel");
const Recipient = require("../models/recipientModel");
const Address = require("../models/addressModel");
const Admin = require("../models/adminModel");
const Notification = require('../models/notificationModel')

const getAllSellersReport = async () => {
  const sellers = await Seller.find().select(
    "userId isActive firstName lastName businessName phone financialPhone createdAt"
  );

  const reportData = await Promise.all(
    sellers.map(async (seller) => {
      const referredShipments = await Shipment.countDocuments({
        referralId: seller.userId,
      });
      const referralEarnings = seller.referralEarnings || 0;

      const wallet = await Wallet.findOne({ userId: seller.userId });
      const firstPayoutRequest = wallet?.transactions
        ?.filter((t) => t.type === "withdrawal")
        ?.sort((a, b) => new Date(a.date) - new Date(b.date))[0]?.date;
      const lastPayoutRequest = wallet?.transactions
        ?.filter((t) => t.type === "withdrawal")
        ?.sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.date;

      return {
        id: seller.userId,
        status: seller.isActive ? "Active" : "Inactive",
        firstName: seller.firstName,
        lastName: seller.lastName,
        businessName: seller.businessName,
        mobile: seller.phone,
        financialPhone: seller.financialPhone,
        referralContact: seller.referralPhone || null,
        refereeCount: seller.referees?.length || 0,
        referredShipments,
        referralEarnings,
        signUpDate: seller.createdAt,
        firstPayoutRequest: firstPayoutRequest || null,
        lastPayoutRequest: lastPayoutRequest || null,
      };
    })
  );

  return reportData;
};

const getAllSendersShipmentActivity = async () => {
  const aggregateData = await Shipment.aggregate([
    {
      $group: {
        _id: "$senderId", // Group by senderId
        totalShipments: { $sum: 1 },
        deliveredShipments: {
          $sum: { $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0] },
        },
        cancelledShipments: {
          $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] },
        },
        inProgressShipments: {
          $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] },
        },
        lateShipments: { $sum: { $cond: ["$isLate", 1, 0] } },
        returnedShipments: {
          $sum: { $cond: [{ $eq: ["$status", "Returned"] }, 1, 0] },
        },
        damagedShipments: {
          $sum: { $cond: [{ $eq: ["$status", "Damaged"] }, 1, 0] },
        },
      },
    },
    {
      $lookup: {
        from: "sellers", // 'sellers' is the collection name for senders
        localField: "_id", // senderId in the shipments collection
        foreignField: "userId", // userId in the sellers collection
        as: "senderDetails",
      },
    },
    {
      $unwind: "$senderDetails",
    },
    {
      $project: {
        _id: 0,
        senderId: "$_id",
        firstName: "$senderDetails.firstName",
        lastName: "$senderDetails.lastName",
        businessName: "$senderDetails.businessName",
        phone: "$senderDetails.phone",
        totalShipments: 1,
        deliveredShipments: 1,
        cancelledShipments: 1,
        inProgressShipments: 1,
        lateShipments: 1,
        returnedShipments: 1,
        damagedShipments: 1,
      },
    },
  ]);

  return aggregateData;
};

const getAllSendersFinancialMetrics = async () => {
  const financialMetrics = await Shipment.aggregate([
    {
      $group: {
        _id: "$senderId", // Group by senderId
        valueOfDelivered: {
          $sum: {
            $cond: [{ $eq: ["$status", "Delivered"] }, "$summary.totalCost", 0],
          },
        },
        valueOfCancelled: {
          $sum: {
            $cond: [{ $eq: ["$status", "Cancelled"] }, "$summary.totalCost", 0],
          },
        },
        valueOfInProgress: {
          $sum: {
            $cond: [
              { $eq: ["$status", "In Progress"] },
              "$summary.totalCost",
              0,
            ],
          },
        },
        valueOfLate: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ["$status", "Delivered"] }, "$isLate"] },
              "$summary.totalCost",
              0,
            ],
          },
        },
        valueOfReturned: {
          $sum: {
            $cond: [{ $eq: ["$status", "Returned"] }, "$summary.totalCost", 0],
          },
        },
        valueOfDamaged: {
          $sum: {
            $cond: [{ $eq: ["$status", "Damaged"] }, "$summary.totalCost", 0],
          },
        },
        totalShipmentValue: { $sum: "$summary.totalCost" },
        revenue: { $sum: "$summary.revenue" },
        shippingCosts: { $sum: "$summary.shippingCost" },
        courierPayment: { $sum: "$summary.courierPayment" },
        paymentFees: { $sum: "$summary.paymentFees" },
        referralPayments: { $sum: "$summary.referralPayment" },
        profit: { $sum: "$summary.profit" },
      },
    },
    {
      $lookup: {
        from: "sellers", // 'sellers' is the collection name for senders
        localField: "_id", // senderId in the shipments collection
        foreignField: "userId", // userId in the sellers collection
        as: "senderDetails",
      },
    },
    {
      $lookup: {
        from: "wallets", // wallets' is the collection name for wallets
        localField: "_id", // senderId
        foreignField: "userId", // userId in the wallets collection
        as: "walletDetails",
      },
    },
    {
      $unwind: "$senderDetails",
    },
    {
      $project: {
        _id: 0,
        senderId: "$_id",
        firstName: "$senderDetails.firstName",
        lastName: "$senderDetails.lastName",
        businessName: "$senderDetails.businessName",
        phone: "$senderDetails.phone",
        valueOfDelivered: 1,
        valueOfCancelled: 1,
        valueOfInProgress: 1,
        valueOfLate: 1,
        valueOfReturned: 1,
        valueOfDamaged: 1,
        totalShipmentValue: 1,
        revenue: 1,
        shippingCosts: 1,
        courierPayment: 1,
        paymentFees: 1,
        referralPayments: 1,
        profit: 1,
        walletBalance: {
          $ifNull: [{ $arrayElemAt: ["$walletDetails.balance", 0] }, 0],
        },
        payoutRequests: {
          $size: {
            $ifNull: [{ $arrayElemAt: ["$walletDetails.transactions", 0] }, []],
          },
        },
        totalPayouts: {
          $sum: {
            $ifNull: [
              { $arrayElemAt: ["$walletDetails.transactions.amount", 0] },
              0,
            ],
          },
        },
      },
    },
  ]);

  return financialMetrics;
};

const getPromotionsAndEngagementMetrics = async () => {
  const promoUsageStats = await Shipment.aggregate([
    { $match: { promoCode: { $exists: true, $ne: null } } },
    {
      $group: {
        _id: "$promoCode",
        count: { $sum: 1 },
        totalSavings: { $sum: "$summary.discount" },
      },
    },
  ]);

  const promoCodes = await PromoCode.find().lean();

  const promoMetrics = promoCodes.map((promo) => {
    const usage = promoUsageStats.find((u) => u._id === promo.promoCode);
    return {
      promoCode: promo.promoCode,
      startDate: promo.startDate,
      endDate: promo.endDate,
      type: promo.promoCodeType,
      usageCount: usage ? usage.count : 0,
      totalSavings: usage ? usage.totalSavings : 0,
    };
  });

  const courierAndRecipientStats = await Shipment.aggregate([
    { $match: { promoCode: { $exists: true, $ne: null } } },
    {
      $group: {
        _id: null,
        couriers: { $addToSet: "$courierId" },
        recipients: { $addToSet: "$recipientId" },
      },
    },
    {
      $project: {
        totalCouriers: { $size: "$couriers" },
        totalRecipients: { $size: "$recipients" },
      },
    },
  ]);

  const { totalCouriers, totalRecipients } = courierAndRecipientStats[0] || {
    totalCouriers: 0,
    totalRecipients: 0,
  };

  return {
    promoCodes: promoMetrics,
    totalCouriersServed: totalCouriers,
    totalRecipientsServed: totalRecipients,
  };
};

const getPaymentMetrics = async () => {
  const depositStats = await Transaction.aggregate([
    { $match: { type: "deposit" | "credit" | "In" } },
    {
      $lookup: {
        from: "sellers",
        localField: "userId",
        foreignField: "userId",
        as: "seller",
      },
    },
    { $unwind: "$seller" },
    {
      $group: {
        _id: "$userId",
        seller: { $first: "$seller" },
        depositCount: { $sum: 1 },
        totalDeposits: { $sum: "$amount" },
        depositFees: { $sum: "$fees" },
      },
    },
    {
      $project: {
        depositCount: 1,
        totalDeposits: 1,
        depositFees: 1,
        netDeposits: { $subtract: ["$totalDeposits", "$depositFees"] },
        "seller.firstName": 1,
        "seller.lastName": 1,
        "seller.phone": 1,
        "seller.businessName": 1,
      },
    },
  ]);

  const paymentStats = await Transaction.aggregate([
    { $match: { type: "payment" } },
    {
      $lookup: {
        from: "sellers",
        localField: "userId",
        foreignField: "userId",
        as: "seller",
      },
    },
    { $unwind: "$seller" },
    {
      $group: {
        _id: "$userId",
        seller: { $first: "$seller" },
        paymentCount: { $sum: 1 },
        totalPayments: { $sum: "$amount" },
        paymentFees: { $sum: "$fees" },
      },
    },
    {
      $project: {
        paymentCount: 1,
        totalPayments: 1,
        paymentFees: 1,
        netPayments: { $subtract: ["$totalPayments", "$paymentFees"] },
        "seller.firstName": 1,
        "seller.lastName": 1,
        "seller.phone": 1,
        "seller.businessName": 1,
      },
    },
  ]);

  const cashPaymentStats = await Transaction.aggregate([
    { $match: { type: "cash_payment" } },
    {
      $lookup: {
        from: "sellers",
        localField: "userId",
        foreignField: "userId",
        as: "seller",
      },
    },
    { $unwind: "$seller" },
    {
      $group: {
        _id: "$userId",
        seller: { $first: "$seller" },
        cashPaymentCount: { $sum: 1 },
        totalCashPayments: { $sum: "$amount" },
      },
    },
    {
      $project: {
        cashPaymentCount: 1,
        totalCashPayments: 1,
        "seller.firstName": 1,
        "seller.lastName": 1,
        "seller.phone": 1,
        "seller.businessName": 1,
      },
    },
  ]);

  return {
    deposits: depositStats,
    payments: paymentStats,
    cashPayments: cashPaymentStats,
  };
};

const getGovernorateShipmentStats = async () => {
  const governorates = [
    "Irbid",
    "Jerash",
    "Ajloun",
    "Mafraq",
    "Balqa",
    "Amman",
    "Madaba",
    "Zarqa",
    "Karak",
    "Tafileh",
    "Maan",
    "Aqaba",
  ];

  const statsTo = await Shipment.aggregate([
    {
      $group: {
        _id: "$dropOffDetails.location.district",
        count: { $sum: 1 },
      },
    },
    {
      $match: { _id: { $in: governorates } },
    },
  ]);

  const statsFrom = await Shipment.aggregate([
    {
      $group: {
        _id: "$pickUpDetails.location.district",
        count: { $sum: 1 },
      },
    },
    {
      $match: { _id: { $in: governorates } },
    },
  ]);

  const result = governorates.map((gov) => {
    const toStat = statsTo.find((stat) => stat._id === gov) || { count: 0 };
    const fromStat = statsFrom.find((stat) => stat._id === gov) || { count: 0 };
    return {
      governorate: gov,
      shipmentsTo: toStat.count,
      shipmentsFrom: fromStat.count,
    };
  });

  return result;
};

const getSessionMetrics = async () => {
  const sessionMetrics = await Seller.aggregate([
    {
      $unwind: "$sessions", // Unwind the sessions array to process each session individually
    },
    {
      $group: {
        _id: "$userId",
        sessionsPerDay: { $avg: 1 }, // Assumes sessions are stored daily
        averageSessionDuration: { $avg: "$sessions.duration" },
        lastSessionTime: { $max: "$sessions.endTime" },
        sellerDetails: {
          $first: {
            firstName: "$firstName",
            lastName: "$lastName",
            businessName: "$businessName",
            phone: "$phone",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        sessionsPerDay: 1,
        averageSessionDuration: 1,
        lastSessionTime: 1,
        sellerDetails: 1,
      },
    },
  ]);

  return sessionMetrics;
};

const getCourierInfoReport = async () => {
  return await Courier.find({}, {
    userId: 1,
    isActive: 1,
    firstName: 1,
    lastName: 1,
    phone: 1,
    createdAt: 1,
    lastSignIn: 1,
    birthdate: 1,
    driverLicenseIssueDate: 1,
    idExpiryDate: 1,
    vehicleBrand: 1,
    vehicleModel: 1,
    vehicleYear: 1,
    fuelType: 1,
    insuranceType: 1,
    insuranceExpiryDate: 1,
    registrationExpiryDate: 1
  }).lean();
};

const getCourierShipmentReport = async () => {
  const couriers = await Courier.find({}, { userId: 1, firstName: 1, lastName: 1 }).lean();

  const report = await Promise.all(
    couriers.map(async (courier) => {
      const shipments = await Shipment.aggregate([
        { $match: { courierId: courier.userId } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            dailyDeliveries: {
              $avg: {
                $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0],
              },
            },
          },
        },
      ]);

      const totalShipments = shipments.reduce((sum, item) => sum + item.count, 0);
      const deliveredShipments =
        shipments.find((item) => item._id === "Delivered")?.count || 0;
      const cancelledShipments =
        shipments.find((item) => item._id === "Cancelled")?.count || 0;
      const inProgressShipments =
        shipments.find((item) => item._id === "In Progress")?.count || 0;
      const lateShipments =
        shipments.find((item) => item._id === "Late")?.count || 0;
      const returnedShipments =
        shipments.find((item) => item._id === "Returned")?.count || 0;

      return {
        courierId: courier.userId,
        firstName: courier.firstName,
        lastName: courier.lastName,
        totalShipments,
        deliveredShipments,
        cancelledShipments,
        inProgressShipments,
        lateShipments,
        returnedShipments,
        dailyDeliveries: parseFloat(
          shipments.find((item) => item._id === "Delivered")?.dailyDeliveries || 0
        ).toFixed(2),
      };
    })
  );

  return report;
};

const getCourierFinancialMetrics = async () => {
  const couriers = await Courier.find({}, { userId: 1, firstName: 1, lastName: 1, phone: 1 }).lean();

  const report = await Promise.all(
    couriers.map(async (courier) => {
      const [shipments, wallet, penalties] = await Promise.all([
        Shipment.aggregate([
          { $match: { courierId: courier.userId } },
          {
            $group: {
              _id: "$status",
              totalCollectedPayments: { $sum: "$paymentDetails.finalAmount" },
              totalEarnings: { $sum: "$paymentDetails.courierEarnings" },
              companyIncome: { $sum: "$paymentDetails.companyEarnings" },
              collectedPerDelivery: {
                $avg: {
                  $cond: [{ $eq: ["$status", "Delivered"] }, "$paymentDetails.finalAmount", 0],
                },
              },
              earningsPerDelivery: {
                $avg: {
                  $cond: [{ $eq: ["$status", "Delivered"] }, "$paymentDetails.courierEarnings", 0],
                },
              },
            },
          },
        ]),
        Wallet.findOne({ userId: courier.userId }),
        Penalty.aggregate([
          { $match: { userId: courier.userId } },
          {
            $group: {
              _id: null,
              penaltyCount: { $sum: 1 },
              penaltyValue: { $sum: "$amount" },
            },
          },
        ]),
      ]);

      const shipmentMetrics = shipments[0] || {};
      const penaltyMetrics = penalties[0] || {};

      return {
        courierId: courier.userId,
        firstName: courier.firstName,
        lastName: courier.lastName,
        phone: courier.phone,
        earningsPerDelivery: parseFloat(shipmentMetrics.earningsPerDelivery || 0).toFixed(2),
        totalEarnings: parseFloat(shipmentMetrics.totalEarnings || 0).toFixed(2),
        companyIncome: parseFloat(shipmentMetrics.companyIncome || 0).toFixed(2),
        collectedPerDelivery: parseFloat(shipmentMetrics.collectedPerDelivery || 0).toFixed(2),
        totalCollectedPayments: parseFloat(shipmentMetrics.totalCollectedPayments || 0).toFixed(2),
        pendingBalance: parseFloat((wallet?.balance || 0) - (wallet?.withdrawnAmount || 0)).toFixed(2),
        withdrawalsMade: wallet?.transactions.filter((t) => t.type === "withdrawal").length || 0,
        paymentFees: parseFloat(wallet?.transactions.reduce((acc, t) => acc + (t.fee || 0), 0) || 0).toFixed(2),
        walletBalance: parseFloat(wallet?.balance || 0).toFixed(2),
        numberOfPenalties: penaltyMetrics.penaltyCount || 0,
        valueOfAppliedPenalties: parseFloat(penaltyMetrics.penaltyValue || 0).toFixed(2),
      };
    })
  );

  return report;
};

const getCourierPerformanceMetrics = async () => {
  const couriers = await Courier.find({}, { userId: 1, firstName: 1, lastName: 1, phone: 1 }).lean();

  const report = await Promise.all(
    couriers.map(async (courier) => {
      const [shipmentMetrics, reviews, incidents, noShows] = await Promise.all([
        Shipment.aggregate([
          { $match: { courierId: courier.userId, status: "Delivered" } },
          {
            $group: {
              _id: null,
              averageDeliveryTime: { $avg: "$deliveryDetails.duration" }, // Assuming duration is stored in minutes
              recipientsServed: { $addToSet: "$recipientId" },
              sendersServed: { $addToSet: "$senderId" },
            },
          },
        ]),
        Review.aggregate([
          { $match: { courierId: courier.userId } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$rating" },
              reviewCount: { $sum: 1 },
            },
          },
        ]),
        Incident.countDocuments({ courierId: courier.userId }),
        Shipment.countDocuments({ courierId: courier.userId, status: "No-Show" }),
      ]);

      const shipmentStats = shipmentMetrics[0] || {};
      const reviewStats = reviews[0] || {};

      return {
        courierId: courier.userId,
        firstName: courier.firstName,
        lastName: courier.lastName,
        phone: courier.phone,
        averageDeliveryTime: parseFloat(shipmentStats.averageDeliveryTime || 0).toFixed(2),
        averageRating: parseFloat(reviewStats.averageRating || 0).toFixed(2),
        reviewCount: reviewStats.reviewCount || 0,
        incidentReports: incidents || 0,
        noShows: noShows || 0,
        recipientsServed: shipmentStats.recipientsServed?.length || 0,
        sendersServed: shipmentStats.sendersServed?.length || 0,
      };
    })
  );

  return report;
};

const getCourierLocationCoverage = async () => {
  const locationCoverage = await Shipment.aggregate([
    {
      $group: {
        _id: "$courierId",
        districts: { $addToSet: "$dropOffDetails.location.district" },
        governorates: { $addToSet: "$dropOffDetails.location.governorate" },
      },
    },
    {
      $lookup: {
        from: "couriers",
        localField: "_id",
        foreignField: "userId",
        as: "courierDetails",
      },
    },
    {
      $unwind: "$courierDetails",
    },
    {
      $project: {
        _id: 0,
        courierId: "$_id",
        courierName: {
          $concat: ["$courierDetails.firstName", " ", "$courierDetails.lastName"],
        },
        phone: "$courierDetails.phone",
        districtsServed: { $size: "$districts" },
        governoratesServed: { $size: "$governorates" },
      },
    },
  ]);

  return locationCoverage;
};

const getCourierGeographicShipmentDistribution = async () => {
  const governorates = [
    "Irbid",
    "Jerash",
    "Ajloun",
    "Mafraq",
    "Balqa",
    "Amman",
    "Madaba",
    "Zarqa",
    "Karak",
    "Tafileh",
    "Maan",
    "Aqaba",
  ];

  const predefinedGovernorates = governorates.flatMap((governorate) => [
    {
      governorate,
      type: "Deliveries to",
      courierId: null,
      courierName: null,
      count: 0,
    },
    {
      governorate,
      type: "Sent from",
      courierId: null,
      courierName: null,
      count: 0,
    },
  ]);

  const results = await Shipment.aggregate([
    {
      $facet: governorates.reduce((facets, governorate) => {
        facets[`to_${governorate}`] = [
          {
            $match: {
              "dropOffDetails.location.governorate": governorate,
              status: "Delivered",
            },
          },
          {
            $group: {
              _id: "$courierId",
              count: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: "couriers",
              localField: "_id",
              foreignField: "userId",
              as: "courierDetails",
            },
          },
          {
            $unwind: { path: "$courierDetails", preserveNullAndEmptyArrays: true },
          },
          {
            $project: {
              governorate: { $literal: governorate },
              courierId: "$_id",
              courierName: {
                $concat: ["$courierDetails.firstName", " ", "$courierDetails.lastName"],
              },
              count: 1,
              type: { $literal: "Deliveries to" },
            },
          },
        ];
        facets[`from_${governorate}`] = [
          {
            $match: {
              "pickUpDetails.location.governorate": governorate,
            },
          },
          {
            $group: {
              _id: "$courierId",
              count: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: "couriers",
              localField: "_id",
              foreignField: "userId",
              as: "courierDetails",
            },
          },
          {
            $unwind: { path: "$courierDetails", preserveNullAndEmptyArrays: true },
          },
          {
            $project: {
              governorate: { $literal: governorate },
              courierId: "$_id",
              courierName: {
                $concat: ["$courierDetails.firstName", " ", "$courierDetails.lastName"],
              },
              count: 1,
              type: { $literal: "Sent from" },
            },
          },
        ];
        return facets;
      }, {}),
    },
    {
      $project: {
        data: {
          $concatArrays: governorates.flatMap((governorate) => [
            `$to_${governorate}`,
            `$from_${governorate}`,
          ]),
        },
      },
    },
    {
      $unwind: "$data",
    },
    {
      $replaceRoot: { newRoot: "$data" },
    },
  ]);

  const mergedResults = [
    ...predefinedGovernorates,
    ...results,
  ].reduce((acc, item) => {
    const key = `${item.governorate}_${item.type}_${item.courierId || "null"}`;
    if (!acc[key]) acc[key] = item;
    else acc[key].count += item.count;
    return acc;
  }, {});

  return Object.values(mergedResults);
};

const getCourierSessionMetrics = async () => {
  const metrics = await Courier.aggregate([
    {
      $match: { "sessions.0": { $exists: true } }, // Match couriers with at least one session
    },
    {
      $unwind: "$sessions", // Unwind sessions for aggregation
    },
    {
      $group: {
        _id: "$userId", // Group by courier ID
        courierName: { $first: { $concat: ["$firstName", " ", "$lastName"] } },
        dailySessions: { $avg: 1 }, // Count sessions per day
        averageSessionDuration: { $avg: "$sessions.duration" }, // Average session duration
      },
    },
    {
      $lookup: {
        from: "couriers",
        localField: "_id",
        foreignField: "userId",
        as: "courierDetails",
      },
    },
    {
      $unwind: "$courierDetails",
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        courierName: 1,
        dailySessions: { $round: ["$dailySessions", 2] },
        averageSessionDuration: { $round: ["$averageSessionDuration", 2] },
        phone: "$courierDetails.phone",
      },
    },
  ]);

  return metrics;
};

const getCourierSchedules = async () => {
  const schedules = await Courier.aggregate([
    {
      $project: {
        userId: 1,
        firstName: 1,
        lastName: 1,
        phone: 1,
        pickUpSchedule: 1,
        dropOffSchedule: 1,
      },
    },
    {
      $addFields: {
        shifts: {
          $concatArrays: ["$pickUpSchedule", "$dropOffSchedule"],
        },
      },
    },
    {
      $unwind: "$shifts",
    },
    {
      $addFields: {
        startHourParsed: {
          $concat: ["1970-01-01T", "$shifts.startHour", ":00Z"],
        },
        finishHourParsed: {
          $concat: ["1970-01-01T", "$shifts.finishHour", ":00Z"],
        },
      },
    },
    {
      $group: {
        _id: "$userId",
        courierName: { $first: { $concat: ["$firstName", " ", "$lastName"] } },
        phone: { $first: "$phone" },
        governoratesFrom: { $addToSet: "$shifts.governorate" },
        governoratesTo: { $addToSet: "$shifts.governorate" },
        totalShifts: { $sum: 1 },
        totalShiftHours: {
          $sum: {
            $divide: [
              {
                $subtract: [
                  { $dateFromString: { dateString: "$finishHourParsed" } },
                  { $dateFromString: { dateString: "$startHourParsed" } },
                ],
              },
              3600000, // Milliseconds to hours
            ],
          },
        },
        averageShiftDuration: {
          $avg: {
            $divide: [
              {
                $subtract: [
                  { $dateFromString: { dateString: "$finishHourParsed" } },
                  { $dateFromString: { dateString: "$startHourParsed" } },
                ],
              },
              3600000,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        courierName: 1,
        phone: 1,
        governoratesFrom: 1,
        governoratesTo: 1,
        totalShifts: 1,
        totalShiftHours: { $round: ["$totalShiftHours", 2] },
        averageShiftDuration: { $round: ["$averageShiftDuration", 2] },
      },
    },
  ]);

  return schedules;
};

const getRecipientInfoReport = async () => {
  try {
    // Aggregate the recipient data, including address details and no-show count
    const recipients = await Recipient.aggregate([
      {
        $lookup: {
          from: "addresses", // Join the addresses collection to fetch address details
          localField: "addresses",
          foreignField: "_id",
          as: "addressDetails",
        },
      },
      {
        $unwind: {
          path: "$addressDetails",
          preserveNullAndEmptyArrays: true, // Ensure it handles cases where a recipient has no address
        },
      },
      {
        $project: {
          userId: 1,
          firstName: 1,
          lastName: 1,
          phone: 1,
          whatsapp: 1,
          noShowCount: 1,
          address: {
            district: "$addressDetails.district",
            streetName: "$addressDetails.streetName",
            buildingNumber: "$addressDetails.buildingNumber",
            floorNumber: "$addressDetails.floorNumber",
            apartmentNumber: "$addressDetails.apartmentNumber",
            closestLandmark: "$addressDetails.closestLandmark",
            locationLink: "$addressDetails.locationLink",
          },
        },
      },
    ]);

    return recipients;
  } catch (error) {
    console.error("Error fetching recipient info report:", error);
    throw error;
  }
};

const getRecipientsShipmentActivityPerformance = async () => {
  try {
    // Aggregate data for shipments related to recipients
    const recipients = await Recipient.aggregate([
      {
        $lookup: {
          from: "shipments",
          localField: "userId",
          foreignField: "recipientId",
          as: "shipments",
        },
      },
      {
        $unwind: "$shipments", // Unwind the shipments array to deal with each shipment individually
      },
      {
        $group: {
          _id: "$userId",
          receivedShipments: {
            $sum: { $cond: [{ $eq: ["$shipments.status", "Delivered"] }, 1, 0] },
          },
          canceledShipments: {
            $sum: { $cond: [{ $eq: ["$shipments.status", "Canceled"] }, 1, 0] },
          },
          lateShipments: {
            $sum: { $cond: [{ $eq: ["$shipments.status", "Late"] }, 1, 0] },
          },
          inProgressShipments: {
            $sum: { $cond: [{ $eq: ["$shipments.status", "In Progress"] }, 1, 0] },
          },
          totalShipments: { $sum: 1 },
          deliveredValue: {
            $sum: { $cond: [{ $eq: ["$shipments.status", "Delivered"] }, "$shipments.summary.totalCost", 0] },
          },
          canceledValue: {
            $sum: { $cond: [{ $eq: ["$shipments.status", "Canceled"] }, "$shipments.summary.totalCost", 0] },
          },
          lateValue: {
            $sum: { $cond: [{ $eq: ["$shipments.status", "Late"] }, "$shipments.summary.totalCost", 0] },
          },
          inProgressValue: {
            $sum: { $cond: [{ $eq: ["$shipments.status", "In Progress"] }, "$shipments.summary.totalCost", 0] },
          },
          totalValue: {
            $sum: "$shipments.summary.totalCost",
          },
        },
      },
      {
        $lookup: {
          from: "recipients",
          localField: "_id",
          foreignField: "userId",
          as: "recipientDetails",
        },
      },
      {
        $unwind: "$recipientDetails", // Unwind the recipient details
      },
      {
        $project: {
          userId: "$_id",
          receivedShipments: 1,
          canceledShipments: 1,
          lateShipments: 1,
          inProgressShipments: 1,
          totalShipments: 1,
          deliveredValue: 1,
          canceledValue: 1,
          lateValue: 1,
          inProgressValue: 1,
          totalValue: 1,
          firstName: "$recipientDetails.firstName",
          lastName: "$recipientDetails.lastName",
          phone: "$recipientDetails.phone",
          whatsapp: "$recipientDetails.whatsapp",
        },
      },
    ]);

    return recipients;
  } catch (error) {
    console.error("Error fetching shipment activity performance:", error);
    throw error;
  }
};

const getRecipientReport = async () => {
  try {
    // Aggregate data for financial metrics, interactions, and geographic shipment distribution for each recipient
    const reportData = await Recipient.aggregate([
      {
        $lookup: {
          from: "shipments",
          localField: "userId",
          foreignField: "recipientId",
          as: "shipments",
        },
      },
      {
        $lookup: {
          from: "wallets",
          localField: "userId",
          foreignField: "userId",
          as: "wallets",
        },
      },
      {
        $unwind: "$shipments", // Unwind shipments for further processing
      },
      {
        $group: {
          _id: "$userId",
          totalReceivedShipments: { $sum: { $cond: [{ $eq: ["$shipments.status", "Delivered"] }, 1, 0] } },
          totalCanceledShipments: { $sum: { $cond: [{ $eq: ["$shipments.status", "Canceled"] }, 1, 0] } },
          totalLateShipments: { $sum: { $cond: [{ $eq: ["$shipments.status", "Late"] }, 1, 0] } },
          totalInProgressShipments: { $sum: { $cond: [{ $eq: ["$shipments.status", "In Progress"] }, 1, 0] } },
          totalShipments: { $sum: 1 },
          totalDeliveredValue: { $sum: { $cond: [{ $eq: ["$shipments.status", "Delivered"] }, "$shipments.summary.totalCost", 0] } },
          totalCanceledValue: { $sum: { $cond: [{ $eq: ["$shipments.status", "Canceled"] }, "$shipments.summary.totalCost", 0] } },
          totalLateValue: { $sum: { $cond: [{ $eq: ["$shipments.status", "Late"] }, "$shipments.summary.totalCost", 0] } },
          totalInProgressValue: { $sum: { $cond: [{ $eq: ["$shipments.status", "In Progress"] }, "$shipments.summary.totalCost", 0] } },
          totalValue: { $sum: "$shipments.summary.totalCost" },
          totalDepositCount: { $sum: { $cond: [{ $gt: ["$wallets.transactions.amount", 0] }, 1, 0] } },
          totalDepositFees: { $sum: { $cond: [{ $eq: ["$wallets.transactions.type", "deposit"] }, "$wallets.transactions.amount", 0] } },
          totalDepositValue: { $sum: { $cond: [{ $eq: ["$wallets.transactions.type", "deposit"] }, "$wallets.transactions.amount", 0] } },
          totalPaymentCount: { $sum: { $cond: [{ $gt: ["$wallets.transactions.amount", 0] }, 1, 0] } },
          totalPaymentFees: { $sum: { $cond: [{ $eq: ["$wallets.transactions.type", "payment"] }, "$wallets.transactions.amount", 0] } },
          totalPaymentValue: { $sum: { $cond: [{ $eq: ["$wallets.transactions.type", "payment"] }, "$wallets.transactions.amount", 0] } },
          totalCashPaymentsReceived: { $sum: { $cond: [{ $eq: ["$wallets.transactions.type", "cash"] }, "$wallets.transactions.amount", 0] } },
          totalCashPaymentsValue: { $sum: { $cond: [{ $eq: ["$wallets.transactions.type", "cash"] }, "$wallets.transactions.amount", 0] } },
          totalServingSenders: { $addToSet: "$shipments.senderId" },
          totalServingCouriers: { $addToSet: "$shipments.courierId" },
          totalNoShows: { $sum: { $cond: [{ $eq: ["$shipments.status", "No-Show"] }, 1, 0] } },
          totalGivenReviews: { $sum: { $cond: [{ $gt: ["$shipments.reviews.length", 0] }, 1, 0] } },
          // Geographic Shipment Distribution - Received from different governorates
          totalFromIrbid: { $sum: { $cond: [{ $eq: ["$shipments.pickUpDetails.location.governorate", "Irbid"] }, 1, 0] } },
          totalFromJerash: { $sum: { $cond: [{ $eq: ["$shipments.pickUpDetails.location.governorate", "Jerash"] }, 1, 0] } },
          totalFromAjloun: { $sum: { $cond: [{ $eq: ["$shipments.pickUpDetails.location.governorate", "Ajloun"] }, 1, 0] } },
          totalFromMafraq: { $sum: { $cond: [{ $eq: ["$shipments.pickUpDetails.location.governorate", "Mafraq"] }, 1, 0] } },
          totalFromBalqa: { $sum: { $cond: [{ $eq: ["$shipments.pickUpDetails.location.governorate", "Balqa"] }, 1, 0] } },
          totalFromAmman: { $sum: { $cond: [{ $eq: ["$shipments.pickUpDetails.location.governorate", "Amman"] }, 1, 0] } },
          totalFromMadaba: { $sum: { $cond: [{ $eq: ["$shipments.pickUpDetails.location.governorate", "Madaba"] }, 1, 0] } },
          totalFromZarqa: { $sum: { $cond: [{ $eq: ["$shipments.pickUpDetails.location.governorate", "Zarqa"] }, 1, 0] } },
          totalFromKarak: { $sum: { $cond: [{ $eq: ["$shipments.pickUpDetails.location.governorate", "Karak"] }, 1, 0] } },
          totalFromTafileh: { $sum: { $cond: [{ $eq: ["$shipments.pickUpDetails.location.governorate", "Tafileh"] }, 1, 0] } },
          totalFromMaan: { $sum: { $cond: [{ $eq: ["$shipments.pickUpDetails.location.governorate", "Maan"] }, 1, 0] } },
          totalFromAqaba: { $sum: { $cond: [{ $eq: ["$shipments.pickUpDetails.location.governorate", "Aqaba"] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from: "recipients",
          localField: "_id",
          foreignField: "userId",
          as: "recipientDetails",
        },
      },
      {
        $unwind: "$recipientDetails",
      },
      {
        $project: {
          userId: "$_id",
          firstName: "$recipientDetails.firstName",
          lastName: "$recipientDetails.lastName",
          phone: "$recipientDetails.phone",
          whatsapp: "$recipientDetails.whatsapp",
          totalReceivedShipments: 1,
          totalCanceledShipments: 1,
          totalLateShipments: 1,
          totalInProgressShipments: 1,
          totalShipments: 1,
          totalDeliveredValue: 1,
          totalCanceledValue: 1,
          totalLateValue: 1,
          totalInProgressValue: 1,
          totalValue: 1,
          totalDepositCount: 1,
          totalDepositFees: 1,
          totalDepositValue: 1,
          totalPaymentCount: 1,
          totalPaymentFees: 1,
          totalPaymentValue: 1,
          totalCashPaymentsReceived: 1,
          totalCashPaymentsValue: 1,
          totalServingSenders: { $size: "$totalServingSenders" },
          totalServingCouriers: { $size: "$totalServingCouriers" },
          totalNoShows: 1,
          totalGivenReviews: 1,
          totalFromIrbid: 1,
          totalFromJerash: 1,
          totalFromAjloun: 1,
          totalFromMafraq: 1,
          totalFromBalqa: 1,
          totalFromAmman: 1,
          totalFromMadaba: 1,
          totalFromZarqa: 1,
          totalFromKarak: 1,
          totalFromTafileh: 1,
          totalFromMaan: 1,
          totalFromAqaba: 1,
        },
      },
    ]);

    return reportData;
  } catch (error) {
    console.error("Error generating recipient report:", error);
    throw new Error("Failed to generate recipient report.");
  }
};

const getAllShipmentReports = async () => { 
  try {
    // Fetch all shipments
    const shipments = await Shipment.find();

    // Iterate over all shipments and prepare the report data
    const reportData = await Promise.all(
      shipments.map(async (shipment) => {
        // Fetch sender, recipient, and courier manually since we're using UUIDs
        const sender = await Seller.findOne({ userId: shipment.senderId });
        const recipient = await Seller.findOne({ userId: shipment.recipientId });
        const courier = await Courier.findOne({ userId: shipment.courierId });

        // Fetch financial data from the Wallet model (for payments, deposits)
        const wallet = await Wallet.findOne({ userId: shipment.recipientId });
        const depositDetails = wallet ? wallet.transactions.filter(txn => txn.type === "deposit") : [];
        const paymentDetails = wallet ? wallet.transactions.filter(txn => txn.type === "payment") : [];

        // Fetch promo code information, if applicable
        const promoCodeDetails = shipment.promoCode ? await PromoCode.findOne({ promoCode: shipment.promoCode }) : null;

        // Calculate the financial details (deposit, payment, fees, etc.)
        const depositValue = depositDetails.reduce((acc, txn) => acc + txn.amount, 0);
        const paymentValue = paymentDetails.reduce((acc, txn) => acc + txn.amount, 0);

        // Calculate the net deposit and payment values after fees
        const netDeposit = depositValue - depositDetails.reduce((acc, txn) => acc + txn.fees, 0);
        const netPayment = paymentValue - paymentDetails.reduce((acc, txn) => acc + txn.fees, 0);

        // Safely access location data with fallback to empty object if undefined
        const getPickupLocation = (pickupDetails) => pickupDetails?.location || {};
        const getDropOffLocation = (dropOffDetails) => dropOffDetails?.location || {};

        const pickupLocation = getPickupLocation(shipment.pickUpDetails);
        const dropOffLocation = getDropOffLocation(shipment.dropOffDetails);

        // Construct the report for this shipment
        return {
          shipmentId: shipment.shipmentId,
          shipmentTime: shipment.createdAt,
          senderId: sender ? sender.userId : null,
          senderName: sender ? `${sender.firstName} ${sender.lastName}` : null,
          recipientId: recipient ? recipient.userId : null,
          recipientName: recipient ? `${recipient.firstName} ${recipient.lastName}` : null,
          courierId: courier ? courier.userId : null,
          courierName: courier ? `${courier.firstName} ${courier.lastName}` : null,
          shipmentValue: shipment.totalValue,
          weight: shipment.weight,
          length: shipment.length,
          width: shipment.width,
          height: shipment.height,
          currentStatus: shipment.status,
          estimatedDelivery: shipment.estimatedDeliveryTime,
          actualDelivery: shipment.actualDeliveryTime,
          addressConfirmation: shipment.addressConfirmedAt,
          depositCompletion: shipment.depositCompletedAt,
          placementTime: shipment.placementTimestamp,
          schedulingTime: shipment.schedulingTimestamp,
          pickupTime: shipment.pickupTimestamp,
          deliveryTime: shipment.deliveryTimestamp,
          deliveryAttempts: shipment.deliveryAttempts,
          delayStatus: shipment.delayStatus,
          delayTime: shipment.delayTimestamp,
          delayDuration: shipment.delayDuration,
          delayReason: shipment.delayReason,
          cancellationStatus: shipment.cancellationStatus,
          cancellationTime: shipment.cancellationTimestamp,
          cancellationBy: shipment.cancellationInitiatedBy,
          cancellationReason: shipment.cancellationReason,
          returnStatus: shipment.returnStatus,
          returnInitiatedAt: shipment.returnInitiationTimestamp,
          returnInitiatedBy: shipment.returnInitiatedBy,
          returnReason: shipment.returnReason,
          returnDeliveryTime: shipment.returnDeliveryTimestamp,
          totalValue: shipment.totalValue,
          depositStatus: shipment.depositStatus,
          depositValue: depositValue,
          depositFees: depositDetails.reduce((acc, txn) => acc + txn.fees, 0),
          netDeposit: netDeposit,
          paymentStatus: shipment.paymentStatus,
          paymentValue: paymentValue,
          paymentFees: paymentDetails.reduce((acc, txn) => acc + txn.fees, 0),
          netPayment: netPayment,
          paymentMethod: shipment.paymentMethod,
          codAmount: shipment.codAmount,
          codCollectionStatus: shipment.codStatus,
          codPaidIn: shipment.codPaidIn,
          codPayInFees: shipment.codPayInFees,
          codPaidOut: shipment.codPaidOut,
          codPayOutFees: shipment.codPayOutFees,
          refundAmount: shipment.refundAmount,
          refundFees: shipment.refundFees,
          refundStatus: shipment.refundStatus,
          promocodeUsed: promoCodeDetails ? "Yes" : "No",
          promocodeType: promoCodeDetails ? promoCodeDetails.promoCodeType : null,
          promocodeCap: promoCodeDetails ? promoCodeDetails.details.cap : null,
          promocodePercentage: promoCodeDetails ? promoCodeDetails.details.percentage : null,
          discountAmount: promoCodeDetails ? shipment.discountAmount : 0,
          referralAmount: shipment.referralAmount,
          totalShippingPaid: shipment.totalShippingPaid,
          paymentProcessingFees: shipment.paymentProcessingFees,
          netPaymentAfterFees: netPayment,
          shipmentIncome: shipment.income,
          courierPayment: shipment.driverPayment,
          referralName: shipment.referralName,
          referralContact: shipment.referralPhone,
          deliveryDuration: shipment.deliveryDuration,
          delayIndicator: shipment.delayIndicator,
          delayCause: shipment.delayCause,
          avgDeliveryTime: shipment.avgDeliveryTime,
          onTimeDeliveryRate: shipment.onTimeDeliveryRate,
          deliveryRating: shipment.deliveryRating,
          pickupGovernorate: pickupLocation.governorate || '',
          pickupDistrict: pickupLocation.district || '',
          pickupStreet: pickupLocation.streetName || '',
          pickupBuilding: pickupLocation.buildingNumber || '',
          pickupFloor: pickupLocation.floorNumber || '',
          pickupApartment: pickupLocation.apartmentNumber || '',
          pickupInstructions: pickupLocation.closestLandmark || '',
          pickupCoordinates: pickupLocation.locationLink || '',
          pickupWaitTime: shipment.pickUpDetails.waitTime || 0,
          dropOffGovernorate: dropOffLocation.governorate || '',
          dropOffDistrict: dropOffLocation.district || '',
          dropOffStreet: dropOffLocation.streetName || '',
          dropOffBuilding: dropOffLocation.buildingNumber || '',
          dropOffFloor: dropOffLocation.floorNumber || '',
          dropOffApartment: dropOffLocation.apartmentNumber || '',
          dropOffInstructions: dropOffLocation.closestLandmark || '',
          dropOffCoordinates: dropOffLocation.locationLink || '',
          dropOffWaitTime: shipment.dropOffDetails.waitTime || 0,
        };
      })
    );

    return reportData;
  } catch (error) {
    console.error("Error generating shipment reports:", error);
    throw new Error("Failed to generate shipment reports.");
  }
};

const generatePromocodeReport = async () => {
  try {
    const promocodes = await PromoCode.find(); // Fetch all promocodes

    const reportData = await Promise.all(
      promocodes.map(async (promo) => {
        // Fetch usage details (total uses, unique recipients, etc.)
        const totalUses = await Transaction.countDocuments({ promoCode: promo.promoCode });
        const uniqueRecipients = await Transaction.distinct("recipientId", { promoCode: promo.promoCode });
        
        // Fetch max usage recipients (those who hit the limit)
        const maxUsageRecipients = await Transaction.aggregate([
          { $match: { promoCode: promo.promoCode } },
          { $group: { _id: "$recipientId", usageCount: { $sum: 1 } } },
          { $match: { usageCount: { $gte: promo.userUsageLimit } } },
        ]);
        
        // Calculate total savings from promocode usage
        const totalSavings = await Transaction.aggregate([
          { $match: { promoCode: promo.promoCode, status: "completed" } },
          { $group: { _id: null, total: { $sum: "$discountAmount" } } },
        ]);
        
        // Fetch refund details (if applicable)
        const refundDetails = await Transaction.aggregate([
          { $match: { promoCode: promo.promoCode, status: "refunded" } },
          { $group: { _id: null, totalRefunded: { $sum: "$refundAmount" } } },
        ]);

        // Calculate additional metrics like usage rate and conversion
        const totalEligibleRecipients = await Recipient.countDocuments({ "promoEligibility.promoCode": promo.promoCode });
        const usageRate = (totalUses / totalEligibleRecipients) * 100;
        const conversionRate = (totalUses / totalEligibleRecipients) * 100; // Placeholder, adjust according to your business logic

        // Construct the report for this promocode
        return {
          promoId: promo._id,
          promoName: promo.promoCode,
          promoType: promo.promoType,
          maxDiscount: promo.details.cap || 0,
          discountPercentage: promo.details.percentage || 0,
          discountAmount: totalSavings[0] ? totalSavings[0].total : 0,
          totalUses: totalUses,
          uniqueRecipients: uniqueRecipients.length,
          maxUsagePerRecipient: promo.details.maxUsagePerUser || 0,
          totalSavings: totalSavings[0] ? totalSavings[0].total : 0,
          startDate: promo.startDate,
          expiryDate: promo.endDate,
          promoStatus: promo.status,
          maxUsageLimit: promo.maxUsageLimit,
          userUsageLimit: promo.userUsageLimit,
          remainingUses: promo.maxUsageLimit - totalUses,
          eligibleRecipients: totalEligibleRecipients,
          sourceGovernorates: promo.governoratesFrom.join(", "),
          destinationGovernorates: promo.governoratesTo.join(", "),
          refundedDiscount: refundDetails[0] ? refundDetails[0].totalRefunded : 0,
          usageRate: usageRate,
          conversionRate: conversionRate,
          revenuePerRecipientWithPromo: totalSavings[0] ? totalSavings[0].total / uniqueRecipients.length : 0,
          revenuePerRecipientWithoutPromo: 0, // Placeholder, calculate if needed
          lifetimeValueIncrease: 0, // Placeholder, calculate if needed
          campaignSource: "Marketing Campaign", // Adjust accordingly
          dailyRedemptions: totalUses / (new Date() - promo.startDate), // Avg redemptions per day
          firstRedemption: promo.startDate,
          lastRedemption: promo.endDate,
          promoROI: 0, // Placeholder, calculate if needed
        };
      })
    );

    return reportData;
  } catch (error) {
    console.error("Error generating promocode report:", error);
    throw new Error("Error generating promocode report.");
  }
};

const getPenaltyReports = async () => {
  try {
    // Fetch all penalties from the database
    const penalties = await Penalty.find();

    // Fetch the penalized party details
    const reportData = await Promise.all(
      penalties.map(async (penalty) => {
        // Depending on the penalized party, fetch the details from the appropriate model
        let penalizedPartyDetails = {};
        if (penalty.penalizedParty === 'Sender') {
          penalizedPartyDetails = await Seller.findOne({ userId: penalty.penalizedId });
        } else if (penalty.penalizedParty === 'Courier') {
          penalizedPartyDetails = await Courier.findOne({ userId: penalty.penalizedId });
        } else if (penalty.penalizedParty === 'Recipient') {
          penalizedPartyDetails = await Recipient.findOne({ userId: penalty.penalizedId });
        }

        return {
          penaltyId: penalty._id,
          penaltyTimestamp: penalty.createdAt,
          penaltyType: penalty.reason,
          penalizedParty: penalty.penalizedParty,
          penaltyReason: penalty.reason,
          penaltyDescription: penalty.description,
          penalizedFirstName: penalizedPartyDetails ? penalizedPartyDetails.firstName : "N/A",
          penalizedLastName: penalizedPartyDetails ? penalizedPartyDetails.lastName : "N/A",
          penalizedId: penalty.penalizedId,
          amountCharged: penalty.amount,
        };
      })
    );

    return reportData;
  } catch (error) {
    console.error("Error generating penalty reports:", error);
    throw new Error("Error generating penalty reports.");
  }
};

const getAllAdminUsers = async () => {
  try {
    // Fetch all admins or users from the database
    const users = await Admin.find();

    // Map through the users and prepare the report data
    const userReports = users.map((user) => ({
      id: user.userId,
      status: user.status,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      position: user.position,
      signUpDate: user.signUpDate,
      accessLevel: user.accessLevel,
      lastSignIn: user.lastSignIn || "N/A", // If lastSignIn is null, set as "N/A"
    }));

    return userReports;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Error fetching user data.");
  }
};

const getTransactionReport = async () => {
  try {
    // Fetch all transactions
    const transactions = await Transaction.find()
      .populate("penaltyDetails")
      .populate("shipmentDetails");

    // Process the data for reporting
    const reportData = await Promise.all(
      transactions.map(async (transaction) => {
        const shipment = transaction.shipmentDetails;
        const penalty = transaction.penaltyDetails;
        const promocode = transaction.promocodeUsed ? await PromoCode.findOne({ promoCode: transaction.promocodeUsed }) : null;

        return {
          transactionId: transaction._id,
          transactionRefId: transaction.trackingId || "N/A",
          paymentMethod: transaction.description, // Assuming description holds the payment method
          transactionReason: transaction.reason,
          payerType: transaction.userId ? "Sender" : "Courier", // Placeholder, adjust based on your actual logic
          status: transaction.status,
          addedBy: "Admin", // Placeholder for actual addedBy logic
          penaltyDetails: penalty ? {
            penaltyType: penalty.reason,
            penalizedParty: penalty.appliedTo,
            penaltyId: penalty._id,
          } : null,
          shipmentDetails: shipment ? {
            shipmentId: shipment.shipmentId,
            senderFirstName: shipment.senderId.firstName,
            senderLastName: shipment.senderId.lastName,
            senderPhone: shipment.senderId.phone,
            senderGovernorate: shipment.senderId.addresses[0]?.governorate, // Adjust based on the structure
            recipientFirstName: shipment.recipientId.firstName,
            recipientLastName: shipment.recipientId.lastName,
            recipientPhone: shipment.recipientId.phone,
            recipientGovernorate: shipment.recipientId.addresses[0]?.governorate,
            courierFirstName: shipment.courierId.firstName,
            courierLastName: shipment.courierId.lastName,
            courierPhone: shipment.courierId.phone,
          } : null,
          transactionAmount: transaction.amount,
          fixedFees: transaction.fees,
          percentageFees: (transaction.fees / transaction.amount) * 100,
          totalFees: transaction.fees,
          netAmount: transaction.amount - transaction.fees,
          netIncome: transaction.amount - transaction.fees, // Placeholder calculation
          courierNet: 0, // Placeholder for courier net calculation
          senderNet: transaction.amount - transaction.fees, // Placeholder for sender net calculation
          referralNet: 0, // Placeholder for referral net calculation
          otherNet: 0, // Placeholder for other net calculation
          promocodeDetails: promocode ? {
            promocodeUsed: "Yes",
            promocodeType: promocode.promoCodeType,
            promocodeCap: promocode.details.cap,
            promocodePercentage: promocode.details.percentage,
            promoSavings: transaction.promoSavings,
          } : null
        };
      })
    );

    return reportData;
  } catch (error) {
    console.error("Error generating transaction report:", error);
    throw new Error("Error generating transaction report.");
  }
};

const getDetailedTransactionReport = async () => {
  try {
    const transactions = await Transaction.find()
      .populate("penaltyDetails")
      .populate("shipmentDetails");

    const reportData = await Promise.all(
      transactions.map(async (transaction) => {
        const shipment = transaction.shipmentDetails;
        const penalty = transaction.penaltyDetails;
        const promocode = transaction.promocodeUsed ? await PromoCode.findOne({ promoCode: transaction.promocodeUsed }) : null;

        return {
          transactionId: transaction._id,
          transactionRefId: transaction.trackingId || "N/A",
          paymentMethod: transaction.description, // Assuming description holds the payment method
          transactionReason: transaction.reason,
          recipientType: "Sender", // Example, update with proper logic for recipient type
          status: transaction.status,
          addedBy: "Admin", // Placeholder for actual addedBy logic
          penaltyDetails: penalty ? {
            penaltyType: penalty.reason,
            penalizedParty: penalty.appliedTo,
            penaltyId: penalty._id,
          } : null,
          shipmentDetails: shipment ? {
            shipmentId: shipment.shipmentId,
            senderFirstName: shipment.senderId.firstName,
            senderLastName: shipment.senderId.lastName,
            senderPhone: shipment.senderId.phone,
            senderGovernorate: shipment.senderId.addresses[0]?.governorate, 
            recipientFirstName: shipment.recipientId.firstName,
            recipientLastName: shipment.recipientId.lastName,
            recipientPhone: shipment.recipientId.phone,
            recipientGovernorate: shipment.recipientId.addresses[0]?.governorate,
            courierFirstName: shipment.courierId.firstName,
            courierLastName: shipment.courierId.lastName,
            courierPhone: shipment.courierId.phone,
          } : null,
          transactionAmount: transaction.amount,
          fixedFees: transaction.fees,
          percentageFees: (transaction.fees / transaction.amount) * 100,
          totalFees: transaction.fees,
          netAmount: transaction.amount - transaction.fees,
          netIncome: transaction.amount - transaction.fees,
          courierNet: 0, // Placeholder for courier net calculation
          senderNet: transaction.amount - transaction.fees, 
          referralNet: 0, 
          otherNet: 0, 
          promocodeDetails: promocode ? {
            promocodeUsed: "Yes",
            promocodeType: promocode.promoCodeType,
            promocodeCap: promocode.details.cap,
            promocodePercentage: promocode.details.percentage,
            promoSavings: transaction.promoSavings,
          } : null
        };
      })
    );

    return reportData;
  } catch (error) {
    console.error("Error generating transaction report:", error);
    throw new Error("Error generating transaction report.");
  }
};

const getNotificationMetrics = async () => {
  try {
    // Fetch all notifications (you can add filters as needed)
    const notifications = await Notification.find();

    // Process each notification and filter the required data
    const notificationMetrics = notifications.map((notification) => {
      const { engagementMetrics, performanceMetrics, ...rest } = notification;

      // Calculate engagement score based on open rate, click rate, and delivery success
      const engagementScore =
        (engagementMetrics.openRate + engagementMetrics.clickRate) / 2;

      // Return only the necessary fields
      return {
        notificationId: notification.notificationId,
        openRate: engagementMetrics.openRate || 0,
        clickRate: engagementMetrics.clickRate || 0,
        numberOfOpens: engagementMetrics.numberOfOpens || 0,
        numberOfClicks: engagementMetrics.numberOfClicks || 0,
        bounceStatus: engagementMetrics.bounceStatus || "No Bounce",
        deliveryDuration: engagementMetrics.deliveryDuration || 0,
        relatedTransactionId: notification.relatedTransactionId || null,
        relatedShipmentId: notification.relatedShipmentId || null,
        relatedPromoId: notification.relatedPromoId || null,
        notificationReason: notification.notificationReason || "N/A",
        deliveredCount: performanceMetrics.deliveredCount || 0,
        failedCount: performanceMetrics.failedCount || 0,
        engagementScore: engagementScore || 0,
      };
    });

    return notificationMetrics;
  } catch (error) {
    console.error("Error generating notification metrics:", error);
    throw new Error("Error generating notification metrics.");
  }
};


module.exports = {
  getAllShipmentReports,
  getRecipientReport,
  getRecipientInfoReport,
  getRecipientsShipmentActivityPerformance,
  getAllSellersReport,
  getAllSendersShipmentActivity,
  getAllSendersFinancialMetrics,
  getPromotionsAndEngagementMetrics,
  getPaymentMetrics,
  getGovernorateShipmentStats,
  getSessionMetrics,
  getCourierInfoReport,
  getCourierShipmentReport,
  getCourierFinancialMetrics,
  getCourierPerformanceMetrics,
  getCourierLocationCoverage,
  getCourierGeographicShipmentDistribution,
  getCourierSessionMetrics,
  getCourierSchedules,
  generatePromocodeReport,
  getPenaltyReports,
  getAllAdminUsers,
  getTransactionReport,
  getDetailedTransactionReport,
  getNotificationMetrics
};
