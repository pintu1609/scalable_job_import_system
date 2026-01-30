const ImportLog = require("../../model/importLog/importLog");
const Job = require("../../model/job/job");

exports.processJob = async (jobData, importLogId) => {
  try {
    const existing = await Job.findOne({
      source: jobData.source,
      externalJobId: jobData.externalJobId,
    });

    if (!existing) {
      await Job.create(jobData);

      await ImportLog.findByIdAndUpdate(importLogId, {
        $inc: { newJobs: 1 },
      });

      return;
    }

    if (existing.hash !== jobData.hash) {
      await Job.updateOne(
        { _id: existing._id },
        { $set: jobData }
      );

      await ImportLog.findByIdAndUpdate(importLogId, {
        $inc: { updatedJobs: 1 },
      });
    }
  } catch (err) {
    // 🔴 DUPLICATE KEY SAFE HANDLING
    if (err.code === 11000) {
      console.log("⚠️ Duplicate job skipped:", jobData.externalJobId);
      return;
    }

    // log unexpected errors
    await ImportLog.findByIdAndUpdate(importLogId, {
      $push: {
        failedJobs: {
          externalJobId: jobData.externalJobId,
          reason: err.message,
        },
      },
    });

    throw err;
  }
};


exports.histroy = async (query) => {
  try {
     const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Number(query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      ImportLog.find()
        .sort({ startedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ImportLog.countDocuments(),
    ]);
    console.log("🚀 ~ total:", total)
    console.log("🚀 ~ data:", data)

    return {
      page,
      limit,
      total,
      data,
    };
   
  } catch (err) {
    throw err;
  }
};