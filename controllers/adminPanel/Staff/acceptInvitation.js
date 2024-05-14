const dayjs = require("dayjs");
const AdminModel = require("../../../models/Admin");
const StaffUser = require("../../../models/Staff");
const inviteStaffTokens = require("../../../models/staffToken");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");

const acceptInvitation = async (req, res, next) => {
  try {
    const checkTokenExistence = await inviteStaffTokens.findOne({
      token: req.headers.token,
    });
    const isTokenExpire =
      checkTokenExistence?.expiresAt &&
      dayjs(checkTokenExistence?.expiresAt).format() <= dayjs().format();

    console.log("checkTokenExistence :>> ", req.headers.token);

    if (!checkTokenExistence) {
      // return res.status(403).send({
      //   status: false,
      //   message: "token is not available or invalid token",
      // });
      next(createError.BadRequest("token is not available or invalid token"));
    }
    if (isTokenExpire) {
      await inviteStaffTokens.findOneAndDelete({
        token: req.headers.token,
      });
      // return res.status(403).send({
      //   status: false,
      //   message: "token is expired, request again for new token",
      // });
      next(
        createError.BadRequest("token is expired, request again for new token")
      );
    }
    const userData = await StaffUser.findOne({
      email: checkTokenExistence?.email,
    });
    const { firstName, lastName, email, phoneNumber, name, role } = userData;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const existingEmail = await AdminModel.findOne({
      email: email?.toLowerCase(),
    });
    if (existingEmail) {
      // return res
      //   .status(400)
      //   .json({ message: `${email} is already registered. Please login.` });
      next(
        createError.BadRequest(`${email} is already registered. Please login.`)
      );
    }
    const user = await AdminModel.create({
      firstName,
      lastName,
      email,
      name: `${firstName} ${lastName}`,
      phoneNumber,
      invitedUserType: "staff",
      role,
      password: hashedPassword,
    });

    const data = await StaffUser.findOneAndUpdate(
      {
        email: checkTokenExistence?.email,
      },
      { status: "active", userId: user._id },
      {
        new: true,
      }
    );
    if (data) {
      await inviteStaffTokens.findOneAndDelete({
        token: req.headers.token,
      });
    }
    res.status(200).send({
      status: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = acceptInvitation;
