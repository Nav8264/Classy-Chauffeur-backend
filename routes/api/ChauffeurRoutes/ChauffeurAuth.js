const router = require("express").Router();

const checkChauffeurExistence = require("../../../controllers/auth/ChauffeurAuth/checkChauffeurExistence");
const chauffeurLogin = require("../../../controllers/auth/ChauffeurAuth/chauffeurLogin");
const signUp = require("../../../controllers/auth/ChauffeurAuth/signup");
const updateChauffeurProfile = require("../../../controllers/auth/ChauffeurAuth/updateProfile");
const validateAccessToken = require("../../../middlewares/jwtValidation");
const deleteChauffeurProfile = require("../../../controllers/Chauffeurs/me/deleteProfile");
const forgotPassword = require("../../../controllers/auth/ChauffeurAuth/forgotPassword");

router.post("/signup", signUp);
router.post("/existence", checkChauffeurExistence);
router.post("/login", chauffeurLogin);
router.post("/forgotPassword", forgotPassword)

router.post("/updateProfile", validateAccessToken, updateChauffeurProfile);

router.post("/deleteProfile", validateAccessToken, deleteChauffeurProfile);

module.exports = router;
