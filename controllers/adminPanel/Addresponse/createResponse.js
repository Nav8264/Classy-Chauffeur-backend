const Response = require("../../../models/AddResponse");
const CustomerFeedback = require("../../../models/CustomerFeedback");
const { ObjectId } = require("mongoose").Types;

const response = async (req, res) => {
  try {
    const { feedbackId, response, adminName, customerEmail } = req.body;

    const addResponse = new Response({
      feedbackId,
      response,
      adminName,
      customerEmail,
    });

    await CustomerFeedback.findOneAndUpdate(
      { _id: ObjectId(feedbackId) },
      { responded: true },
      { new: true }
    );

    await addResponse.save();

    res
      .status(201)
      .json({ success: true, message: "Successfully!", data: addResponse });
  } catch (error) {
    console.log(error);
  }
};

module.exports = response;
