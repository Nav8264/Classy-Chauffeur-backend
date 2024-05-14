const { Schema, model } = require("mongoose");

const Ride = new Schema(
  {
    bookingNo: {
      type: String,
    },
    accountNo: {
      type: String,
    },
    billingContact: {
      type: String,
    },
    billingContactId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    companyName: {
      type: String,
    },
    bookedBySalutation: {
      type: String,
    },
    bookedByFirstName: {
      type: String,
    },
    bookedByLastName: {
      type: String,
    },
    bookedByCountryCode: {
      type: String,
    },
    bookedByPhoneNo: {
      type: String,
    },
    bookedByEmail: {
      type: String,
    },
    salutation: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    phoneNo: {
      type: Number,
    },
    email: {
      type: String,
    },
    date: {
      type: String,
    },

    time: {
      type: Date,
    },
    clientID: {
      type: Schema.Types.ObjectId,
      ref: "Passenger",
    },
    chauffeurID: {
      type: Schema.Types.ObjectId,
      ref: "Chauffeur",
    },

    price: {
      type: Number,
    },

    chauffeurPrice: {
      type: Number,
    },
    fixedChauffeurPrice: {
      type: Boolean,
      default: false,
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },

    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "vehicle",
    },
    pickupLocation: {
      type: Object,
      required: true,
    },
    dropLocation: {
      type: Object,
    },

    addStop: [
      {
        type: Object,
      },
    ],

    paymentType: {
      type: String,
      enum: ["perKm", "perHour"],
    },

    paymentStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Completed"],
    },

    paymentMethod: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Stripe", "Cash", "Card", "Invoice", "Paypal"],
    },

    totalRideDistance: {
      type: Number,
    },

    numberOfHours: {
      type: Number,
    },

    chauffeurStatus: {
      type: String,
      default: "Pending",
      enum: [
        "Pending",
        "Started",
        "Completed",
        "Rejected",
        "Booked",
        "On-the-way",
        "Arrived",
      ],
    },

    status: {
      type: String,
      default: "Pending",
      enum: [
        "Pending",
        "Started",
        "Completed",
        "Cancelled",
        "Booked",
        "FarmedOut",
        "NoShow",
        "CancelledByCustomer",
      ],
    },
    onlineRideStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Rejected", "Accepted"],
    },
    rejectedBy: [
      {
        _id: false,
        type: String,
      },
    ],
    rideMode: {
      type: String,
      enum: ["One-Way-Ride", "Round-Trip", "Instant-Ride"],
    },
    rideType: {
      type: String,
      enum: ["Point-to-Point", "Airport-Pickup", "Airport-Drop", "Event"],
    },
    passengers: {
      type: Number,
    },
    luggage: {
      type: Number,
    },
    luggageCapacityLarge: {
      type: Number,
    },
    luggageCapacitySmall: {
      type: Number,
    },
    childSeats: [{ type: Object }],

    vehicleType: {
      type: String,
    },
    flightId: {
      type: String,
    },
    flightNumber: {
      type: String,
    },
    flightDate: {
      type: String,
    },
    airportId: {
      type: Schema.Types.ObjectId,
      ref: "Airports",
    },

    addTrailer: {
      type: Boolean,
    },
    flightDetails: {
      type: Object,
    },

    returnFlight: {
      type: Boolean,
      default: false,
    },

    returnRideId: {
      type: Schema.Types.ObjectId,
      ref: "ride",
    },

    invoiceSent: {
      type: Boolean,
      default: false,
      required: true,
    },

    allPrices: {
      type: Schema.Types.ObjectId,
      ref: "ridePrices",
    },

    notes: {
      type: String,
    },

    byAdmin: {
      type: Boolean,
      default: false,
    },

    timeZone: {
      type: String,
    },
    passengerRating: {
      type: Number,
    },
    clientRef: {
      type: String,
    },
  },

  { timestamps: true }
);

module.exports = model("ride", Ride, "ride");
