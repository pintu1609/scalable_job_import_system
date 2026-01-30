const IORedis = require("ioredis");

let redis;

if (!redis) {
  redis = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,   
    enableReadyCheck: false,      
    keepAlive: 10000,

    retryStrategy(times) {
      return Math.min(times * 100, 3000);
    },
  });

  redis.on("connect", () => {
    console.log("✅ Redis connected");
  });

  redis.on("error", (err) => {
    if (
      err.code === "ECONNRESET" ||
      err.message?.includes("ECONNRESET")
    ) {
      return;
    }

    console.error("❌ Redis error:", err);
  });
}

module.exports = redis;
