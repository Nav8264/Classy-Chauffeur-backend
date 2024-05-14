const { Schema, model } = require("mongoose");

const userLoginMechSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Chauffeur", required: true },
    // login_mech_type: {
    //   type: String,
    //   valueType: "String",
    //   trim: true,
    // },
    login_mech_value: {
      type: Number,
      // unique: true,
      trim: true,
    },
    password: {
      type: String,
      // unique: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

userLoginMechSchema.index(
  { login_mech_value: 1, password: 1 },
  { unique: true }
);

const UserLoginMech = model(
  "UserLoginMech",
  userLoginMechSchema,
  "userloginmech"
);

// make this available to our users in our Node applications
module.exports = UserLoginMech;
