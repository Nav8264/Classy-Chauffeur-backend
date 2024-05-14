const geolib = require("geolib");
const GetCoordinates = require("./GetCoordinates");

const getRideDistance = async (originId, destinationId, addStop) => {
  try {
    let distance = 0;

    let pickUpCoords = await GetCoordinates(originId);

    let prevCoordsOfStop;

    if (addStop && addStop.length != 0) {
      for (let x of addStop) {
        const stopCoords = await GetCoordinates(x.stopPlaceId);

        console.log(prevCoordsOfStop, " prevCoordsOfStop yuyu");

        distance =
          distance +
          (await geolib.getDistance(
            prevCoordsOfStop ? prevCoordsOfStop : pickUpCoords,
            stopCoords
          ));

        prevCoordsOfStop = stopCoords;
      }
    }

    console.log(distance, "distance");

    let lastStopCoords;
    if (addStop && addStop.length != 0) {
      lastStopCoords = await GetCoordinates(
        addStop[addStop?.length - 1].stopPlaceId
      );
    }

    let dropCoords = await GetCoordinates(destinationId);

    console.log("lastStopCoords", pickUpCoords);

    distance =
      distance +
      (await geolib.getDistance(
        addStop && addStop.length != 0 ? lastStopCoords : pickUpCoords,
        dropCoords
      ));

    return distance;
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = getRideDistance;
