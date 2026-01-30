const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");
const { XMLParser } = require("fast-xml-parser");

exports.getAccessToken = (body) => {
  return jwt.sign(body, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRY_DAY,
  });
};

exports.getRefreshToken = (body) => {
  return jwt.sign(body, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY_DAY,
  });
};

exports.getOtp = () => {
  return Math.floor(
    Math.pow(10, 6 - 1) +
      Math.random() * (Math.pow(10, 6) - Math.pow(10, 6 - 1) - 1),
  );
};

exports.generateHash = (payload) =>
  crypto.createHash("md5").update(JSON.stringify(payload)).digest("hex");

exports.toText = (value) => {
  if (!value) return "";
  if (typeof value === "object" && value.text) return value.text;
  return String(value);
};

exports.parseXML = (xml) => {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      textNodeName: "text",
      trimValues: true,
      parseTagValue: true,
      parseAttributeValue: true,
    });

    return parser.parse(xml);
  } catch (error) {
    console.error("XML Parse Error:", error.message);
    throw new Error("Invalid XML response");
  }
};
