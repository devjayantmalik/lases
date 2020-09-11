const { Router } = require("express");
const auth = require("../services/auth");
const { celebrate } = require("celebrate");
const Joi = require("joi");

module.exports = (app) => {
  const routes = Router();
  app.use("/auth", routes);

  routes.post(
    "/signin",
    celebrate({
      body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().alphanum().required(),
      }),
    }),
    async (req, res, next) => {
      try {
        const { email, password } = req.body;
        const { user, token } = await auth.loginByCredentials(email, password);
        return res.status(200).json({ user, token });
      } catch (err) {
        return next(err);
      }
    }
  );

  routes.post(
    "/signup",
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().alphanum().required(),
      }),
    }),
    async (req, res, next) => {
      try {
        const { user, token } = await auth.registerNewUser(req.body);
        return res.status(200).json({ user, token });
      } catch (err) {
        return next(err);
      }
    }
  );
};
