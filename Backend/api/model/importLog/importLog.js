const  mongoose = require("mongoose");

const importLogSchema = new mongoose.Schema({
  feedUrl: String,
  startedAt: Date,
  finishedAt: Date,
  totalFetched: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: [
    { externalJobId: String, reason: String }
  ]
});

module.exports = mongoose.model("ImportLog", importLogSchema);
