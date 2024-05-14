const Customer = require("../../../models/Customer");
const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const findUser = await Customer.findOne({
      _id: ObjectId(id),
    });

    if (!findUser) {
      throw createError.BadRequest("User doesn't exists");
    } else {
      await Customer.findOneAndUpdate(
        { _id: ObjectId(id) },
        { ...req.body },
        { new: true }
      );

      res.json({
        message: "User updated successfully!",
        success: true,
      });
    }
  } catch (err) {
    next(err);
  }
};
module.exports = updateUser;
