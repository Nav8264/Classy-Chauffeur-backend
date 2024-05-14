const OffersDays = require("../../../models/Offers");
const createError = require("http-errors");

const addOffers = async (req, res, next) => {
  try {
    const { offerDays, autoAssign } = req.body;

    const pastOffer = await OffersDays.find();

    if (!offerDays && autoAssign === undefined) {
      //   here we get offer days.

      res.json({
        message: "Offer days fetched successfully.",
        data: pastOffer[0],
      });
    } else {
      if (pastOffer?.length != 0) {
        /// if offer days already exists then updating the offer days.
        const response = await OffersDays.findOneAndUpdate(
          { _id: pastOffer[0]._id },
          {
            days: offerDays || pastOffer[0]?.days,
            autoAssign:
              autoAssign === undefined ? pastOffer[0]?.autoAssign : autoAssign,
          },
          { new: true }
        );

        res.json({
          message: "Offer days updated successfully.",
          data: response,
        });
      } else {
        /// other wise creating new/first one.

        const newOfferDays = new OffersDays({
          days: offerDays,
          autoAssign,
        });

        await newOfferDays.save();

        res.json({
          message: "Offer days created successfully.",
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

module.exports = addOffers;
