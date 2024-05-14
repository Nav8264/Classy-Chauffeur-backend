const path = require("path");
const ejs = require("ejs");
const pdf = require("html-pdf");

const { v4: uuid } = require("uuid");
const rideDetailsPdfTemplate = require("../templates/rideDetailsPdfTemplate");

const uniqueId = uuid();

const getPdfLocation = ({
  bookingNo,
  lastModified,
  pickUpDate,
  pickUpTime,
  serviceType,
  customerName,
  phoneNo,
  noOfPassengers,
  vehicleType,
  paymentMethod,
  pickUpLocation,
  dropLocation,
  notes,
  flatRate,
  reservationTotal,
  paymentsDeposits,
  authorizations,
  totalDue,
  numberOfHours,
  flightNumber,
}) => {
  try {
    return new Promise(async (resolve, reject) => {
      const options = {
        border: "10mm",
        type: "pdf",
        childProcessOptions: {
          env: {
            OPENSSL_CONF: "/dev/null",
          },
        },
      };

      const fileName = `${uniqueId}.pdf`;
      const data1 = await rideDetailsPdfTemplate({
        bookingNo,
        lastModified,
        pickUpDate,
        pickUpTime,
        serviceType,
        customerName,
        phoneNo,
        noOfPassengers,
        vehicleType,
        paymentMethod,
        pickUpLocation,
        dropLocation,
        notes,
        flatRate,
        reservationTotal,
        paymentsDeposits,
        authorizations,
        totalDue,
        numberOfHours,
        flightNumber,
      });

      pdf.create(data1, options).toFile(fileName, async function (err, data) {
        if (err) {
          console.log(`er1r`, err);

          reject(err);
        } else {
          const PRODUCTION_PATH = "../../";
          const LOCAL_PATH = "../";

          let location = path.join(__dirname, LOCAL_PATH, fileName);

          resolve({
            location,
            fileName,
          });
        }
      });
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getPdfLocation;
