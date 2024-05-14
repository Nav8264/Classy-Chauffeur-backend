const BankDetails = require("../../../models/BankDetails");
const Chauffeur = require("../../../models/Chauffeur");
const UserLoginMech = require("../../../models/ChauffeurLoginMech");
const uploadFiles = require("../../../services/upload-files");
const formidable = require("formidable");

const { ObjectId } = require("mongoose").Types;

const updateChauffeurProfile = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const { email, phone, drivingDetails, bankDetails } = req.query;

    const {
      drivingExperience,
      vehicleType,
      licenseType,
      licenseNo,
      licenseExpiry,

      bsbCode,
      accountNumber,
      accountholderName,
    } = req.body;

    if (email) {
      await Chauffeur.findOneAndUpdate(
        { _id: ObjectId(userId) },
        { email },
        { new: true }
      );
    } else if (phone) {
      await Chauffeur.findOneAndUpdate(
        { _id: ObjectId(userId) },
        { phone },
        { new: true }
      );

      await UserLoginMech.findOneAndUpdate(
        { user: ObjectId(userId) },
        { login_mech_value: phone },
        { new: true }
      );
    }

    if (drivingDetails) {
      await Chauffeur.findOneAndUpdate(
        { _id: ObjectId(userId) },
        {
          drivingExperience,
          vehicleType,
          licenseType,
          licenseNo,
          licenseExpiry,
        },
        { new: true }
      );
    }

    if (bankDetails) {
      await BankDetails.findOneAndUpdate(
        { chauffeurId: ObjectId(userId) },
        {
          bsbCode,
          accountNumber,
          accountholderName,
        },
        { new: true }
      );
    }

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
        next(err);
      }

      if (files?.avatar_url) {
        let image;
        if (!!files?.avatar_url === true) {
          let location = files.avatar_url.filepath;
          const originalFilename = files.avatar_url.originalFilename;
          image = await uploadFiles.upload(
            location,
            originalFilename,
            `bg-chauffeur`,
            null
          );
        }

        await Chauffeur.findOneAndUpdate(
          { _id: ObjectId(userId) },
          {
            avatar_url: image.Location,
          },
          { new: true }
        );
      }


      if (files?.drivingDocument) {
        let image;
        if (!!files?.drivingDocument === true) {
          let location = files.drivingDocument.filepath;
          const originalFilename = files.drivingDocument.originalFilename;
          image = await uploadFiles.upload(
            location,
            originalFilename,
            `bg-chauffeur`,
            null
          );
        }

        await Chauffeur.findOneAndUpdate(
          { _id: ObjectId(userId) },
          {
            drivingDocument: image.Location,
          },
          { new: true }
        );
      }

      if (files?.residentialDocument) {
        let image;
        if (!!files?.residentialDocument === true) {
          let location = files.residentialDocument.filepath;
          const originalFilename = files.residentialDocument.originalFilename;
          image = await uploadFiles.upload(
            location,
            originalFilename,
            `bg-chauffeur`,
            null
          );
        }

        await Chauffeur.findOneAndUpdate(
          { _id: ObjectId(userId) },
          {
            residentialDocument: image.Location,
          },
          { new: true }
        );
      }

      if (files?.drivingAuthorityDocument) {
        let image;
        if (!!files?.drivingAuthorityDocument === true) {
          let location = files.drivingAuthorityDocument.filepath;
          const originalFilename = files.drivingAuthorityDocument.originalFilename;
          image = await uploadFiles.upload(
            location,
            originalFilename,
            `bg-chauffeur`,
            null
          );
        }

        await Chauffeur.findOneAndUpdate(
          { _id: ObjectId(userId) },
          {
            drivingAuthorityDocument: image.Location,
          },
          { new: true }
        );
      }
    });
    res.json({
      message: "Profile updated successfully !",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updateChauffeurProfile;
