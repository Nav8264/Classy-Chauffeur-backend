const OTP = require("../../../models/OTP");

const verifyOTP = async (req, res, next) => {
  try {
    const { otp, email } = req.body;

    const checkOTP = await OTP.findOne({ otp, user: email });

    console.log("checkOTP", checkOTP);

    if (checkOTP) {
      res.json({
        message: "Your OTP has been successfully verified.",
        success: true,
        email,
      });
    } else {
      res.json({
        message: "Invalid OTP.",
        success: false,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = verifyOTP;
