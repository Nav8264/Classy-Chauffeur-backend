const createError = require("http-errors");

const Customer = require("../../../models/Customer");

const { ObjectId } = require("mongoose").Types;

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Customer.findOneAndDelete({
      _id: ObjectId(id),
    });

    res.json({
      message: "User deleted successfully!",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteUser;
