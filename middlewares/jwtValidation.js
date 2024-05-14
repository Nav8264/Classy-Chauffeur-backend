const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const { accessSecret, refreshSecret, accessTokenLife, refreshTokenLife } =
  require("../config/keys").jwt;

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../services/auth/generate_token");
const Token = require("../models/token");

const validateAccessToken = async (req, res, next) => {
  if (!req.headers["authorization"])
    return next(createError.Unauthorized("Please login again"));

  const token = req.headers["authorization"];
  jwt.verify(token, accessSecret, async (err, decoded) => {
    if (err) {
      if (err.message === "jwt expired") {
        if (req.cookies?.auth) {
          const { auth } = req.cookies;

          try {
            const payload = jwt.verify(auth, refreshSecret);
            if (!payload)
              throw createError.Unauthorized(
                "Session expired. Please login again."
              );

            const resultQuery = await Token.findOne({
              // _userId: payload.data._id,
              token: auth,
            });
            if (!resultQuery)
              return next(createError.Unauthorized("Please login again"));

            const jwtPayload = {
              data: payload,
            };

            const accessToken = generateAccessToken(
              jwtPayload,
              accessTokenLife
            );
            const refreshToken = generateRefreshToken(
              jwtPayload,
              refreshTokenLife
            );
            if (accessToken && refreshToken) {
              resultQuery.overwrite(
                new Token({
                  _userId: payload._id,
                  token: refreshToken,
                })
              );
              await resultQuery.save();
              res.cookie("auth", refreshToken, { httpOnly: true });
              const json_ = res.json; // capture the default resp.json implementation

              res.json = function (object) {
                object["accessToken"] = accessToken;

                json_.call(res, object);
              };
              req.user = payload;
              return next();
            }
          } catch (error) {
            if (error.message === "jwt expired")
              return next(createError.Unauthorized("Please login again"));
            return next(createError.InternalServerError());
          }
        }
        return next(createError.Unauthorized("Please login again"));
      } else {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));
      }
    }
    req.user = decoded;
    next();
  });
};

module.exports = validateAccessToken;
