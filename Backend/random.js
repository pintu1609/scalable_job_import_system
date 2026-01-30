const axios = require("axios");
const { parseXML } = require("./api/utils/xmlParser");
const Job = require("./api/model/job/job");
const db  = require("./api/middleware/db");

const main= async() => {
    console.log("running")
    await db.connectToDatabase();
    try{
await Job.create({
  source: "test",
  externalJobId: "test-1",
  title: "Test Job"
});   
}catch(err){
    console.log("🚀 ~ main ~ err:", err)
}
}
main();