const formidable = require("formidable");
const Vehicle = require("../../../models/Vehicle");
const createError = require("http-errors");
const Chauffeur = require("../../../models/Chauffeur");
const sendNotifications = require("../../../services/notifications/notification");
const uploadFiles = require("../../../services/upload-files");
const VehiclePrice = require("../../../models/VehiclePrice");

const { ObjectId } = require("mongoose").Types;

const updateVehicle = async (req, res, next) => {
  const { id } = req.params;

  try {
    const form = new formidable.IncomingForm({
      multiples: true,
    });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400).send(err);
      }

      const data = await Vehicle.findOne({ _id: ObjectId(id) });

      if (!data) {
        throw createError.BadRequest("Vehicle id is not valid!");
      }

      let {
        registrationNumber,
        plateNumber,
        vehicleName,
        category,
        capacity,
        chauffeur,

        luggageQuantity,
        luggageQuantityLarge,
        luggageQuantitySmall,

        regoExpiryDate,
        insuranceExpiryDate,
        COIExpiryDate,

        insuranceNumber,
        COICertificate,
        rego,
        vehicleImage,
        vehicleLogo,
        trailerOption,

        vehicleOwner,

        fuelType,

        regoNo,
        insuranceNo,
        coiNo,

        // fixedKm,
        // fixedPrice,

        // pricePerHour,
        // pricePerKm,
      } = fields;

      let insuranceData;
      if (!!files?.insuranceNumber === true && !insuranceNumber) {
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
      if (!!files?.COICertificate === true && !COICertificate) {
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
      if (!!files?.rego === true && !rego) {
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
      if (!!files?.vehicleImage === true && !vehicleImage) {
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
      if (!!files?.vehicleLogo === true && !vehicleLogo) {
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

      await Vehicle.findOneAndUpdate(
        {
          _id: ObjectId(id),
        },
        {
          registrationNumber,
          plateNumber,
          vehicleLogo: "logo",
          vehicleName,
          capacity,
          chauffeur,

          category,
          trailerOption,

          fixedKm: vehicleCategory.fixedKm,
          fixedPrice: vehicleCategory.fixedPrice,
          pricePerKm: vehicleCategory.pricePerKm,
          pricePerHour: vehicleCategory.pricePerHour,

          // fixedKm,
          // fixedPrice,

          // pricePerHour,
          // pricePerKm,

          luggageQuantity,
          luggageQuantityLarge,
          luggageQuantitySmall,

          vehicleOwner,

          vehicleInsurance: {
            url: insuranceNumber ? insuranceNumber : insuranceData?.Location,
            expiryDate: insuranceExpiryDate,
          },
          vehicleCOI: {
            url: COICertificate ? COICertificate : vehicleCOIData?.Location,
            expiryDate: COIExpiryDate,
          },
          vehicleRego: {
            url: rego ? rego : vehicleRegoData?.Location,
            expiryDate: regoExpiryDate,
          },
          vehicleImage: {
            url: vehicleImage ? vehicleImage : vehicleImageData?.Location,
          },
          vehicleLogo: {
            url: vehicleLogo ? vehicleLogo : logoData?.Location,
          },

          fuelType,

          regoNo,
          insuranceNo,
          coiNo,
        },
        { new: true }
      );

      if (chauffeur) {
        const getChauffeur = await Chauffeur.findOne({
          _id: ObjectId(chauffeur),
        });

        await Chauffeur.findOneAndUpdate(
          {
            _id: ObjectId(chauffeur),
          },
          {
            vehicleId: id,
          },
          { new: true }
        );

        if (getChauffeur?.notifToken) {
          await sendNotifications({
            title: "New Vehicle.",
            body: "A new Vehicle has assigned to you.",

            receiverId: chauffeur,
            type: "new-vehicle",
            token: getChauffeur?.notifToken?.toString(),
          });
        }
      }

      res.status(200).json({
        success: true,
        message: "Vehicle updated Successfully",
      });
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = updateVehicle;
