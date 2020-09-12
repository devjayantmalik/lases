const fs = require("fs");
const parser = require("parse-torrent");
const WebTorrent = require("webtorrent");
const TorrentModel = require("../models/Torrent");
const humanize = require("humanize");
const UserModel = require("../models/User");
const CustomError = require("../utils/error");
const lowdb = require("../config/lowdb");

/**
 * Parse a torrent from file and returns its info.
 * @param {*} filepath Location to .torrent file, e.g /tmp/file.torrent
 * @param {*} magnet Magnet URL of torrent file, e.g magnet://?...
 */
function getTorrentInfo(filepath, magnet) {
  let torrent = null;
  if (!!filepath) {
    torrent = parser(fs.readFileSync(filepath));
  }

  if (!!magnet) {
    torrent = parser(magnet);
  }

  // Attach Magnet uri to torrent.
  torrent.magnet = parser.toMagnetURI(torrent);

  return torrent;
}

/**
 * Downloads a torrent to provided ./storage/user_id folder
 * @param {*} user A User Object, with _id, e.g {_id: "dxdedsdf"}
 * @param {*} torrent A Parsed torrent Object
 * @param {*} callback Executes the function with added torrent, and error if any
 */

function addTorrent(user, torrent) {
  return new Promise(async (resolve, reject) => {
    try {
      /**
       * Torrent might already be downloaded by someone else, so check it out.
       */

      // Get the user information
      const currentUser = await UserModel.findById({ _id: user._id });

      const existingTorrent = await TorrentModel.findOne({
        hash: torrent.infoHash,
      });

      if (!!existingTorrent) {
        // Check if user is again downloading the torrent, when the torrent is already available.
        const isDuplicate = currentUser.torrents.find(
          (i) => i.hash === torrent.infoHash
        );
        if (!isDuplicate) {
          throw CustomError("Torrent already exists.", 400, "DuplicateTorrent");
        }

        // There is no duplicate torrent found, now let's add the torrent to user torrents list.
        currentUser.torrents.push({ existingTorrent });
        await currentUser.save();

        return { torrent: existingTorrent.toObject(), alreadyExists: true };
      }

      /**
       * You need to download the torrent now, because it is new torrent.
       */
      const client = new WebTorrent();

      client.add(
        torrent.magnet,
        { path: `./storage`, name: torrent.infoHash },
        async (t) => {
          /**
           * Update the torrent download progress
           */
          t.on("download", (bytes) => {
            lowdb
              .set(user._id, {
                name: torrent.name,
                hash: torrent.infoHash,
                downloaded: humanize(t.downloaded),
                downloadSpeed: t.downloadSpeed,
                uploaded: humanize(t.uploaded),
                uploadSpeed: t.uploadSpeed,
              })
              .write();
          });

          /**
           * Save the torrent to database, on completion.
           */
          t.on("done", async () => {
            // Create a new torrent in database
            const model = new TorrentModel({
              name: torrent.name,
              hash: torrent.infoHash,
              files: torrent.files,
              magnet: torrent.magnet,
              size: humanize(torrent.length),
              createdOn: torrent.created,
              createdBy: torrent.createdBy,
            });

            await model.save();

            // Remove from lowdb
            lowdb.get(user._id).remove().write();

            // Add the torrent to user torrents list
            currentUser.torrents.push({ ...model.toObject() });
            await currentUser.save();
          });

          return resolve({ torrent: torrent, alreadyExists: false });
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
}

module.exports = { addTorrent, getTorrentInfo };
