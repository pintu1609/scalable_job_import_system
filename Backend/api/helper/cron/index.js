const cron = require("node-cron");
const feeds = require("../../utils/dataSource/feed");
const { fetchFeeds } = require("./fetchCron");

let cronStarted = false;

exports.startCron = () => {
  if (cronStarted) return;
  cronStarted = true;
  console.log("🚀 ~ startCron ~ cronStarted:", cronStarted);

  cron.schedule(
    "0 * * * *",
    async () => {
      try {
        console.log("Running job import cron");
        for (const feed of feeds) {
          fetchFeeds(feed);
        }

        console.log("Job import cron finished");
      } catch (err) {
        console.error("Cron failed:", err);
      }
    },
    {
      timezone: "Asia/Kolkata",
    },
  );
};

// const feeds = require("../../utils/dataSource/feed");
// const { fetchFeeds } = require("./fetchCron");
// const db = require("../../middleware/db");

// (async () => {
//   try {
//     console.log("Running job import once");

//     await db.connectToDatabase();

//     for (const feed of feeds) {
//       await fetchFeeds(feed);
//     }

//     console.log("Job import finished");
//     process.exit(0);
//   } catch (err) {
//     console.error("Import failed:", err);
//     process.exit(1);
//   }
// })();
