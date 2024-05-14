const router = require("express").Router();

const { ObjectId } = require("mongoose").Types;

const adminPanel = require("./AdminPanel");
const passenger = require("./PassengerRoutes/index");
const chauffeurRoutes = require("./ChauffeurRoutes/index");
const getCountryCode = require("../../controllers/Extras/getCountryCode");
const validateAccessToken = require("../../middlewares/jwtValidation");
const getConversations = require("../../controllers/Conversation/getConversations");
const sendMessage = require("../../controllers/Conversation/sendMessage");
const getMessages = require("../../controllers/Conversation/getMessages");
const verifyOTP = require("../../controllers/auth/PassengerAuth/verifiyOTP");
const getFlightDetails = require("../../controllers/FlightDetails/getFlightDetails");
// const pdf = require("../../controllers/pdf");
const updateMessage = require("../../controllers/Conversation/update");
const createRating = require("../../controllers/Ratings/create");
const getRatings = require("../../controllers/Ratings/get");

const bcrypt = require("bcryptjs");

router.use("/adminPanel", adminPanel);
router.use("/chauffeur", chauffeurRoutes);

router.use("/passenger", passenger);

router.get("/countryCode", getCountryCode);

// Conversation/Chatting routes here.
router.get("/getConversations", validateAccessToken, getConversations);
router.post("/sendMessage", validateAccessToken, sendMessage);
router.get("/getMessages", validateAccessToken, getMessages);
router.put("/updateMessage", updateMessage);

// Rating routes here.
router.post("/rating", validateAccessToken, createRating);
router.get("/rating", validateAccessToken, getRatings);

router.post("/verifyOtp", verifyOTP);

router.get("/getFlightDetails", getFlightDetails);

// router.post("/pdf", pdf);

router.get("/ping", async (req, res) => {
  try {
    const { date } = req.query;

    const queryDate = new Date(date).toLocaleString();

    const currentDate = new Date().toString();

    console.log("queryDate", new Date(date).getTimezoneOffset());
    console.log("currentDate", currentDate);

    res.json({ success: true });
  } catch (err) {
    console.log("err", err);
  }
});

module.exports = router;
