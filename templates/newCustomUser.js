const newUserTemplate = ({ name, email, password }) => {
  return `
  <!DOCTYPE html>
<html>
  <head>
    <title>New Account Details</title>
    <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #f6f6f6;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .header {
      background-color: #0c2cdf;
      padding: 30px;
      text-align: center;
    }

    .header h2 {
      color: #ffffff;
      font-size: 28px;
      margin: 0;
      text-transform: uppercase;
    }

    .content {
      padding: 40px;
      color: #000000;
    }

    p {
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 20px;
    }

    .highlight {
      color: #0c2cdf;
      font-weight: bold;
    }

    .button {
      display: inline-block;
      background-color: #0c2cdf;
      color: #ffffff;
      font-size: 16px;
      font-weight: bold;
      text-decoration: none;
      padding: 12px 26px;
      border-radius: 5px;
    }

    .button:hover {
      background-color: #0c2cdf;
    }

    .footer {
      background-color: #cccaca;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color:#000000
    }
    .footer p {
      margin: 0;
    }
    
    .btn {
        color: white !important;
      }
  </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Welcome to Black grandeur chauffeur!</h2>
      </div>
      <div class="content">
        <p>Dear <span class="highlight">${name}</span>,</p>
        <p>
          We are pleased to inform you that an account has been created for you
          by our admin. Please find your login details below:
        </p>
        <table style="width: 100%">
          <tr>
            <td style="width: 150px"><strong>Email:</strong></td>
            <td>${email}</td>
          </tr>
          <tr>
            <td style="width: 150px"><strong>Password:</strong></td>
            <td>${password}</td>
          </tr>
        </table>
        <p>
          Please log in using these credentials and consider changing your
          password after the first login.
        </p>
        <p style="text-align: center">
          <a href="https://blackgrandeurchauffeur.com/login" class="button btn"
            >Login Now</a
          >
        </p>
      </div>
      <div class="footer">
        <p>
          Thank you for choosing our services.<br />
          If you have any questions, please contact our support team at
          blackgrandeurchauffeur@gmail.com
        </p>
      </div>
    </div>
  </body>
</html>

`;
};

module.exports = newUserTemplate;
