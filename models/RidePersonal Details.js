const { Schema, model } = require("mongoose");

const RidePersonalDetails = new Schema(
    {
        
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        contactNo: {
            type: String,
        },
        email: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = model("ridePersonalDetails", RidePersonalDetails, "ridePersonal");
