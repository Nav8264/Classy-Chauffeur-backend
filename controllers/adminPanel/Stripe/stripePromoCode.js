const express = require("express");

require("dotenv").config();
const stripe = require("stripe");
const Stripe = stripe(process.env.STRIPE_KEY);
const router = express.Router();
router.post("/add-promo-code", async (req, res) => {
  console.log(req.body);

  const session = await Stripe.coupons
    .create({
      percent_off: req.body.percent_off,
      duration: req.body.duration,
      name: req.body.code,
      max_redemptions: req.body.max_redemptions,
      duration_in_months: req.body.duration_in_months,
      redeem_by: req.body.redeem_by,
    })
    .then(async (res) => {
      const promotionCode = await Stripe.promotionCodes
        .create({
          coupon: res.id,
          code: req.body.code,
        })
        .then((val) => {
          //  console.log('val', val)
        });
    });
  res.status(200).send(session);
});
module.exports = router;
