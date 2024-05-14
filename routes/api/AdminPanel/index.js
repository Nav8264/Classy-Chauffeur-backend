const adminAuth = require("./auth");

const vehicle = require("./vehicle");
const rides = require("./rides");
const chauffeurs = require("./chauffeurs");
const staff = require("./staff");
const stripe = require("./stripe");
const paypal = require("./paypal");
const stripeCheckout = require("./stripeCheckout");
const airport = require("./airport");
const reports = require("./reports");
const customerFeedback = require("./customerfeedback");
const vehiclePrices = require("./vehiclePrices");
const user = require("./user");
const invoice = require("./invoice");
const operators = require("./operator");
const promocodes = require("./promocode");

const getAnalytics = require("../../../controllers/adminPanel/getAnalytics");
const getAdminUser = require("../../../controllers/adminPanel/me");
const validateAccessToken = require("../../../middlewares/jwtValidation");
const addOffers = require("../../../controllers/adminPanel/Offers/create");
const firebaseTopic = require("../../../controllers/adminPanel/firebaseTopic");

const router = require("express").Router();

router.use("/auth", adminAuth);

router.use("/vehicles", vehicle);
router.use("/rides", rides);
router.use("/chauffeurs", chauffeurs);
router.use("/operator", operators);

router.use("/stripe", stripe);
router.use("/paypal", paypal);
router.use("/stripeCheckout", stripeCheckout);
router.use("/promocodes", promocodes);
router.use("/passenger", customerFeedback);
router.use("/staff", staff);
router.use("/prices", vehiclePrices);
router.use("/airport", airport);
router.use("/reports", reports);

router.use("/invoice", invoice);

router.get("/getAnalytics", getAnalytics);

router.put("/offerDays", addOffers);

router.use("/user", user);

router.get("/me", validateAccessToken, getAdminUser);

router.post("/firebaseTopic", firebaseTopic);

// router.post("/createVehicle", createVehicle);
// router.post("/createRide", createRide);

module.exports = router;
