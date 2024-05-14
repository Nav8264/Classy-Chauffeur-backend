const addVehicle = require("../../../controllers/adminPanel/Vehicle/addVehicle");
const deleteVehicle = require("../../../controllers/adminPanel/Vehicle/deleteVehicle");
const getAllVehicles = require("../../../controllers/adminPanel/Vehicle/getAllVehicles");
const getSingleVehicleDetails = require("../../../controllers/adminPanel/Vehicle/getSingleVehicleDetails");
const updateVehicle = require("../../../controllers/adminPanel/Vehicle/updateVehicle");

const router = require("express").Router();

// creating/adding vehicle
router.post("/addVehicle", addVehicle);

router.get("/getAllVehicles", getAllVehicles);
router.get("/getSingleVehicleDetails", getSingleVehicleDetails);
router.delete("/:id", deleteVehicle);
router.put('/updateVehicle/:id',updateVehicle);


module.exports = router;
