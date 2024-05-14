const bcrypt = require("bcryptjs");
const formidable = require("formidable");
const createError = require("http-errors");
const BankDetails = require("../../../models/BankDetails");
const Chauffeur = require("../../../models/Chauffeur");
const UserLoginMech = require("../../../models/ChauffeurLoginMech");
const {
  chauffeurRegisterValidation,
} = require("../../../services/validations/validation_schema");
const uploadFiles = require("../../../services/upload-files");
const Admin = require("../../../models/Admin");

const signUp = async (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      next(err);
    }
    try {
      // Todo: upload profile picture from files, otp authentication

      const result = await chauffeurRegisterValidation.validateAsync(fields);
      let {
        name,
        email,
        phone,
        countryCode,
        password,
        dob,
        gender,
        drivingExperience,
        vehicleType,
        licenseType,
        licenseNo,
        licenseExpiry,
        bsbCode,
        accountNumber,
        nameOfHolder,
        loginType,
        googleID,
        appleId,

        isOperator,
        companyName,
      } = result;

      let profileImage;
      if (!!files?.avatar_url === true) {
        let location = files.avatar_url.filepath;
        const originalFilename = files.avatar_url.originalFilename;
        profileImage = await uploadFiles.upload(
          location,
          originalFilename,
          `bg-chauffeur`,
          null
        );
      }

      let licenseDoc;
      if (!!files?.drivingDocument === true) {
        let location = files.drivingDocument.filepath;
        const originalFilename = files.drivingDocument.originalFilename;
        licenseDoc = await uploadFiles.upload(
          location,
          originalFilename,
          `bg-chauffeur`,
          null
        );
      }

      let residentialDoc;
      if (!!files?.residentialDocument === true) {
        let location = files.residentialDocument.filepath;
        const originalFilename = files.residentialDocument.originalFilename;
        residentialDoc = await uploadFiles.upload(
          location,
          originalFilename,
          `bg-chauffeur`,
          null
        );
      }

      let drivingAuthorityDoc;
      if (!!files?.drivingAuthorityDocument === true) {
        let location = files.drivingAuthorityDocument.filepath;
        const originalFilename =
          files.drivingAuthorityDocument.originalFilename;
        drivingAuthorityDoc = await uploadFiles.upload(
          location,
          originalFilename,
          `bg-chauffeur`,
          null
        );
      }

      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(password, salt);

      const chauffeur = new Chauffeur({
        // profileImage: profileImage,
        experience: drivingExperience,
        vehicleType,
        licenseType,
        licenseNo,
        licenseExpiry,
        email,
        phone,
        countryCode,
        dateOfBirth: dob,
        name,
        gender,
        isGoogleLogin: loginType === "googleLogin" ? true : false,
        googleID: loginType === "googleLogin" ? googleID : 0,
        appleId,

        avatar_url: profileImage.Location,
        drivingDocument: licenseDoc.Location,
        residentialDocument: residentialDoc.Location,
        drivingAuthorityDocument: drivingAuthorityDoc.Location,

        isOperator,
        companyName,
      });

      const bankDetails = new BankDetails({
        // profileImage: profileImage,
        chauffeurId: chauffeur._id,
        bsbCode,
        accountNumber,
        accountholderName: nameOfHolder,
      });

      const userPhoneLoginMech = new UserLoginMech({
        user: chauffeur._id,
        login_mech_value: phone,
        password: hashedPassword,
      });

      await chauffeur.save();

      await bankDetails.save();

      await userPhoneLoginMech.save();

      if (isOperator == "true") {
        const findAdmin = await Admin.findOne({
          $or: [{ email }, { phone }],
        });

        if (findAdmin) {
          throw createError.BadRequest("User already exists !.");
        }

        if (!name || !phone || !password) {
          throw createError.BadRequest("Please enter full details !");
        }

        const admin = new Admin({
          name,
          phoneNumber: phone,
          email,
          password: hashedPassword,
          // designation,
          role: "Partner",
        });

        admin.save();
      }

      res.status(200).json({
        message: "chauffeur created successfully",
        success: true,
        data: chauffeur,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
};

module.exports = signUp;
