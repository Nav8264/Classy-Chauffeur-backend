const BankDetails = require("../../models/BankDetails");

const getBankDetails = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const response = await BankDetails.findOne({ chauffeurId: userId });

    const bankDetails = {
      bsbCode: response.bsbCode,
      accountNumber: response.accountNumber,
      accountholderName: response.accountholderName,
    };

    console.log(bankDetails, "BankDetails");

    return res.status(200).json({
      message: "success",
      data: bankDetails,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getBankDetails;
