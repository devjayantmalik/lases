const mongoose = require("mongoose");
const config = require("./index");

module.exports = () => {
  mongoose
    .connect(config.databaseUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database connected...");
    })
    .catch((err) => {
      console.error("Database connection failed...");
      throw err;
    });
};
