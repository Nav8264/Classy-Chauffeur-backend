const GetCoordinates = require("../GeoLocation/GetCoordinates");
const getTimeZone = require("../GeoLocation/getTimeZone");

/**
 * This function returns the actual date which will show similar to all users even if it is on admin, driver or passenger
 *
 *  @returns It return final date and timezone of the pickup location
 *
 *  Here we are getting user's defined date and converting it to desired date by subtracting hours and minutes
 */
const dateAndTimezone = async (lat, lng, date) => {
  const timezone = await getTimeZone(lat, lng, date);

  const actualDate = new Date(date).toLocaleString();

  const requiredDate = new Date(date).toLocaleString("en-US", {
    timeZone: timezone,
  });

  const actualHours = new Date(actualDate).getHours();
  const actualMinutes = new Date(actualDate).getMinutes();

  const requiredDateHours = new Date(requiredDate).getHours();
  const requiredDateMinutes = new Date(requiredDate).getMinutes();

  const extraHours = requiredDateHours - actualHours;
  const extraMinutes = requiredDateMinutes - actualMinutes;

  const remainingHoursDate = new Date(actualDate).setHours(
    actualHours - extraHours,
    actualMinutes - extraMinutes
  );

  const finalDate = new Date(remainingHoursDate).toLocaleString();

  //   console.log("actualDate", finalDate);
  //   console.log("requiredDate", requiredDate);

  return {
    finalDate,
    timezone,
  };
};

module.exports = dateAndTimezone;
