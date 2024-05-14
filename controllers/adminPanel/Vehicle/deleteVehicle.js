const Chauffeur = require("../../../models/Chauffeur");
const Vehicle = require("../../../models/Vehicle");

const { ObjectId } = require("mongoose").Types;

const deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Chauffeur.findOneAndUpdate(
        { vehicleId: ObjectId(id) },
        {
          $unset: {
            vehicleId: "",
          },
        }
      );
  
    await Vehicle.findOneAndDelete({ _id: ObjectId(id) });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = deleteVehicle;
