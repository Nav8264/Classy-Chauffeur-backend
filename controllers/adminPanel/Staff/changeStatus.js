const AdminModel = require("../../../models/Admin");
const StaffUser = require("../../../models/Staff");

const changeStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const { id } = req.params;
    const data = await StaffUser.findOneAndUpdate(
      { _id: id },
      { status: isActive ? "active" : "inactive" },
      { new: true }
    );
    await AdminModel.findOneAndUpdate(
      { _id: data?.userId },
      {
        isActive,
      },
      { new: true }
    );
    return res.status(200).send({
      status: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = changeStatus;
