const Chauffeur = require("../../models/Chauffeur");
const Customer = require("../../models/Customer");
const DeleteAccountOtp = require("../../models/DeleteAccountOtp");
const sendEmail = require("../../services/sendEmail");
const OTPtemplate = require("../../templates/OTPlink");

const { ObjectId } = require("mongoose").Types;

const generateOTP = () => {
  var digits = "0123456789";
  var otpLength = 6;
  var otp = "";
  for (let i = 1; i <= otpLength; i++) {
    var index = Math.floor(Math.random() * digits.length);
    otp = otp + digits[index];
  }
  return otp;
};

const sendDeleteAccountOTP = async (req, res, next) => {
  try {
    const { email, type } = req.body;

    let isExist;
    if (type === "chauffeur") {
      isExist = await Chauffeur.findOne({ email: email });
    } else if (type === "passenger") {
      isExist = await Customer.findOne({ email: email });
    }

    if (!isExist) {
      return res.status(404).send({ message: "Account not found" });
    }

    const OTP = generateOTP();
    console.log("OTP", OTP);
    const isExistOTP = await DeleteAccountOtp.findOne({
      email: email,
    });

    if (isExistOTP) {
      return res.status(409).send({ message: "OTP already send" });
    }

    const driverOTP = await DeleteAccountOtp.create({
      email: email,
      otp: OTP,
      accountType: type,
    });

    await sendEmail(
      [email],
      `ONE TIME PASSWORD (OTP) - CONFIRMATION`,
      OTPtemplate({ OTP: OTP })
    );

    res.status(200).json({
      status: "success",
      OTP,
      message: "OTP sent on mail successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      error: err,
    });
  }
};

module.exports = sendDeleteAccountOTP;
