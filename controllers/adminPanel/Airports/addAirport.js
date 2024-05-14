const Airport = require("../../../models/Airports");
const GetCoordinates = require("../../../services/GeoLocation/GetCoordinates");

const airport = async (req, res) => {
  try {
    const {
      airportCode,

      airportName,
      airportPlaceId,
      airportToll,
      airportTimezone,
    } = req.body;

    let airportCoords;
    if (airportPlaceId) {
      airportCoords = await GetCoordinates(airportPlaceId);
    }
    const addAirport = new Airport({
      airportCode: airportCode?.trim(),
      airportLocation: {
        name: airportName,
        airportCoords,
        placeId: airportPlaceId,
      },
      airportTimezone: airportTimezone,
      airportToll,
    });

    await addAirport.save();

    res.status(201).json({
      success: true,
      message: "Saved successfully!",
      data: addAirport,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = airport;
