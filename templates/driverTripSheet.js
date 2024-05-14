const DriverTripSheet = async ({
  pickUpDate,
  pickUpTime,
  bookingNo,
  customerName,
  customerPhoneNo,
  customerEmail,
  lastModified,
  pax,
  vehicleType,
  vehicleName,
  driverName,
  driverPhoneNo,
  paymentMethod,
  paymentStatus,
  pickUpLocation,
  dropLocation,
  serviceType,
  noOfPassengers,

  notes,
  flatRate,
  reservationTotal,
  paymentsDeposits,
  totalDue,
}) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
  <style>
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 70%;
    margin: auto;
  }
  td, th {
    text-align: left;
    padding: 5px;
    height: 10px;
    font-size: 10px;
  }
  </style>
  </head>
  <body>
  <table style="width:100%;margin: auto;margin-top: 25px;border-collapse: collapse;">
  <tr>
            <th><img src="https://bgchauffers.s3.ap-southeast-2.amazonaws.com/bg-chauffeur/bgChauffeurLogo%20%283%29-863bce1e-f7b5-400c-b940-0af351406739.png"
             style="width: 150px;"></th>
            <th></th>
            <th></th>
            <th style=" width: 250px;text-align:left;">Pick-up Date:<br><br>Pick-up Time:<br><br>Reservation </th>
            <th></th>
            <th></th>
            <th style="  width: 250px;text-align:left;">${pickUpDate}<br><br>${pickUpTime}<br><br>${bookingNo}</th>
         
    </tr>

<tr>
  <td ></td>
  <td ></td>
</tr>
</table>
  <table style="width:100%;">
      <tr>
        <th>Bill To:</th>
        <th>Primary Passenger:</th>
      </tr>
      <tr>
          <td>N/A</td>
          <td>${customerName}<br>${customerEmail}</td>
          <td style=" border:1.5px solid black; width: 40%;">Booked On:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;   ${lastModified}<br>Arr. By: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;   Not Specified<br>PO/Client #: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; N/A</td>
        </tr>
    </table>
  <table style="width:100%; margin-top: 10px;">
  <tr>
  <th style=" border:2px solid black; width: 100px; text-align: center;"># of Pax</th>
  <th></th>
  <th></th>
  <th style=" border:2px solid black; width: 300px; text-align: center;">Vehicle Type </th>
  <th></th>
  <th></th>
  <th style=" border:2px solid black; width: 300px; text-align: center;">Car(s)</th>
  <th></th>
  <th></th>
  <th style=" border:2px solid black; width: 300px; text-align: center;">Driver(s)</th>
  </tr>
  <tr>
  <td style=" border:2px solid black; width: 100px; text-align: center;">${
    pax || 0
  }</td>
  <td ></td>
  <td ></td>
  <td style=" border:2px solid black; width: 300px; text-align: center;">${vehicleType} </td>
  <td ></td>
  <td ></td>
  <td style=" border:2px solid black; width: 300px; text-align: center;">${vehicleName}</td>
  <td ></td>
  <td ></td>
  <td style=" border:2px solid black; width: 300px; text-align: center;">${driverName}<br>${driverPhoneNo}</td>
  </tr>
  </table>
  <table style="width:100%; margin-top: 10px;">
  <tr>
  <th style=" border:2px solid black; width: 700px;">Passenger & Routing Information</th>
  <th></th>
  <th></th>
  <th style=" border:2px solid black; width: 200px; text-align: center;">Pmt Type</th>
  <th></th>
  <th></th>
  <th style=" border:2px solid black; width: 200px; text-align: center;">Status</th>
  </tr>
  <tr>
  <td style=" border:2px solid black; width: 700px; padding: 10px 10px;"><b>Passenger:</b> ${customerName} <br><b>Phone:</b> ${customerPhoneNo}
  </td>
  <td ></td>
  <td ></td>
  <td style=" border:2px solid black; width: 200px; text-align: center;">${paymentMethod}</td>
  <td ></td>
  <td ></td>
  <td style=" border:2px solid black; width: 200px; text-align: center;">${paymentStatus}</td>
  </tr>
  <tr>
  <td style=" border:2px solid black; width: 700px; padding: 10px 10px; ">PU: -- : ${pickUpLocation}</td>
  <td ></td><td ></td><td></td><td ></td><td ></td><td></td></tr>
  <tr>
  <td style=" border:2px solid black; width: 700px; padding: 10px 10px;"><b>DO:</b> -- : ${dropLocation} </td>
  </tr>
  <tr>
  </table>
 
  <table style="width: 100%; position: relative; top: 10px; margin-top: 30px;">
  <tr>
  <th style=" border:2px solid black; width: 693px; text-align: center;">Standard Rental Agreement</th>
  </tr>
  <tr>
  <td style=" border:2px solid black; width: 693px;">All deposits are NON refundable. Company is not liable in the event of mechanical breakdown while on charter and will only be responsible for making up lost time at a mutually agreed date. The client assumes full financial liability for any damage to the limousine caused during the duration of the rental by them or any members of their party. A fee of 100.00 for each carpet or seat burn. Sanitation fee is 250.00. Alcohol Consumption and drug use is prohibited by law. Any fines will be paid for by the customer. The driver has the right to terminate run without refund (if there is blatant indiscretion on the part of the client(s)). It is Illegal to stand through the sunroof. Smoking is not permitted in some of our limousines and this is left to the discretion of the driver. Overtime pay will apply after the first 15 minutes of prearranged time described on the run sheet. Not responsible for delays or the termination in winter caused by unsafe road conditions (ie. not salted, accidents, etc.). Not responsible for articles left in the limousine. Balances to be paid to the driver on the run date before the beginning of the run. Vehicles cannot be loaded beyond seating capacity</td>
  </tr>
  </table>
  <table class="test" style="margin: auto; width: 40%; position: relative; top: -245px; left: 207px; text-align: center;">
    <tr>
      <th style=" border:2px solid black; width: 100px; text-align: center;">Charges & Fees</th>
    </tr>
    <tr>
      <td style=" border:2px solid black; width: 100px;"> N/A</td>
    </tr>
  </table>
  </body>
  </html>
    `;
};

module.exports = DriverTripSheet;
