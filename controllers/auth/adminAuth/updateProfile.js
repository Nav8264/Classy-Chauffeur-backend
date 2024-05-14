const Admin = require("../../../models/Admin");
const StaffUser = require("../../../models/Staff");
const { ObjectId } = require("mongoose").Types;

const UpdateProfile = async (req, res, next) => {
  try {
    const { address, adminId, firstName, lastName, phoneNumber } = req.body;

    const data = await Admin.findOneAndUpdate(
      { _id: ObjectId(adminId) },
      {
        name: `${firstName} ${lastName}`,
        address,
        phoneNumber,
        firstName,
        lastName,
      },
      { new: true }
    );
    if (data?.invitedUserType === "staff") {
      await StaffUser.findOneAndUpdate(
        { userId: adminId },
        { firstName, lastName, phoneNumber },
        { new: true }
      );
    }
    res.json({
      success: true,
      message: "Profile updated successfully.",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = UpdateProfile;
