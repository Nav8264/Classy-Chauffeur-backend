const invoiceTemplate = ({ pdfLink }) => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0 ; color:black">
      <div
        style="
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f8f8;
        "
      >
        <h1 style="color: #333333; margin-top: 0">Regarding Invoice</h1>
        <p>Hello,</p>
        <p>
          We are pleased to share invoice of your previous rides with you. Please
          find the attached PDF document of invoice below:
        </p>
  
        <p>
          If you don't see the attatchment below, you can copy and paste the
          following URL into your browser:
        </p>
        <p><a href="path/to/your/file.pdf">path/to/your/file.pdf</a></p>
  
        <p>
          If you have any questions or need further assistance, please don't
          hesitate to contact us.
        </p>
        <p>
          You can reach us by replying to this email or by using the "Contact Us"
          button below.
        </p>
        <a
          style="
            display: inline-block;
            background-color: #4caf50;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            margin-top: 20px;
            border-radius: 4px;
          "
          href="https://blackgrandeurchauffeur.com/contact"
          >Contact Us</a
        >
        <p>Thank you for your attention.</p>
        <p>Best regards,</p>
        <p>Black Grandeur Chauffeur</p>
      </div>
    </body>
  </html>
  `;
};

module.exports = invoiceTemplate;
