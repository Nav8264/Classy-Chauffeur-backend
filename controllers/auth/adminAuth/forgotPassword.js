const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const Admin = require("../../../models/Admin");

const { ObjectId } = require("mongoose").Types;

const forgotPassword = async (req, res, next) => {
  try {
    const { type, userId, email } = req.query;

    const { oldPassword, newPassword } = req.body;

    if (type == "changePass") {
      const findAdmin = await Admin.findOne({
        $or: [
          {
            _id: ObjectId(userId),
          },
          { email },
        ],
      });

      if (!findAdmin) {
        throw createError.BadRequest("User does not exists !");
      }

      const passMatch = await bcrypt.compare(oldPassword, findAdmin.password);

      if (!passMatch) {
        throw createError.Unauthorized("Incorrect password. Please try again.");
      }

      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await Admin.findOneAndUpdate(
        {
          _id: ObjectId(userId),
        },
        { password: hashedPassword }
      );
    } else if (type == "forgotPass") {
      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await Admin.findOneAndUpdate(
        {
          email,
        },
        { password: hashedPassword },
        { new: true }
      );
    }

    res.json({
      message: "Password changed successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = forgotPassword;
