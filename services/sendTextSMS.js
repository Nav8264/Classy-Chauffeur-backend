require("dotenv").config();

var AWS = require("aws-sdk");

/// set region because SNS in set up in the region written below
AWS.config.update({ region: "ap-south-1" });

const sendTextSMS = async ({ message, subject, phoneNumber }) => {
  console.log("Message = " + message);
  console.log("Subject = " + subject);

  var params = {
    Message: message,
    // PhoneNumber: "+" + "919878936433",
    PhoneNumber: phoneNumber,
    MessageAttributes: {
      "AWS.SNS.SMS.SenderID": {
        DataType: "String",
        StringValue: subject,
      },
    },
  };

  var publishTextPromise = new AWS.SNS({ apiVersion: "2010-03-31" })
    .publish(params)
    .promise();

  publishTextPromise
    .then(function (data) {
      //   res.end(JSON.stringify({ MessageID: data.MessageId }));
      console.log("data", data);
    })
    .catch(function (err) {
      //   res.end(JSON.stringify({ Error: err }));
      console.log("err", err);
    });
};

module.exports = sendTextSMS;
