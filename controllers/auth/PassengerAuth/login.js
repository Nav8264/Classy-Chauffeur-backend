const bcrypt = require("bcryptjs");
const Customer = require("../../../models/Customer");
const createError = require("http-errors");
const Token = require("../../../models/token");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../../services/auth/generate_token");
const { accessTokenLife, refreshTokenLife } =
  require("../../../config/keys").jwt;

const webCustomerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const findCust = await Customer.findOne({
      email: email,
    });
    if (!findCust) {
      throw createError.BadRequest("Customer does not exits! Please sign up.");
    }
    //TODO
    // if (findCust.isVerified === false) {
    //   throw createError.BadRequest("Please verify your email first!");
    // }
    const isMatch = await bcrypt.compare(password, findCust.password);

    if (!isMatch) {
      throw createError.Unauthorized("Incorrect password. Please try again.");
    }
    const payload = {
      _id: findCust._id,
    };

    const accessToken = generateAccessToken(payload, accessTokenLife);
    const refreshToken = generateRefreshToken(payload, refreshTokenLife);

    if (accessToken && refreshToken) {
      const token = new Token({
        user: findCust._id,
        token: refreshToken,
      });
      token.save();

      res.status(200).json({
        success: true,
        accessToken,
        refreshToken,
        user: payload,
      });
    }
  } catch (error) {
    console.log("error while logging in!", error);
    next(error);
  }
};

module.exports = webCustomerLogin;
