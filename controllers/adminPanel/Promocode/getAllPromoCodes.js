const Promocode = require("../../../models/Promocode");

const getAllPromocodes = async (req, res, next) => {
  try {
    const data = await Promocode.find();

    res.json({
      message: "Promocodes fetched successfully!",
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getAllPromocodes;
