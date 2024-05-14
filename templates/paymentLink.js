const paymentLinkTemplate = ({ amount, link }) => {
  return `
 <!DOCTYPE html>
  <html>
    <head>
      <title>Payment Link</title>
    </head>
    <body
      style="
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.5;
        color: #333;
      "
    >
      <table
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          border-collapse: collapse;
        "
      >
        <tr>
          <td style="padding: 20px">
            <p style="margin-bottom: 20px">
              We are pleased to inform you that your payment for
              booking ride on <strong>Black Grandeur Chauffeur</strong>  is due. 
              To make the payment process
              easier, we have provided a secure payment link below:
            </p>
            <table
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="width: 100%; border-collapse: collapse"
            >
              <tr>
                <td
                  style="
                    padding: 10px;
                    border: 1px solid #ddd;
                    text-align: center;
                  "
                >
                  <p
                    style="
                      margin: 0;
                      font-size: 24px;
                      font-weight: bold;
                      color: #333;
                    "
                  >
                    ${amount}
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 0">
                  <p style="margin-bottom: 20px">
                    To make the payment, simply click the button below:
                  </p>
                  <p style="margin-bottom: 20px; text-align: center">
                    <a
                      href="${link}"
                      style="
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #008cba;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                      "
                      >Pay Now</a
                    >
                  </p>
                  <p style="margin-bottom: 20px">
                    If you have any questions or concerns, please don't hesitate
                    to contact us at
                    <a
                      href="mailto:blackgrandeurchauffeur@gmail.com"
                      style="color: #008cba; text-decoration: none"
                      >blackgrandeurchauffeur@gmail.com</a
                    >.
                  </p>
                  <p style="margin-bottom: 20px">
                    Thank you for choosing Black Grandeur Chauffeur.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html> 
      `;
};

module.exports = paymentLinkTemplate;
