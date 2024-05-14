const createHttpError = require("http-errors");
const Response = require("../../.././models/AddResponse");
const { ObjectId } = require("mongoose").Types;
const getResponseById = async function (req, res, next) {
  try {
    const { email } = req.query;
    if (email) {
      const responses = await Response.find({ customerEmail: email });
      console.log("responses :>> ", responses);

      res.status(200).json({
        data: responses,
        // count: totalCount?.length,
      });
    }
  } catch (error) {
    return res.status(404).send({
      status: false,
      data: error,
    });
  }
};

module.exports = getResponseById;
