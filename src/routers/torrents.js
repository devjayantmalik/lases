const middlewares = require("../middlewares");
const { Router } = require("express");
const torrentService = require("../services/torrent");
const { celebrate, Joi } = require("celebrate");
const CustomError = require("../utils/error");

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
        return res.status(200).send(req.torrents).end();
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
        magnet: Joi.string(),
        fileUrl: Joi.string(),
      }),
    }),
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    async (req, res, next) => {
      try {
        const user = req.currentUser;
        const { magnet, fileUrl } = req.body;
        if (!magnet && !fileUrl) {
          throw CustomError(
            "Please provide Magnet or .torrent file url.",
            400,
            "TorrentValidationError"
          );
        }
        const info = torrentService.getTorrentInfo(fileUrl, magnet);
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
