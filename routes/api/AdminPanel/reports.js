const generateReports = require("../../../controllers/adminPanel/Reports/generate");

const router = require("express").Router();

router.post("/generate", generateReports);

module.exports = router;
