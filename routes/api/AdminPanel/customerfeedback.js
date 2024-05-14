const router = require("express").Router();

const feedback = require("../../../controllers/Passenger/customerFeedback/createFeedback");
const getCustomerFeedback = require("../../../controllers/Passenger/customerFeedback/getCustomerFeedback");
const response = require("../../../controllers/adminPanel/Addresponse/createResponse");
// const validateAccessToken = require("../../../middlewares/jwtValidation");
// const getResponseById = require("../../../controllers/Passenger/customerFeedback/getAdminResponse");

router.post("/addResponse", response);
// router.get("/getResponse/:id",validateAccessToken, getResponseById)

// router.post("/createFeedback", feedback);
router.get("/getAllFeedback", getCustomerFeedback);

module.exports = router;
