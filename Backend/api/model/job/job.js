const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  source: { type: String, required: true },
  externalJobId: { type: String, required: true },
  title: String,
  company: String,
  location: String,
  description: String,
  applyUrl: String,
  hash: String
}, { timestamps: true });

jobSchema.index({ source: 1, externalJobId: 1 }, { unique: true });

module.exports = mongoose.model("Job", jobSchema);
