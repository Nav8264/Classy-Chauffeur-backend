const express = require("express");

require("dotenv").config();
const stripe = require("stripe");
const Stripe = stripe(process.env.STRIPE_KEY);
const router = express.Router();
router.get("/getAllPromoCodes", async (req, res, next) => {
  try {
    const promotionCodes = await Stripe.promotionCodes
      .list({
        limit: 100,
      })
      .then(async (res) => {
        console.log(res.data);
        return res.data;
      });
    // console.log("coupons", promotionCodes);
    res.status(200).send(promotionCodes);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
