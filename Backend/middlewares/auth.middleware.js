const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blackListTokenModel = require("../models/blacklistToken.model");
const captainModel = require("../models/captain.model");

module.exports.authUser = async (req, res, next) => {
  //use of '||' operator is to check for the presence of the token in both the cookies and the Authorization header. If the token is not found in either location, it will return a 401 Unauthorized response.
  //Authorized header is used to send the token in the format "Bearer <token>", so we split the header value by space and take the second part (the actual token) for verification.
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isBlacklisted = await blackListTokenModel.findOne({ token: token });

  if (isBlacklisted) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //_id is given to the token when it is generated in the user model, so we can access it here after decoding the token to find the user in the database.
    const user = await userModel.findById(decoded._id);

    req.user = user;
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isBlacklisted = await blackListTokenModel.findOne({ token: token });

  if (isBlacklisted) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decoded._id);

    //here we are attaching the captain object to the request object (req.captain) so that it can be accessed in the subsequent middleware or route handlers. This allows us to easily access the authenticated captain's information without having to query the database again in each route handler.
    req.captain = captain;
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};