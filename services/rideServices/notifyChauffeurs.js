const geolib = require("geolib");
const Chauffeur = require("../../models/Chauffeur");
var admin = require("firebase-admin");
const dayjs = require("dayjs");

const notifyChauffeurs = async (ride) => {
  const chauffeurs = await Chauffeur.find();

  const tokens = [];

  for (let x of chauffeurs) {
    let distance = 0;

    if (x?.location) {
      distance = geolib.getDistance(
        x.location,
        ride?.pickupLocation?.pickUpCoords
      );

      if (distance != 0 && distance / 1000 <= 500) {
        tokens.push(x.notifToken);
      }
    }
  }

  const rideDate = new Date(ride?.date).toLocaleString("en-US", {
    // timeZone: "Australia/Sydney",
    timeZone: ride.timeZone,
  });

  if (tokens?.length > 0) {
    await admin.messaging().sendMulticast({
      tokens,
      notification: {
        title: "New Offer",
        body: `A new job offer is available for you on ${dayjs(rideDate).format(
          "DD/MM/YYYY"
        )} from ${ride?.pickupLocation?.name}.`,
      },

      data: {
        url: "UserScreens/Offers",
      },
    });
  }
};

module.exports = notifyChauffeurs;
