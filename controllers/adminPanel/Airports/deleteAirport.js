const Airports = require("../../../models/Airports");

const { ObjectId } = require("mongoose").Types;

const deleteAirport = async (req, res, next) => {
  try {
    const { id } = req.query;

    await Airports.findOneAndDelete({ _id: ObjectId(id) });

    res.status(200).json({
      message: "Deleted Airport successfully!",
      success: true,
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};
module.exports = deleteAirport;
