const { Queue } = require("bullmq");
const redis = require("../middleware/radis");
const jobQueue = new Queue("job-import", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

module.exports = jobQueue;
