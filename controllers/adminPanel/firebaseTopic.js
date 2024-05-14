var admin = require("firebase-admin");

const firebaseTopic = async (req, res, next) => {
  try {
    const { type, token, rideId } = req.body;

    if (type == "subscribe") {
      admin
        .messaging()
        .subscribeToTopic([token], rideId?.toString())
        .then((res) => console.log("Subscribed to topic successfully.", res))
        .catch((err) => console.log("Error subscribing to topic.", err));
    } else if (type == "unsubscribe") {
      admin
        .messaging()
        .unsubscribeFromTopic([token], rideId?.toString())
        .then((res) =>
          console.log("Successfully unsubscribed from topic.", res)
        )
        .catch((err) => console.log("Error unsubscribing to topic.", err));
    }

    res.json({
      success: true,
      message: "Token update successfully.",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = firebaseTopic;
