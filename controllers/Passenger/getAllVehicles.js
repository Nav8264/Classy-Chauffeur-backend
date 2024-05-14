const createError = require("http-errors");
const AdditionalPrice = require("../../models/AdditionalPrice");
const Ride = require("../../models/Ride");

const Vehicle = require("../../models/Vehicle");
const Airports = require("../../models/Airports");
const getRideDistance = require("../../services/GeoLocation/getRideDistance");
const { ObjectId } = require("mongoose").Types;

const getAllVehicles = async (req, res, next) => {
  try {
    const { className, seats, rideId, returnRidePlaceId } = req.query;
    console.log("rideId", rideId);
    let searchCriteria = {};

    let addPriceCriteria = {};
    if (rideId) {
      /// Calling ride by its id to get ride details
      const ride = await Ride.findOne({ _id: ObjectId(rideId) });
      console.log("ride", ride);
      let returnKms = 0;
      //have to check this later for baby seat and airport toll addition
      if (returnRidePlaceId) {
        returnKms = await getRideDistance(
          returnRidePlaceId,
          ride.pickupLocation.placeId
        );

        returnKms = returnKms / 1000;
      }

      console.log(
        "returnKms",
        returnKms,
        returnRidePlaceId,
        ride.pickupLocation.placeId
      );

      let kms = ride.totalRideDistance;

      /// searching vehicles by passengers requirement.
      searchCriteria["$and"] = [
        /// TODO:  infant, toddler and booster are skipped for a while because it was asked by client

        // { infant: { $gte: parseInt(ride.childSeats[0].infant) } },

        // { toddler: { $gte: parseInt(ride.childSeats[1].toddler) } },

        // { booster: { $gte: parseInt(ride.childSeats[2].booster) } },

        { luggageQuantity: { $gte: parseInt(ride.luggage) } },

        { capacity: { $gte: parseInt(ride.passengers) } },
      ];

      /// Called additional prices to add on ride charges
      const additionalPrices = await AdditionalPrice.find();

      let addAdditionalPrices = 0;
      let eventCharges = 0;

      await additionalPrices.map((item) => {
        /// getting additional charges to add in ride everyTime

        if (item?.rateName == "GST" || item?.rateName == "ADMIN-FEE") {
          addAdditionalPrices =
            parseInt(addAdditionalPrices) + parseInt(item?.amount);
        } else if (item?.rateName == "EVENT-FEE") {
          /// getting Event charges to add in Event type rides

          eventCharges = parseInt(eventCharges) + parseInt(item?.amount);
        } else if (item?.rateName == "AIRPORT-TOLL") {
          /// getting Airport charges to add in Airport type rides

          airportToll = parseInt(airportToll) + parseInt(item?.amount);
        }
      });

      /// getting Airport Toll Price if required
      let airportToll = 0;

      if (ride?.airportId) {
        const airport = await Airports.findOne({
          _id: ObjectId(ride?.airportId),
        });

        if (airport) {
          airportToll = parseInt(airport.airportToll);
        }
      }

      //getting child seat count for price addition ($10 per seat)
      let babySeats = 0;

      if (ride?.childSeats) {
        const babySeatCount = ride?.childSeats
          ?.map((val) => {
            return parseInt(Object.values(val)?.[0]);
          })
          ?.map((ite) => (babySeats += ite));
      }

      console.log("babySeats", babySeats);

      /// adding price per Km
      addPriceCriteria =
        ride?.paymentType == "perKm"
          ? perKmPrice(
              kms,
              ride,
              addAdditionalPrices,
              additionalPrices,
              eventCharges,
              airportToll,
              returnKms,
              babySeats
            )
          : perHourPrice(
              ride?.numberOfHours,
              ride,
              airportToll,
              addAdditionalPrices,
              eventCharges,
              additionalPrices,
              babySeats
            );
    }

    const vehicles = await Vehicle.aggregate([
      {
        $match: searchCriteria,
      },
      {
        $addFields: addPriceCriteria,
      },
      {
        $group: {
          _id: "$category",
          vehicleId: { $first: "$_id" },
          vehicleName: { $first: "$vehicleName" },
          category: { $first: "$category" },

          price: { $first: "$price" },
          pricingDetails: { $first: "$pricingDetails" },

          returnPrice: { $first: "$returnPrice" },
          returnPricingDetails: { $first: "$returnPricingDetails" },

          vehicleLogo: { $first: "$vehicleLogo" },
          vehicleImage: { $first: "$vehicleImage" },
          category: { $first: "$category" },
          capacity: { $first: "$capacity" },
          luggageQuantity: { $first: "$luggageQuantity" },
          trailerOption: { $first: "$trailerOption" },
          vehicleOwner: { $first: "$vehicleOwner" },
        },
      },
      // {
      //   $project: {
      //     _id: 1,
      //     vehicleName: 1,
      //     category: 1,

      //     price: 1,
      //     pricingDetails: 1,

      //     returnPrice: 1,
      //     returnPricingDetails: 1,

      //     vehicleLogo: 1,
      //     vehicleImage: 1,
      //     category: 1,
      //     capacity: 1,
      //     luggageQuantity: 1,
      //     trailerOption: 1,
      //     vehicleOwner: 1,
      //   },
      // },
      { $set: { vehicleName: "$category" } },

      {
        $sort: { price: 1 },
      },
    ]);

    res.json({
      message: "Successfully Fetched vehicles for passenger.",
      count: vehicles.length,
      data: vehicles,
    });
  } catch (err) {
    next(err);
    console.log("err", err);
  }
};

