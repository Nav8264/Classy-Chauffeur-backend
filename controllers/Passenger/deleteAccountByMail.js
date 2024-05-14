const Chauffeur = require("../../models/Chauffeur");
const Customer = require("../../models/Customer");
const DeleteAccountOtp = require("../../models/DeleteAccountOtp");

const deleteAccountByEmail = async (req, res, next) => {
  const { email } = req.body;

  const otpObj = await DeleteAccountOtp.findOne({ email });
  console.log("otpObj", otpObj);
  if (!otpObj) {
    return res.status(404).send({ message: "Something went wrong! Try again" });
  }

  if (otpObj?.accountType === "chauffeur") {
    await Chauffeur.findOneAndDelete({ email: email });
  } else if (otpObj?.accountType === "passenger") {
    await Customer.findOneAndDelete({ email: email });
  }

  res.status(200).json({
    status: "success",
    message: "Account deleted successfully",
  });
};

module.exports = deleteAccountByEmail;
