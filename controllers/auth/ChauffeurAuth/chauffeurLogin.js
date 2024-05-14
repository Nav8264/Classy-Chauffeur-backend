const bcrypt = require("bcryptjs");
const createError = require("http-errors");

// import models and helpers
const Token = require("../../../models/token");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../../services/auth/generate_token");
const Chauffeur = require("../../../models/Chauffeur");
const {
  loginValidation,
} = require("../../../services/validations/validation_schema");
const UserLoginMech = require("../../../models/ChauffeurLoginMech");
const { accessTokenLife, refreshTokenLife } =
  require("../../../config/keys").jwt;

const chauffeurLogin = async (req, res, next) => {
  console.log("login");

  try {
    const { apiKey, loginType, googleID,appleId } = req.body;


    if (loginType === "googleLogin") {
      let googleUser = await Chauffeur.findOne({ googleID });

      
      if (googleUser === null) {
        res.status(200).json({
          success: true,
          userExists: false,
        });
      } else if (!!googleUser === true) {
        const payload = {
          _id: googleUser._id,
          isVerified: googleUser.isVerified,
        };

        const accessToken = generateAccessToken(payload, accessTokenLife);
        const refreshToken = generateRefreshToken(payload, refreshTokenLife);

        if (accessToken && refreshToken) {
          const token = new Token({
            user: googleUser._id,
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
    } else if (loginType === "appleLogin") {
      let appleUser = await Chauffeur.findOne({ appleId });

      console.log("apple login", appleId);

      if (appleUser === null) {
        res.status(200).json({
          success: true,
          userExists: false,
        });
      } else if (!!appleUser === true) {
        const payload = {
          _id: appleUser._id,
          isVerified: appleUser.isVerified,
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
      let buff = Buffer.from(apiKey, "base64");
      let text = buff.toString("ascii");
      const [userName, password] = text.split(":");

      let userData = {};
      let userLogin = await UserLoginMech.findOne({
        login_mech_value: userName,
      });
      // console.log(userLogin);

      if (!userLogin) {
        throw createError.BadRequest(
          "Please try again! Phone number is not correct."
        );
      }

      const isMatch = await bcrypt.compare(password, userLogin.password);

      if (!isMatch) {
        throw createError.Unauthorized("Incorrect password. Please try again.");
      }

      userData = await Chauffeur.findOne({ phone: userLogin.login_mech_value });

      const payload = {
        _id: userData._id,
        isVerified: userData.isVerified,
      };

      const accessToken = generateAccessToken(payload, accessTokenLife);
      const refreshToken = generateRefreshToken(payload, refreshTokenLife);

      if (accessToken && refreshToken) {
        const token = new Token({
          user: userData._id,
          token: refreshToken,
        });
        token.save();

        // res.cookie("auth", refreshToken, { httpOnly: true });

        res.status(200).json({
          success: true,
          accessToken,
          // refreshToken,
          user: payload,
        });
      }
    }

    // const result = await loginValidation.validateAsync(req.body);
    // const { phone, password } = result;
    // console.log(1);
    // const userLogin = await Chauffeur.findOne({ phone: phone });
    // console.log(2);

    // if (!userLogin) {
    //   throw createError(403, "Account not found,");
    // }
    // if (userLogin?.isGoogleLogin === true) {
    //   throw createError.BadRequest("Please Login with Google");
    // }
    // if (userLogin?.isFacebookLogin === true) {
    //   throw createError.BadRequest("Please Login with Facebook");
    // }
    // const isMatch = await bcrypt.compare(password, userLogin.password);
    // if (!isMatch) {
    //   throw createError.Unauthorized("Incorrect password. Please try again.");
    // }
    // if (userLogin?.is_verified !== "Approved") {
    //   throw createError.BadRequest(
    //     "Wait until your verification process completes"
    //   );
    // }
    // console.log(3);

    // const payload = {
    //   name: userLogin.name,
    //   _id: userLogin._id,
    //   role: userLogin.role,
    //   phone: userLogin.phone,
    //   email: userLogin.email,
    // };

    // const accessToken = generateAccessToken(payload, accessTokenLife);
    // const refreshToken = generateRefreshToken(payload, refreshTokenLife);
    // if (accessToken && refreshToken) {
    //   const token = new Token({
    //     user: userLogin._id,
    //     token: refreshToken,
    //   });
    //   await token.save();

    //   // res.cookie("auth", refreshToken, { httpOnly: true });
    //   console.log(4);

    //   res.status(200).json({
    //     success: true,
    //     accessToken,
    //     user: payload,
    //   });
    // console.log(5);
    // }
  } catch (error) {
    // if (error.isJoi === true) error.status = 422;
    next(error);

    console.log(error);
  }
};

module.exports = chauffeurLogin;
