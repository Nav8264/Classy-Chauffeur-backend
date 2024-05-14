const express = require("express");

require("dotenv").config();
const stripe = require("stripe");
const Stripe = stripe(process.env.STRIPE_KEY);
const router = express.Router();
router.delete("/deletePromoCode", async (req, res, next) => {
  const { id } = req.query;

  console.log("id", id);
  try {
    const deleted = await Stripe.coupons.del(id).then(async (res) => {
      console.log(res, "response");
      return res;
    });
    // console.log("coupons", deleted);
    res.status(200).send(deleted);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
