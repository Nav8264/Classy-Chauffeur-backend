const rideBookedTemplate = require("../templates/rideBooked");
const getPdfLocation = require("./generateRidePdf");
const { sendRawEmail } = require("./sendRawEmail");
const uploadFromFile = require("./upload-fs-file");
const dayjs = require("dayjs");

const sendRidePdfEmail = async (
  ride,
  vehicleType,
  allPrices,
  paymentMethod
) => {
  /**
   * Firstly, we create html to pdf here
   */

  const rideDate = new Date(ride?.date).toLocaleString("en-US", {
    // timeZone: "Australia/Sydney",
    timeZone: ride.timeZone,
  });

  const lastUpdatedAt = new Date(ride?.updatedAt).toLocaleString("en-US", {
    // timeZone: "Australia/Sydney",
    timeZone: ride.timeZone,
  });

  const { location, fileName } = await getPdfLocation({
    bookingNo: ride?.bookingNo,
    lastModified: dayjs(lastUpdatedAt).format("DD-MM-YYYY hh:mm A"),
    pickUpDate: dayjs(rideDate).format("DD/MM/YYYY - dddd"),
    pickUpTime: dayjs(rideDate).format("hh:mm A"),
    serviceType: ride?.rideType,
    customerName: ride?.firstName,
    phoneNo: ride?.countryCode + ride?.phoneNo || "",
    noOfPassengers: ride?.passengers,
    vehicleType,
    paymentMethod: paymentMethod || ride?.paymentMethod,
    pickUpLocation: ride?.pickupLocation?.name,
    dropLocation: ride?.dropLocation?.name,
    notes: ride?.notes || "",

    flatRate: allPrices?.flatRate,
    reservationTotal: allPrices?.totalPrice,
    paymentsDeposits: allPrices?.deposits || 0,
    authorizations: allPrices?.authorizations || 0,
    totalDue: allPrices?.totalDue,

    numberOfHours: ride?.numberOfHours,
    flightNumber: ride?.flightNumber,
  });

  /**
   * Then upload it to s3
   */
  const uploadFile = await uploadFromFile(location, fileName);

  /**
   * After that send it as an attachment.
   */
  await sendRawEmail(
    uploadFile.Bucket,
    uploadFile.key,
    "Ride Booked",
    rideBookedTemplate({
      passengerName: ride?.firstName,
      rideId: ride?.bookingNo,
      pickUpLocation: ride?.pickupLocation?.name,
      dropOffLocation: ride?.dropLocation?.name,
    }),
    ride?.email
  );
};

module.exports = sendRidePdfEmail;
