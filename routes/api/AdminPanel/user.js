const addUser = require("../../../controllers/adminPanel/User/addUser");
const deleteUser = require("../../../controllers/adminPanel/User/deleteUser");
const getAllUser = require("../../../controllers/adminPanel/User/getAllUsers");
const updateUser = require("../../../controllers/adminPanel/User/updateUser");

const router = require("express").Router();

router.post("/addUser", addUser);

router.delete("/deleteUser/:id", deleteUser);

router.put("/updateUser/:id", updateUser);

router.get("/getAllUser", getAllUser);

module.exports = router;
