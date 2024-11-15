const Courier = require("../models/courierModel");
const Shipment = require("../models/shipmentModel");

const savePersonalInfo = async (userId, personalInfo) => {
  await Courier.updateOne({ userId }, personalInfo, { upsert: true });

  return await findUserByUserId(userId)
};

const saveVehicleInfo = async (userId, vehicleInfo) => {
  const user = await findUserByUserId(userId);
  if (!user) throw new Error("User not found against the provided ID");

  return await Courier.updateOne({ userId }, { $set: vehicleInfo });
};

const saveSchedule = async (userId, schedules) => {
  const user = await findUserByUserId(userId);
  if (!user) throw new Error("User not found against the provided ID");

  return await Courier.updateOne(
    { userId },
    {
      $set: {
        dropOffSchedule: schedules.dropOffSchedule,
        pickUpSchedule: schedules.pickUpSchedule,
      },
    }
  );
};

const findUserByUserId = async (userId) => {
  return await Courier.findOne({ userId });
};

const updatePhone = async (userId, newPhone) => {
  const user = await findUserByUserId(userId);
  if (!user) throw new Error("User not found against the provided ID");

  return await Courier.updateOne({ userId }, { phone: newPhone });
};

const updatePersonalDetails = async (userId, updateFields) => {
  const user = await findUserByUserId(userId);
  if (!user) throw new Error("User not found against the provided ID");

  return await Courier.updateOne({ userId }, { $set: updateFields });
};

const updatePickupSchedule = async (userId, pickupSchedule) => {
  const user = await findUserByUserId(userId);
  if (!user) throw new Error("User not found against the provided ID");

  return await Courier.updateOne(
    { userId },
    { $set: { pickUpSchedule: pickupSchedule } }
  );
};

const updateDropoffSchedule = async (userId, dropoffSchedule) => {
  const user = await findUserByUserId(userId);
  if (!user) throw new Error("User not found against the provided ID");

  return await Courier.updateOne(
    { userId },
    { $set: { dropOffSchedule: dropoffSchedule } }
  );
};

const getAllCouriers = async () => {
  const couriers = await Courier.find();

  const couriersWithStats = await Promise.all(
    couriers.map(async (courier) => {
      const stats = await Shipment.aggregate([
        { $match: { courierId: courier.userId } }, // Using courierId to match shipments
        {
          $group: {
            _id: "$status",
            totalValue: { $sum: "$summary.totalCost" },
            count: { $sum: 1 },
          },
        },
      ]);

      let totalPaid = 0;
      let shipments = 0;
      let returned = 0;
      let cancelled = 0;
      let delivered = 0;

      stats.forEach((stat) => {
        totalPaid += stat.totalValue;
        if (stat._id === "Delivered") delivered = stat.count;
        else if (stat._id === "Returned") returned = stat.count;
        else if (stat._id === "Cancelled") cancelled = stat.count;
        shipments += stat.count;
      });

      return {
        ...courier.toObject(),
        shipments,
        returned,
        cancelled,
        delivered,
        totalPaid,
      };
    })
  );

  return couriersWithStats;
};

module.exports = {
  savePersonalInfo,
  findUserByUserId,
  saveVehicleInfo,
  saveSchedule,
  updatePhone,
  updatePersonalDetails,
  updatePickupSchedule,
  updateDropoffSchedule,
  getAllCouriers,
};
