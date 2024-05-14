const express = require("express");

require("dotenv").config();
const stripe = require("stripe");
const paymentLinkTemplate = require("../../../templates/paymentLink");
const sendEmail = require("../../../services/sendEmail");
const Stripe = stripe(process.env.STRIPE_KEY);
const router = express.Router();
router.post("/create-payment-link", async (req, res) => {
  console.log(req.body);
  const { price, email } = req.body;

  let url = "";

  const product = await Stripe.products
    .create({
      name: "Ride",
    })
    .then(async (res) => {
      const actualPrice = await Stripe.prices
        .create({
          currency: "aud",
          unit_amount: Math.round(price),
          product: res.id,
        })
        .then(async (res) => {
          const paymentLink = await Stripe.paymentLinks
            .create({
              line_items: [{ price: res.id, quantity: 1 }],
            })
            .then(async (val) => {
              console.log("val", val?.url);
              url = await val?.url;
              // return val?.url;
            });
        });
    });

  await sendEmail(
    [email],
    "Invitation Link",
    paymentLinkTemplate({ amount: `AUD ${price / 100}`, link: url })
    //["joshanpreet.singh@simbaquartz.com"]
  );

  res.status(200).send(url);
});
module.exports = router;
