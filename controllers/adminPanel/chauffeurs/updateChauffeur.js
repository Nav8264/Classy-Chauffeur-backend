const Chauffeur = require("../../../models/Chauffeur");
const { ObjectId } = require("mongoose").Types;


const UpdateChauffeur = async (req, res, next) => {

    const { id } = req.query;
    const { chauffeurPrice, specialChauffeur } = req.body;

    try {
        if (chauffeurPrice || specialChauffeur) {
            await Chauffeur.findOneAndUpdate(
                { _id: ObjectId(id) },
                {
                    chauffeurPrice,
                    specialChauffeur
                },
                { new: true }
            )

            res.json({
                success: true,
                message: "Chauffeur updated successfully!"
            })
        }
    }
    catch (err) {
        next(err)
    }
}
module.exports = UpdateChauffeur;