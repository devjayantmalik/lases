const UserModel = require("../models/User");
const CustomError = require("../utils/error");

const attachUserTorrents = async (req, res, next) => {
  try {
    const user = await UserModel.findById({ _id: req.currentUser._id });

    if (!user) {
      throw CustomError("Invalid User provided.", 401, "AuthorizationError");
    }

    req.torrents = user.torrents || [];

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = attachUserTorrents;
