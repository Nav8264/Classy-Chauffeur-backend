require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_KEY);
const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

const paymentSheet = async (req, res, next) => {
  try {
    const { price } = req.body;

    if (parseInt(price?.toString()?.split(".")[0]) * 100) {
      // Use an existing Customer ID if this is a returning customer.
      const customer = await stripe.customers.create();
      const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: "2022-11-15" }
      );
      const paymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(price?.toString()?.split(".")[0]) * 100,
        currency: "aud",
        customer: customer.id,

        payment_method_types: ["card"],
        //   automatic_payment_methods: {
        //     enabled: true,
        //   },
      });

      res.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: stripePublishableKey,
      });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    next(err);
    console.log("err", err);
  }
};

module.exports = paymentSheet;
