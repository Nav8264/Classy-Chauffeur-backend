const router = require("express").Router();

const { paypalPayment } = require("../../../controllers/Paypal/paypal");

router.get("/", paypalPayment);

module.exports = router;
