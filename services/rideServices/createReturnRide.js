const Chauffeur = require("../../models/Chauffeur");
const Ride = require("../../models/Ride");
const RidePrices = require("../../models/RidePrices");
const agenda = require("../../utils/agendaUtils");
const GetCoordinates = require("../GeoLocation/GetCoordinates");
const getRideDistance = require("../GeoLocation/getRideDistance");
const sendNotifications = require("../notifications/notification");
const sendRidePdfEmail = require("../sendRidePdfEmail");
const createRideBookingNumber = require("./createRideBookingNumber");
const dateAndTimezone = require("./dateandtimezone");
const getRidePrice = require("./getRidePrice");
const getRideTimezone = require("./getRideTimezone");
const { ObjectId } = require("mongoose").Types;
const moment = require("moment-timezone");

const createReturnRide = async ({
  returnPickupLocation,
  returnPickupPlaceId,
  returnDropPlaceId,
  returnDropLocation,
  chauffeurID,
  returnDateAndTime,

  firstName,
  lastName,
  countryCode,
  phoneNo,
  email,

  passengers,

  // price,
  customerId,
  vehicleId,

  vehicleType,
  paymentType,
  addTrailer,
  luggage,
  luggageCapacityLarge,
  luggageCapacitySmall,
  childSeats,
  numberOfHours,
  flightId,
  flightNumber,
  airportId,

  rideMode,
  rideType,

  paymentStatus,
  paymentMethod,

  returnPrice,
  returnPricingDetails,
  notes,
  byAdmin,

  accountNo,
  billingContact,
  billingContactId,
  companyName,
  salutation,
  bookedBySalutation,
  bookedByFirstName,
  bookedByLastName,
  bookedByCountryCode,
  bookedByPhoneNo,
  bookedByEmail,
  clientRef,
}) => {
  let pickUpCoords;
  let dropCoords;
  let returnPickUpTimezone = "";
  let regionName = "";

  if (returnPickupPlaceId) {
    pickUpCoords = await GetCoordinates(returnPickupPlaceId);
    let { timezone, region } = await getRideTimezone(
      pickUpCoords?.lat,
      pickUpCoords?.lng
    );
    returnPickUpTimezone = timezone;
    regionName = region;
  }
  console.log("returnPickUpTimezone", returnPickUpTimezone, regionName);

  if (returnDropPlaceId) {
    dropCoords = await GetCoordinates(returnDropPlaceId);
  }

  /// create unique Ride Booking Number everytime
  let bookingNumber = await createRideBookingNumber();

  let returnDistance = 0;

  if (paymentType != "perHour") {
    // getting ride returnDistance
    returnDistance = await getRideDistance(
      returnPickupPlaceId,
      returnDropPlaceId
    );

    /// if Ride is round trip then double charges other wise normal charges
    returnDistance = returnDistance / 1000;

    if (returnDistance.toString().includes(".")) {
      returnDistance = parseInt(returnDistance + 1)
        .toString()
        .split(".")[0];
    }
  }

  let prices;

  let ridePrice;

  let chauffeursPrice = 0;

  let vehicle;

  let newPrices;

  if (returnPrice && returnPrice > 0) {
    ridePrice = returnPrice;

    chauffeursPrice = (40 * returnPricingDetails?.flatRate) / 100;

    newPrices = new RidePrices({
      ...returnPricingDetails,
      deposits:
        paymentStatus == "Completed" ? returnPricingDetails?.totalDue : 0,
      totalDue:
        paymentStatus == "Completed" ? 0 : returnPricingDetails?.totalDue,
    });
  } else {
    if (vehicleType || vehicleId) {
      const { price, vehicleDetails, allPrices, chauffeurPrice } =
        await getRidePrice(
          vehicleType,
          rideType,
          returnDistance,
          addTrailer,
          paymentType,
          numberOfHours,
          childSeats,
          airportId,
          regionName
        );

      ridePrice = price;
      vehicle = vehicleDetails;
      prices = allPrices;
      chauffeursPrice = chauffeurPrice;

      newPrices = new RidePrices({
        ...prices,
        deposits: paymentStatus == "Completed" ? prices?.totalDue : 0,
        totalDue: paymentStatus == "Completed" ? 0 : prices?.totalDue,
      });
    }
  }

  let chauffeur;

  if (chauffeurID) {
    chauffeur = await Chauffeur.findOne({
      _id: ObjectId(chauffeurID),
    });

    if (chauffeur?.notifToken) {
      await sendNotifications({
        title: "You have a new Ride.",
        body: `A new ride has assigned to you at ${new Date(
          returnDateAndTime
        ).toLocaleString()}.`,

        receiverId: chauffeurID,
        type: "new-ride",
        token: chauffeur?.notifToken?.toString(),

        data: {
          url: "UserScreens/Actions/RidesHistoryScreen",
        },
      });
    }
  }

  /**
   * This is to update vehicleId if exists
   */
  let vehicleDetails = {};

  if (vehicleId || chauffeur) {
    vehicleDetails = {
      vehicleId: vehicleId || chauffeur?.vehicleId,
    };
  }

  let companyNameDetails = {};

  if (accountNo) {
    companyNameDetails = {
      accountNo,
      billingContact,
      billingContactId,
      companyName,
      // bookedByFirstName,
      // bookedByLastName,
      // bookedByCountryCode,
      // bookedByPhoneNo,
      // bookedByEmail,
    };
  }

  // let { lat, lng } = pickUpCoords;

  // const { finalDate, timezone } = await dateAndTimezone(lat, lng, date);

  const ride = new Ride({
    bookingNo: bookingNumber?.toString(),
    date: returnDateAndTime,
    // time: new Date(rideTime).toUTCString(),
    firstName,
    lastName,
    countryCode,
    phoneNo,
    email,

    chauffeurID,

    customerId,

    pickupLocation: {
      name: returnPickupLocation,
      pickUpCoords,
      placeId: returnPickupPlaceId,
    },
    dropLocation: {
      name: returnDropLocation,
      dropCoords,
      placeId: returnDropPlaceId,
    },

    rideMode,
    rideType: rideType == "Airport-Pickup" ? "Airport-Drop" : rideType,
    passengers,
    luggage,
    luggageCapacityLarge,
    luggageCapacitySmall,
    childSeats,
    vehicleType,
    ...vehicleDetails,

    paymentType,
    paymentStatus,
    // airlineName,
    // flightNumber,
    addTrailer,
    // flightDetails,
    totalRideDistance: parseInt(returnDistance),

    numberOfHours,
    flightId,
    flightNumber,
    airportId,
    numberOfHours,
    returnFlight: true,
    price: ridePrice,
    chauffeurPrice: chauffeursPrice,
    bookedByFirstName,
    bookedByLastName,
    bookedByCountryCode,
    bookedByPhoneNo,
    bookedByEmail,
    salutation,
    bookedBySalutation,
    allPrices: newPrices?._id,
    paymentMethod,

    notes,
    byAdmin,

    ...companyNameDetails,

    timeZone: returnPickUpTimezone,
    clientRef,
    // timeZone: timezone,
  });
  if (newPrices) {
    await newPrices.save();
  }

  await ride.save();

  if (chauffeurID) {
    // schedule job for reminder notification to driver
    const scheduleDate = moment(new Date(returnDateAndTime) - 60 * 60 * 1000);
    const convertedDate = moment(scheduleDate).tz(returnPickUpTimezone, true);
    agenda.schedule(convertedDate, "Ride Reminder Notification", {
      rideId: ride?._id,
      chauffeurId: chauffeurID,
      returnPickUpTimezone,
    });
  }

  if (vehicleType || vehicleId) {
    if (!byAdmin) {
      await sendRidePdfEmail(
        ride,
        vehicleType,
        returnPricingDetails || prices,
        paymentMethod
      );
    }
  }
  return { returnDistance, returnRideId: ride?._id, returnRide: ride };
};

module.exports = createReturnRide;
