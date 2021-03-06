const { Router } = require("express");
const auth = require("./auth");
const user = require("./user");
const torrents = require("./torrents");

module.exports = () => {
  const app = Router();

  auth(app);
  user(app);
  torrents(app);

  return app;
};
