const Chauffeur = require("../../../models/Chauffeur");
const UserLoginMech = require("../../../models/ChauffeurLoginMech");
const Ride = require("../../../models/Ride");
const Vehicle = require("../../../models/Vehicle");
const { ObjectId } = require("mongoose").Types;

const deleteChauffeurProfile = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const rides = await Ride.find({ chauffeurID: ObjectId(userId) });

    for (let x of rides) {
      await Ride.findOneAndUpdate(
        { _id: ObjectId(x._id) },
        { $unset: { chauffeurID: "" } },
        { new: true }
      );
    }

    await Vehicle.findOneAndUpdate(
      { chauffeur: ObjectId(userId) },
      { $unset: { chauffeur: "" } },
      { new: true }
    );

    await Chauffeur.findOneAndDelete({ _id: ObjectId(userId) });

    await UserLoginMech.findOneAndDelete({ user: ObjectId(userId) });

    res.json({ message: "Chauffeur deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteChauffeurProfile;
