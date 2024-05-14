const Ride = require("../../models/Ride");
const RidePrices = require("../../models/RidePrices");
const { ObjectId } = require("mongoose").Types;

const addAllPrices = async (ride, allPrices) => {
  console.log("ride.allPrices", ride.allPrices, allPrices);

  /**
   * Here give 40% of the flat price to the Chauffeur
   * Formula is :=>
   * (40 * flatRate) / 100
   */
  const chauffeurPrice = (40 * allPrices.flatRate) / 100;

  if (ride.allPrices) {
    await RidePrices.findOneAndUpdate(
      { _id: ObjectId(ride.allPrices) },
      { ...allPrices },
      { new: true }
    );

    await Ride.findOneAndUpdate(
      { _id: ObjectId(ride._id) },
      {
        price: allPrices.totalPrice,
        chauffeurPrice,
      },
      { new: true }
    );
  } else {
    const prices = new RidePrices({ ...allPrices });

    await Ride.findOneAndUpdate(
      { _id: ObjectId(ride._id) },
      {
        allPrices: prices._id,
        price: allPrices.totalPrice,
        chauffeurPrice,
      },
      { new: true }
    );

    await prices.save();
  }
};

module.exports = addAllPrices;
