const Ride = require("../../../models/Ride");
const { ObjectId } = require("mongoose").Types;

const updateOnlineRideStatus = async (req, res, next) => {
  try {
    const { status } = req.query;
    const { id } = req.params;
    if (status) {
      const ride = await Ride.findOneAndUpdate(
        { _id: ObjectId(id) },
        { onlineRideStatus: status },
        { new: true }
      );

      const smsMessage = `Hello ${ride?.firstName}${
        ride?.lastName ? " " + ride?.lastName : ""
      }, your ride ${ride?.bookingNo} has been ${status?.toLowerCase()}`;

      await sendSms({
        body: smsMessage,
        to: `${ride?.countryCode}${ride?.phoneNo}`,
      });
    }

    res.json({ success: true, message: "Status updated successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = updateOnlineRideStatus;
