const bcrypt = require("bcryptjs");
const createError = require("http-errors");

const Admin = require("../../../models/Admin");
const Token = require("../../../models/token");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../../services/auth/generate_token");
var admin = require("firebase-admin");

const { accessTokenLife, refreshTokenLife } =
  require("../../../config/keys").jwt;

const adminLogin = async (req, res, next) => {
  try {
    const { email, password, fcmToken } = req.body;

    if (!password || !email) {
      throw createError.BadRequest("Please enter full details !");
    }

    const findAdmin = await Admin.findOne({
      $or: [{ email }, { phone: email }],
    });
    if (!findAdmin?.isActive) {
      throw createError.BadRequest("Account suspended");
    }
    if (!findAdmin) {
      throw createError.BadRequest("User does not exists !");
    }

    const passMatch = await bcrypt.compare(password, findAdmin.password);

    if (!passMatch) {
      throw createError.Unauthorized("Incorrect password. Please try again.");
    }

    await subscribeToTopic(fcmToken, findAdmin);

    const payload = {
      _id: findAdmin._id,
    };

    const accessToken = generateAccessToken(payload, accessTokenLife);
    const refreshToken = generateRefreshToken(payload, refreshTokenLife);

    if (accessToken && refreshToken) {
      const token = new Token({
        user: findAdmin._id,
        token: refreshToken,
      });
      token.save();

      res.json({
        message: "Login Success",
        success: true,
        data: payload,
        accessToken,
        refreshToken,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = adminLogin;

async function subscribeToTopic(fcmToken, findAdmin) {
  /**
   * TODO : Implement subscription to topic for push notifications using FCM or APNS APIs based on
   * The function below will only run if token is not available in database.
   * Steps:
   * First, unsubscribe the topic.
   * Then, subscribe to topic with new tokens.
   *  */
  console.log("findAdmin?.fcmTokens", findAdmin?.fcmTokens);

  if (!findAdmin?.fcmTokens.includes(fcmToken)) {
    const allTokens = [...findAdmin.fcmTokens, fcmToken];

    if (findAdmin?.fcmTokens?.length > 0 && fcmToken) {
      // Unsubscribing to topic from previous tokens.
      admin
        .messaging()
        .unsubscribeFromTopic(findAdmin.fcmTokens, "adminTrack")
        .then((res) =>
          console.log("Successfully unsubscribed from topic.", res)
        )
        .catch((err) => console.log("Error unsubscribing to topic.", err));
    }

    // Subscribing to topic with new tokens.
    admin
      .messaging()
      .subscribeToTopic(allTokens, "adminTrack")
      .then((res) => console.log("Subscribed to topic successfully.", res))
      .catch((err) => console.log("Error subscribing to topic.", err));

    await Admin.findOneAndUpdate(
      {
        email: findAdmin.email,
      },
      {
        fcmTokens: allTokens,
      },
      { new: true }
    );
  }
}
