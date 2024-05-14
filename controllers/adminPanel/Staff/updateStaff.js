const AdminModel = require("../../../models/Admin");
const StaffUser = require("../../../models/Staff");

const updateStaff = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, role, address } = req.body;
    const { id } = req.params;
    const data = await StaffUser.findOneAndUpdate(
      { _id: id },
      { firstName, lastName, phoneNumber, role },
      { new: true }
    );
    if (data?.userId) {
      await AdminModel.findOneAndUpdate(
        { _id: data?.userId },
        {
          firstName,
          lastName,
          phoneNumber,
          role,
          name: `${firstName} ${lastName}`,
          address,
        },
        { new: true }
      );
    }
    return res.status(200).send({
      status: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updateStaff;
