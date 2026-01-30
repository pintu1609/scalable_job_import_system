const { Worker } = require("bullmq");
const redis = require("../../middleware/radis");
const { processJob } = require("../../service/import/importService");
const ImportLog = require("../../model/importLog/importLog");

let workerStarted = false;

exports.startWorker = () => {
  if (workerStarted) return;
  workerStarted = true;

  console.log("🚀 ~ startWorker ~ workerStarted:", workerStarted);
  new Worker(
    "job-import",
    async (job) => {
      console.log("🚀 ~ ob.data.importLogId:", job.data.importLogId);
      console.log("🚀 ~ job.data.job:", job.data.job);
      try {
        await processJob(job.data.job, job.data.importLogId);
      } catch (err) {
        await ImportLog.findByIdAndUpdate(job.data.importLogId, {
          $push: {
            failedJobs: {
              externalJobId: String(job.data.job.externalJobId),
              reason: err.message,
            },
          },
        });
        throw err;
      }
    },
    {
      connection: redis,
      concurrency: Number(process.env.WORKER_CONCURRENCY || 10),
    },
  );
};
