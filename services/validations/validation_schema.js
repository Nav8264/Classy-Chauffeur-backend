const Joi = require("joi");

const loginValidation = Joi.object({
  phone: Joi.number().required(),
  password: Joi.string().min(3).required(),
});

const registerValidation = Joi.object({
  phone: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(3).max(50),
});

const chauffeurRegisterValidation = Joi.object({
  name: Joi.string().required(),
  phone: Joi.number().required(),
  countryCode: Joi.string().required(),
  email: Joi.allow(),
  password: Joi.string().required().min(3).max(50),
  dob: Joi.date().required(),
  gender: Joi.string().required(),
  drivingExperience: Joi.any().required(),
  vehicleType: Joi.any().required(),
  licenseType: Joi.any().required(),
  licenseNo: Joi.any().required(),
  licenseExpiry: Joi.any().required(),

  bsbCode: Joi.any().required(),
  accountNumber: Joi.any().required(),
  nameOfHolder: Joi.any().required(),
  loginType: Joi.allow(),
  googleID: Joi.allow(),
  appleId: Joi.allow(),

  isOperator: Joi.allow(),
  companyName: Joi.allow(),
});

const createVehicleValidation = Joi.object({
  chauffeurID: Joi.required(),
  description: Joi.string().required(),
  vehicleName: Joi.string().required(),
  vehicleNumber: Joi.string().required(),
  vehicleType: Joi.any().required(),
  images: Joi.allow(),
});

const createRideValidation = Joi.object({
  chauffeurID: Joi.allow(),
  pickupLocation: Joi.required(),
  dropLocation: Joi.allow(),
  date: Joi.required(),
  rideTime: Joi.required(),
  status: Joi.allow(),
  salutation: Joi.allow(),
  firstName: Joi.allow(),
  lastName: Joi.allow(),
  countryCode: Joi.allow(),
  phoneNo: Joi.allow(),
  email: Joi.allow(),
  pickupPlaceId: Joi.allow(),
  dropPlaceId: Joi.allow(),
  rideMode: Joi.required(),
  rideType: Joi.required(),
  passengers: Joi.required(),
  addStop: Joi.allow(),
  luggage: Joi.required(),
  luggageCapacityLarge: Joi.allow(),
  luggageCapacitySmall: Joi.allow(),
  childSeats: Joi.allow(),
  paymentType: Joi.required(),
  vehicleType: Joi.allow(),
  customerId: Joi.allow(),
  price: Joi.allow(),
  vehicleId: Joi.allow(),
  flightId: Joi.allow(),
  flightNumber: Joi.allow(),
  flightDate: Joi.allow(),
  addTrailer: Joi.allow(),
  airportId: Joi.allow(),
  numberOfHours: Joi.allow(),
  returnPickupLocation: Joi.allow(),
  returnPickupPlaceId: Joi.allow(),
  returnDateAndTime: Joi.allow(),
  notes: Joi.allow(),
  paymentMethod: Joi.allow(),
  byAdmin: Joi.allow(),

  accountNo: Joi.allow(),
  billingContact: Joi.allow(),
  billingContactId: Joi.allow(),
  companyName: Joi.allow(),
  bookedBySalutation: Joi.allow(),
  bookedByFirstName: Joi.allow(),
  bookedByLastName: Joi.allow(),
  bookedByCountryCode: Joi.allow(),
  bookedByPhoneNo: Joi.allow(),
  bookedByEmail: Joi.allow(),
clientRef:Joi.allow(),
  timeZone: Joi.allow(),
});

const createPassengerValidation = Joi.object({
  serviceType: Joi.string().required(),
  pickupDate: Joi.date().required(),
  pickupTime: Joi.required(),
  pickupLocation: Joi.required(),
  stops: Joi.required(),
  dropOfLocation: Joi.required(),
  numberOfPassenger: Joi.number().required(),
  luggage: Joi.required(),
  childSeats: Joi.required(),
  numberOfHours: Joi.number(),
});

// const updateProspectValidation = Joi.object({
//   status: Joi.string().required(),
//   rejectionCause: Joi.string().allow(""),
//   role: Joi.string().allow(""),
// });
// const paymentValidation = Joi.object({
//   totalAmount: Joi.number().required(),
//   modeOfPayment: Joi.string().required(),
//   paymentType: Joi.string().required(),
//   partiallyPaidAmount: Joi.number().allow(""),
//   dueDate: Joi.number().allow(""),
//   chequeDate: Joi.date().allow(""),
//   notes: Joi.string().allow(""),
// });
// const categoryValidation = Joi.object({
//   name: Joi.string(),
//   tax: Joi.number().allow(""),
//   parent: Joi.string(),
// });
// const productValidation = Joi.object({
//   name: Joi.string().required(),
//   // price: {
//   //   wholesaler_price: Joi.number().required(),
//   //   retailer_price: Joi.number().required(),
//   //   distributor_price: Joi.number().required(),
//   //   myPrice: Joi.number().required(),
//   // },
//   description: Joi.string().required(),
//   // shipping_details: {
//   //   weight: Joi.number(),
//   //   height: Joi.number(),
//   //   width: Joi.number(),
//   //   depth: Joi.number(),
//   // },
//   category: Joi.string().required(),
//   subCategory: Joi.string().allow(""),

