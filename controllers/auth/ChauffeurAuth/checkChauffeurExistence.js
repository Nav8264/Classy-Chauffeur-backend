const Chauffeur = require("../../../models/Chauffeur");

const checkChauffeurExistence = async (req, res, next) => {
  try {
    const findUser = await Chauffeur.findOne({
      phone: req.body.phone,
    });
    if (findUser) {
      return res.status(200).json({
        userExist: true,
      });
    }

    return res.status(200).json({
      userExist: false,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = checkChauffeurExistence;