module.exports = getAllVehicles;

function perKmPrice(
  kms,
  ride,
  addAdditionalPrices,
  additionalPrices,
  eventCharges,
  airportToll,
  returnKms,
  babySeats
) {
  /// if kms will be greater than fixedkms only then price will be calculated otherwise fixedPrice will be returned

  /// Calculated price from simple pick up to drop
  /// formula is
  /// fixPrice + ((rideKms - fixKms) * pricePerKm);
  const pointToPointSum = getPointToPointSum(kms, ride, airportToll, babySeats);

  /// calculated additional Charges to add up every time in ride prices
  /// formula is:
  /// (addAdditionalPrices * pointToPointSum) / 100
  const additionalCharges = getAdditionalCharges(
    addAdditionalPrices,
    ride,
    pointToPointSum,
    airportToll,
    eventCharges
  );

  /**
   * These functions are called to calculate prices of return ride (if any)
   */
  const returnPointToPointSum = getPointToPointSum(
    returnKms,
    ride,
    airportToll
  );

  const returnAdditionalCharges = getAdditionalCharges(
    addAdditionalPrices,
    ride,
    returnPointToPointSum,
    airportToll,
    eventCharges
  );

  let returnPrices = {};

  if (ride?.rideMode == "Round-Trip") {
    returnPrices = {
      returnPrice: {
        $sum: {
          $add: [
            {
              $toDouble: returnAdditionalCharges,
            },
            {
              $toDouble: returnPointToPointSum,
            },
          ],
        },
      },

      returnPricingDetails: pricingDetails(
        returnPointToPointSum,
        ride,
        additionalPrices,
        airportToll,
        eventCharges
      ),
    };
  }

  /**
   * Here, setting final prices
   */
  let addPriceCriteria = {
    price: {
      $sum: {
        $add: [
          {
            $toDouble: additionalCharges,
          },
          {
            $toDouble: pointToPointSum,
          },
        ],
      },
    },

    pricingDetails: pricingDetails(
      pointToPointSum,
      ride,
      additionalPrices,
      airportToll,
      eventCharges
    ),

    ...returnPrices,
  };

  return addPriceCriteria;
}

function perHourPrice(
  hours,
  ride,
  airportToll,
  addAdditionalPrices,
  eventCharges,
  additionalPrices,
  babySeats
) {
  /// Calculated price from simple pick up to drop
  /// formula is
  /// (hours * pricePerHour) + additional(if any);
  const pointToPointSum = gePointToPointHrsSum(
    hours,
    ride,
    airportToll,
    babySeats
  );

  /// calculated additional Charges to add up every time in ride prices
  /// formula is:
  /// (addAdditionalPrices * pointToPointSum) / 100
  const additionalCharges = getAdditionalCharges(
    addAdditionalPrices,
    ride,
    pointToPointSum,
    airportToll,
    eventCharges
  );

  let returnPrices = {};

  if (ride?.rideMode == "Round-Trip") {
    returnPrices = {
      returnPrice: {
        $sum: {
          $add: [
            {
              $toDouble: additionalCharges,
            },
            {
              $toDouble: pointToPointSum,
            },
          ],
        },
      },

      returnPricingDetails: pricingDetails(
        pointToPointSum,
        ride,
        additionalPrices,
        airportToll,
        eventCharges
      ),
    };
  }

  /**
   * Here, setting final prices
   */
  let addPriceCriteria = {
    price: {
      $sum: {
        $add: [
          {
            $toDouble: additionalCharges,
          },
          {
            $toDouble: pointToPointSum,
          },
        ],
      },
    },

    pricingDetails: pricingDetails(
      pointToPointSum,
      ride,
      additionalPrices,
      airportToll,
      eventCharges
    ),

    ...returnPrices,
  };

  return addPriceCriteria;
}