//   // inventory: Joi.number().required(),
//   // sku: Joi.string().required(),
//   // attributesVal: Joi.string().required(),
//   attributes: Joi.string().required(),
// });

// const orderValidation = Joi.object({
//   productData: Joi.array().required(),
//   paymentmethod: Joi.string().allow(""),
//   type: Joi.string(),
//   address: Joi.object({
//     address_line_1: Joi.string(),
//     address_line_2: Joi.string(),
//     city: Joi.string(),
//     country_code: Joi.string(),
//     postal_code: Joi.string(),
//     state_code: Joi.string(),
//     state: Joi.string(),
//   }),
// });

// const skuValidation = Joi.object({
//   sku: Joi.string().required(),
//   price: {
//     wholesaler_price: Joi.number().required(),
//     retailer_price: Joi.number().required(),
//     distributor_price: Joi.number().required(),
//     myPrice: Joi.number().required(),
//   },
//   attributesVal: Joi.string().required(),
//   inventory: Joi.number().required(),
//   barcode: Joi.string().required(),
//   volume: Joi.allow(""),
// });

// const contactUsValidation = Joi.object({
//   firstName: Joi.string().required(),
//   lastName: Joi.string().required(),
//   phone: Joi.string().required(),
//   email: Joi.string().email().required(),
//   description: Joi.string().required(),
// });

// const cartValidation = Joi.object({
//   items: {
//     productId: Joi.number().required(),
//     quantity: Joi.number().required(),
//   },
// });

// const wishlistValidation = Joi.object({
//   items: {
//     productId: Joi.number().required(),
//     quantity: Joi.number().required(),
//   },
// });

// const updateUserPrivacyValidation = Joi.object({
//   is_private: Joi.boolean(),
// });

// const loginAdminValidation = Joi.object({
//   email: Joi.string().email().required(),

//   password: Joi.string().min(2).required(),
// });

// const emailValidation = Joi.object({
//   email: Joi.string().email().lowercase().required(),
// });

// const passwordValidation = Joi.object({
//   password: Joi.string().min(2).required(),
// });

// const createPostValidation = Joi.object({
//   name: Joi.string().allow("").optional(),
//   price: Joi.number(),
//   mentions: Joi.string(),
//   media_type: Joi.string().valid("image", "video", "audio", "text").required(),
//   type: Joi.string().valid("open", "subscription", "premium").required(),
//   is_highlight: Joi.boolean(),
//   thumbnail: Joi.any(),
// });

// const postRatingValidation = Joi.object({
//   rating: Joi.number().greater(0).less(6).required(),
// });

// const createMessageGroupValidation = Joi.object({
//   usersList: Joi.array(),
//   type: Joi.string().valid("single", "group").required(),
//   name: Joi.string().min(3).max(30),
//   description: Joi.string().min(2).max(1000),
// });

// const createFollowRequestUpdateValidation = Joi.object({
//   status: Joi.string().valid("accepted", "rejected").required(),
// });

// const getMessageGroupValidation = Joi.object({
//   sender: Joi.string()
//     .regex(/^[0-9a-fA-F]{24}$/)
//     .required(),
//   receiver: Joi.string()
//     .regex(/^[0-9a-fA-F]{24}$/)
//     .required(),
// });

// const getPostsStatsValidation = Joi.object({
//   id: Joi.string().required(),
// });

// const newMessageValidation = Joi.object({
//   conversationId: Joi.string()
//     .regex(/^[0-9a-fA-F]{24}$/)
//     .required(),
//   type: Joi.string().valid("image", "video", "audio", "text").required(),
//   message: Joi.string().required(),
//   sender: Joi.string()
//     .regex(/^[0-9a-fA-F]{24}$/)
//     .required(),
// });

// const newNotificationValidation = Joi.object({
//   actor: Joi.string()
//     .regex(/^[0-9a-fA-F]{24}$/)
//     .required(),
//   verb: Joi.string()
//     .valid(
//       "post",
//       "rate",
//       "comment",
//       "follow-request",
//       "follow-accept",
//       "post-mention"
//     )
//     .required(),
//   object: Joi.string().required(),
//   receiver: Joi.string()
//     .regex(/^[0-9a-fA-F]{24}$/)
//     .required(),
// });

// const createGiftValidation = Joi.object({
//   name: Joi.string().required(),
//   cost: Joi.number().required(),
// });
// const paymentTypeValidation = Joi.object({
//   type: Joi.string().required(),
//   price: Joi.number().required(),
// });

module.exports = {
  registerValidation,
  loginValidation,
  // updateProspectValidation,
  // categoryValidation,
  // productValidation,
  // wishlistValidation,
  // contactUsValidation,
  // orderValidation,
  // skuValidation,
  // paymentValidation,
  // loginAdminValidation,
  chauffeurRegisterValidation,
  createVehicleValidation,
  createRideValidation,
  createPassengerValidation,
};
