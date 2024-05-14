const ResetPassword = require("../../../models/ResetPassword.model");
const Chauffeur = require("../../../models/Chauffeur");

const createError = require("http-errors");
const UserLoginMech = require("../../../models/ChauffeurLoginMech");

const bcrypt = require("bcryptjs");

const generateOTP = () => {
  var digits = "0123456789";
  var otpLength = 4;
  var otp = "";
  for (let i = 1; i <= otpLength; i++) {
    var index = Math.floor(Math.random() * digits.length);
    otp = otp + digits[index];
  }
  return otp;
};

const forgotPassword = async (req, res, next) => {
  try {
    const { newPass } = req.body;

    let buff = Buffer.from(newPass, "base64");
    let text = buff.toString("ascii");
    const [userName, password] = text.split(":");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await UserLoginMech.findOneAndUpdate({
      login_mech_value: userName,
      password: hashedPassword,
    });

    res.status(200).send({ message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = forgotPassword;
