const OTPtemplate = ({ OTP }) => {
  return `
        <!DOCTYPE html>
      
  <html>
    <head>
      <title>One-Time Password (OTP)</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-size: 16px;
          line-height: 1.5;
          color: #333;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-weight: 600;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }
        p {
          margin-bottom: 1.5rem;
        }
        a {
          color: #08a5e1;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }
        .header {
          padding: 1.5rem;
          text-align: center;
          background-color: #f2f2f2;
        }
        .header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .body {
          padding: 1.5rem;
          background-color: #fff;
        }
        .otp-code {
          margin-bottom: 1.5rem;
          text-align: center;
          font-size: 3rem;
          font-weight: 700;
          color: #08a5e1;
          background-color: #f2f2f2;
          padding: 2rem;
        }
        .otp-expiration {
          font-size: 1rem;
          color: #999;
          margin-top: 1rem;
        }
        .footer {
          padding: 1.5rem;
          background-color: #f2f2f2;
        }
        .footer p {
          margin-bottom: 0.5rem;
        }
        .footer p:last-child {
          margin-bottom: 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="body">
          <p>
            We have received a request to generate a one-time password (OTP) for
            your account. Please enter the OTP below:
          </p>
          <div class="otp-code">${OTP}</div>
          <div class="otp-expiration">This OTP will expire in 10 minutes.</div>
          <p>
            Please use the above OTP to complete your requested action. If you did
            not request an OTP, please contact us immediately at
            <a href="mailto:blackgrandeurchauffeur@gmail.com">blackgrandeurchauffeur@gmail.com</a>.
          </p>
          <p>Thank you for chosing Black Grandeur Chauffeur.</p>
        </div>
      </div>
    </body>
  </html> 
  ​
  ​`;
};

module.exports = OTPtemplate;