/**
 *
 * @param { This function is for get point to point price in kilometers
 *          Calculated price from simple pick up to drop
 *          formula is
 *          fixPrice + ((rideKms - fixKms) * pricePerKm);
 *          calculated additional Charges to add up every time in ride prices}
 * @param { Here add the ride to show ride data}
 * @returns
 */
function getPointToPointSum(kms, ride, airportToll, babySeats) {
  return {
    $cond: [
      { $gt: [kms, { $toDouble: "$fixedKm" }] },
      {
        $sum: {
          $add: [
            { $toDouble: "$fixedPrice" },

            {
              $multiply: [
                {
                  $subtract: [{ $toDouble: kms }, { $toDouble: "$fixedKm" }],
                },
                { $toDouble: "$pricePerKm" },
              ],
            },
            ride.addTrailer ? 50 : 0,
            // ride?.rideType == "Airport-Pickup"
            //   ? //  ||
            //     // ride?.rideType == "Airport-Drop"
            //     airportToll
            //   : 0,
            babySeats ? babySeats * 10 : 0,
          ],
        },
      },
      {
        $toDouble: "$fixedPrice",
      },
    ],
  };
}

/**
 * Function to get Point to Point sum in Hours
 * @param hours
 * @param ride
 * @returns
 */
function gePointToPointHrsSum(hours, ride, airportToll, babySeats) {
  console.log("babySeatssss", babySeats);
  return {
    $cond: [
      { $gt: [hours, { $toDouble: 1 }] },
      {
        $sum: {
          $add: [
            {
              $multiply: [{ $toDouble: hours }, { $toDouble: "$pricePerHour" }],
            },
            ride.addTrailer ? 50 : 0,
            ride?.rideType == "Airport-Pickup" ? airportToll : 0,
            babySeats ? babySeats * 10 : 0,
          ],
        },
      },
      {
        $toDouble: "$pricePerHour",
      },
    ],
  };
}

/**
 * This function is to set all the Pricing details required
 * @param {*} pointToPointSum
 * @param {*} ride
 * @param {*} additionalPrices
 * @param {*} airportToll
 * @returns
 */
function pricingDetails(
  pointToPointSum,
  ride,
  additionalPrices,
  airportToll,
  eventCharges
) {
  return {
    flatRate: pointToPointSum,
    toll: ride?.rideType == "Airport-Pickup" ? airportToll : 0,

    gst: getPercAmount(additionalPrices, pointToPointSum, "GST"),
    gstPerc:
      additionalPrices?.find((item) => item?.rateName == "GST")?.amount + "%",

    adminFee: getPercAmount(additionalPrices, pointToPointSum, "ADMIN-FEE"),
    adminFeePerc:
      additionalPrices?.find((item) => item?.rateName == "ADMIN-FEE")?.amount +
      "%",

    eventChargesPerc: ride.rideType == "Event" ? eventCharges : 0,
    eventChargesPerc:
      ride.rideType == "Event"
        ? additionalPrices?.find((item) => item?.rateName == "EVENT-FEE")
            ?.amount + "%"
        : "0%",

    airportToll: ride?.rideType == "Airport-Pickup" ? airportToll : 0,

    trailer: ride.addTrailer ? 50 : 0,
  };
}

function getAdditionalCharges(
  addAdditionalPrices,
  ride,
  pointToPointSum,
  airportToll,
  eventCharges
) {
  return {
    $sum: {
      $add: [
        {
          $divide: [
            {
              $multiply: [
                {
                  $add: [
                    {
                      $toDouble: addAdditionalPrices,
                    },

                    {
                      /// Adding 'Event Fee' extra if ride is Event type
                      $toDouble: ride.rideType == "Event" ? eventCharges : 0,
                    },
                  ],
                },

                {
                  $toDouble: pointToPointSum,
                },
              ],
            },
            {
              $toDouble: 100,
            },
          ],
        },
        {
          $toDouble: ride?.rideType === "Airport-Pickup" ? airportToll : 0,
        },
      ],
    },
  };
}

function getPercAmount(additionalPrices, pointToPointSum, type) {
  return {
    $sum: {
      $divide: [
        {
          $multiply: [
            {
              $add: [
                {
                  $toDouble: additionalPrices?.find(
                    (item) => item?.rateName == type
                  )?.amount,
                },
              ],
            },

            {
              $toDouble: pointToPointSum,
            },
          ],
        },
        {
          $toDouble: 100,
        },
      ],
    },
  };
}
