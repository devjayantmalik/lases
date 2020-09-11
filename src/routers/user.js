const middlewares = require("../middlewares");
const Router = require("express").Router;

const router = Router();

module.exports = (app) => {
  app.use("/users", router);

  router.get(
    "/me",
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    (req, res) => {
      return res.send(req.currentUser);
    }
  );
};
