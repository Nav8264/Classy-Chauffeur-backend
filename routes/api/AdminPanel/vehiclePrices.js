const addAdditionalPrices = require("../../../controllers/adminPanel/Prices/addAdditionalPrices");
const addVehiclePrices = require("../../../controllers/adminPanel/Prices/addVehiclePrices");
const deleteAdditionalPrices = require("../../../controllers/adminPanel/Prices/deleteAdditionalPrices");
const deleteVehiclePrice = require("../../../controllers/adminPanel/Prices/deleteVehiclePrice");
const getAdditionalPrices = require("../../../controllers/adminPanel/Prices/getAdditionalPrices");
const getVehiclePrices = require("../../../controllers/adminPanel/Prices/getVehiclePrices");
const updateAdditionalPrices = require("../../../controllers/adminPanel/Prices/updateAdditionalPrices");
const updateVehiclePrices = require("../../../controllers/adminPanel/Prices/updateVehiclePrices");

const router = require("express").Router();

// creating/adding vehicle prices
router.post("/addVehiclePrices", addVehiclePrices);
router.put("/updateVehiclePrices", updateVehiclePrices);
router.get("/getVehiclePrices", getVehiclePrices);
router.delete("/deleteVehiclePrice", deleteVehiclePrice);

// creating/adding addtional prices
router.post("/addAdditionalPrices", addAdditionalPrices);
router.put("/updateAdditionalPrices", updateAdditionalPrices);
router.get("/getAdditionalPrices", getAdditionalPrices);
router.delete("/deleteAdditionalPrice", deleteAdditionalPrices);

module.exports = router;
