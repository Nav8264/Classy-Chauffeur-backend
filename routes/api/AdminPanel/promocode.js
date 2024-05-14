const router = require("express").Router();

const createPromoCode = require("../../../controllers/adminPanel/PromoCodes/createPromoCode");
const getPromoCodes = require("../../../controllers/adminPanel/PromoCodes/get");
const updatePromoCode = require("../../../controllers/adminPanel/PromoCodes/update");
const usePromoCode = require("../../../controllers/adminPanel/PromoCodes/usePromoCode");

router.post("/addPromocode", createPromoCode);
router.put("/deletePromocode", updatePromoCode);
router.get("/getAllPromocodes", getPromoCodes);
router.put("/usePromoCode", usePromoCode);
module.exports = router;
