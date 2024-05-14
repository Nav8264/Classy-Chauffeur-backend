var aws = require("aws-sdk");
var nodemailer = require("nodemailer");

var ses = new aws.SES();
var s3 = new aws.S3();

function getS3File(bucket, key) {
  return new Promise(function (resolve, reject) {
    s3.getObject(
      {
        Bucket: bucket,
        Key: key,
      },
      function (err, data) {
        if (err) return reject(err);
        else return resolve(data);
      }
    );
  });
}

exports.sendRawEmail = async function (
  bucket,
  key,
  subject,
  template,
  recipients,
  ccMails
) {
  getS3File(bucket, key)
    .then(async function (fileData) {
      /** This CC is for, If empty ccMails received */
      let cc = ccMails || [];
      cc = [...cc, "blackgrandeurchauffeur@gmail.com"];

      var mailOptions = {
        from: "support@blackgrandeurchauffeur.com.au",
        subject,
        html: template,
        to: recipients,
        cc,
        // cc: [...ccMails, "blackgrandeurchauffeur@gmail.com"], // An array of mails to add on in cc.
        // bcc: Any BCC address you want here in an array,
        attachments: [
          {
            filename: "An Attachment.pdf",
            content: fileData.Body,
          },
        ],
      };

      console.log("Creating SES transporter");
      // create Nodemailer SES transporter
      var transporter = await nodemailer.createTransport({
        SES: ses,
      });

      // send email
      await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
          console.log("Error sending email");
          //   callback(err);
        } else {
          console.log("Email sent successfully");
          //   callback();
        }
      });
    })
    .catch(function (error) {
      console.log(error);
      console.log("Error getting attachment from S3");
      //   callback(err);
    });
};
