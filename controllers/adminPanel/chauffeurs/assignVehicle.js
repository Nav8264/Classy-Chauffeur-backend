const Chauffeur = require("../../../models/Chauffeur");
const Vehicle = require("../../../models/Vehicle");

const { ObjectId } = require("mongoose").Types;

const assignVehicle = async (req, res, next) => {
  const { chauffeurID, vehicleID } = req.body;
  const { status } = req.query;

  try {
    if (status == "chauffeur") {
      const chauffeur = await Chauffeur.findOne({ _id: ObjectId(chauffeurID) });
      console.log("chauffeur", chauffeur);
      await Vehicle.findOneAndUpdate(
        { chauffeur: ObjectId(chauffeur._id) },
        {
          $unset: {
            chauffeur: "",
          },
        },
        { new: true }
      );
      console.log("chauffeur?.vehicleId", chauffeur?.vehicleId);
    }
    const vehicleDetails = await Vehicle.findOne({
      _id: ObjectId(vehicleID),
    });

    const chauffeurDetails = await Chauffeur.findOne({
      _id: ObjectId(chauffeurID),
    });
    console.log("chauffeurDetails", chauffeurDetails?.vehicleId);
    if (chauffeurDetails?.vehicleId) {
      await Vehicle?.findOneAndUpdate(
        {
          _id: ObjectId(chauffeurDetails?.vehicleId),
        },
        {
          $unset: {
            chauffeur: "",
          },
        },
        { new: true }
      );
    }
    if (vehicleDetails?.chauffeur) {
      await Chauffeur?.findOneAndUpdate(
        {
          _id: ObjectId(vehicleDetails?.chauffeur),
        },
        {
          $unset: {
            vehicleId: "",
          },
        },
        { new: true }
      );
    }
    await Chauffeur.findOneAndUpdate(
      {
        _id: ObjectId(chauffeurID),
      },
      {
        vehicleId: vehicleID,
      },
      { new: true }
    );

    await Vehicle.findOneAndUpdate(
      {
        _id: ObjectId(vehicleID),
      },
      {
        chauffeur: chauffeurID,
      },
      { new: true }
    );

    res.json({
      message: "Vehicle assigned Successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = assignVehicle;
