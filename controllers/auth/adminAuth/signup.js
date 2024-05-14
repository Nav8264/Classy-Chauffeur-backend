const bcrypt = require("bcryptjs");
const createError = require("http-errors");

const Admin = require("../../../models/Admin");
const { ObjectId } = require("mongoose").Types;

const adminSignUp = async (req, res, next) => {
  try {
    const { name, phoneNo, password, email, designation } = req.body;

    const findAdmin = await Admin.findOne({
      $or: [{ email }, { phone: phoneNo }],
    });

    if (findAdmin) {
      throw createError.BadRequest("User already exists !.");
    }

    if (!name || !phoneNo || !password || !email) {
      throw createError.BadRequest("Please enter full details !");
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({
      name,
      phoneNumber: phoneNo,
      email,
      password: hashedPassword,
      designation,
    });

    admin.save();

    res.json({
      message: "Registration success",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = adminSignUp;
