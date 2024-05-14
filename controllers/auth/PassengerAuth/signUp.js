const bcrypt = require("bcryptjs");
const Customer = require("../../../models/Customer");
const createError = require("http-errors");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../../services/auth/generate_token");
const Token = require("../../../models/token");

const { accessTokenLife, refreshTokenLife } =
  require("../../../config/keys").jwt;

const signup = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      photo,
      googleId,
      countryCode,
      phone,
      appleId,
    } = req.body;

    if (googleId) {
      let customer;

      customer = await Customer.findOne({
        email,
      });

      if (!customer) {
        customer = new Customer({
          name,
          email,
          avatar_url: photo,
          googleId,
          countryCode,
          phone,
        });

        await customer.save();
      }

      const payload = {
        _id: customer._id,
      };

      const accessToken = generateAccessToken(payload, accessTokenLife);
      const refreshToken = generateRefreshToken(payload, refreshTokenLife);

      if (accessToken && refreshToken) {
        const token = new Token({
          user: customer._id,
          token: refreshToken,
        });
        await token.save();

        res.status(200).json({
          success: true,
          accessToken,
          refreshToken,
          user: payload,
        });
      }
    } else if (appleId && !password) {
      let appleUser = await Customer.findOne({ appleId });

      if (!appleUser || appleUser === null) {
        const customer = new Customer({
          name,
          email,
          appleId,
        });

        await customer.save();

        const payload = {
          _id: customer._id,
          isVerified: customer.isVerified,
        };

        const accessToken = generateAccessToken(payload, accessTokenLife);
        const refreshToken = generateRefreshToken(payload, refreshTokenLife);

        if (accessToken && refreshToken) {
          const token = new Token({
            user: customer._id,
            token: refreshToken,
          });

          token.save();

          res.status(200).json({
            success: true,
            userExists: true,
            accessToken,
            // refreshToken,
            user: payload,
          });
        }
      } else if (!!appleUser === true) {
        const payload = {
          _id: appleUser._id,
        };

        const accessToken = generateAccessToken(payload, accessTokenLife);
        const refreshToken = generateRefreshToken(payload, refreshTokenLife);

        if (accessToken && refreshToken) {
          const token = new Token({
            user: appleUser._id,
            token: refreshToken,
          });
          token.save();

          res.status(200).json({
            success: true,
            userExists: true,
            accessToken,
            // refreshToken,
            user: payload,
          });
        }
      }
    } else {
      const findCust = await Customer.findOne({
        email: email,
      });
      if (findCust) {
        // TODO
        // if (findCust.isVerified === false){
        //     throw createError.BadRequest("user already exist! please verify your email!")
        // }
        throw createError.BadRequest("User already exists, Please Login!");
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const customer = new Customer({
        name,
        email,
        password: hashedPassword,
        countryCode,
        phone,
      });
      await customer.save();

      res.status(201).json({
        success: true,
        message: "Customer created successfully!",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = signup;
