const inviteStaffTemplate = ({ firstName, lastName, accessToken }) => {
  return `<!DOCTYPE html>
    
    <html
      lang="en"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:v="urn:schemas-microsoft-com:vml"
    >
      <head>
        <title></title>
        <meta charset="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <!--[if mso
          ]><xml
            ><o:OfficeDocumentSettings
              ><o:PixelsPerInch>96</o:PixelsPerInch
              ><o:AllowPNG /></o:OfficeDocumentSettings></xml
        ><![endif]-->
        <!--[if !mso]><!-->
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Nunito"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Droid+Serif"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Cabin"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Ubuntu"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Oxygen"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto+Slab"
          rel="stylesheet"
          type="text/css"
        />
        <!--<![endif]-->
        <style>
          * {
            box-sizing: border-box;
          }
    
          body {
            margin: 0;
            padding: 0;
          }
    
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important;
          }
    
          #MessageViewBody a {
            color: inherit;
            text-decoration: none;
          }
    
          p {
            line-height: inherit;
          }
    
          @media (max-width: 670px) {
            .icons-inner {
              text-align: center;
            }
    
            .icons-inner td {
              margin: 0 auto;
            }
    
            .row-content {
              width: 100% !important;
            }
    
            .stack .column {
              width: 100%;
              display: block;
            }
          }
        </style>
      </head>
      <body
        style="
          background-color: #fbfbfb;
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: none;
          text-size-adjust: none;
        "
      >
        <table
          border="0"
          cellpadding="0"
          cellspacing="0"
          class="nl-container"
          role="presentation"
          style="
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            background-color: #fbfbfb;
          "
          width="100%"
        >
          <tbody>
            <tr>
              <td>
              <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  class="row row-1"
                  role="presentation"
                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                  width="100%"
                >
                  <tbody>
                    <tr>
                      <td>
                        <table
                          align="center"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="row-content stack"
                          role="presentation"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            color: #000000;
                            width: 650px;
                          "
                          width="650"
                        >
                          <tbody>
                            <tr>
                              <td
                                class="column"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  font-weight: 400;
                                  text-align: left;
                                  vertical-align: top;
                                  padding-top: 5px;
                                  padding-bottom: 5px;
                                  border-top: 0px;
                                  border-right: 0px;
                                  border-bottom: 0px;
                                  border-left: 0px;
                                "
                                width="100%"
                              >
                                
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  class="row row-1"
                  role="presentation"
                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                  width="100%"
                >
                  <tbody>
                    <tr>
                      <td>
                        <table
                          align="center"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="row-content stack"
                          role="presentation"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            color: #000000;
                            width: 650px;
                          "
                          width="650"
                        >
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  class="row row-2"
                  role="presentation"
                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                  width="100%"
                >
                  <tbody>
                    <tr>
                      <td>
                        <table
                          align="center"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="row-content stack"
                          role="presentation"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            color: #000000;
                            width: 650px;
                          "
                          width="650"
                        >
                          <tbody>
                            <tr>
                              <td
                                class="column"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  font-weight: 400;
                                  text-align: left;
                                  vertical-align: top;
                                  padding-top: 5px;
                                  padding-bottom: 15px;
                                  border-top: 0px;
                                  border-right: 0px;
                                  border-bottom: 0px;
                                  border-left: 0px;
                                "
                                width="100%"
                              >
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="text_block"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    word-break: break-word;
                                  "
                                  width="100%"
                                >
                                  <tr>
                                    <td
                                      style="
                                        padding-left: 10px;
                                        padding-right: 10px;
                                        padding-top: 25px;
                                      "
                                    >
                                      <div style="font-family: sans-serif">
                                        <div
                                          style="
                                            font-size: 14px;
                                            font-family: Cabin, Arial,
                                              Helvetica Neue, Helvetica, sans-serif;
                                            mso-line-height-alt: 16.8px;
                                            color: #ffffff;
                                            line-height: 1.2;
                                          "
                                        >
                                          <p
                                            style="
                                              margin: 0;
                                              font-size: 20px;
                                           
                                            "
                                          >
                                            <span style="color: #000000"
                                              ><strong
                                                ><span style=""
                                                  >Hello, ${firstName} ${lastName}</span
                                                ></strong
                                              ></span
                                            >
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
    
                <!-- content -->
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  class="row row-4"
                  role="presentation"
                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                  width="100%"
                >
                  <tbody>
                    <tr>
                      <td>
                        <table
                          align="center"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="row-content stack"
                          role="presentation"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            background-color: #fbfbfb;
                            color: #000000;
                            width: 700px;
                          "
                          width="700"
                        >
                          <tbody>
                            <tr>
                              <td
                                class="column"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  font-weight: 400;
                                  text-align: left;
                                  vertical-align: top;
                                  padding-top: 0px;
                                  padding-bottom: 5px;
                                  border-top: 0px;
                                  border-right: 0px;
                                  border-bottom: 0px;
                                  border-left: 0px;
                                "
                                width="100%"
                              >
                                
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="text_block"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    word-break: break-word;
                                  "
                                  width="100%"
                                >
                                  <tr>
                                    <td
                                      style="
                                        padding-bottom: 10px;
                                        padding-left: 40px;
                                        padding-right: 30px;
                                      "
                                    >
                                      <div style="font-family: sans-serif">
                                        <div
                                          style="
                                            font-size: 12px;
                                            mso-line-height-alt: 24px;
                                            color: #555555;
                                            line-height: 2;
                                            font-family: Montserrat, Trebuchet MS,
                                              Lucida Grande, Lucida Sans Unicode,
                                              Lucida Sans, Tahoma, sans-serif;
                                          "
                                        >
                                          <p
                                            style="
                                              margin: 0;
                                              font-size: 16px;
                                              
                                            "
                                          >
                                          We are all really excited to welcome you to our team!
                                          </p>
                                          <p
                                            style="
                                              margin: 0;
                                              font-size: 16px;
                                              
                                            "
                                          >
                                          Make sure you verify your email address and we'll finish setting up your account for you
                                          </p>
                                          
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="divider_block"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                  "
                                  width="100%"
                                >
                                  <tr>
                                    <td>
                                      <div align="center">
                                      <table
                                      border="0"
                                      cellpadding="10"
                                      cellspacing="0"
                                      class="text_block"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        word-break: break-word;
                                      "
                                      width="100%"
                                    >
                                      <tr>
                                        <td>
                                          <div style="font-family: sans-serif">
                                            <div
                                              style="
                                                font-size: 14px;
                                                mso-line-height-alt: 25.2px;
                                                color: #ffffff;
                                                line-height: 1.8;
                                                font-family: Cabin, Arial,
                                                  Helvetica Neue, Helvetica, sans-serif;
                                              "
                                            >
                                              <p
                                                style="
                                                  margin: 0;
                                                  font-size: 14px;
                                                  text-align: center;
                                                "
                                              >
                                                <a
                                                  href="https://bgc-admin.web.app/user/invitation?token=${accessToken}"
                                                  rel="noopener"
                                                  style="
                                                    text-decoration: underline;
                                                    color: #ffffff;
                                                    width: 100%;
                                                  "
                                                  target="_blank"
                                                  >
                                                  <button
                                                  style="width:250px; height:35px; border-radius:20px; outline:none; border:none; background: #1C467E; color:white"
                                                  >
                                                  Yes, verify me!
                                                  </button>
                                                  </a
                                                >
                                              </p>
                                              
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <!-- end of content -->
    
                <!-- Footer -->
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  class="row row-17"
                  role="presentation"
                  style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                  width="100%"
                >
                  <tbody>
                    <tr>
                      <td>
                        <table
                          align="center"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="row-content stack"
                          role="presentation"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            
                            color: #000000;
                            width: 625px;
                          "
                          width="625"
                        >
                          <tbody>
                            <tr>
                              <td
                                class="column"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  font-weight: 400;
                                  text-align: left;
                                  vertical-align: top;
                                  padding-top: 15px;
                                  padding-bottom: 20px;
                                  border-top: 0px;
                                  border-right: 0px;
                                  border-bottom: 0px;
                                  border-left: 0px;
                                "
                                width="100%"
                              >
                                
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="text_block"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    word-break: break-word;
                                  "
                                  width="100%"
                                >
                                  <tr>
                                    <td>
                                      <div style="font-family: sans-serif">
                                        <div
                                          style="
                                            font-size: 14px;
                                            mso-line-height-alt: 16.8px;
                                            color: #ffffff;
                                            line-height: 1.2;
                                            font-family: Cabin, Arial,
                                              Helvetica Neue, Helvetica, sans-serif;
                                          "
                                        >
                                          <p
                                            style="
                                              margin: 0;
                                              font-size: 14px;
                                              
                                            "
                                          >
                                            <span style="color:#000000 ">Regards,</span>
                                          </p>
                                          <p
                                            style="
                                              margin: 0;
                                              font-size: 14px;
                                              color: #000000;
                                              margin-top: 10px;
                                              mso-line-height-alt: 16.8px;
                                            "
                                          >
                                          BG Chauffeur Team.
                                          </p>
                                          <hr style="width= 100%" />
                                          <p
                                            style="
                                              margin: 0;
                                              font-size: 14px;
                                              margin-top: 20px;
                                              margin-bottom: 20px;
                                              color: #000000;
                                            "
                                          >
                                          If you're having trouble with the button above, copy and paste the URL below into your web browser.
                                          </p>
                                          <a style="margin-top: 5px;" href="https://bgc-admin.web.app/user/invitation?token=${accessToken}">https://bgc-admin.web.app/user/invitation?token=${accessToken}</a>
                                          <p
                                            style="
                                              margin: 0;
                                              font-size: 14px;
                                              margin-top: 20px;
                                            "
                                          >
                                              <span
                                                id="9ab04e5d-f56c-43c6-89ae-9cf8f416ecd8"
                                                style="color: #000000"
                                                >
                                                © BG Chauffeur Inc., All rights reserved.
                                                </span>
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <!-- End of Footer -->
              </td>
            </tr>
          </tbody>
        </table>
        <!-- End -->
      </body>
    </html>
    `;
};

module.exports = inviteStaffTemplate;
