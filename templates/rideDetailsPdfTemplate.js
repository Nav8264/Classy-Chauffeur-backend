const rideDetailsPdfTemplate = async ({
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
  authorizations,
  totalDue,
  numberOfHours,
  flightNumber,
  childSeatPrice,
  trailerPrice,
  allPrices,
  accountNo,
  addStop,
  childSeats,
  clientRef,
}) => {
  return `<html>
<head>
  <style>
    table {
      font-family: arial, sans-serif;
      border-collapse: collapse;
      width: 90%;
      margin: auto;
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
      <th style="height: 130px">
        <img
          src="https://bgchauffers.s3.ap-southeast-2.amazonaws.com/bg-chauffeur/bgChauffeurLogo%20%283%29-863bce1e-f7b5-400c-b940-0af351406739.png"
          alt="Logo" class="logo" width="125px" height="125px" />
      </th>
      <th style="height: 130px"></th>
      <th style="height: 130px">Confirmation</th>
    </tr>
    <tr class="bg" style="
          background-color: #e5f2f8;
          height: 50px;
          border-bottom: 3px solid #3087b1;
        ">
      <td>Reservation Confirmation ${bookingNo}</td>
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
    ${
      flightNumber
        ? `
        <tr>
        <td style="width: 20%"><b>Flight Number:</b></td>
        <td>${flightNumber}</td>
      </tr>`
        : `${""}`
    }
    
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
    ${
      clientRef
        ? ` <tr>
      <td style="width: 20%"><b>Client Ref#</b></td>
      <td>${clientRef}</td>
    </tr>`
        : ""
    }
    <tr>
      <td style="width: 20%"><b>Vehicle Type:</b></td>
      <td>${vehicleType}</td>
    </tr>
    ${
      childSeats?.length > 0
        ? `<tr>
    <td style="width: 20%"><b>Child Seats:</b></td>
    <td> 
    ${
      childSeats?.length > 0
        ? `
    ${childSeats
      ?.map((val, idx) => {
        return Number(Object.values(childSeats[idx])[0]) > 0
          ? `${capitalizeFirstLetter(Object.keys(childSeats[idx])[0])} : ${
              Object.values(childSeats[idx])[0]
            } <br/>`
          : null;
      })
      ?.join()
      ?.replaceAll(",", "")}
   `
        : `${""}`
    }</td>
  </tr>`
        : ""
    }

    <tr>
      <td style="width: 20%"><b>Primary/Billing Contact:</b></td>
      <td>${accountNo || customerName}</td>
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
        ${
          addStop?.length > 0
            ? `
        <b>Stop:--</b> 
        ${addStop?.map((val) => `${val?.name} <br/>`)}
       `
            : `${""}`
        }
        <br/>
        ${
          dropLocation
            ? `
        <b>DO:--</b> 
        ${dropLocation}`
            : `${""}`
        }
       
      </td>
    </tr>
    ${
      numberOfHours
        ? !dropLocation
          ? `
        <tr>
        <td style="width: 20%"><b>No of hours:</b></td>
        <td>${numberOfHours}</td>
      </tr>`
          : ""
        : ""
    }
    
    <tr>
      <td style="width: 20%"><b>Notes/Comments:</b></td>
      <td>${notes}</td>
    </tr>
    
    <tr>
      <td style="width: 20%"><b>Charges & Fees</b></td>
      <td>Flat Rate</td>
      <td>$${flatRate?.toFixed(2)}</td>
    </tr>
   
    ${
      childSeatPrice
        ? `<tr>
      <td style="width: 20%"><b></b></td>
      <td>Child Seat Price</td>
      <td>$${childSeatPrice || 0}</td>
    </tr>`
        : `${""}`
    }
    ${
      trailerPrice
        ? `<tr>
      <td style="width: 20%"><b></b></td>
      <td>Trailer Price</td>
      <td>$${trailerPrice || 0}</td>
    </tr>`
        : `${""}`
    }
    ${
      allPrices?.adminFee
        ? `<tr>
      <td style="width: 20%"><b></b></td>
      <td>Admin Fee</td>
      <td>$${allPrices?.adminFee?.toFixed(2) || 0}</td>
    </tr>`
        : `${""}`
    }
    ${
      allPrices?.gst
        ? `<tr>
      <td style="width: 20%"><b></b></td>
      <td>GST</td>
      <td>$${allPrices?.gst?.toFixed(2) || 0}</td>
    </tr>`
        : `${""}`
    }
    ${
      allPrices?.extraStopCharges
        ? `<tr>
      <td style="width: 20%"><b></b></td>
      <td>Extra Stop Charges</td>
      <td>$${allPrices?.extraStopCharges?.toFixed(2) || 0}</td>
    </tr>`
        : `${""}`
    }
    ${
      Number(allPrices?.waitingTimeCharges)
        ? `<tr>
      <td style="width: 20%"><b></b></td>
      <td>Waiting Charges</td>
      <td>$${Number(allPrices?.waitingTimeCharges)?.toFixed(2) || 0}</td>
    </tr>`
        : `${""}`
    }
    ${
      allPrices?.toll
        ? `<tr>
      <td style="width: 20%"><b></b></td>
      <td>Toll</td>
      <td>$${allPrices?.toll?.toFixed(2) || 0}</td>
    </tr>`
        : `${""}`
    }
    ${
      allPrices?.perHour
        ? `<tr>
      <td style="width: 20%"><b></b></td>
      <td>Per Hour</td>
      <td>$${allPrices?.perHour?.toFixed(2) || 0}</td>
    </tr>`
        : `${""}`
    }
    ${
      allPrices?.cardCharges
        ? `<tr>
      <td style="width: 20%"><b></b></td>
      <td>Card Charges</td>
      <td>${allPrices?.cardCharges?.toFixed(2) || 0}%</td>
    </tr>`
        : `${""}`
    }
    ${
      allPrices?.stateTax
        ? `<tr>
      <td style="width: 20%"><b></b></td>
      <td>Extra Charges</td>
      <td>$${allPrices?.stateTax?.toFixed(2) || 0}</td>
    </tr>`
        : `${""}`
    }
    <tr>
   
  </tr>
    <td style="width: 20%"><b></b></td>
    <td>Reservation Total</td>
    <td>$${reservationTotal?.toFixed(2)}</td>
  </tr>
    <tr>
      <td style="width: 20%"><b></b></td>
      <td style="color: #018236"><b>Payments/Deposits:</b></td>
      <td style="color: #018236">$${paymentsDeposits?.toFixed(2)}</td>
    </tr>
    <tr>
      <td style="width: 20%"><b></b></td>
      <td style="color: #018236"><b>Authorizations </b></td>
      <td style="color: #018236">$${authorizations?.toFixed(2)}</td>
    </tr>
    <tr>
      <td style="width: 20%"><b></b></td>
      <td style="color: #ff0000"><b>Total Due:</b></td>
      <td style="color: #ff0000">$${totalDue?.toFixed(2)}</td>
    </tr>
  </table>
</body>
</html>`;
};

module.exports = rideDetailsPdfTemplate;
function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
