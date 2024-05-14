const { AxiosHeaders, default: axios } = require("axios");
const base64 = require("base-64");

const paypalCheckout = async (req, res, next) => {
  try {
    let baseUrl = "https://api-m.sandbox.paypal.com";

    let clientId =
      "AQtMh1GoaEM5WQgRFilZ2Za5cXL-f3SUKDJ4Co65lH2u18cTDlCbeNMbQxPWaXwIpgB5eFyMZoqZ4Ekq";
    let secretKey =
      "EItiiJuWD3WDdgJnq7M8gMoBdiEbAOpSD9ZM6kwrNojim6Mizfp4rsZn9d4e9FfsW2-A-J0S50X4fniu";

    await axios
      .post(
        `${baseUrl}/v1/oauth2/token`,
        {
          grant_type: "client_credentials",
        },
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          auth: {
            username: clientId,
            password: secretKey,
          },
        }
      )
      ?.then((resp) => {
        res.send(200, {
          data: resp?.data,
          success: true,
        });
        console.log("RESSSSSS", resp?.data?.access_token);
      })
      ?.catch((err) => {
        throw err;
      });
  } catch (e) {
    console.log("errprrrrrrr", e);
  }
};
module.exports = paypalCheckout;
