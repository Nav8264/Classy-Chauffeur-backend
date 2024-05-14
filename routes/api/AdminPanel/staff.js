const acceptInvitation = require("../../../controllers/adminPanel/Staff/acceptInvitation");
const changeStatus = require("../../../controllers/adminPanel/Staff/changeStatus");
const getAllStaff = require("../../../controllers/adminPanel/Staff/getAllStaff");
const inviteStaff = require("../../../controllers/adminPanel/Staff/inviteStaff");
const updateStaff = require("../../../controllers/adminPanel/Staff/updateStaff");
const validateAccessToken = require("../../../middlewares/jwtValidation");

const router = require("express").Router();
router.post("/invite", validateAccessToken, inviteStaff);
router.post("/accept/invitation", acceptInvitation);
router.get("/", getAllStaff);
router.put("/:id", updateStaff);
router.put("/:id/status", changeStatus);
module.exports = router;
