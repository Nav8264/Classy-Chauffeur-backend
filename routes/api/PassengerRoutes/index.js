const router = require("express").Router();
const validateAccessToken = require("../../../middlewares/jwtValidation");

const contactUs = require("../../../controllers/Passenger/contactUs");
const webPassengerLogin = require("../../../controllers/auth/PassengerAuth/login");
// const signup = require("../../../controllers/auth/PassengerAuth/signup");
const passengerDetail = require("../../../controllers/Passenger/passengerDetail");
const createPassenger = require("../../../controllers/Passenger/createPassenger");
const enquiry = require("../../../controllers/Passenger/enquiry");
const feedback = require("../../../controllers/Passenger/customerFeedback/createFeedback");
const getGeoLocation = require("../../../controllers/Passenger/getGeoLocation");
const getAllVehicles = require("../../../controllers/Passenger/getAllVehicles");
const getAllBookedRides = require("../../../controllers/Passenger/getAllBookedRides");
const paymentSheet = require("../../../controllers/Passenger/payments/paymentSheet");
const checkPassengerExistence = require("../../../controllers/auth/PassengerAuth/checkExistance");
const forgotPassword = require("../../../controllers/auth/PassengerAuth/forgotPassword");
const signup = require("../../../controllers/auth/PassengerAuth/signUp");
const getAdminResponse = require("../../../controllers/Passenger/customerFeedback/getAdminResponse");
const updateProfile = require("../../../controllers/auth/PassengerAuth/updateProfile");
const sendDeleteAccountOTP = require("../../../controllers/Passenger/sendDeleteAccountOtp");
const deleteAccountVerifyOtp = require("../../../controllers/Passenger/deleteAccountVerifyOtp");
const deleteAccountByEmail = require("../../../controllers/Passenger/deleteAccountByMail");
const paypalCheckout = require("../../../controllers/Passenger/payments/paypal");
const rateChauffeur = require("../../../controllers/Passenger/rateChauffeur");

router.post("/signup", signup);
router.post("/login", webPassengerLogin);
router.post("/existence", checkPassengerExistence);
router.post("/forgotPassword", forgotPassword);
router.put("/update", updateProfile);

router.post("/contactUs", contactUs);
router.get("/me", validateAccessToken, passengerDetail);
router.post("/createPassenger", createPassenger);
router.post("/createFeedback", feedback);
router.post("/enquiry", validateAccessToken, enquiry);
router.get("/geo/location", getGeoLocation);
// router.post("/enquiry", validateAccessToken, enquiry);
router.get("/getAdminResponse", getAdminResponse);
router.post("/geo/location", getGeoLocation);

router.put("/deleteAccount/sendOtp", sendDeleteAccountOTP);
router.put("/deleteAccount/verifyOtp", deleteAccountVerifyOtp);
router.delete("/deleteAccount/delete", deleteAccountByEmail);

router.post("/rateChauffeur", rateChauffeur);
/**
 * Ride CRUD apis
 */
// router.post
router.get("/getAllVehicles", getAllVehicles);
router.get("/getAllBookedRides", validateAccessToken, getAllBookedRides);
router.post("/paymentSheet", paymentSheet);

router.post("/paypal/generateToken", paypalCheckout);

module.exports = router;
