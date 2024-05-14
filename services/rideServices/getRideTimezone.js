//http://api.timezonedb.com/v2.1/get-time-zone?key=FDJ1IPGTEO7F&lat=31.6339793&lng=74.8722642&by=position&format=json

const { default: axios } = require("axios");

const getRideTimezone = async (lat, lng) => {
  try {
    const response = await axios.get(
      `http://api.timezonedb.com/v2.1/get-time-zone?key=FDJ1IPGTEO7F&lat=${lat}&lng=${lng}&by=position&format=json`
    );
    console.log("response", response?.data);
    return {
      timezone: response?.data?.zoneName,
      region: response?.data?.regionName,
    };
  } catch (err) {
    throw err;
  }
};

module.exports = getRideTimezone;
