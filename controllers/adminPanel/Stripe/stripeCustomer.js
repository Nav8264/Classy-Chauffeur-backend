const Customer = require("../../../models/Customer");
const stripe = require("../../../utils/stripe");

const getCustomer = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await Customer.findOne({ email });
    if (!user || !user?.stripe_customer_id)
      return res.status(500).json({
        message: "This user is not a customer yet",
        success: false,
      });

    const customer = await stripe.customers.retrieve(user.stripe_customer_id);

    res.json({
      message: "Customer retrieved successfully",
      success: true,
      data: customer,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const createCustomer = async (req, res, next) => {
  const { email, name } = req.body;

  try {
    const user = await Customer.findOne({ email });
    if (user.stripe_customer_id)
      return res.status(500).json({
        message: "This user is already a customer",
        success: false,
      });

    const customer = await stripe.customers.create({
      email,
      name,
    });

    // update user
    user.stripe_customer_id = customer.id;
    await user.save();

    res.json({
      message: "Customer created successfully",
      success: true,
      data: customer,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const linkPaymentMethod = async (req, res, next) => {
  const { customerID, paymentMethodID } = req.body;

  try {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodID, {
      customer: customerID,
    });

    res.json({
      message: "Payment method linked successfully",
      success: true,
      data: paymentMethod,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getPaymentMethods = async (req, res, next) => {
  const { customerID } = req.query;

  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerID,
      type: "card",
    });

    res.json({
      message: "Payment methods retrieved successfully",
      success: true,
      data: paymentMethods,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  getCustomer,
  createCustomer,
  linkPaymentMethod,
  getPaymentMethods,
};
