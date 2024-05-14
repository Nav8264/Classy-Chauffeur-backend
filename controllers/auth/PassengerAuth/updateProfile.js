const formidable = require("formidable");

const updateProfile = (req, res, next) => {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
        next(err);
      }

      if (files?.avatar_url) {
        let image;
        if (!!files?.avatar_url === true) {
          let location = files.avatar_url.filepath;
          const originalFilename = files.avatar_url.originalFilename;
          image = await uploadFiles.upload(
            location,
            originalFilename,
            `bg-chauffeur`,
            null
          );
        }

        await Chauffeur.findOneAndUpdate(
          { _id: ObjectId(userId) },
          {
            avatar_url: image.Location,
          },
          { new: true }
        );
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = updateProfile;
