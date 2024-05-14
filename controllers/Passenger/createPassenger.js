
const Passenger = require("../../models/Passenger");
const { createPassengerValidation } = require("../../services/validations/validation_schema");
  
  const createPassenger = async (req, res, next) => {
    try {
      const result = await createPassengerValidation.validateAsync(req.body);
  
      let {
        serviceType,
        pickupDate,
        pickupTime,
        pickupLocation,
        stops,
        dropOfLocation,
        numberOfPassenger,
        luggage,
        childSeats,
        numberOfHours,
      } = result;
  
    //   const allRides = await Ride.find({});
  
    //   var bookingNumber = 00000 + Number(allRides.length) + 1;
  
    //   if ((bookingNumber.toString().length = 1)) {
    //     bookingNumber = "BGEM" + bookingNumber.toString().padStart(4, "0");
    //   } else if ((bookingNumber.toString().length = 2)) {
    //     bookingNumber = "BGEM" + bookingNumber.toString().padStart(3, "0");
    //   } else if ((bookingNumber.toString().length = 3)) {
    //     bookingNumber = "BGEM" + bookingNumber.toString().padStart(2, "0");
    //   } else if ((bookingNumber.toString().length = 4)) {
    //     bookingNumber = "BGEM" + bookingNumber.toString().padStart(1, "0");
    //   }
  
      const passenger = new Passenger({
        // bookingNo: bookingNumber,
        serviceType,
        pickupDate,
        pickupTime: new Date(pickupTime).toUTCString(),
        pickupLocation,
        stops,
        dropOfLocation,
        numberOfPassenger,
        luggage,
        childSeats,
        numberOfHours,
       
      });
  
      await passenger.save();
  
      res.status(200).json({
        message: "Ride saved successfully",
        success: true,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
  
  module.exports = createPassenger;
  