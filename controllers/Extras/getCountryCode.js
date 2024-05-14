const CountryCode = require("../../models/CountryCode");

const getCountryCode = async function (req, res, next) {
  try {
    console.log("getting codess");
    const code = await CountryCode.find();
    if (!code) {
      return res.status(404).send({ message: "Not found" });
    }
    return res.status(200).send({
      status: true,
      result: code[0]?.data,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
module.exports = getCountryCode;
