var admin = require("firebase-admin");
const Notification = require("../../models/Notification");

const sendNotifications = async ({
  title,
  body,
  img,
  receiverId,
  type,
  token,
  data,
}) => {
  try {
    await admin
      .messaging()
      .sendMulticast({
        tokens: [
          token,
          /* ... */
        ], // ['token_1', 'token_2', ...]
        notification: {
          title,
          body,
          imageUrl: img,
        },
        priority: "high",
        apns: {
          headers: {
            "apns-collapse-id": "solo_changed_administrator",
            "content-available": "1",
            "apns-priority": "10",
          },
          payload: {
            aps: {
              sound: "default",
            },
          },
        },

        data,
      })
      .then((res) => console.log("res", res?.responses[0], res?.responses))
      .catch((err) => console.log("err", err));

    if (receiverId) {
      const notif = new Notification({
        type,
        subject: title,
        message: body,
        avatar: img,
        receiver: receiverId,
      });

      await notif.save();

      console.log(notif, "new notif");
    }
  } catch (err) {
    console.log(err, "erooro");
  }
};

module.exports = sendNotifications;
