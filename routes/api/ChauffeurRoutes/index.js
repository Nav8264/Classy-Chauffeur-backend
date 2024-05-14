const chauffeurAuthRoutes = require("./ChauffeurAuth");
const chauffeurData = require("./ChauffeurData");

const validateAccessToken = require("../../../middlewares/jwtValidation");

const router = require("express").Router();

router.use("/auth", chauffeurAuthRoutes);

router.use("/chauffeurData", validateAccessToken, chauffeurData);

// router.post("/createVehicle", createVehicle);
// router.post("/createRide", createRide);

module.exports = router;
