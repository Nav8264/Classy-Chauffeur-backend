const Invoice = require("../../../models/Invoice");
const formidable = require("formidable");
const uploadfiles = require("../../../services/upload-files");
const emailService = require("../../../services/sendRawEmail");

const { ObjectId } = require("mongoose").Types;
const Customer = require("../../../models/Customer");

const Ride = require("../../../models/Ride");
const invoiceTemplate = require("../../../templates/invoiceTemplate");

const createInvoice = async (req, res, next) => {
  console.log("files :>> ", req.body);

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      next(err);
    }
    try {
      let pdf;

      if (!!files?.pdf === true) {
        let location = files.pdf.filepath;
        const originalFilename = files.pdf.originalFilename;

        pdf = await uploadfiles.upload(
          location,
          originalFilename,
          `bg-chauffeur`,
          null,
          "application/pdf"
        );
      }

      console.log("originalFilename :>> ", pdf);

      for (let x of JSON.parse([fields?.rides])) {
        // console.log("x :>> ", x);

        await Ride.updateMany(
          { _id: { $in: ObjectId(x) } },
          { invoiceSent: true },
          { new: true }
        );
      }

      const newInvoice = new Invoice({
        billTo: fields?.billTo,
        date: fields?.date,
        total: fields?.total,
        rides: JSON.parse([fields?.rides]),
        pdf: {
          url: pdf.Location,
          key: pdf.key,
        },
      });

      await newInvoice.save();

      // console.log("newInvoice :>> ", fields);

      const customer = await Customer.findOne({
        _id: ObjectId(fields?.billTo),
      });

      await emailService.sendRawEmail(
        pdf.Bucket,
        pdf.key,
        // "bgchauffers",
        // "bg-chauffeur/-032c6434-1736-4048-8793-dbaae15232d5.pdf",
        "Invoice Service",
        invoiceTemplate({ pdfLink: pdf.Location }),
        // "gurpreet.ramgarhia@simbaquartz.com"
        customer?.email
      );

      res.json({
        success: true,
        message: "Invoice created and sent successfully.",
      });
    } catch (err) {
      next(err);
    }
  });
};

module.exports = createInvoice;
