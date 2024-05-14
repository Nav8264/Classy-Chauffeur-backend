const paypal = require("paypal-rest-sdk");
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AZV6jx7u3jS-bvKI5-dM-1dboXgpwk0HVNlARpWj7REO95fyAbvWswPZbiffkBMs8okN77JUMDq-m0gp",
  client_secret:
    "EFhqstZj6dz9aeFZUE5mGJ5o0tRFtGF5H4KzkF3B6HaGYGOVLMhzOCnPTeJzwzP2mbmthLLAQFuZMt95",
});

const paypalPayment = async (req, res) => {
  const { price } = req.query;

  var create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
      // return_url: "https://api.blackgrandeurchauffeur.au/success",
      // cancel_url: "https://api.blackgrandeurchauffeur.au/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "item",
              sku: "item",
              price: `${price}`,
              currency: "AUD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "AUD",
          total: `${price}`,
        },
        description: "This is the payment description.",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      return res.send({ error: error });
    } else {
      console.log("Create Payment Response");
      console.log(payment);
      res.redirect(payment.links[1].href);
    }
  });
};
module.exports = { paypalPayment };
