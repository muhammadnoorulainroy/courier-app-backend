const Courier = require("../models/courierModel");
const Shipment = require("../models/shipmentModel")

const savePersonalInfo = async (personalInfo) => {
  return await Courier.updateOne({ phone: personalInfo.phone }, personalInfo, {
    upsert: true,
  });
};

const saveVehicleInfo = async (phone, vehicleInfo) => {
  return await Courier.updateOne({ phone }, { $set: vehicleInfo });
};

const saveSchedule = async (phone, schedules) => {
  return await Courier.updateOne(
    { phone },
    {
      $set: {
        dropOffSchedule: schedules.dropOffSchedule,
        pickUpSchedule: schedules.pickUpSchedule,
      },
    }
  );
};

const findUserByPhone = async (phone) => {
  return await Courier.findOne({ phone });
};


const updatePhone = async (phone, newPhone) => {
  return await Courier.updateOne({ phone }, { phone: newPhone });
};

const updatePersonalDetails = async (phone, updateFields) => {
  return await Courier.updateOne({ phone }, { $set: updateFields });
};

const updatePickupSchedule = async (phone, pickupSchedule) => {
  return await Courier.updateOne(
    { phone },
    { $set: { pickUpSchedule: pickupSchedule } }
  );
};

const updateDropoffSchedule = async (phone, dropoffSchedule) => {
  return await Courier.updateOne(
    { phone },
    { $set: { dropOffSchedule: dropoffSchedule } }
  );
};

const getAllCouriers = async () => {
  const couriers = await Courier.find();

  const couriersWithStats = await Promise.all(
    couriers.map(async (courier) => {
      const stats = await Shipment.aggregate([
        { $match: { courierPhone: courier.phone } },
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
  findUserByPhone,
  saveVehicleInfo,
  saveSchedule,
  updatePhone,
  updatePersonalDetails,
  updatePickupSchedule,
  updateDropoffSchedule,
  getAllCouriers
};
