const { default: axios } = require("axios");

const sendSms = async ({ body, to }) => {
  try {
    const response = await axios.post(
      "https://rest.clicksend.com/v3/sms/send",
      {
        messages: [
          {
            body: body,
            to: to,
            source: "sdk",
          },
        ],
      },
      {
        auth: {
          username: "info@upforks.com",
          password: "D5DFEA78-F83C-CB2F-E759-997FBB6E2CA4",
        },
      }
    );

    console.log("sms response", response);
  } catch (err) {
    console.log("err", err);
  }
};
module.exports = sendSms;
