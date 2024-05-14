const inviteStaffTemplate = require("../../../templates/inviteStaff");

const AdminModel = require("../../../models/Admin");
const StaffUser = require("../../../models/Staff");
const inviteStaffTokens = require("../../../models/staffToken");
const sendEmail = require("../../../services/sendEmail");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");

const createError = require("http-errors");

const inviteStaff = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, role } = req.body;
    const { _id } = req.user;
    const existingEmail = await AdminModel.findOne({
      email: email?.toLowerCase(),
    });
    const checkTokenExistence = await inviteStaffTokens.findOne({
      email: email?.toLowerCase(),
    });

    if (existingEmail) {
      throw createError.BadRequest(
        `${email} is already registered. Please login.`
      );
    }
    if (checkTokenExistence) {
      throw createError.BadRequest("Invitation already sent please verify");
    }
    const data = await StaffUser.create({
      firstName,
      lastName,
      email,
      name: `${firstName} ${lastName}`,
      phoneNumber: {
        countryCode: phoneNumber.countryCode,
        number: phoneNumber.number,
      },
      role,
      invitedBy: _id,
    });

    const response = {
      firstName,
      lastName,
      name: firstName + " " + lastName,
      email,
      phoneNumber: {
        countryCode: phoneNumber.countryCode,
        number: phoneNumber.number,
      },
      role,
      invitedUserType: "staff",
    };
    const token = jwt.sign(
      {
        ...response,
        expiresAt: dayjs().add(7, "day"),
      },
      "avengers"
    );
    await sendEmail(
      [email],
      `Welcome to BG Chauffeur`,
      inviteStaffTemplate({
        firstName: firstName,
        lastName: lastName,
        accessToken: token,
      })
      //["joshanpreet.singh@simbaquartz.com"]
    );
    await inviteStaffTokens.create({
      token,
      expiresAt: dayjs().add(7, "day"),
      email,
    });
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = inviteStaff;
