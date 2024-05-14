const { default: axios } = require("axios");
const createError = require("http-errors");

const { ObjectId } = require("mongoose").Types;

const geolib = require("geolib");
const GetCoordinates = require("../../services/GeoLocation/GetCoordinates");

var admin = require("firebase-admin");

const passengerDetail = async (req, res, next) => {
  try {
    const { originId, destinationId } = req.query;
    const { token, title, body } = req.body;
    try {
       console.log('token', token)
      await admin.messaging().sendMulticast({
        tokens: [
          token,
          /* ... */
        ], // ['token_1', 'token_2', ...]
        notification: {
          title,
          body,
          // imageUrl: img,
        },
      });
  
    } catch (err) {
      console.log(err, "erooro");
    }
    // const { addStop } = req.body;
    // //   if (!originId || !destinationId) throw createError[400]("provide place id");
    // //   const origin = await axios.get(
    // //     `https://maps.googleapis.com/maps/api/place/details/json?place_id=${originId}&key=${process.env.GOOGLE_API_KEY}`
    // //   );

    // //   const destination = await axios.get(
    // //     `https://maps.googleapis.com/maps/api/place/details/json?place_id=${destinationId}&key=${process.env.GOOGLE_API_KEY}`
    // //   );

    // //   const startingLocation = await origin.data?.result?.geometry?.location;

    // //   const endLocation = await destination.data?.result?.geometry?.location;

    // //   const distance = geolib.getDistance(
    // //     startingLocation,
    // //     endLocation
    // // );

    // let distance = 0;

    // console.log(distance, " yeye 1");

    // let pickUpCoords = await GetCoordinates(originId);

    // let stopsOfRide = [];

    // let prevCoordsOfStop;

    // for (let x of addStop) {
    //   const stopCoords = await GetCoordinates(x.placeId);

    //   console.log(prevCoordsOfStop, " prevCoordsOfStop yuyu");

    //   distance =
    //     distance +
    //     (await geolib.getDistance(
    //       prevCoordsOfStop ? prevCoordsOfStop : pickUpCoords,
    //       stopCoords
    //     ));

    //   prevCoordsOfStop = stopCoords;

    //   //   stopsOfRide.push({ name: x.name, stopCoords });

    //   // console.log( await geolib.getDistance(pickUpCoords, stopCoords), " yeye 4")

    //   console.log(distance, " yeye 2");
    // }

    // const lastStopCoords = await GetCoordinates(
    //   addStop[addStop?.length - 1].placeId
    // );
    // let dropCoords = await GetCoordinates(destinationId);

    // distance =
    //   distance + (await geolib.getDistance(lastStopCoords, dropCoords));

    // console.log(distance, " yeye 3");

    // distance = await geolib.convertDistance(distance, "km");

    // if (distance.toString().includes(".")) {
    //   distance = await parseInt(distance + 1)
    //     .toString()
    //     .split(".")[0];
    // }

    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = passengerDetail;
