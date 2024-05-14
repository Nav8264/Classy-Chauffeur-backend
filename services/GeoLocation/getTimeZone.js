const { default: axios } = require("axios");

module.exports = async (lat, lng, date) => {
  const actualDate = Math.round(+new Date(date) / 1000);

  const googlePlaceId = process.env.GOOGLE_API_KEY;

  let timeZone;

  await axios
    .get(
      `https://maps.googleapis.com/maps/api/timezone/json?location=${lat}%2C${lng}&timestamp=${actualDate}&key=${googlePlaceId}`
    )
    .then((res) => {
      console.log(res.data.timeZoneId, "res");

      timeZone = res.data.timeZoneId;
    })
    .catch((err) => {
      console.log(err, "err");
    });

  return timeZone;
};
