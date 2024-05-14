const Chauffeur = require("../../../models/Chauffeur");

const { ObjectId } = require("mongoose").Types;

const getSingleChauffeurs = async (req, res, next) => {
  const { id } = req.params;

  try {
    const singleChauffeurs = await Chauffeur.findById({
      _id: ObjectId(id),
    });

    res.status(200).json({
      message: "success",
      success: true,
      data: singleChauffeurs,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getSingleChauffeurs;