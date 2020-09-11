const CustomError = require("../utils/error");
const jwt = require("jsonwebtoken");
const config = require("../config");

const getTokenFromHeaders = (req) => {
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Token") ||
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  }

  return null;
};

/**
 * Attaches token to req.token if available else calls next with AuthorizationError
 * @param {*} req Express Request Object
 * @param {*} res Express Response Object
 * @param {*} next Express Next Function
 */

module.exports = async (req, res, next) => {
  try {
    const token = getTokenFromHeaders(req);
    if (!token) {
      return next(
        CustomError(
          "Please provide authentication token to login.",
          401,
          "AuthorizationError"
        )
      );
    }

    // Validate the token
    const isValid = jwt.verify(token, config.jwt.secret);
    if (!isValid) {
      return next(
        CustomError(
          "Invalid Authentication Token, please login again.",
          401,
          "AuthorizationError"
        )
      );
    }

    // Attach the token to request
    req.token = token;

    return next();
  } catch (err) {
    return next(
      CustomError("Authentication Token Expired", 401, "TokenExpiredError")
    );
  }
};
