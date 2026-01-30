const axios = require("axios");
const ImportLog = require("../../model/importLog/importLog");
const jobQueue = require("../../queue/queue");
const { parseXML } = require("../helper");
const { generateHash } = require("../helper");
const dal = require("../dal");
const {toText} = require("../helper");


module.exports.fetchFeeds = async (feed) => {
  console.log("🚀 ~ feed:", feed)
  const log = await dal.create(ImportLog, {
    feedUrl: feed.feedUrl,
    startedAt: new Date(),
    totalFetched: 0,
    newJobs: 0,
    updatedJobs: 0,
    failedJobs: [],
  });
  console.log("🚀 ~ log:", log)
  console.log("🚀 ~ feed.feedUrl:", feed.feedUrl)
  const { data } = await axios.get(feed.feedUrl);
  const parsed = parseXML(data);
  const rawItems = parsed?.rss?.channel?.item ;
    const items = Array.isArray(rawItems)
    ? rawItems
    : rawItems
    ? [rawItems]
    : [];

  console.log("🚀 ~ items:", items.length)

  log.totalFetched = items.length;
  await log.save();

  for (const item of items) {
 
    await jobQueue.add("import", {
  importLogId: log._id,
  job: {
    source: feed.source,
    externalJobId: toText(item.guid),
    title: toText(item.title),
    company: toText(item["job_listing:company"]),
    location: toText(item["job_listing:location"]),
    description: toText(item.description),
    applyUrl: toText(item.link),
    hash: generateHash({
      guid: toText(item.guid),
      title: toText(item.title),
      link: toText(item.link),
    }),
  },
});
  }

  log.finishedAt = new Date();
  await log.save();
};
