const Chauffeur = require("../../models/Chauffeur");
const Customer = require("../../models/Customer");
const Ride = require("../../models/Ride");
const RidePrices = require("../../models/RidePrices");
const sendNotifications = require("../../services/notifications/notification");
const notifyChauffeurs = require("../../services/rideServices/notifyChauffeurs");
const sendEmail = require("../../services/sendEmail");
const rideFinished = require("../../templates/rideFinished");
const { ObjectId } = require("mongoose").Types;
const GetCoordinates = require("../../services/GeoLocation/GetCoordinates");
const Conversation = require("../../models/Conversation");
const sendSms = require("../../services/notifications/sendSms");
const dayjs = require("dayjs");

const updateRide = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { toll, extraStop, waitingTime, driverNotes } = req.body;
    const { rideId, status } = req.query;
    const ride = await Ride.findOne({ _id: ObjectId(rideId) });

    const customer = await Customer.findOne({
      _id: ObjectId(ride?.customerId),
    });
    const pricingDetails = await RidePrices.find({
      _id: ObjectId(ride?.allPrices),
    });
    const stopOfRide = [];

    if (status == "reject") {
      await Ride.findOneAndUpdate(
        { _id: ObjectId(rideId) },
        {
          $unset: { chauffeurID: "" },
          rejectedBy: [...ride.rejectedBy, userId],
          chauffeurStatus: "Pending",
        },
        { new: true }
      );

      /// Updating other chauffeurs to get the ride
      await notifyChauffeurs(ride);
    } else if (status == "accept") {
      const { chauffeurPrice } = req.body;

      await Ride.findOneAndUpdate(
        { _id: ObjectId(rideId) },
        {
          chauffeurID: ObjectId(userId),
          chauffeurStatus: "Booked",
          chauffeurPrice,
        },
        { new: true }
      );

      if (customer?.notifToken) {
        await sendNotifications({
          title: "Ride Accepted.",
          body: "Your ride has been accepted by the chauffeur.",

          data: { type: "ride-update", url: "UserScreens/MyRides" },
          token: customer?.notifToken?.toString(),
        });
      }
    } else if (status == "start") {
      await Ride.findOneAndUpdate(
        { _id: ObjectId(rideId) },
        {
          chauffeurStatus: "Started",
          status: "Started",
        },
        { new: true }
      );

      await Chauffeur.findOneAndUpdate(
        { _id: ObjectId(userId) },
        {
          activeRide: ObjectId(rideId),
        },
        { new: true }
      );

      if (customer?.notifToken) {
        await sendNotifications({
          title: "Ride Started.",
          body: "Your ride has been started. Hope you will enjoy the best.",

          data: { type: "ride-start", url: "UserScreens/MyRides" },
          token: customer?.notifToken?.toString(),
        });
      }
    } else if (status == "finish") {
      if (extraStop) {
        const stopCoords = await GetCoordinates(extraStop?.stopPlaceId);

        stopOfRide.push({
          name: extraStop?.stopName,
          stopCoords,
          stopPlaceId: extraStop?.stopPlaceId,
        });
      }
      console.log("stopOfRide", stopOfRide);
      const body = {
        chauffeurStatus: "Completed",
        status: "Completed",
        price: Number(pricingDetails?.[0]?.totalDue) + Number(toll || 0),
      };
      if (stopOfRide?.[0]?.name !== undefined) {
        body.addStop = [...ride?.addStop, ...stopOfRide];
      }
      console.log("body", body);
      const result = await Ride.findOneAndUpdate(
        { _id: ObjectId(rideId) },
        {
          ...body,
        },
        { new: true }
      );

      // console.log("toll", toll, extraStop, waitingTime, driverNotes);

      await RidePrices.findOneAndUpdate(
        { _id: ObjectId(ride?.allPrices) },
        {
          toll,
          extraStop: stopOfRide?.length || 0,
          waitingTime,
          driverNotes,
          totalDue: Number(pricingDetails?.[0]?.totalDue) + Number(toll || 0),
        },
        { new: true }
      );

      await Chauffeur.findOneAndUpdate(
        { _id: ObjectId(userId) },
        {
          $unset: { activeRide: "" },
        },
        { new: true }
      );
      if (ride.chauffeurID && ride.customerId) {
        await Conversation.updateMany(
          {
            $and: [
              {
                members: { $all: [ride.chauffeurID, ride.customerId] },
              },
            ],
          },
          { isEnabled: false },
          {
            new: true,
          }
        );
      }

      if (customer?.notifToken) {
        await sendNotifications({
          title: "Ride Completed.",
          body: "Your ride is completed. Have a nice day.",

          data: {
            type: "ride-finish",
            url: "UserScreens/MyRides",
            rideId: rideId?.toString(),
            chauffeurId: userId?.toString(),
          },
          token: customer?.notifToken?.toString(),
        });
      }

      await sendEmail(
        [ride?.email],
        "Ride Finished",
        // paymentLinkTemplate({ amount: `AUD ${price / 100}`, link: url }),
        rideFinished({
          passengerName: ride?.firstName,
        })
        // [ride?.email]
      );
    } else if (status == "On-the-way") {
      await Ride.findOneAndUpdate(
        { _id: ObjectId(rideId) },
        {
          chauffeurStatus: "On-the-way",
        },
        { new: true }
      );

      const chauffeurDetails = await Chauffeur.findOne({
        _id: ObjectId(ride.chauffeurID),
      });

      const smsMessage = `Hello ${ride?.firstName}${
        ride?.lastName ? " " + ride?.lastName : ""
      }, your driver ${
        chauffeurDetails?.name
      } is now on the way to your pick up point to ${
        ride?.dropLocation?.name
      }. They will arrive at ${ride?.date}. You can reach your driver at tel:${
        chauffeurDetails?.countryCode
      }${chauffeurDetails?.phone} if needed. Safe travels!`;

      await sendSms({
        body: smsMessage,
        to: `${ride?.countryCode}${ride?.phoneNo}`,
      });
      if (customer?.notifToken) {
        await sendNotifications({
          title: "On the way.",
          body: "Your chauffeur is on the way for your ride.",

          data: { type: "ride-update", url: "UserScreens/MyRides" },
          token: customer?.notifToken?.toString(),
        });
      }
    } else if (status == "Arrived") {
      await Ride.findOneAndUpdate(
        { _id: ObjectId(rideId) },
        {
          chauffeurStatus: "Arrived",
        },
        { new: true }
      );

      if (customer?.notifToken) {
        await sendNotifications({
          title: "Arrived.",
          body: "Your chauffeur has arrived for your ride.",

          data: { type: "ride-update", url: "UserScreens/MyRides" },
          token: customer?.notifToken?.toString(),
        });
      }
    } else if (status == "cancelledByCustomer") {
      await Ride.findOneAndUpdate(
        { _id: ObjectId(rideId) },
        {
          status: "CancelledByCustomer",
        },

        { new: true }
      );
    } else if (status == "noShow") {
      await Ride.findOneAndUpdate(
        { _id: ObjectId(rideId) },
        {
          status: "NoShow",
        },
        { new: true }
      );
    }

    res.json({ message: "Ride updated successfully." });
  } catch (err) {
    next(err);
    console.log("err", err);
  }
};

module.exports = updateRide;
