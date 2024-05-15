const express = require("express");
const { ObjectId } = require("mongoose").Types;
const stripe = require("stripe");
const Ride = require("../../../models/Ride");
require("dotenv").config();
const Stripe = stripe(process.env.STRIPE_KEY);
const router = express.Router();

let rideId = [];
let vehiclePrice = [];
let vehicleId = [];

let firstName = [];
let lastName = [];
let countryCode = [];
let phoneNo = [];
let email = [];

router.post("/create-checkout-session", async (req, res) => {
  console.log("dfdddsfsfwefewfwe", req.body?.booking?.price);

  rideId.splice(0, 1);
  vehiclePrice.splice(0, 1);
  vehicleId.splice(0, 1);

  rideId.push(req.body?.booking?.rideId);
  vehiclePrice.push(req.body?.booking?.price);
  vehicleId.push(req.body?.booking?._id);

  firstName.push(req.body?.booking?.firstName);
  lastName.push(req.body?.booking?.lastName);
  countryCode.push(req.body?.booking?.countryCode);
  phoneNo.push(req.body?.booking?.phoneNo);
  email.push(req.body?.booking?.email);

  const price =
    req?.body?.booking?.price && parseInt(req.body?.booking?.price) * 100;

  const className = req.body?.booking?.category;
  const seatCapacity = req.body?.booking?.capacity;
  const luggageQuantity = req.body?.booking?.luggageQuantity;

  const session = await Stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "aud",
          unit_amount: price,
          product_data: {
            name: className,
            description: `You have booked a ${className} which has ${seatCapacity} seats and you can put ${luggageQuantity} bag `,
          },
        },
        quantity: 1,
      },
    ],

    allow_promotion_codes: false,
    mode: "payment",
    success_url: `https://classy-chauffeurs.vercel.app/booking/loading/${req.body?.booking?._id}`,
    cancel_url: `https://classy-chauffeurs.vercel.app/vehicle`,

    // success_url: `http://localhost:3000/booking/loading/${req.body?.booking?._id}`,
    // cancel_url: `http://localhost:3000/vehicle`,
  });

  await Ride.findOneAndUpdate(
    { _id: ObjectId(rideId?.[0]) },
    {
      vehicleId: req.body?.booking?._id,
      price: req.body?.booking?.price,
      chauffeurPrice: req.body?.booking?.priceice,
    },
    { new: true }
  );

  console.log("session", session);
  res.send({ url: session.url });
});

// ------------------------------webHook-start-----------
// This is your Stripe CLI webhook secret for testing your endpoint locally.
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let eventStatus = req.body.data.object.status;
    let statues = req.body.data.object.status;
    let stripePaymentStatus = statues == "succeeded";

    console.log(
      "stripePaymentStatus",
      stripePaymentStatus,
      "actual statusss ",
      req.body.data.object.status
    );

    console.log("first", rideId, vehicleId?.[0], vehiclePrice?.[0]);

    // if (stripePaymentStatus) {
    //   await Ride.findOneAndUpdate(
    //     { _id: ObjectId(rideId?.[0]) },
    //     {
    //       paymentStatus: "Completed",
    //       vehicleId: vehicleId?.[0],
    //       price: vehiclePrice?.[0],
    //     },
    //     { new: true }
    //   );

    //   if (firstName?.length != 0) {
    //     await Ride.findOneAndUpdate(
    //       { _id: ObjectId(rideId?.[0]) },
    //       {
    //         firstName: firstName?.[0],
    //         lastName: lastName?.[0],
    //         countryCode: countryCode?.[0],
    //         phoneNo: phoneNo?.[0],
    //         email: email?.[0],
    //       },
    //       { new: true }
    //     );
    //   }
    // }
    res.send();
  }
);
// ------------------------------webHook-end-----------

module.exports = router;

// const express = require("express");
// const { ObjectId } = require("mongoose").Types;
// const stripe = require("stripe");
// const Ride = require("../../../models/Ride");
// require("dotenv").config();
// const Stripe = stripe(process.env.STRIPE_KEY);
// const router = express.Router();
// let value = [];
// router.post("/create-checkout-session", async (req, res) => {
//   // console.log(req.body?.booking);
//   value.push(req.body?.booking.booking?.userRideId);
//   const price = req.body?.booking.booking?.price * 100;
//   const className = req.body?.booking.booking?.category;
//   const seatCapacity = req.body?.booking.booking?.capacity;
//   const luggageQuantity = req.body?.booking.booking?.luggageQuantity;

