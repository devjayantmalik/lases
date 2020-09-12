const middlewares = require("../middlewares");
const { Router } = require("express");
const torrentService = require("../services/torrent");
const { celebrate, Joi } = require("celebrate");
const lowdb = require("../config/lowdb");

const router = Router();

module.exports = (app) => {
  app.use("/torrents", router);

  /**
   * Returns all completed downloads
   */
  router.get(
    "/",
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.attachUserTorrents,
    async (req, res, next) => {
      try {
        const pending = [lowdb.get(req.currentUser._id)] || [];
        const completed = req.torrents;
        return res.status(200).send({ completed, pending }).end();
      } catch (err) {
        return next(err);
      }
    }
  );

  /**
   * Adds a new torrent for downloading
   */
  router.post(
    "/",
    celebrate({
      body: Joi.object({
        magnet: Joi.string().required(),
      }),
    }),
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (req, res, next) => {
      try {
        const user = req.currentUser;
        const { magnet } = req.body;
        const info = await torrentService.getTorrentInfo(magnet);
        const { torrent, alreadyExists } = await torrentService.addTorrent(
          user,
          info
        );
        return res.status(200).json({
          torrent,
          status: alreadyExists ? "complete" : "downloading",
        });
      } catch (err) {
        return next(err);
      }
    }
  );
};
