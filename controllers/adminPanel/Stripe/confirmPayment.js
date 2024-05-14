const createError = require("http-errors");
const StripeTransaction = require("../../../models/StirpeTransactions");
const stripe = require("../../../utils/stripe");
const Ride = require("../../../models/Ride");
const RidePrices = require("../../../models/RidePrices");

const confirmPayment = async (req, res, next) => {
  try {
    const { paymentId, ride, customer, price, paymentMethodId } = req.body;

    // stripe confirm payment
    const paymentConfirmation = await stripe?.paymentIntents.confirm(
      paymentId,
      {
        payment_method: paymentMethodId,
      }
    );
    if (!paymentConfirmation?.paymentIntent?.status === "succeeded") {
      throw createError.BadRequest("Payment failed.");
    }

    await StripeTransaction.create({
      customer,
      amount: parseInt(+price * 100),
      intent_id: paymentId,
      ride,
    });

    const rideDetails = await Ride.findOne({ _id: ride });
    rideDetails.paymentStatus = "Completed";
    rideDetails.paymentMethod = "Stripe";
    await rideDetails.save();

    const allPrices = await RidePrices.findOne({ _id: rideDetails.allPrices });
    allPrices.totalDue = allPrices.totalDue - price;
    allPrices.deposits = allPrices.deposits + price;
    await allPrices.save();

    // if (transaction) {
    // }
    res.json({
      success: true,
      intentId: paymentId,
      message: "success",
      // transactionId: transaction._id,
    });
  } catch (error) {
    console.log("error: ", error);
    // await sendEmail(
    //   ["suryapratapbbr21@gmail.com", "no-reply@myfanstime.com"],
    //   "FansTime Error in confirm payment",
    //   `<div>${JSON.stringify(error)}</div>`
    // );
    next(error);
  }
};

module.exports = confirmPayment;
