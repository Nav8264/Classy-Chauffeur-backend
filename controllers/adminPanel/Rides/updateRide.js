const createHttpError = require("http-errors");
const Chauffeur = require("../../../models/Chauffeur");
const Ride = require("../../../models/Ride");
const Vehicle = require("../../../models/Vehicle");
const GetCoordinates = require("../../../services/GeoLocation/GetCoordinates");
const getRideDistance = require("../../../services/GeoLocation/getRideDistance");
const sendNotifications = require("../../../services/notifications/notification");
const AdditionalPrice = require("../../../models/AdditionalPrice");
const getRidePrice = require("../../../services/rideServices/getRidePrice");
const createReturnRide = require("../../../services/rideServices/createReturnRide");
const sendEmail = require("../../../services/sendEmail");
const rideBookedTemplate = require("../../../templates/rideBooked");
const VehiclePrice = require("../../../models/VehiclePrice");
const sendRidePdfEmail = require("../../../services/sendRidePdfEmail");
const addAllPrices = require("../../../services/rideServices/addAllPrices");
const RidePrices = require("../../../models/RidePrices");
const notifyChauffeurs = require("../../../services/rideServices/notifyChauffeurs");
const RideCancellation = require("../../../templates/rideCancellation");

const { ObjectId } = require("mongoose").Types;
const dayjs = require("dayjs");
const getTimeZone = require("../../../services/GeoLocation/getTimeZone");
const dateAndTimezone = require("../../../services/rideServices/dateandtimezone");
const Conversation = require("../../../models/Conversation");