//   const session = await Stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: [
//       {
//         price_data: {
//           currency: "aud",
//           unit_amount: price,
//           product_data: {
//             name: className,
//             description: `You have booked a ${className} which has ${seatCapacity} seats and you can put ${luggageQuantity} bag `,
//           },
//         },
//         quantity: 1,
//       },
//     ],

//     allow_promotion_codes: true,
//     mode: "payment",
//     success_url: `http://127.0.0.1:3000/booking/myRides`,
//     cancel_url: `http://127.0.0.1:3000/vehicle`,
//   });
//   res.send({ url: session.url });
// });

// // ------------------------------webHook-start-----------
// // This is your Stripe CLI webhook secret for testing your endpoint locally.
// const endpointSecret =
//   "whsec_50dcbf11b46ea5883dcdecb5739237fade4f2f8e90883c50d2473b8525c81566";

// // router.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
// //   const sig = req.headers['stripe-signature'];
// //  let data;
// //  let eventType
// //  if(endpointSecret){
// //    let event;
// //   try {
// //     event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
// //     console.log('WebHook Verified')
// //   } catch (err) {
// //     console.log(`Webhook Error: ${err.message}`)
// //     res.status(400).send(`Webhook Error: ${err.message}`);
// //     return;
// //   }
// //   data=event.data.object;
// //   eventType=event.type
// // }else{
// //   data=req.body?.booking.data.object;
// //   eventType=req.body?.booking.type
// // }

// //   // Handle the event
// //   if(eventType==="payment_intent.succeeded"){
// //     console.log('yoyo', yoyo)
// //     stripe.customers
// //     .retrive(data.customer)
// //     .then((customer)=>{
// //       console.log('customer', customer)
// //       console.log('data', data)
// //     }).catch((err)=>{
// //       console.log('this in error >>', err)
// //     })
// //   }
// //   // Return a 200 res to acknowledge receipt of the event
// //   res.send().end();
// // });
// // ------------------------------webHook-end-----------

// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   async (req, res) => {
//     console.log("reqqqqq", req.body?.booking);
//     try {
//       const sig = req.headers["stripe-signature"];

//       let event;
//       // if(endpointSecret){
//       //   try {
//       //     event = stripe.webhooks.constructEvent(req.body?.booking, sig, endpointSecret);
//       //     console.log('event', event)
//       //   } catch (err) {
//       //     res.status(400).send(`Webhook Error: ${err.message}`);
//       //     return;
//       //   }
//       // }else{
//       // }
//       let eventStatus = req.body?.booking.type;
//       let statues = req.body?.booking.data.object.status;
//       let stripePaymentStatus =
//         eventStatus === "payment_intent.succeeded" && statues === "succeeded";
//       console.log("statuesiiii", statues);
//       console.log("statusuuu", eventStatus);
//       console.log("paymentStatus", stripePaymentStatus);
//       if (stripePaymentStatus) {
//         console.log("simranValue", value?.[0]);
//         console.log("c", value?.?.[0]);

//         await Ride.findOneAndUpdate(
//           { _id: ObjectId(`${value?.?.[0]}`) },
//           { paymentStatus: "Completed" },
//           { new: true }
//         );
//       }

//       // Handle the event
//       // switch (event.type) {
//       //   case 'payment_intent.payment_failed':
//       //     const paymentIntentPaymentFailed = event.data.object;
//       //     console.log('paymentIntentPaymentFailed', paymentIntentPaymentFailed)
//       //     // Then define and call a function to handle the event payment_intent.payment_failed
//       //     break;
//       //   case 'payment_intent.succeeded':
//       //     const paymentIntentSucceeded = event.data.object;
//       //     console.log('paymentIntentSucceeded', paymentIntentSucceeded)

//       //     // Then define and call a function to handle the event payment_intent.succeeded
//       //     break;
//       //   // ... handle other event types
//       //   default:
//       //     console.log(`Unhandled event type ${event.type}`);
//       // }

//       // Return a 200 res to acknowledge receipt of the event
//       res.send();
//     } catch (err) {
//       console.log("err", err);
//     }
//   }
// );

// module.exports = router;
