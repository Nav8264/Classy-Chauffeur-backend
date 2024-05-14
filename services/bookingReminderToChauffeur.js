const dayjs = require("dayjs");
const Ride = require("./../models/Ride");
const Chauffeur = require("./../models/Chauffeur");
const Notification = require("./../models/Notification");
var weekday = require("dayjs/plugin/weekday");
const sendNotifications = require("./notifications/notification");
const { date } = require("joi");
const { ObjectId } = require("mongoose").Types;

dayjs.extend(weekday);
const bookingReminderToChauffeur = async (chauffeurId) => {
  var utc = require("dayjs/plugin/utc");
  var timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

  dayjs.extend(utc);
  dayjs.extend(timezone);
  console.log("chauffeurId", chauffeurId);
  try {
    if (chauffeurId) {
      const driverToken = await Chauffeur.findOne({
        _id: ObjectId(chauffeurId),
      });

      const data1 = new Notification({
        type: "reminder",
        subject: "You have a ride within an hour.",
        message: `Confirm on the way`,
        receiver: chauffeurId,
        token: driverToken?.notifToken?.toString(),
        data: {
          url: "UserScreens/Actions/RidesHistoryScreen",
        },
      });
      await data1.save();
      const notifiObj = {
        title: "You have a ride in an hour.",
        body: `A reminder to press on the way.`,

        receiverId: chauffeurId,
        type: "reminder",
        token: driverToken?.notifToken?.toString(),

        data: {
          url: "UserScreens/Actions/RidesHistoryScreen",
        },
      };
      if (driverToken?.notifToken) {
        console.log("notification sent");
        await sendNotifications(notifiObj);
      }
    }
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

module.exports = bookingReminderToChauffeur;
