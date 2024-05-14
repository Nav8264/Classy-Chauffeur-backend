const Agenda = require("agenda");
const { database } = require("./../config/keys.js");

const bookingReminderToChauffeur = require("../services/bookingReminderToChauffeur.js");
const updateDriverChecklist = require("../services/updateDriverChecklist.js");

let configureMongoDBObj = {
  db: {
    address: database,
    collection: "agendaJobs",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};
const agenda = new Agenda(configureMongoDBObj);

agenda.define("Ride Reminder Notification", async (job, done) => {
  const { chauffeurId } = job.attrs.data;
  bookingReminderToChauffeur(chauffeurId);
  done();
});

agenda.on("ready", async () => await agenda.start());

let graceful = () => {
  agenda.stop(() => process.exit(0));
};

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

module.exports = agenda;
