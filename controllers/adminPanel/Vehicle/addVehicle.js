const uploadFiles = require("../../../services/upload-files");
const Vehicle = require("../../../models/Vehicle");
const formidable = require("formidable");
const createError = require("http-errors");
const VehicleDetails = require("../../../models/VehicleDetails");
const sendNotifications = require("../../../services/notifications/notification");
const Chauffeur = require("../../../models/Chauffeur");
const VehiclePrice = require("../../../models/VehiclePrice");

const { ObjectId } = require("mongoose").Types;

const addVehicle = async (req, res, next) => {
  try {
    const form = new formidable.IncomingForm({
      multiples: true,
    });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400);
        res.send(err);
      }

      let { regoExpiryDate, insuranceExpiryDate, COIExpiryDate, category } =
        fields;

      let insuranceData;
      if (!!files?.insuranceNumber === true) {
        let location = files.insuranceNumber.filepath;
        const originalFilename = files.insuranceNumber.originalFilename;
        insuranceData = await uploadFiles.upload(
          location,
          originalFilename,
          `bg-chauffeur`,
          null
        );
      }

      let vehicleCOIData;
      if (!!files?.COICertificate === true) {
        let location = files.COICertificate.filepath;
        const originalFilename = files.COICertificate.originalFilename;
        vehicleCOIData = await uploadFiles.upload(
          location,
          originalFilename,
          `bg-chauffeur`,
          null
        );
      }

      let vehicleRegoData;
      if (!!files?.rego === true) {
        let location = files.rego.filepath;
        const originalFilename = files.rego.originalFilename;
        vehicleRegoData = await uploadFiles.upload(
          location,
          originalFilename,
          `bg-chauffeur`,
          null
        );
      }

      let vehicleImageData;
      if (!!files?.vehicleImage === true) {
        let location = files.vehicleImage.filepath;
        const originalFilename = files.vehicleImage.originalFilename;
        vehicleImageData = await uploadFiles.upload(
          location,
          originalFilename,
          `bg-chauffeur`,
          null
        );
      }

      let logoData;
      if (!!files?.vehicleLogo === true) {
        let location = files.vehicleLogo.filepath;
        const originalFilename = files.vehicleLogo.originalFilename;
        logoData = await uploadFiles.upload(
          location,
          originalFilename,
          `bg-chauffeur`,
          null
        );
      }

      const vehicleCategory = await VehiclePrice.findOne({ category });

      if (!vehicleCategory) {
        next(createError.NotFound("Invalid vehicle Category."));
      }

      const vehicle = new Vehicle({
        ...fields,

        category,

        fixedKm: vehicleCategory.fixedKm,
        fixedPrice: vehicleCategory.fixedPrice,
        pricePerKm: vehicleCategory.pricePerKm,
        pricePerHour: vehicleCategory.pricePerHour,

        vehicleRego: {
          url: vehicleRegoData?.Location,
          expiryDate: regoExpiryDate,
        },
        vehicleInsurance: {
          url: insuranceData?.Location,
          expiryDate: insuranceExpiryDate,
        },
        vehicleCOI: {
          url: vehicleCOIData?.Location,
          expiryDate: COIExpiryDate,
        },
        vehicleImage: {
          url: vehicleImageData?.Location,
        },
        vehicleLogo: {
          url: logoData?.Location,
        },
      });

      await vehicle.save();

      if (fields.chauffeur) {
        const chauffeur = await Chauffeur.findOne({
          _id: ObjectId(fields.chauffeur),
        });

        await Chauffeur.findOneAndUpdate(
          {
            _id: ObjectId(fields.chauffeur),
          },
          {
            vehicleId: vehicle._id,
          },
          { new: true }
        );

        if (chauffeur?.notifToken) {
          await sendNotifications({
            title: "New Vehicle.",
            body: "A new Vehicle has assigned to you.",

            receiverId: fields.chauffeur,
            type: "new-ride",
            token: chauffeur?.notifToken,
          });
        }
      }

      res.status(200).json({
        success: true,
        data: vehicle,
      });
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = addVehicle;
