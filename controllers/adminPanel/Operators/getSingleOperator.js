const Chauffeur = require("../../../models/Chauffeur");

const { ObjectId } = require("mongoose").Types;

const getSingleOperator = async (req, res, next) => {
  const { id } = req.params;

  try {
    const singleOperator = await Chauffeur.findById({
      _id: ObjectId(id),
    });

    res.status(200).json({
      message: "success",
      success: true,
      data: singleOperator,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getSingleOperator;
