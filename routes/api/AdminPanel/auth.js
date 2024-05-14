const checkAdminExistence = require("../../../controllers/auth/adminAuth/checkExistance");
const forgotPassword = require("../../../controllers/auth/adminAuth/forgotPassword");
const adminLogin = require("../../../controllers/auth/adminAuth/login");
const adminSignUp = require("../../../controllers/auth/adminAuth/signup");
const UpdateProfile = require("../../../controllers/auth/adminAuth/updateProfile");
const verifyOTP = require("../../../controllers/auth/adminAuth/verifiyOTP");

const router = require("express").Router();

router.post("/signup", adminSignUp);
router.post("/login", adminLogin);
router.post("/forgotPassword", forgotPassword);

router.put("/updateProfile", UpdateProfile);

router.put("/checkExistance", checkAdminExistence);
router.put("/verifyOtp", verifyOTP);

// router.post("/createVehicle", createVehicle);
// router.post("/createRide", createRide);

module.exports = router;
