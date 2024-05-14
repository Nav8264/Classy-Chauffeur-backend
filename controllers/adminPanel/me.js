const Admin = require("../../models/Admin");
const { ObjectId } = require("mongoose").Types;

const getAdminUser = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const adminUser = await Admin.findOne({ _id: ObjectId(userId) });

    res.json({
      message: "Success",
      data: adminUser,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getAdminUser;
