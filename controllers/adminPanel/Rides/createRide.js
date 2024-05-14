const {
  createRideValidation,
} = require("../../../services/validations/validation_schema");
const Ride = require("../../../models/Ride");
const GetCoordinates = require("../../../services/GeoLocation/GetCoordinates");
const getRideDistance = require("../../../services/GeoLocation/getRideDistance");
const Chauffeur = require("../../../models/Chauffeur");
const createRideBookingNumber = require("../../../services/rideServices/createRideBookingNumber");
const sendNotifications = require("../../../services/notifications/notification");
const getRidePrice = require("../../../services/rideServices/getRidePrice");
const createReturnRide = require("../../../services/rideServices/createReturnRide");
const sendRidePdfEmail = require("../../../services/sendRidePdfEmail");
const RidePrices = require("../../../models/RidePrices");
const notifyChauffeurs = require("../../../services/rideServices/notifyChauffeurs");
const createHttpError = require("http-errors");
const getTimeZone = require("../../../services/GeoLocation/getTimeZone");
const dateAndTimezone = require("../../../services/rideServices/dateandtimezone");
const getRideTimezone = require("../../../services/rideServices/getRideTimezone");
const OffersDays = require("../../../models/Offers");
const agenda = require("../../../utils/agendaUtils");
const moment = require("moment-timezone");

const { ObjectId } = require("mongoose").Types;

