const ResetPassword = require("../../../models/ResetPassword.model");
const Chauffeur = require("../../../models/Chauffeur");
const UserLoginMech = require("../../../models/ChauffeurLoginMech");

const { ObjectId } = require("mongoose").Types;

const bcrypt = require("bcryptjs");
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { type } = req.body;

    // decode base64 token
    let buff = Buffer.from(token, "base64");
    let text = buff.toString("ascii");

    const [email, password] = text.split("-");

    const chauffeur = await Chauffeur.findOne({ email: email });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const data = await UserLoginMech.findOneAndUpdate(
      { user: ObjectId(chauffeur._id) },
      { password: hashedPassword },
      {
        new: true,
      }
    );

    console.log(data);

    await ResetPassword.findOneAndDelete({ email: email }).exec();

    res.status(200).send({ message: "Password reset successfully" });
  } catch (err) {
    res.status(400).send({ message: "Error occured" });
  }
};
module.exports = resetPassword;
