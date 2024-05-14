const router = require("express").Router();

const createRide = require("../../../controllers/adminPanel/Rides/createRide");
const getAllRides = require("../../../controllers/adminPanel/Rides/getAllRides");
const getSingleRideDetails = require("../../../controllers/adminPanel/Rides/getSingleRideDetails");
const deleteRide = require("../../../controllers/adminPanel/Rides/deleteRide");
const updateRide = require("../../../controllers/adminPanel/Rides/updateRide");
const updateRidePrices = require("../../../controllers/adminPanel/Rides/updateRidePrices");
const sendReservationEmail = require("../../../controllers/adminPanel/Rides/sendReservationEmail");
const updateRideDetails = require("../../../controllers/adminPanel/Rides/updateRideDetails");
const updateOnlineRideStatus = require("../../../controllers/adminPanel/Rides/updateOnlineRideStatus");

router.post("/createRide", createRide);
router.get("/getAllRides", getAllRides);
router.get("/getSingleRideDetails", getSingleRideDetails);
router.delete("/:id", deleteRide);

router.put("/updateRide", updateRide);
router.patch("/updateRideDetails", updateRideDetails);
router.put("/updateOnlineRideStatus/:id", updateOnlineRideStatus);

router.put("/prices", updateRidePrices);

router.put("/email", sendReservationEmail);

module.exports = router;