const createRide = async (req, res, next) => {
  try {
    const result = await createRideValidation.validateAsync(req.body);

    let {
      chauffeurID,

      price,
      customerId,
      vehicleId,

      pickupLocation,
      pickupPlaceId,

      dropLocation,
      dropPlaceId,

      addStop,

      date,
      rideTime,
      salutation,
      bookedBySalutation,
      firstName,
      lastName,
      countryCode,
      phoneNo,
      email,

      rideMode,
      rideType,
      passengers,
      luggage,
      luggageCapacityLarge,
      luggageCapacitySmall,
      childSeats,
      vehicleType,
      paymentStatus,
      paymentType,

      numberOfHours,
      flightId,
      flightNumber,
      flightDate,
      airportId,

      addTrailer,

      returnPickupLocation,
      returnPickupPlaceId,
      returnDateAndTime,
      paymentMethod,
      notes,
      byAdmin,
      accountNo,
      billingContact,
      billingContactId,
      companyName,
      bookedByFirstName,
      bookedByLastName,
      bookedByCountryCode,
      bookedByPhoneNo,
      bookedByEmail,
      timeZone,
      clientRef,
    } = result;

    let pickUpCoords;
    let dropCoords;
    let pickUpTimezone = "Australia/Brisbane";
    let regionName = "";

    if (pickupPlaceId) {
      pickUpCoords = await GetCoordinates(pickupPlaceId);
      let { timezone, region } = await getRideTimezone(
        pickUpCoords?.lat,
        pickUpCoords?.lng
      );
      pickUpTimezone = timezone;
      regionName = region;
    }

    const stopsOfRide = [];

    if (addStop && addStop?.length > 0) {
      for (let x of addStop) {
        const stopCoords = await GetCoordinates(x.stopPlaceId);

        stopsOfRide.push({
          name: x.stopName,
          stopCoords,
          stopPlaceId: x.stopPlaceId,
        });
      }
    }

    if (dropPlaceId) {
      dropCoords = await GetCoordinates(dropPlaceId);
    }

    let distance = 0;

    if (paymentType != "perHour") {
      // getting ride distance
      distance = await getRideDistance(pickupPlaceId, dropPlaceId, addStop);

      distance = distance / 1000;

      if (distance > 1000) {
        throw createHttpError[403]("Distance of ride is too long.");
      }

      if (distance.toString().includes(".")) {
        distance = parseInt(distance + 1)
          .toString()
          .split(".")[0];
      }
    }

    /**
     * Here, Return ride will only be created if it is being created from admin panel
     * And vehicleType will only come from admin panel
     
     */
    let returnRide;
    if (vehicleType && returnPickupLocation && rideMode == "Round-Trip") {
      const { returnDistance, returnRideId } = await createReturnRide({
        returnPickupLocation: returnPickupLocation,
        returnPickupPlaceId: returnPickupPlaceId,
        returnDropPlaceId: pickupPlaceId,
        returnDropLocation: pickupLocation,
        chauffeurID: chauffeurID,
        returnDateAndTime: returnDateAndTime,
        salutation,
        bookedBySalutation,
        bookedByFirstName,
        bookedByLastName,
        bookedByCountryCode,
        bookedByPhoneNo,
        bookedByEmail,
        firstName,
        lastName,
        countryCode,
        phoneNo,
        email,

        passengers,

        customerId,
        vehicleId,

        vehicleType,
        paymentType,
        paymentStatus,
        addTrailer,

        numberOfHours,
        // flightId,
        // flightNumber,
        // flightDate,
        // airportId,
        rideMode,
        rideType,

        notes,
        byAdmin,
        timeZone,
        clientRef,
      });

      returnRide = returnRideId;
    }

    console.log("distance :>> ", distance);

    /// create unique Ride Booking Number everytime
    let bookingNumber = await createRideBookingNumber();

    let ridePrice;

    let chauffeursPrice;

    let vehicle;

    let prices;

    if (vehicleType) {
      const { price, vehicleDetails, allPrices, chauffeurPrice } =
        await getRidePrice(
          vehicleType,
          rideType,
          distance,
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
    }

    let newPrices;

    if (vehicleType) {
      newPrices = new RidePrices({
        ...prices,
        deposits: paymentStatus == "Completed" ? prices?.totalDue : 0,
        totalDue: paymentStatus == "Completed" ? 0 : prices?.totalDue,
      });
    }

    /**
     * Sending notification to chauffeur if assigned to chauffeur
     */
    let chauffeur;

    if (chauffeurID) {
      chauffeur = await Chauffeur.findOne({
        _id: ObjectId(chauffeurID),
      });

      if (chauffeur?.notifToken) {
        await sendNotifications({
          title: "You have a new Ride.",
          body: `A new ride has assigned to you at ${new Date(
            date
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
        bookedByFirstName,
        bookedByLastName,
        bookedByCountryCode,
        bookedByPhoneNo,
        bookedByEmail,
      };
    }

    // let { lat, lng } = pickUpCoords;

    // const { finalDate, timezone } = await dateAndTimezone(lat, lng, date);

    const ride = new Ride({
      bookingNo: bookingNumber?.toString(),
      date: date,
      time: new Date(rideTime).toUTCString(),
      firstName,
      lastName,
      countryCode,
      phoneNo,
      email,
      salutation,
      bookedBySalutation,
      bookedByFirstName,
      bookedByLastName,
      bookedByCountryCode,
      bookedByPhoneNo,
      bookedByEmail,
      chauffeurID,

      customerId,

      pickupLocation: {
        name: pickupLocation,
        pickUpCoords,
        placeId: pickupPlaceId,
      },
      dropLocation: {
        name: dropLocation,
        dropCoords,
        placeId: dropPlaceId,
      },
      addStop: stopsOfRide,
      rideMode,
      rideType,
      passengers,
      luggage,
      luggageCapacityLarge,
      luggageCapacitySmall,
      childSeats,
      vehicleType,
      ...vehicleDetails,

      paymentType,
      paymentStatus,
      paymentMethod,

      addTrailer,

      totalRideDistance: parseInt(distance),

      numberOfHours,
      flightId,
      flightNumber,
      flightDate,
      airportId,

      price: ridePrice,
      chauffeurPrice: chauffeursPrice,
      returnRideId: returnRide?._id,

      allPrices: newPrices?._id || null,

      notes,
      byAdmin,

      ...companyNameDetails,

      timeZone: pickUpTimezone,
      clientRef,
    });

    await ride.save();

    if (chauffeurID) {
      // schedule job for reminder notification to driver
      const scheduleDate = moment(new Date(date) - 60 * 60 * 1000);
      const convertedDate = moment(scheduleDate).tz(pickUpTimezone, true);
      agenda.schedule(convertedDate, "Ride Reminder Notification", {
        rideId: ride?._id,
        chauffeurId: chauffeurID,
        pickUpTimezone,
      });
    }

    /**
     * Sending Email after ride created
     */
    if (vehicleType) {
      await newPrices.save();

      if (!byAdmin) {
        await sendRidePdfEmail(ride, vehicleType, prices, paymentMethod);
      }

      if (!chauffeurID) {
        const offers = await OffersDays.find();
        if (offers[0]?.autoAssign) await notifyChauffeurs(ride);
      }
    }
    if (chauffeurID) {
      req.io
        .to(chauffeurID?.toString())
        .emit("refetchRides", { message: "Ride updated" });
    }
    req.io.emit("refetchOffers", { message: "Offers updated" });

    res.status(200).json({
      message: "Ride saved successfully",
      success: true,
      ride_id: ride._id,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = createRide;
