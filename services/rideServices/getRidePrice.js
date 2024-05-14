const AdditionalPrice = require("../../models/AdditionalPrice");
const Airports = require("../../models/Airports");
const Vehicle = require("../../models/Vehicle");
const VehiclePrice = require("../../models/VehiclePrice");
const { ObjectId } = require("mongoose").Types;

const getRidePrice = async (
  vehicleType,
  rideType,
  distance,
  addTrailer,
  paymentType,
  hours,
  childSeats,
  airportId,
  regionName
) => {
  let ridePrice = 0;
  let babySeats = 0;

  if (childSeats) {
    const babySeatCount = childSeats
      ?.map((val) => {
        return parseInt(Object.values(val)?.[0]);
      })
      ?.map((ite) => (babySeats += ite));
  }
  let vehicle = {};
  response = await VehiclePrice.findOne({
    category: vehicleType,
  });
  if (response?.statewisePricing && regionName) {
    vehicle =
      response?.[regionName?.replaceAll(" ", "")?.toLowerCase()] || response;
  } else {
    vehicle = response;
  }
  console.log("vehicle", vehicle);
  /// Called additional prices to add on ride charges
  const additionalPrices = await AdditionalPrice.find();

  let addAdditionalPrices = 0;
  let gstVal = 0;
  let adminFeeVal = 0;

  let eventCharges = 0;
  let chauffeurPrice = 0;

  await additionalPrices.map((item) => {
    /// getting additional charges to add in ride everyTime

    if (item?.rateName == "GST") {
      addAdditionalPrices =
        parseInt(addAdditionalPrices) + parseInt(item?.amount);

      gstVal = item?.amount;
    } else if (item?.rateName == "ADMIN-FEE") {
      addAdditionalPrices =
        parseInt(addAdditionalPrices) + parseInt(item?.amount);

      adminFeeVal = item?.amount;
    } else if (item?.rateName == "EVENT-FEE") {
      /// getting Event charges to add in Event type rides

      eventCharges = parseInt(eventCharges) + parseInt(item?.amount);
    }
  });

  /// getting Airport Toll Price if required
  let airportToll = 0;

  if (airportId) {
    const airport = await Airports.findOne({ _id: ObjectId(airportId) });
    if (airport) {
      airportToll = parseInt(airport.airportToll || 0);
    }
  }

  let childSeatPrice = parseInt(babySeats * 10) || 0;
  let trailerPrice = addTrailer ? 50 : 0;
  let allPrices = {};

  if (paymentType != "perHour") {
    const pointToPointPrice = () => {
      let sum = 0;
      if (distance > parseInt(vehicle?.fixedKm)) {
        /// Calculated price from simple pick up to drop
        /// formula is
        /// fixPrice + ((rideKms - fixKms) * pricePerKm);

        let fixPrice = parseInt(vehicle?.fixedPrice);

        let kmsLeftToAdd = distance - parseInt(vehicle?.fixedKm);

        let pricePerKm = parseInt(vehicle?.pricePerKm);

        sum = fixPrice + kmsLeftToAdd * pricePerKm;
      } else {
        sum = parseInt(vehicle?.fixedPrice);
      }
      return sum;
    };

    let allAdditionalPrices =
      ((addAdditionalPrices + (rideType == "Event" ? eventCharges : 0)) *
        pointToPointPrice()) /
      100;

    ridePrice =
      pointToPointPrice() +
      allAdditionalPrices +
      (rideType == "Airport-Pickup" ? airportToll : 0) +
      childSeatPrice +
      trailerPrice;

    /**
     * Here give 40% of the flat price to the Chauffeur
     * Formula is :=>
     * (40 * flatRate) / 100
     */
    chauffeurPrice = (40 * pointToPointPrice()) / 100;

    allPrices = {
      flatRate: pointToPointPrice(),
      toll: rideType == "Airport-Pickup" ? airportToll : 0,
      perHour: 0,
      parking: 0,
      overTime: 0,
      extraStop: 0,
      cardCharges: 0,
      stateTax: 0,
      childSeatPrice,
      trailerPrice,
      eventCharges:
        rideType == "Event" ? (eventCharges * pointToPointPrice()) / 100 : 0,
      eventChargesPerc: rideType == "Event" ? eventCharges.toString() : 0,

      adminFee: (adminFeeVal * pointToPointPrice()) / 100,
      adminFeePerc: adminFeeVal.toString(),

      gst: (gstVal * pointToPointPrice()) / 100,
      gstPerc: gstVal.toString(),

      totalDue: ridePrice,
      totalPrice: ridePrice,
      chauffeurPrice,
    };
    console.log("allPrices", allPrices);
  } else {
    /// Calculated price from simple pick up to drop
    /// formula is
    /// (hours * pricePerHour) + additional(if any);

    const pointToPointPrice = () => {
      let sum = 0;

      if (hours > 1) {
        let fullHours = hours * parseInt(vehicle?.pricePerHour);

        let extraAdditionals = rideType == "Airport-Pickup" ? airportToll : 0;

        sum = fullHours + extraAdditionals;
      } else {
        sum = parseInt(vehicle?.pricePerHour);
      }

      return sum;
    };

    let allAdditionalPrices =
      ((addAdditionalPrices + (rideType == "Event" ? eventCharges : 0)) *
        pointToPointPrice()) /
      100;

    ridePrice =
      pointToPointPrice() +
      allAdditionalPrices +
      (rideType == "Airport-Pickup" ? airportToll : 0) +
      childSeatPrice +
      trailerPrice;

    /**
     * Here give 40% of the flat price to the Chauffeur
     * Formula is :=>
     * (40 * flatRate) / 100
     */
    chauffeurPrice = (40 * pointToPointPrice()) / 100;

    allPrices = {
      flatRate: pointToPointPrice(),
      toll: rideType == "Airport-Pickup" ? airportToll : 0,
      perHour: vehicle?.pricePerHour,
      parking: 0,
      overTime: 0,
      extraStop: 0,
      cardCharges: 0,
      stateTax: 0,
      childSeatPrice,
      trailerPrice,
      eventCharges:
        rideType == "Event" ? (eventCharges * pointToPointPrice()) / 100 : 0,
      eventChargesPerc: rideType == "Event" ? eventCharges.toString() : 0,

      adminFee: (adminFeeVal * pointToPointPrice()) / 100,
      adminFeePerc: adminFeeVal.toString(),

      gst: (gstVal * pointToPointPrice()) / 100,
      gstPerc: gstVal.toString(),

      totalDue: Number(ridePrice)?.toFixed(2),
      totalPrice: Number(ridePrice)?.toFixed(2),
      chauffeurPrice,
    };
    console.log("allPrices", allPrices);
  }

  // console.log("ridePrice", ridePrice, allPrices);

  return {
    price: ridePrice,
    vehicleDetails: vehicle,
    allPrices,
    chauffeurPrice,
  };
};

module.exports = getRidePrice;
