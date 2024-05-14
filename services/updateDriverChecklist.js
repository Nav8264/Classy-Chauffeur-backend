const { ObjectId } = require("mongoose").Types;
const Chauffeur = require("../models/Chauffeur");

const updateDriverChecklist = async () => {
  try {
    const chauffeurs = await Chauffeur.find({ isChecklisted: true });
    console.log("chauffeurs", chauffeurs);
    if (chauffeurs?.length > 0) {
      await Chauffeur.updateMany(
        { isChecklisted: true },
        {
          isChecklisted: false,
        },
        { multi: true }
      );
    }
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

module.exports = updateDriverChecklist;
