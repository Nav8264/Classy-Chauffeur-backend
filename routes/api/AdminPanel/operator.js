const getAllOperators = require("../../../controllers/adminPanel/Operators/getAllOperators");
const getSingleOperator = require("../../../controllers/adminPanel/Operators/getSingleOperator");

const router = require("express").Router();

router.get("/getAllOperator", getAllOperators);
router.get("/:id", getSingleOperator);

module.exports = router;
