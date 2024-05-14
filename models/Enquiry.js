const { Schema, model } = require("mongoose");
const EnquiryDetails = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
        message: {
            type: String,
        },
        rateCount:{
            
        }
      
    },
    { timestamps: true }
);
module.exports = model("enquiryDetails", EnquiryDetails, "enquiryDetails");
