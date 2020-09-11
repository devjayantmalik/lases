const UserModel = require("../models/User");
const CustomError = require("../utils/error");
const jwt = require("jsonwebtoken");

/**
 * Attaches current logged in user to req.currentUser
 * @param {*} req Express Request Object with token
 * @param {*} res Express Response Object
 * @param {*} next Express Next Function
 */
module.exports = async (req, res, next) => {
  try {
    const token = req.token;
    if (!token) {
      return next(
        CustomError("Authentication token missing.", 401, "AuthorizationError")
      );
    }

    // Decode the token information
    const decoded = jwt.decode(token);

    // Check if the user for the token exists
    const userRecord = await UserModel.findById({ _id: decoded._id });
    if (!userRecord) {
      return next(
        CustomError(
          "Invalid Authentication Token provided.",
          401,
          "AuthorizationError"
        )
      );
    }

    // Check if the token is whitelisted
    const isTokenAvailable = userRecord
      .toObject()
      .tokens.find((t) => t.token === token);
    if (!isTokenAvailable) {
      return next(
        CustomError(
          "Invalid Authentication Token provided.",
          401,
          "AuthorizationError"
        )
      );
    }

    // Refactor the user
    const user = userRecord.toObject();

    Reflect.deleteProperty(user, "password");
    Reflect.deleteProperty(user, "tokens");

    // Attach the user to request
    req.currentUser = user;

    return next();
  } catch (error) {
    return next(error);
  }
};
