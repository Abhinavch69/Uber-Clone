const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  const { email, password, fullname } = req.body;

  //userModel.hashPassword is used instad of user.hashPassword because hashPassword is a static method defined in the user model, which can be called directly on the model itself without needing an instance of a user.
  const hashedPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    email,
    password: hashedPassword,
    firstname: fullname.firstname,
    lastname: fullname.lastname,
  });

  const token = user.generateAuthToken();

  res.status(201).json({ token, user });
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  //'+password' is used to include the password field in the query result, as it is set to select: false in the schema for security reasons. This allows us to compare the entered password with the hashed password stored in the database.
  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  //user.comaprePassword is used instead of userModel.comparePassword because comparePassword is an instance method defined in the user schema, which can be called on an instance of a user document (in this case, the 'user' variable that we retrieved from the database).
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();
  res.cookie("token", token)

  res.status(200).json({ token, user });
};

module.exports.getUserProfile = async (req, res, next) => {
   res.status(200).json({ user: req.user });
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");

  // Add the token to the blacklist to prevent further use
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];
  if (token) {
    await blackListTokenModel.create({ token });
  }
  res.status(200).json({ message: "Logged out successfully" });
}