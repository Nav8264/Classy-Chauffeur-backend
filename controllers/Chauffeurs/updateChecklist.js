const { ObjectId } = require("mongoose").Types;
const Chauffeur = require("../../models/Chauffeur");

const updateChecklistStatus = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { status } = req.query;

    await Chauffeur.findOneAndUpdate(
      { _id: ObjectId(userId) },
      {
        isChecklisted: status,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "success",
      message: "Status updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateChecklistStatus;
