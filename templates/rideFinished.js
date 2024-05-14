const rideFinished = ({ passengerName }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Chauffeur Has Arrived - Ride Completed</title>
        <style>
          /* Typography */
          body {
            font-family: 'Helvetica Neue', sans-serif;
            font-size: 16px;
            color: #333333;
            line-height: 1.5;
          }
          h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #333333;
          }
          h2 {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333333;
          }
          p {
            font-size: 16px;
            margin-bottom: 20px;
            color: #333333;
          }
          /* Layout */
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 10px;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 40px;
          }
          .logo {
            display: block;
            max-width: 200px;
          }
          /* Buttons */
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #333333;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            transition: background-color 0.3s ease-in-out;
          }
          .button:hover {
            background-color: #555555;
          }
          .button.primary {
            background-color: #007bff;
          }
          .button.primary:hover {
            background-color: #0069d9;
          }
          /* Responsive */
          @media only screen and (max-width: 600px) {
            .container {
              max-width: 100%;
              border-radius: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
          <img src="https://www.blackgrandeurchauffeur.com.au/wp-content/uploads/2022/12/resized-logo.png" alt="Logo" class="logo">

          </div>
          <h1 style="text-align: center;"> Ride Completed</h1>
          <p>Dear ${passengerName},</p>
          <p>We are pleased to inform you that your ride with us has been successfully completed. Your chauffeur has arrived at the designated location and we hope that you had a comfortable and enjoyable journey with us.</p>
          <h2>Thank you for choosing us as your transportation provider!</h2>
          <p>If you have any feedback or suggestions for us, please do not hesitate to get in touch with us. We value your <a href="https://blackgrandeurchauffeur.com/feedback" style="text-decoration: none; font-weight: bold;">Feedback</a>and are constantly striving to improve our services.</p>
          <p>Click the button below to visit our website and learn more about our services:</p>
         <a href="https://blackgrandeurchauffeur.com/" style="text-decoration: none; font-weight: bold;">Black Grandeur Chauffeur</a>
          
          <p>Best regards,<br>The Black Grand Chauffeur Team</p>
        </div>
      </body>
    </html> 
    ​
    `;
};

module.exports = rideFinished;
