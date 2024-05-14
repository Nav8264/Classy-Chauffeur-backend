const Ride = require("../../models/Ride");
const { ObjectId } = require("mongoose").Types;

const rateChauffeur = async (req, res, next) => {
  // res.status(201).send({ message: "success" });
  const { rideId, rating } = req.body;
  try {
    if (rideId) {
      const ride = await Ride.findOneAndUpdate(
        { _id: ObjectId(rideId) },
        { passengerRating: Number(rating) },
        { new: true }
      );
      console.log(ride);

      res.status(201).send({
        success: true,
        message: "Rating added successfully!",
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = rateChauffeur;
