const createHttpError = require("http-errors");
const Airports = require("../../../models/Airports");
const GetCoordinates = require("../../../services/GeoLocation/GetCoordinates");
const { ObjectId } = require("mongoose").Types;

const updateAirport = async (req, res, next) => {
  const { id } = req.query;
  const {
    airportCode,
    airportName,
    airportToll,
    airportPlaceId,
    airportTimezone,
  } = req.body;
  console.log("airportTimezone", airportTimezone);
  const airport = await Airports.findOne({
    _id: ObjectId(id),
  });

  if (!airport) {
    throw createHttpError.NotFound("Airport does not exists!");
  }

  let airportCoords;
  if (airportPlaceId) {
    airportCoords = await GetCoordinates(airportPlaceId);
  }
  await Airports.updateOne(
    { _id: ObjectId(id) },
    {
      airportCode: airportCode?.trim(),
      airportLocation: {
        name: airportName,
        airportCoords,
        placeId: airportPlaceId,
      },
      airportTimezone,
      airportToll,
    },
    { new: true }
  );

  res.json({
    success: true,
    message: "Airport updated successfully!",
  });
};
module.exports = updateAirport;
