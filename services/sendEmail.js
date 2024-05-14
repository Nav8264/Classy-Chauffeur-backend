const AWS = require("aws-sdk");
const { accessKeyId, secretAccessKey, region, sesSenderAddress } =
  require("../config/keys").aws;

/**
 * Sends email address
 * @param {Array} recipients - Array of recipient email addresses
 * @param {String} subject - Subject line of the email
 * @param {String} template - Email body in html with inline styles
 * @param {String} ccRecipients - Array of cc email addresses
 */
const sendEmail = (recipients, subject, template, ccRecipients) => {
  /** This CC is for, If empty ccMails received */
  let cc = ccRecipients || [];
  cc = [...cc, "blackgrandeurchauffeur@gmail.com"];

  return new Promise((resolve, reject) => {
    try {
      const SES_CONFIG = {
        accessKeyId,
        secretAccessKey,
        region,
      };

      const ses = new AWS.SES(SES_CONFIG);
      const params = {
        Destination: {
          ToAddresses: recipients, // Email address/addresses that you want to send your email
          CcAddresses: cc || [], // Email address/addresses that you want to CC
        },
        Message: {
          Body: {
            Html: {
              // HTML Format of the email
              Charset: "UTF-8",
              Data: template,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: subject,
          },
        },
        Source: "support@blackgrandeurchauffeur.com.au",
      };

      const sendEmail = async () => await ses.sendEmail(params).promise();
      sendEmail();
      resolve();
    } catch (error) {
      return reject(error);
    }
  });
};

exports.generateOTP = () => {
  var digits = "0123456789";
  var otpLength = 4;
  var otp = "";
  for (let i = 1; i <= otpLength; i++) {
    var index = Math.floor(Math.random() * digits.length);
    otp = otp + digits[index];
  }
  return otp;
};

module.exports = sendEmail;
