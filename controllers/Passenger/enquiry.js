const Enquiry = require("../../models/Enquiry");

const enquiry = async (req, res, next) => {
    console.log('req', req.body)
  try {
    const { user_Id, message } = req.body;
    console.log(message,'message')
    const enquiry = new Enquiry({
         user_Id,
         message,
         rateCount
    });
    enquiry.save();
    res.status(201).json({
      success: true,
      message: "Enquiry form submitted successfully!",
    });
  } catch (error) {
    console.log("Error while adding enquiry:", error);
    next(error);
  }
};
module.exports = enquiry;
