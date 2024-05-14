const RideCancellation = ({
  bookingNo,
  lastModified,
  pickUpDate,
  pickUpTime,
  serviceType,
  customerName,
  phoneNo,
  noOfPassengers,
  vehicleType,
  paymentMethod,

  pickUpLocation,
  dropLocation,
  notes,
  flatRate,
  reservationTotal,
  paymentsDeposits,
  totalDue,
}) => {
  return `
<html>
<head>
  <style>
    table {
      font-family: arial, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }
    td,
    th {
      text-align: left;
      padding: 2px;
      height: 10px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <table>
    <tr>
      <th style="height: 150px">
        <img
          src="https://bgchauffers.s3.ap-southeast-2.amazonaws.com/bg-chauffeur/bgChauffeurLogo%20%283%29-863bce1e-f7b5-400c-b940-0af351406739.png"
          alt="Logo" class="logo" width="125px" height="125px" />
      </th>
      <th style="height: 200px"></th>
      <th style="height: 200px">Cancellation Confirmation</th>
    </tr>
    <tr class="bg" style="
          background-color: #ffcbd1;
          height: 50px;
          border-bottom: 3px solid #c30010;
        ">
      <td>Cancellation Confirmation ${bookingNo}</td>
      <td></td>
      <td>Last Modified On: ${lastModified}</td>
    </tr>
    <tr>
      <td><b>Pick-up Date:</b></td>
      <td>${pickUpDate}</td>
    </tr>
    <!-- <hr /> -->
    <tr>
      <td style="width: 20%"><b>Pick-up Time:</b></td>
      <td>${pickUpTime}</td>
    </tr>
    <tr>
      <td style="width: 20%"><b>ServiceType:</b></td>
      <td>${serviceType}</td>
    </tr>
    <tr>
      <td style="width: 20%"><b>Passenger:</b></td>
      <td>${customerName}</td>
    </tr>
    <tr>
      <td style="width: 20%"><b>Phone Number:</b></td>
      <td>${phoneNo}</td>
    </tr>
    <tr>
      <td style="width: 20%"><b>No. of Pass:</b></td>
      <td>${noOfPassengers}</td>
    </tr>
    <tr>
      <td style="width: 20%"><b>Vehicle Type:</b></td>
      <td>${vehicleType}</td>
    </tr>
    <tr>
      <td style="width: 20%"><b>Primary/Billing Contact:</b></td>
      <td>${customerName}</td>
    </tr>
    <tr>
      <td style="width: 20%"><b>Payment Method:</b></td>
      <td>${paymentMethod}</td>
    </tr>
    <tr>
      <td style="width: 20%"><b>Trip Routing Information:</b></td>
      <td>
        <b>PU:--</b> 
        ${pickUpLocation}
        <br/>
        <b>DO:--</b> 
        ${dropLocation}
      </td>
    </tr>
    <tr>
      <td style="width: 20%"><b>Notes/Comments:</b></td>
      <td>${notes}</td>
    </tr>
    
    <tr>
      <td style="width: 20%"><b>Charges & Fees</b></td>
      <td>Flat Rate</td>
      <td>$${flatRate}</td>
    </tr>
    <tr>
      <td style="width: 20%"><b></b></td>
      <td>Reservation Total</td>
      <td>$${reservationTotal}</td>
    </tr>
    <tr>
      <td style="width: 20%"><b></b></td>
      <td style="color: #018236"><b>Payments/Deposits:</b></td>
      <td style="color: #018236">$${paymentsDeposits}</td>
    </tr>
    <tr>
      <td style="width: 20%"><b></b></td>
    </tr>
    <tr>
      <td style="width: 20%"><b></b></td>
      <td style="color: #ff0000"><b>Total Due:</b></td>
      <td style="color: #ff0000">$${totalDue}</td>
    </tr>
  </table>
  <h3 style="
  font-size: 10px;">Terms & Conditions/
</h3>
<h4 style="color: #202124; width: 90%;
font-size: 10px;"><b> Reservation Agreement:</b>All deposits are NON refundable. Company is not liable in the event of mechanical breakdown while
  on charter and will only be responsible for making up lost time at a mutually agreed date. The client assumes full financial liability
  for any damage to the limousine caused during the duration of the rental by them or any members of their party. A fee of 100.00
  for each carpet or seat burn. Sanitation fee is 250.00. Alcohol Consumption and drug use is prohibited by law. Any fines will be
  paid for by the customer. The driver has the right to terminate run without refund (if there is blatant indiscretion on the part of the
  client(s)). It is Illegal to stand through the sunroof. Smoking is not permitted in some of our limousines and this is left to the
  discretion of the driver. Overtime pay will apply after the first 15 minutes of prearranged time described on the run sheet. Not
  responsible for delays or the termination in winter caused by unsafe road conditions (ie. not salted, accidents, etc.). Not
  responsible for articles left in the limousine. Balances to be paid to the driver on the run date before the beginning of the run.
  Vehicles cannot be loaded beyond seating capacity</h4>

</body>

</html>

`;
};

module.exports = RideCancellation;
