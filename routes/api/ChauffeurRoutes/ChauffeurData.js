const router = require("express").Router();

const getBankDetails = require("../../../controllers/Chauffeurs/bankDetails");
const getAllRides = require("../../../controllers/Chauffeurs/getAllRides");
const getNotifications = require("../../../controllers/Chauffeurs/getNotifications");
const getUpcomingRides = require("../../../controllers/Chauffeurs/getUpcomingRides");
const getChauffeursData = require("../../../controllers/Chauffeurs/me/getChauffeursData");
const saveNotificationToken = require("../../../controllers/Chauffeurs/me/saveNotifToken");
const updateChecklistStatus = require("../../../controllers/Chauffeurs/updateChecklist");
const updateRide = require("../../../controllers/Chauffeurs/updateRide");

router.get("/me", getChauffeursData);
router.get("/bankDetails", getBankDetails);
router.get("/getAllRides", getAllRides);
router.put("/updateRide", updateRide);
router.get("/getUpcomingRide", getUpcomingRides);
router.put("/notifToken", saveNotificationToken);

router.get("/notifications", getNotifications);
router.put("/checklist", updateChecklistStatus);

module.exports = router;
