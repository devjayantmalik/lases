const UserModel = require("../models/User");
const config = require("../config");
const CustomError = require("../utils/error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getToken = (userObject) => {
  // Generate Auth Token
  return jwt.sign(userObject, config.jwt.secret, {
    algorithm: config.jwt.algorithm,
    expiresIn: 60 * 60 * 12 * 10,
  });
};

const loginByCredentials = async (email, password) => {
  // Check if the user with provided email exists
  const userRecord = await UserModel.findOne({ email });
  if (!userRecord) {
    throw CustomError(
      "Invalid Credentials provided.",
      400,
      "AuthenticationError"
    );
  }

  // Validate User Password
  const isValid = await bcrypt.compare(password, userRecord.password);
  if (!isValid) {
    throw CustomError(
      "Invalid Credentials provided.",
      400,
      "AuthenticationError"
    );
  }

  const userObject = userRecord.toObject();
  // Remove Password from User
  Reflect.deleteProperty(userObject, "password");
  Reflect.deleteProperty(userObject, "tokens");

  // Generate Auth Token
  const token = getToken(userObject);

  // Add token to user
  userRecord.tokens.push({ token });

  // Save the user
  await userRecord.save();

  return { user: userObject, token: token };
};

const registerNewUser = async (user) => {
  // Make sure the exists
  const isExists = await UserModel.findOne({ email: user.email });
  if (isExists) {
    throw CustomError("User already exists.", 400, "AuthenticationError");
  }

  // Create new user instance
  const userRecord = new UserModel(user);

  // Hash User Password
  userRecord.password = await bcrypt.hash(user.password, 8);

  // Create User object
  const userObject = userRecord.toObject();
  Reflect.deleteProperty(userObject, "password");
  Reflect.deleteProperty(userObject, "tokens");

  // Generate Auth Token
  const token = getToken(userObject);

  // Add token to user
  userRecord.tokens.push({ token: token });

  // Save the user
  await userRecord.save();

  return { user: userObject, token: token };
};

module.exports = { loginByCredentials, registerNewUser };
