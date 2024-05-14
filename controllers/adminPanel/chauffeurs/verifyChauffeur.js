const Chauffeur = require("../../../models/Chauffeur");
const Vehicle = require("../../../models/Vehicle");
const { ObjectId } = require("mongoose").Types;

const verifyChauffeurs = async (req, res, next) => {
  const { status, chauffeurID } = req.body;

  try {
    const chauffeur = await Chauffeur.findOne({ _id: ObjectId(chauffeurID) });

    const vehicle = await Vehicle.findOne({
      chauffeur: ObjectId(chauffeur?._id),
    });

    console.log(vehicle);

    if (status == "Rejected" || status == "Deactivated") {
      await Vehicle.findOneAndUpdate(
        { chauffeur: ObjectId(chauffeur._id) },
        {
          $unset: {
            chauffeur: "",
          },
        },
        { new: true }
      );

      await Chauffeur.findOneAndUpdate(
        {
          _id: ObjectId(chauffeurID),
        },
        {
          isVerified: status,

          $unset: {
            vehicleId: "",
          },
        },
        { new: true }
      );
    } else {
      await Chauffeur.findOneAndUpdate(
        {
          _id: ObjectId(chauffeurID),
        },
        {
          isVerified: status,
        },
        { new: true }
      );
    }

    res.json({
      message: "Status Updated Successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = verifyChauffeurs;
