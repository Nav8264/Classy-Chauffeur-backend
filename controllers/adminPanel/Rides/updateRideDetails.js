const dayjs = require("dayjs");
const Chauffeur = require("../../../models/Chauffeur");
const Ride = require("../../../models/Ride");
const VehiclePrice = require("../../../models/VehiclePrice");
const GetCoordinates = require("../../../services/GeoLocation/GetCoordinates");
const sendNotifications = require("../../../services/notifications/notification");
const getRideTimezone = require("../../../services/rideServices/getRideTimezone");
const createReturnRide = require("../../../services/rideServices/createReturnRide");
const agenda = require("../../../utils/agendaUtils");
const createHttpError = require("http-errors");
const { ObjectId } = require("mongoose").Types;
const moment = require("moment-timezone");

const updateRideDetails = async (req, res, next) => {
  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);
  try {
    const data = req.body;
    console.log("update data here", data);
    let ride = await Ride.findOne({ _id: data?.rideID });
    if (!ride) {
      createHttpError.NotFound("Ride not found");
    }

    let pickUpCoords;
    let dropCoords;

    if (data.pickupPlaceId) {
      pickUpCoords = await GetCoordinates(data.pickupPlaceId);
      pickUpTimezone = await getRideTimezone(
        pickUpCoords?.lat,
        pickUpCoords?.lng
      );
      data.pickupLocation = {
        name: data.pickupLocation,
        pickUpCoords,
        placeId: data.pickupPlaceId,
      };
    }

    if (data.dropPlaceId) {
      dropCoords = await GetCoordinates(data.dropPlaceId);
      data.dropLocation = {
        name: data.dropLocation,
        dropCoords,
        placeId: data.dropPlaceId,
      };
    }

    const stopsOfRide = [];

    if (data.addStop && data.addStop?.length > 0) {
      for (let x of data.addStop) {
        const stopCoords = await GetCoordinates(x.stopPlaceId);

        stopsOfRide.push({
          name: x.stopName,
          stopCoords,
          stopPlaceId: x.stopPlaceId,
        });
      }
      data.addStop = stopsOfRide;
    }

    let returnRide;

    if (
      !data?.returnRideId &&
      data.returnPickupLocation &&
      data.rideMode == "Round-Trip"
    ) {
      returnRide = await createReturnRide({
        returnPickupLocation: data?.returnPickupLocation,
        returnPickupPlaceId: data?.returnPickupPlaceId,
        returnDropPlaceId:
          data?.pickupLocation?.placeId || ride?.pickupLocation?.placeId,
        returnDropLocation:
          data?.pickupLocation?.name || ride?.pickupLocation?.name,
        chauffeurID: data?.chauffeurID || ride?.chauffeurID,
        returnDateAndTime: data?.returnDateAndTime,
        salutation: data?.salutation || ride?.salutation,
        bookedBySalutation:
          data?.bookedBySalutation || ride?.bookedBySalutation,
        bookedByFirstName: data?.bookedByFirstName || ride?.bookedByFirstName,
        bookedByLastName: data?.bookedByLastName || ride?.bookedByLastName,
        bookedByCountryCode:
          data?.bookedByCountryCode || ride?.bookedByCountryCode,
        bookedByPhoneNo: data?.bookedByPhoneNo || ride?.bookedByPhoneNo,
        bookedByEmail: data?.bookedByEmail || ride?.bookedByEmail,
        accountNo: data?.accountNo || ride?.accountNo,
        billingContact: data?.billingContact || ride?.billingContact,
        billingContactId: data?.billingContactId || ride?.billingContactId,
        companyName: data?.companyName || ride?.companyName,
        salutation: data?.salutation || ride?.salutation,
        firstName: data?.firstName || ride?.firstName,
        lastName: data?.lastName || ride?.lastName,
        countryCode: data?.countryCode || ride?.countryCode,
        phoneNo: data?.phoneNo || ride?.phoneNo,
        email: data?.email || ride?.email,
        passengers: data?.passengers || ride?.passengers,
        customerId: data?.customerId || ride?.customerId,
        vehicleId: data?.vehicleId || ride?.vehicleId,
        vehicleType: data?.vehicleType || ride?.vehicleType,
        paymentType: data?.paymentType || ride?.paymentType,
        paymentStatus: "Pending",
        addTrailer: data?.addTrailer || ride?.addTrailer,
        numberOfHours: data?.numberOfHours || ride?.numberOfHours,
        byAdmin: data?.byAdmin || ride?.byAdmin,
        // flightId: data?.flightId || ride?.flightId,
        // flightNumber: data?.flightNumber || ride?.flightNumber,
        // flightDate: data?.flightDate || ride?.flightDate,
        // airportId: data?.airportId || ride?.airportId,
        rideMode: data?.rideMode || ride?.rideMode,
        rideType: data?.rideType || ride?.rideType,
        paymentMethod: ride?.paymentMethod || data?.paymentMethod,
        returnPrice: data?.returnPrice,
        returnPricingDetails: data?.returnPricingDetails,
        notes: data?.notes,
        luggage: data?.luggage || ride?.luggage,
        luggageCapacityLarge:
          data?.luggageCapacityLarge || ride?.luggageCapacityLarge,
        luggageCapacitySmall:
          data?.luggageCapacitySmall || ride?.luggageCapacitySmall,
        childSeats: data?.childSeats || ride?.childSeats,
        clientRef: data?.clientRef || ride?.clientRef,
        // timeZone,
      });
    }
    console.log("return ride id is here", returnRide);
    data.returnRideId = returnRide?.returnRideId;

    let chauffeur;

    if (data.chauffeurID) {
      chauffeur = await Chauffeur.findOne({
        _id: ObjectId(data.chauffeurID),
      });
    }
    if (chauffeur?.notifToken) {
      await sendNotifications({
        title: "You have a new Ride.",
        body: `A new ride has assigned to you at ${dayjs(data.date).format(
          "lll"
        )}.`,
        receiverId: data.chauffeurID,
        type: "new-ride",
        token: chauffeur?.notifToken?.toString(),

        data: {
          url: "UserScreens/Actions/RidesHistoryScreen",
        },
      });
    }

    const updatedRide = await Ride.findOneAndUpdate(
      {
        _id: ObjectId(data.rideID),
      },
      {
        ...data,
        chauffeurID:
          data?.isChauffeurIdAvailable == false
            ? null
            : data?.chauffeurID || ride?.chauffeurID,
      },
      { new: true }
    );

    if (data?.chauffeurID || ride?.chauffeurID) {
      const reciever = data?.chauffeurID || ride?.chauffeurID;
      req.io
        .to(reciever?.toString())
        .emit("refetchRides", { message: "Ride updated" });
    }
    req.io.emit("refetchOffers", { message: "Offers updated" });

    //reschedule reminder notification agenda job
    const jobs = await agenda.jobs({
      name: "Ride Reminder Notification",
      "data.rideId": new ObjectId(ride?.id),
    });
    console.log(
      "updatedRide?.chauffeurID",
      updatedRide?.chauffeurID,
      ride?.chauffeurID
    );
    if (jobs.length !== 0) {
      const job = jobs[0];
      //Update chauffeur if changed
      if (
        updatedRide?.chauffeurID?.toString() !== ride?.chauffeurID?.toString()
      ) {
        (job.attrs.data.chauffeurId = updatedRide?.chauffeurID?.toString()),
          await job.save();
      }

      //update nexRunAt if date changed
      if (updatedRide?.date?.toString() !== ride?.date?.toString()) {
        const scheduleDate = moment(
          new Date(updatedRide?.date) - 60 * 60 * 1000
        );
        const convertedDate = moment(scheduleDate).tz(ride?.timeZone, true);
        job.attrs.nextRunAt = convertedDate;
        await job.save();
      }
    } else {
      if (updatedRide?.chauffeurID?.toString()) {
        const scheduleDate = moment(
          new Date(updatedRide?.date) - 60 * 60 * 1000
        );
        const convertedDate = moment(scheduleDate).tz(ride?.timeZone, true);

        agenda.schedule(convertedDate, "Ride Reminder Notification", {
          rideId: ride?._id,
          chauffeurId: updatedRide?.chauffeurID,
          pickUpTimezone: ride?.timeZone,
        });
      }
    }

    res.json({
      message: "Ride Updated Successfully",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = updateRideDetails;
