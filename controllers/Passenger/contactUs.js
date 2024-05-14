const ContactForm = require("../../models/ContactForm");

const contactUs = async (req, res, next) => {
  try {
    const { name, email, phone, message, subject } = req.body;
    const contactForm = new ContactForm({
      name,
      email,
      phone,
      message,
      subject,
    });
    contactForm.save();
    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully!",
    });
  } catch (error) {
    console.log("Error while adding contact form:", error);
    next(error);
  }
};
module.exports = contactUs;
