const Chauffeur = require("../../../models/Chauffeur");
const { ObjectId } = require("mongoose").Types;

const getChauffeursData = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    // const response = await Chauffeur.findById(userId);

    const response = await Chauffeur.aggregate([
      {
        $match: { _id: ObjectId(userId) },
      },
      {
        $lookup: {
          from: "vehicle",
          localField: "vehicleId",
          foreignField: "_id",
          as: "vehicle",
        },
      },
      {
        $unwind: { path: "$vehicle", preserveNullAndEmptyArrays: true },
      },
    ]);

    // const userDetails = {
    //   _id: response._id,
    //   name: response.name,
    //   phone: response.phone,
    //   email: response.email,
    //   dateOfBirth: response.dateOfBirth,
    //   gender: response.gender,
    //   profile: response.profile,
    //   experience: response.experience,
    //   vehicleType: response.vehicleType,
    //   licenseType: response.licenseType,
    //   isGoogleLogin: response.isGoogleLogin,
    //   isFacebookLogin: response.isFacebook,
    //   createdAt: response.createdAt,
    //   isDrivingLicenseVerified: response.isDrivingLicenseVerified,
    //   istialProofVerified: response.isResidentialProofVerified,
    // };

    return res.status(200).json({
      message: "success",
      data: response[0],
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

module.exports = getChauffeursData;
