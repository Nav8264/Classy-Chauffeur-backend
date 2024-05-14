const dayjs = require("dayjs");
const { Schema, model } = require("mongoose");
const staffToken = new Schema({
  token: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: dayjs().format(),
  },
});

const inviteStaffTokens = model(
  "inviteStaffTokens",
  staffToken,
  "inviteStaffTokens"
);

module.exports = inviteStaffTokens;
