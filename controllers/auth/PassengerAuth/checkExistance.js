const Customer = require("../../../models/Customer");
const OTP = require("../../../models/OTP");
const sendEmail = require("../../../services/sendEmail");
const OTPtemplate = require("../../../templates/OTPlink");
const paymentLinkTemplate = require("../../../templates/paymentLink");

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

const sendOTP = async (user) => {
  let newOTP = generateOTP();

  let otp;

  do {
    otp = await OTP.findOne({ otp: newOTP });
    newOTP = generateOTP();
  } while (otp);

  if (!otp) {
    let pastOTP = await OTP.findOne({ user: user });
    if (pastOTP) {
      await OTP.findOneAndDelete({ user: user });
    }

    const createOTP = new OTP({
      otp: newOTP,
      user: user,
    });

    await createOTP.save();

    await sendEmail(
      [user],
      "Regarding OTP",
      OTPtemplate({ OTP: newOTP })
      // ["joshanpreet.singh@simbaquartz.com",]
    );
  }
};

const checkPassengerExistence = async (req, res, next) => {
  try {
    const { status, signUpRequest } = req.query;

    const findUser = await Customer.findOne({
      email: req.body.email,
    });

    console.log("findUser", findUser);

    if (findUser) {
      res.status(200).json({
        userExist: true,
      });
      if (status == "forgotPass") {
        sendOTP(req.body.email);
      }
    } else {
      if (signUpRequest) {
        sendOTP(req.body.email);
      }

      res.status(200).json({
        userExist: false,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = checkPassengerExistence;
