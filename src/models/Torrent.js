const mongoose = require("mongoose");

const TorrentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    hash: {
      type: String,
      required: true,
      index: true,
    },
    size: {
      type: String,
      required: true,
    },
    files: [],
    magnet: {
      type: String,
      required: true,
    },
    createdOn: String,
    createdBy: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Torrent", TorrentSchema);
