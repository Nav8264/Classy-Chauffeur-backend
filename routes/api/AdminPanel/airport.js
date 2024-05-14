const addAirport = require("../../../controllers/adminPanel/Airports/addAirport");
const deleteAirport = require("../../../controllers/adminPanel/Airports/deleteAirport");
const getAirports = require("../../../controllers/adminPanel/Airports/getAirports");
const updateAirport = require("../../../controllers/adminPanel/Airports/updateAirport");

const router = require("express").Router();

router.post("/addAirport", addAirport);
router.get("/getAllAirports", getAirports);
router.delete("/deleteAirport", deleteAirport);
router.put("/updateAirport", updateAirport);

module.exports = router;
