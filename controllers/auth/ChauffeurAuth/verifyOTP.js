const ResetPassword = require("../../../models/ResetPassword.model");
const createError = require("http-errors");

const verifyOTP = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { type, verify } = req.body;
    let buff = Buffer.from(token, "base64");
    let text = buff.toString("ascii");

    const [email, otp] = text.split("-");

    // decode base64 token
    if (verify === false) {
      const verifyotp = await ResetPassword.findOne({
        email: email,
        otp: otp,
        type,
        isVerified: false,
      }).exec();
      if (!verifyotp) {
        throw createError.BadRequest("OTP is invalid or it may be expired!");
      }

      verifyotp.isVerified = true;
      await verifyotp.save();

      res.status(200).send({ message: "OTP verified successfully" });
    } else if (verify === true) {
      const verifyotp = await ResetPassword.findOne({
        email: email,
        otp: otp,
        type,
        isVerified: false,
      }).exec();
      if (!verifyotp) {
        throw createError.BadRequest("OTP is invalid or it may be expired!");
      }
      user.isVerified = true;
      await user.save();
      await ResetPassword.findOneAndDelete({ email: email }).exec();

      res.status(200).send({ message: "OTP verified successfully" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = verifyOTP;
