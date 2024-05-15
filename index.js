const express = require("express");
const app = express();
const http = require("http").Server(app);
const mongoose = require("mongoose");
const chalk = require("chalk");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { port, hostIP } = require("./config/keys").host;
// const stripe = require ('./routes/stripe')
// const { accountSid, authToken } = require("./config/keys").twilio;
const bodyParser = require("body-parser");
const routes = require("./routes");
const { database } = require("./config/keys");
const socketIO = require("./socket/socketIO");
const paypal = require("paypal-rest-sdk");
const path = require("path");
require("./utils/agendaUtils");

// const notificationSocket = require("./socketIO");
// const twilio = require("twilio")(accountSid, authToken)

// app.use((req, res, next) => {
//   req.twilio = twilio;
//   next();
// });

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AZV6jx7u3jS-bvKI5-dM-1dboXgpwk0HVNlARpWj7REO95fyAbvWswPZbiffkBMs8okN77JUMDq-m0gp",
  client_secret:
    "EFhqstZj6dz9aeFZUE5mGJ5o0tRFtGF5H4KzkF3B6HaGYGOVLMhzOCnPTeJzwzP2mbmthLLAQFuZMt95",
});

var admin = require("firebase-admin");

var serviceAccount = require("./config/b-g-chauffeur-firebase-adminsdk-mb9gc-830eb05ade.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// paypal.configure({
//   mode: "sandbox", //sandbox or live
//   client_id:
//     "AQtMh1GoaEM5WQgRFilZ2Za5cXL-f3SUKDJ4Co65lH2u18cTDlCbeNMbQxPWaXwIpgB5eFyMZoqZ4Ekq",
//   client_secret:
//     "EItiiJuWD3WDdgJnq7M8gMoBdiEbAOpSD9ZM6kwrNojim6Mizfp4rsZn9d4e9FfsW2-A-J0S50X4fniu",
// });

app.use(cors());

const io = require("socket.io")(http, {
  cors: {
    origin: [
      "http://localhost:8000",
      "http://localhost:8000/",
      "http://localhost:5000",
      "http://127.0.0.1:5000",
      "https://bg-chauffeur-react-app.vercel.app/",
      "https://classy-chauffeurs.vercel.app/",
      "https://bg-chauffeur-react-app.vercel.app",
      "https://black-grandeur-chauffeur.web.app/",
      "https://black-grandeur-chauffeur.web.app",
      "https://bgc-admin.web.app/",
      "https://bgc-admin.web.app",
    ],
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json({ limit: "50mb", extended: true }));

app.use(express.urlencoded({ limit: "50mb", extended: true }));
const corsOptions = {
  origin: [
    "http://localhost:8000",
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "https://bg-chauffeur-react-app.vercel.app/",
    "https://bg-chauffeur-react-app.vercel.app",
    "https://bgc-admin.web.app/",
    "https://bgc-admin.web.app",
    "https://black-grandeur-chauffeur.web.app/",
    "https://black-grandeur-chauffeur.web.app",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
// app.use('/api/stripe',stripe)
app.use(cookieParser());
app.use(morgan("combined"));

app.use(routes);

app.get("/redirecting", (req, res) => {
  res.render("redirecting");
});

app.get("/success", (req, res) => {
  var payerId = req.query.PayerID;
  var paymentId = req.query.paymentId;

  var execute_payment_json = {
    payer_id: payerId,
  };
  paypal.payment.execute(
    paymentId,
    JSON.stringify(execute_payment_json),
    function (error, payment) {
      if (error) {
        res.redirect("ErrorExecutingPayment");
      } else {
        res.redirect(payment?.state);
      }
    }
  );
});

app.get("/cancel", (req, res) => {
  res.render("cancel");
});

// app.use(passport.initialize());
// app.use(passport.session());

// Connect to MongoDB
mongoose.set("useCreateIndex", true);
mongoose
  .connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() =>
    console.log(`${chalk.green("✓")} ${chalk.blue("MongoDB Connected!")}`)
  )
  .then(() => {
    const HOST = "127.0.0.1";
    // const HOST = "192.168.0.103";
    const PORT = 5000;
    http.listen(PORT, HOST, () => {
      console.log(
        `${chalk.green("✓")} ${chalk.blue(
          "Server Started on port"
        )} http://${chalk.bgMagenta.white(HOST)}:${chalk.bgMagenta.white(PORT)}`
      );
    });
    socketIO(io);
    // agenda(io);
  })
  .catch((err) => console.log(err));
