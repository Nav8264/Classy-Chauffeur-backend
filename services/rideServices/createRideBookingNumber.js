const Ride = require("../../models/Ride");

const createRideBookingNumber = async () => {
  // creating unique ride booking number
  const allRides = await Ride.find({}).sort({ createdAt: -1 }).limit(1);

  let bookingNumber = "BGEM0001";

  if (allRides?.length != 0 && allRides[0].bookingNo) {
    let startingIndex;

    if (allRides[0].bookingNo?.toString()?.includes("M")) {
      if (allRides[0].bookingNo?.toString()?.includes("9999")) {
        startingIndex = "BGEN";
      } else {
        startingIndex = "BGEM";
      }
    } else if (allRides[0].bookingNo?.toString()?.includes("N")) {
      startingIndex = "BGEN";
    }

    const prevBookingNo = allRides[0].bookingNo.toString().slice(4);

    bookingNumber = parseInt(prevBookingNo) + 1;

    if ((bookingNumber.toString().length = 1)) {
      bookingNumber = startingIndex + bookingNumber.toString().padStart(4, "0");
    } else if ((bookingNumber.toString().length = 2)) {
      bookingNumber = startingIndex + bookingNumber.toString().padStart(3, "0");
    } else if ((bookingNumber.toString().length = 3)) {
      bookingNumber = startingIndex + bookingNumber.toString().padStart(2, "0");
    } else if ((bookingNumber.toString().length = 4)) {
      bookingNumber = startingIndex + bookingNumber.toString().padStart(1, "0");
    }
  } else {
    bookingNumber = "BGEM0001";
  }

  console.log("prevbookingn umber", bookingNumber);

  return bookingNumber;
};

module.exports = createRideBookingNumber;
