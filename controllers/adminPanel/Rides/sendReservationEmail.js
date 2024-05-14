const { v4: uuid } = require("uuid");
const pdf = require("html-pdf");
const Ride = require("../../../models/Ride");
const DriverTripSheet = require("../../../templates/driverTripSheet");
const { ObjectId } = require("mongoose").Types;
const createError = require("http-errors");
const dayjs = require("dayjs");
const fs = require("fs");

const Chauffeur = require("../../../models/Chauffeur");
const Vehicle = require("../../../models/Vehicle");
const RidePrices = require("../../../models/RidePrices");
const CustomerTripSheet = require("../../../templates/customerTripSheet");
const RideCancellation = require("../../../templates/rideCancellation");
const rideDetailsPdfTemplate = require("../../../templates/rideDetailsPdfTemplate");
const uploadFromFile = require("../../../services/upload-fs-file");
const { sendRawEmail } = require("../../../services/sendRawEmail");
const path = require("path");
const rideBookedTemplate = require("../../../templates/rideBooked");

const sendReservationEmail = async (req, res, next) => {
  try {
    const { type, rideId, ccMails } = req.body;

    let filePath;

    let nameOfFile;

    const ride = await Ride.findOne({ _id: ObjectId(rideId) });

    const allPrices = await RidePrices.findOne({
      _id: ObjectId(ride.allPrices),
    });

    let chauffeur;
    let vehicle;

    if (ride.chauffeurID) {
      chauffeur = await Chauffeur.findOne({
        _id: ObjectId(ride.chauffeurID),
      });

      vehicle = await Vehicle.findOne({
        _id: ObjectId(chauffeur.vehicleId),
      });
    }

    let pdfTemplate;

    const rideDate = new Date(ride?.date).toLocaleString("en-US", {
      // timeZone: "Australia/Sydney",
      timeZone: ride.timeZone,
    });

    const lastUpdatedAt = new Date(ride?.updatedAt).toLocaleString("en-US", {
      // timeZone: "Australia/Sydney",
      timeZone: ride.timeZone,
    });

    if (type == "DriverSheet") {
      if (!ride.chauffeurID) {
        return res.json({
          success: false,
          message: "Chauffeur is not assigned to the ride.",
        });
      } else {
        pdfTemplate = await DriverTripSheet({
          pickUpDate: dayjs(rideDate).format("DD/MM/YYYY - dddd"),
          pickUpTime: dayjs(rideDate).format("hh:mm A"),
          bookingNo: ride?.bookingNo,
          customerName: ride?.firstName,
          customerPhoneNo: ride?.countryCode + ride?.phoneNo || "",
          customerEmail: ride?.email,
          lastModified: dayjs(lastUpdatedAt).format("DD-MM-YYYY hh:mm A"),
          // pax,
          vehicleType: ride?.vehicleType,
          vehicleName: vehicle?.vehicleName,
          driverName: chauffeur?.name,
          driverPhoneNo: `${chauffeur?.countryCode}${chauffeur?.phone}`,
          paymentMethod: ride?.paymentMethod,
          paymentStatus: ride?.paymentStatus,
          pickUpLocation: ride?.pickupLocation?.name,
          dropLocation: ride?.dropLocation?.name,
          serviceType: ride?.rideType,
          noOfPassengers: ride?.passengers,
          notes: ride?.notes || "",
          flatRate: allPrices?.flatRate,
          reservationTotal: ride?.price,
          paymentsDeposits: allPrices?.deposits,
          totalDue: allPrices?.totalDue,
        });

        const { location, fileName } = await generatePdf(pdfTemplate);

        filePath = location;
        nameOfFile = fileName;
      }
    } else if (type == "CustomerSheet") {
      if (!ride.chauffeurID) {
        return res.json({
          success: false,
          message: "Chauffeur is not assigned to the ride.",
        });
      } else {
        pdfTemplate = await CustomerTripSheet({
          pickUpDate: dayjs(rideDate).format("DD/MM/YYYY - dddd"),
          pickUpTime: dayjs(rideDate).format("hh:mm A"),
          bookingNo: ride?.bookingNo,
          customerName: ride?.firstName,
          customerPhoneNo: ride?.countryCode + ride?.phoneNo || "",
          customerEmail: ride?.email,
          lastModified: dayjs(lastUpdatedAt).format("DD-MM-YYYY hh:mm A"),
          // pax,
          vehicleType: ride?.vehicleType,
          vehicleName: vehicle?.vehicleName,
          driverName: chauffeur?.name,
          driverPhoneNo: `${chauffeur?.countryCode}${chauffeur?.phone}`,
          paymentMethod: ride?.paymentMethod,
          paymentStatus: ride?.paymentStatus,
          pickUpLocation: ride?.pickupLocation?.name,
          dropLocation: ride?.dropLocation?.name,
          serviceType: ride?.rideType,
          noOfPassengers: ride?.passengers,

          notes: ride?.notes || "",
          flatRate: allPrices?.flatRate,
          reservationTotal: ride?.price,
          paymentsDeposits: allPrices?.deposits,
          totalDue: allPrices?.totalDue,
        });

        const { location, fileName } = await generatePdf(pdfTemplate);

        filePath = location;
        nameOfFile = fileName;
      }
    } else if (type == "Cancellation") {
      pdfTemplate = await RideCancellation({
        bookingNo: ride?.bookingNo,
        lastModified: dayjs(lastUpdatedAt).format("DD-MM-YYYY hh:mm A"),
        pickUpDate: dayjs(rideDate).format("DD/MM/YYYY - dddd"),
        pickUpTime: dayjs(rideDate).format("hh:mm A"),
        serviceType: ride?.rideType,
        customerName: ride?.firstName,
        phoneNo: ride?.countryCode + ride?.phoneNo || "",
        noOfPassengers: ride?.passengers,
        vehicleType: ride?.vehicleType,
        paymentMethod: ride?.paymentMethod,
        pickUpLocation: ride?.pickupLocation?.name,
        dropLocation: ride?.dropLocation?.name,
        notes: ride?.notes || "",
        flatRate: allPrices?.flatRate,
        reservationTotal: ride?.price,
        paymentsDeposits: allPrices?.deposits,
        totalDue: allPrices?.totalDue,
      });

      const { location, fileName } = await generatePdf(pdfTemplate);

      filePath = location;
      nameOfFile = fileName;
    } else if (type == "Standard") {
      pdfTemplate = await rideDetailsPdfTemplate({
        bookingNo: ride?.bookingNo,
        lastModified: dayjs(lastUpdatedAt).format("DD-MM-YYYY hh:mm A"),
        pickUpDate: dayjs(ride?.date).format("DD/MM/YYYY - dddd"),
        pickUpTime: dayjs(ride?.date).format("hh:mm A"),
        serviceType: ride?.rideType,
        customerName: `${ride?.salutation || ""} ${ride?.firstName} ${
          ride?.lastName || ""
        }`,
        accountNo: ride?.accountNo,
        phoneNo: ride?.countryCode + ride?.phoneNo || "",
        noOfPassengers: ride?.passengers,
        vehicleType: ride?.vehicleType,
        paymentMethod: ride?.paymentMethod,
        pickUpLocation: ride?.pickupLocation?.name,
        dropLocation: ride?.dropLocation?.name,
        notes: ride?.notes || "",
        flatRate: allPrices?.flatRate,
        reservationTotal: ride?.price,
        paymentsDeposits: allPrices?.deposits,
        authorizations: allPrices?.authorizations,
        totalDue: allPrices?.totalDue,
        childSeatPrice: allPrices?.childSeatPrice,
        trailerPrice: allPrices?.trailerPrice,
        numberOfHours: ride?.numberOfHours,
        flightNumber: ride?.flightNumber,
        allPrices: allPrices,
        addStop:ride?.addStop,
        childSeats:ride?.childSeats,
        clientRef:ride?.clientRef
      });

      const { location, fileName } = await generatePdf(pdfTemplate);

      filePath = location;
      nameOfFile = fileName;
    }

    console.log("filePath", filePath);

    // const generatedPDF = fs.readFileSync(nameOfFile);
    // res.contentType("application/pdf");
    // res.send(generatedPDF);

    if (filePath) {
      /**
       * Then upload it to s3
       */
      const uploadFile = await uploadFromFile(filePath, nameOfFile);
      /**
       * After that send it as an attachment.
       */
      await sendRawEmail(
        uploadFile.Bucket,
        uploadFile.key,
        "Ride Confimation",
        htmlTemplate(),
        ride?.email,
        ccMails
      );
    }

    res.json({ success: true, message: "Pdf sent successfully." });
  } catch (err) {
    next(err);
    console.log("err", err);
  }
};

module.exports = sendReservationEmail;

function generatePdf(pdfTemplate) {
  const uniqueId = uuid();

  try {
    return new Promise(async (resolve, reject) => {
      const options = {
        border: "10mm",
        type: "pdf",
        // phantomPath: "../../../node_modules/phantomjs-prebuilt/bin/phantomjs",
        childProcessOptions: {
          env: {
            OPENSSL_CONF: "/dev/null",
          },
        },
      };

      const fileName = `${uniqueId}.pdf`;

      pdf
        .create(pdfTemplate, options)
        .toFile(fileName, async function (err, data) {
          if (err) {
            console.log(`er1r`, err);

            reject(err);
          } else {
            console.log("data", data);

            const PRODUCTION_PATH = "../../../../";
            const LOCAL_PATH = "../../";

            let location = path.join(__dirname, "../../../", fileName);

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
}

function htmlTemplate() {
  return `
  <!DOCTYPE html>
<html>
<head>
  <title>Email Confirmation</title>
</head>
<body>
  <p>Hello dear,</p>
  <p>Please see attached files for Black Grandeur Chauffeur confirmation emails.</p>
  <p>Kind regards,<br>Black Grandeur Chauffeur</p>
</body>
</html>
`;
}
