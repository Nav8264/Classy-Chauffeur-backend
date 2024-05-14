const router = require("express").Router();

const createInvoice = require("../../../controllers/adminPanel/Invoices/createInvoice");
const getAllInvoices = require("../../../controllers/adminPanel/Invoices/getAllInvoices");
const getPendingCustomers = require("../../../controllers/adminPanel/Invoices/getPendingCustomers");
const updateInvoice = require("../../../controllers/adminPanel/Invoices/updateInvoice");
const validateAccessToken = require("../../../middlewares/jwtValidation");

router.get("/getPendingCustomers", getPendingCustomers);
router.post("/createInvoice", createInvoice);
router.get("/getAllInvoices", getAllInvoices);
router.put("/updateInvoice", updateInvoice);

// router.post("/createRide", createRide);

module.exports = router;
