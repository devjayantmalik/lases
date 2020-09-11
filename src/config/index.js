const dotenv = require("dotenv");

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("🔥 Couldn't find .env file 🔥");
}

// Set some defaults
process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || 3000;

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  databaseUrl: process.env.MONGODB_URI,

  jwt: {
    secret: process.env.JWT_SECRET,
    algorithm: "HS256",
  },
};
