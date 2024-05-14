const radar = require("flightradar24-client/lib/radar");
const flight = require("flightradar24-client/lib/flight");

const flightdata = require("flight-data");
const axios = require("axios");
const dayjs = require("dayjs");

const getFlightDetails = async (req, res, next) => {
  let arr = [];
  const { flightNumber } = req.query;

  // const url = https://aeroapi.flightaware.com/aeroapi/airports/${airportCode}/flights/scheduled_arrivals?start=${startDate}&end=${endDate}
  try {
    if (flightNumber) {
      const startDate = dayjs().format("YYYY-MM-DD");

      const endDate = dayjs().add(2, "day").format("YYYY-MM-DD");

      await axios
        .get(
          `https://aeroapi.flightaware.com/aeroapi/flights/${flightNumber
            ?.toString()
            .toUpperCase()}?start=${startDate}&end=${endDate}`,
          {
            headers: {
              "x-apikey": "hInAcnDZz1tQG5HJicLIffN5ApeaTgu3",
            },
          }
        )
        .then((data) => {
          res.json({
            message: "Successfully loaded Flight",
            success: true,
            data: data?.data?.flights,
          });
        });
    }
  } catch (err) {
    next(err);
    console.log("err", err);
  }
};

module.exports = getFlightDetails;
