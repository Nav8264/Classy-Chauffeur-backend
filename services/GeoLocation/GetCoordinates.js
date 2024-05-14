const { default: axios } = require("axios");

module.exports = async (placeId) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.GOOGLE_API_KEY}`
  );
  const geoLocation = await response.data?.result?.geometry?.location;

  return geoLocation;
};
