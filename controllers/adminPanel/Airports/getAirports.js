const Airports = require("../../../models/Airports");
const Airport = require("../../../models/Airports");
const { ObjectId } = require("mongoose").Types;

const getAllAirports = async (req, res) => {
  const { id } = req.query;
  try {
    const startIndex =
      (req.query.startIndex && parseInt(req.query.startIndex)) || 0;
    const fetchSize =
      (req.query.viewSize && parseInt(req.query.viewSize)) || 10;

    let allAirports;
    if (id) {
      allAirports = await Airports.findOne({ _id: ObjectId(id) });
      console.log("allAirports", allAirports);
    } else {
      allAirports = await Airports.aggregate([
        {
          $skip: startIndex,
        },
        {
          $limit: fetchSize,
        },
      ]);
    }

    const totalCount = await Airports.countDocuments();

    res.status(201).json({
      success: true,
      message: "Saved successfully!",
      totalCount: totalCount,
      data: allAirports,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = getAllAirports;
