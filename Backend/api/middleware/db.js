
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
let dbConnection;

const options = {
  dbName: process.env.DB_NAME,
};

exports.connectToDatabase = async (req, res, next) => {
  const mongoURI =
    process.env.DB_STRING
  if (dbConnection) {
    console.log("----DB----PREVIOUS-CONNECTION----------------");
    next();
  } else {
    mongoose.connect(mongoURI, options).then(
      (db) => {
        console.log("----DB----NEW-CONNECTION----------------");
        dbConnection = db.connections[0].readyState;
        console.log("----DB----NEW-CONNECTION-INIT----------------");
        next();
      },
      (err) => {
        console.log("----DB----ERROR-CONNECTION----------------");
        console.log(err);
        return res.send({
          status_code: 409,
          success: false,
          message: "DB connection failure",
        });
      }
    );
  }
};
