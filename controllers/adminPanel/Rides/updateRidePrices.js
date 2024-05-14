const Ride = require("../../../models/Ride");
const RidePrice = require("../../../models/RidePrices");
const { ObjectId } = require("mongoose").Types;

const updateRidePrices = async (req, res, next) => {
  try {
    const { rideId, priceId } = req.query;

    const { chauffeurPrice, totalPrice, paymentMethod, paymentStatus } = req.body;

    const ride = await Ride.findOne({ _id: ObjectId(rideId) });

    if (ride?.allPrices) {
      await RidePrice.findOneAndUpdate(
        { _id: ObjectId(ride.allPrices) },
        { ...req.body },
        { new: true }
      );
    }

    await Ride.findOneAndUpdate(
      { _id: ObjectId(rideId) },
      { price: totalPrice, chauffeurPrice, paymentMethod, paymentStatus },
      { new: true }
    );

  
    if(ride?.chauffeurID){
      req.io.to(ride?.chauffeurID?.toString()).emit('refetchRides', {message:'Ride updated'});
     }
    res.json({ success: true, message: "Ride Prices updated successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = updateRidePrices;
