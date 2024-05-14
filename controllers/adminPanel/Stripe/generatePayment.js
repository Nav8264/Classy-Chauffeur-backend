const stripe = require("../../../utils/stripe");

const generatePayment = async (req, res, next) => {
  try {
    const { customerId, paymentMethodId, price, ride, customer } = req.body;
    const userPrice = parseInt(+price * 100);

    const payload = {
      //use the specified price
      amount: userPrice,
      currency: "aud",
      payment_method_types: ["card"],
      customer: customerId,
      setup_future_usage: "off_session",
      description: "Payment for BG Chauffeur Cars",
      payment_method: paymentMethodId,
      metadata: {
        ride,
        customer,
        price: userPrice,
      },
    };

    //create a payment intent
    const intent = await stripe.paymentIntents.create(payload);

    //respond with the client secret and id of the new payment intent
    res.json({ client_secret: intent.client_secret, intent_id: intent.id });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = generatePayment;
