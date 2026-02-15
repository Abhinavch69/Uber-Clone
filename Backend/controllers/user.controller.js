const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");

/**
 * POST /users/register
 * Register a new user in the application
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email (must be unique)
 * @param {Object} req.body.fullname - User's full name
 * @param {string} req.body.fullname.firstname - Minimum 3 characters
 * @param {string} req.body.fullname.lastname - Optional, minimum 3 characters if provided
 * @param {string} req.body.password - Minimum 6 characters
 *
 * @returns {Object} res - Express response object
 *
 * @example
 * // Success Response (201 Created)
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "_id": "507f1f77bcf86cd799439011",
 *     "fullname": {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     },
 *     "email": "user@example.com",
 *     "socketId": null
 *   }
 * }
 *
 * @example
 * // Error Response (400 Bad Request)
 * {
 *   "success": false,
 *   "message": "Validation errors",
 *   "errors": [
 *     {
 *       "param": "email",
 *       "msg": "Invalid email",
 *       "value": "invalid-email"
 *     },
 *     {
 *       "param": "fullname.firstname",
 *       "msg": "Firstname must be at least 3 characters long",
 *       "value": "ab"
 *     }
 *   ]
 * }
 */
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
