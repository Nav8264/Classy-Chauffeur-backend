const bcrypt = require("bcryptjs");
const createError = require("http-errors");

const Customer = require("../../../models/Customer");
const sendEmail = require("../../../services/sendEmail");
const newUserTemplate = require("../../../templates/newCustomUser");

const { ObjectId } = require("mongoose").Types;

const addUser = async (req, res, next) => {
  try {
    const { name, phone, password, email, designation, countryCode } = req.body;

    const findAdmin = await Customer.findOne({
      email,
    });

    if (findAdmin) {
      throw createError.BadRequest("User already exists !.");
    }

    if (!name || !phone || !password || !email) {
      throw createError.BadRequest("Please enter full details !");
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = new Customer({
      name,
      phone,
      email,
      countryCode,
      password: hashedPassword,
      designation,
      byAdmin: true,
    });

    await customer.save();

    await sendEmail(
      [email],
      "New Account Details",
      // paymentLinkTemplate({ amount: `AUD ${price / 100}`, link: url }),
      newUserTemplate({
        name,
        email,
        password,
      }),
      [email]
    );

    res.json({
      message: "User Registered successfully!",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = addUser;