const updateRide = async (req, res, next) => {
  try {
    const { status, ridePrice, rideStatus } = req.query;

    const {
      chauffeurID,
      rideID,

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
      paymentType,
      paymentStatus,
      vehicleType,
      // airlineName,
      // flightNumber,
      addTrailer,
      // flightDetails,
      flightId,
      flightNumber,
      flightDate,
      airportId,

      numberOfHours,

      returnPickupLocation,
      returnPickupPlaceId,
      returnDateAndTime,

      allPrices,
      paymentMethod,
      returnPrice,
      returnPricingDetails,

      notes,

      accountNo,
      billingContact,
      billingContactId,
      companyName,
      bookedByFirstName,
      bookedByLastName,
      bookedByCountryCode,
      bookedByPhoneNo,
      bookedByEmail,
      status: schemaStatus,
      timeZone,
    } = req.body;

    let ride = await Ride.findOne({ _id: rideID });

    let vehicle;
    if (vehicleType) {
      vehicle = await VehiclePrice.findOne({
        category: vehicleType,
      });
    }

    if (!ride) {
      createHttpError.NotFound("Ride not found");
    }

    let returnRide;

    /// adding return ride
    if (
      !ride?.returnRideId &&
      returnPickupLocation &&
      rideMode == "Round-Trip"
    ) {
      returnRide = await createReturnRide({
        returnPickupLocation,
        returnPickupPlaceId,
        returnDropPlaceId: pickupPlaceId,
        returnDropLocation: pickupLocation,
        chauffeurID: ride?.chauffeurID,
        returnDateAndTime: returnDateAndTime,
        salutation: ride?.salutation,
        bookedBySalutation: ride?.bookedBySalutation,
        firstName: ride?.firstName || firstName,
        lastName: ride?.lastName || lastName,
        countryCode: ride?.countryCode || countryCode,
        phoneNo: ride?.phoneNo || phoneNo,
        email: ride?.email || email,

        passengers,

        // price,
        customerId: ride?.customerId,
        vehicleId: vehicleId,
        vehicleType: vehicleType,
        paymentType: ride?.paymentType,
        paymentStatus: paymentStatus || ride?.paymentStatus,
        addTrailer: addTrailer || ride?.addTrailer,
        numberOfHours: ride?.numberOfHours,
        flightId: ride?.flightId,
        flightNumber: ride?.flightNumber,
        flightDate: ride?.flightDate,
        airportId: ride?.airportId,
        rideMode: ride?.rideMode,
        rideType: ride?.rideType,
        paymentMethod: paymentMethod || ride?.paymentMethod,
        returnPrice,
        returnPricingDetails,

        notes,

        timeZone,
      });
    }
    if (status || rideStatus) {
      if (rideStatus) {
        if (rideStatus === "Cancelled") {
          await Ride.findOneAndUpdate(
            { _id: ObjectId(rideID) },
            {
              status: "Cancelled",
              $unset: { chauffeurID: "" },
            },

            { new: true }
          );
        } else {
          await Ride.findOneAndUpdate(
            { _id: ObjectId(rideID) },
            {
              status: rideStatus,
            },

            { new: true }
          );
        }
      }
      if (status == "cancel") {
        await Ride.findOneAndUpdate(
          { _id: ObjectId(rideID) },
          {
            status: "Cancelled",
            $unset: { chauffeurID: "" },
          },

          { new: true }
        );

        const rideDate = new Date(ride?.date).toLocaleString("en-US", {
          // timeZone: "Australia/Sydney",
          timeZone: ride.timeZone,
        });

        const lastUpdatedAt = new Date(ride?.updatedAt).toLocaleString(
          "en-US",
          {
            // timeZone: "Australia/Sydney",
            timeZone: ride.timeZone,
          }
        );

        const allPrices = await RidePrices.findOne({
          _id: ObjectId(ride.allPrices),
        });

        const vehicle = await Vehicle.findOne({
          _id: ObjectId(ride?.vehicleId),
        });

        // console.log(vehicle, "allPrices");

        // await sendEmail(
        //   [ride.email],
        //   `Welcome to BG Chauffeur`,
        //   RideCancellation({
        //     bookingNo: ride.bookingNo,
        //     lastModified: dayjs(lastUpdatedAt).format("DD-MM-YYYY hh:mm A"),
        //     pickUpDate: dayjs(rideDate).format("DD/MM/YYYY - dddd"),
        //     pickUpTime: dayjs(rideDate).format("hh:mm A"),
        //     serviceType: ride?.rideType,
        //     noOfPassengers: ride?.passengers,

        //     customerName: ride?.firstName,
        //     phoneNo: ride?.countryCode + ride?.phoneNo || "",

        //     vehicleType: vehicle.category,
        //     paymentMethod: ride?.paymentMethod,

        //     pickUpLocation: ride?.pickupLocation?.name,
        //     dropLocation: ride?.dropLocation?.name,
        //     notes: ride?.notes || "",

        //     flatRate: allPrices?.flatRate,
        //     reservationTotal: allPrices?.totalPrice,
        //     paymentsDeposits: allPrices?.deposits || 0,
        //     totalDue: allPrices?.totalDue,
        //   }),

        //   ["gurpreet.ramgarhia@simbaquartz.com"]
        // );
      } else if (status == "delete") {
        await Ride.findOneAndUpdate(
          { _id: ObjectId(rideID) },
          { $unset: { customerId: "" } },
          { new: true }
        );
      } else if (status == "price") {
        await Ride.findOneAndUpdate(
          { _id: ObjectId(rideID) },
          {
            vehicleId,
            vehicleType,
            price,
            chauffeurPrice: price,
            paymentStatus: paymentStatus || ride?.paymentStatus,
            returnRideId: returnRide?._id ? returnRide?._id : null,
            paymentMethod: paymentMethod || ride?.paymentMethod,
          }
        );

        if (firstName?.length != 0) {
          await Ride.findOneAndUpdate(
            { _id: ObjectId(rideID) },
            {
              salutation: salutation,
              firstName: firstName,
              lastName: lastName,
              countryCode: countryCode,
              phoneNo: phoneNo,
              email: email,
            },
            { new: true }
          );
        }

        /**
         * Updating or creating prices
         */

        if (allPrices) {
          await addAllPrices(ride, allPrices);
        }

        /**
         * Calling ride again for updated values
         */

        ride = await Ride.findOne({ _id: rideID });

        /// Send email
        await sendRidePdfEmail(
          ride,
          vehicleType,
          allPrices,
          paymentMethod || ride?.paymentMethod
        );

        /// This is to send notification to chauffeurs with 500km of ride pickup
        // await notifyChauffeurs(ride);
      } else if (
        status == "paymentUpdate"
        //  &&
        // ride?.vehicleId &&
        // ride.vehicleId == vehicleId
      ) {
        await Ride.findOneAndUpdate(
          { _id: ObjectId(rideID) },
          {
            paymentStatus: paymentStatus || ride?.paymentStatus,
            returnRideId: returnRide?._id ? returnRide?._id : null,
            paymentMethod: paymentMethod || ride?.paymentMethod,
            vehicleId,
            vehicleType,
          },
          { new: true }
        );

        if (firstName?.length != 0) {
          await Ride.findOneAndUpdate(
            { _id: ObjectId(rideID) },
            {
              salutation: salutation,
              firstName: firstName,
              lastName: lastName,
              countryCode: countryCode,
              phoneNo: phoneNo,
              email: email,
            },
            { new: true }
          );
        }

        /**
         * Updating or creating prices
         */

        if (allPrices) {
          await addAllPrices(ride, allPrices);
        }

        /**
         * Calling ride again for updated values
         */

        ride = await Ride.findOne({ _id: rideID });

        /// Send email
        await sendRidePdfEmail(
          ride,
          vehicleType,
          allPrices,
          paymentMethod || ride?.paymentMethod
        );

        /// This is to send notification to chauffeurs with 500km of ride pickup
        await notifyChauffeurs(ride);
      } else if (status == "reassign") {
        await Ride.findOneAndUpdate(
          { _id: ObjectId(rideID) },
          { chauffeurID: ObjectId(chauffeurID) },
          { new: true }
        );
      }

      res.json({ message: "Ride updated successfully.", success: true });
    } else {
      let pickUpCoords;
      let dropCoords;

      if (pickupPlaceId) {
        pickUpCoords = await GetCoordinates(pickupPlaceId);
      }

      if (dropPlaceId) {
        dropCoords = await GetCoordinates(dropPlaceId);
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

      let distance = 0;

      if (paymentType != "perHour") {
        // getting ride distance
        distance = await getRideDistance(pickupPlaceId, dropPlaceId, addStop);

        /// if Ride is round trip then double charges other wise normal charges
        distance = distance / 1000;

        if (distance.toString().includes(".")) {
          distance = parseInt(distance + 1)
            .toString()
            .split(".")[0];
        }
      }

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
            airportId
          );

        ridePrice = price;
        vehicle = vehicleDetails;
        prices = allPrices;
        chauffeursPrice = allPrices?.chauffeurPrice;
      }

      let newPrices;

      if (vehicleType) {
        if (ride?.allPrices) {
          await RidePrices.findOneAndUpdate(
            { _id: ObjectId(ride?.allPrices) },
            {
              ...prices,
              deposits: paymentStatus == "Completed" ? prices?.totalDue : 0,
              totalDue: paymentStatus == "Completed" ? 0 : prices?.totalDue,
            }
          );
        } else {
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
       * This is to update vehicle if exists
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
          bookedBySalutation,
          bookedByFirstName,
          bookedByLastName,
          bookedByCountryCode,
          bookedByPhoneNo,
          bookedByEmail,
        };
      }

      // let { lat, lng } = pickUpCoords;

      // const { finalDate, timezone } = await dateAndTimezone(lat, lng, date);

      await Ride.findOneAndUpdate(
        {
          _id: ObjectId(rideID),
        },
        {
          chauffeurID,
          price,
          customerId: customerId || ride.customerId,
          date: date,
          rideTime,
          salutation,
          bookedBySalutation,
          firstName,
          lastName,
          countryCode,
          phoneNo,
          email,

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
          paymentType,
          paymentStatus: paymentStatus || ride?.paymentStatus,
          paymentMethod: paymentMethod || ride?.paymentMethod,
          vehicleType,
          ...vehicleDetails,

          // airlineName,
          // flightNumber,
          addTrailer,
          flightId,
          flightNumber,
          flightDate,
          airportId,
          // flightDetails,
          numberOfHours,

          totalRideDistance: parseInt(distance),
          price: ridePrice,

          price: ridePrice,
          chauffeurPrice: chauffeursPrice,

          allPrices: ride?.allPrices || newPrices?._id || null,

          notes,

          ...companyNameDetails,
          bookedByFirstName,
          bookedByLastName,
          bookedByCountryCode,
          bookedByPhoneNo,
          bookedByEmail,

          timeZone: timeZone,
        },
        { new: true }
      );

      res.json({
        message: "Ride Updated Successfully",
        success: true,
      });
    }
    if (chauffeurID || ride?.chauffeurID) {
      const reciever = chauffeurID || ride?.chauffeurID;
      req.io
        .to(reciever?.toString())
        .emit("refetchRides", { message: "Ride updated" });
    }
    req.io.emit("refetchOffers", { message: "Offers updated" });
    if (
      ride.chauffeurID &&
      ride.customerId &&
      (status === "Completed" ||
        rideStatus === "Completed" ||
        schemaStatus === "Completed")
    ) {
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
  } catch (err) {
    next(err);
    console.log("err", err);
  }
};

module.exports = updateRide;
