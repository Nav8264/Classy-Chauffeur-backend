const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const Customer = require("../../../models/Customer");

const { ObjectId } = require("mongoose").Types;

const forgotPassword = async (req, res, next) => {
  try {
    const { type, email } = req.query;

    console.log("type, email", type, email);

    const { oldPassword, newPassword } = req.body;
    const findCustomer = await Customer.findOne({
      email: email,
    });

    if (!findCustomer) {
      throw createError.BadRequest("User does not exists !");
    }

    if (type == "changePass") {
      const passMatch = await bcrypt.compare(
        oldPassword,
        findCustomer.password
      );

      if (!passMatch) {
        throw createError.Unauthorized("Incorrect password. Please try again.");
      }

      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await Customer.findOneAndUpdate(
        {
          email: email,
        },
        { password: hashedPassword }
      );
    } else if (type == "forgotPass") {
      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await Customer.findOneAndUpdate(
        {
          email: email,
        },
        { password: hashedPassword }
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
