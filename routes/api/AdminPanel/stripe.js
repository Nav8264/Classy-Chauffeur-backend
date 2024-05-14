const stripePromo = require("../../../controllers/adminPanel/Stripe/stripePromoCode");
const router = require("express").Router();
const stripe = require("../../../controllers/adminPanel/Stripe/stripe");
const stripePayment = require("../../../controllers/adminPanel/Stripe/stripepaymentlink");

const getAllPromoCodes = require("../../../controllers/adminPanel/Stripe/getAllPromoCodes");

const deletePromoCode = require("../../../controllers/adminPanel/Stripe/deletePromoCode");
const {
  getCustomer,
  createCustomer,
  linkPaymentMethod,
  getPaymentMethods,
} = require("../../../controllers/adminPanel/Stripe/stripeCustomer");
const generatePayment = require("../../../controllers/adminPanel/Stripe/generatePayment");
const confirmPayment = require("../../../controllers/adminPanel/Stripe/confirmPayment");

router.post("/customer/get", getCustomer);
router.post("/customer", createCustomer);
router.get("/paymentMethod", getPaymentMethods);
router.post("/paymentMethod", linkPaymentMethod);
router.post("/payment/generate", generatePayment);
router.post("/payment/confirm", confirmPayment);

// creating/adding vehicle
router.use("/stripe-promo-code", stripePromo);
router.use("/stripe-payment-link", stripePayment);
router.use("/promoCodes", getAllPromoCodes);
router.use("/deletePromoCode", deletePromoCode);
router.use("/checkout", stripe);
module.exports = router;
