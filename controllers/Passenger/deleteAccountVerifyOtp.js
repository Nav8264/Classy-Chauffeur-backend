const DeleteAccountOtp = require("../../models/DeleteAccountOtp");

const deleteAccountVerifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const accountOTP = await DeleteAccountOtp.findOne({
      email: email,
      otp: otp,
    });

    if (!accountOTP) {
      return res.status(404).send({ message: "OTP is expired" });
    }

    res.status(200).json({
      status: "success",
      message: "OTP verified successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = deleteAccountVerifyOtp;
