const { Router } = require("express");
const auth = require("./auth");
const user = require("./user");

module.exports = () => {
  const app = Router();

  auth(app);
  user(app);

  return app;
};
