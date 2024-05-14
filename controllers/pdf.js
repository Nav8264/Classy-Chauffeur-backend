const getPdfLocation = require("../services/generateRidePdf");
const uploadFromFile = require("../services/upload-fs-file");
const { sendRawEmail } = require("../services/sendRawEmail");
const invoiceTemplate = require("../templates/invoiceTemplate");

const pdfs = async (req, res, next) => {
  try {
    const { location, fileName } = await getPdfLocation({ ...null });

    console.log("pdfLocation", location);

    const uploadFile = await uploadFromFile(location, fileName);

    console.log("uploadFile", uploadFile);

    await sendRawEmail(
      uploadFile.Bucket,
      uploadFile.key,
      "RideDetails",
      invoiceTemplate({ pdfLink: uploadFile.Location }),
      "navpreet.singh@simbaquartz.com"
    );

    res.json({ message: "Done,,,," });
  } catch (err) {
    next(err);
  }
};

module.exports = pdfs;
