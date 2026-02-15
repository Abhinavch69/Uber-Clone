// Import required packages
const mongoose = require("mongoose");      // ODM to interact with MongoDB
const bcrypt = require("bcrypt");          // Library for hashing passwords securely
const jwt = require("jsonwebtoken");       // Library to generate authentication tokens

// Define the structure (schema) of a User document in MongoDB
const userSchema = new mongoose.Schema({

  // Nested object to store user's full name
  fullname: {
    firstname: {
      type: String,
      required: true, // Firstname is mandatory
      minlength: [3, "Firstname must be at least 3 characters long"], // Validation rule
    },
    lastname: {
      type: String,
      minlength: [3, "Lastname must be at least 3 characters long"], // Optional but must be >= 3 characters if provided
    },
  },

  // User email field
  email: {
    type: String,
    required: true,     // Email is required
    unique: true,       // Prevent duplicate emails
    minlength: [5, "Email must be at least 5 characters long"],
  },

  // Password field (stored as hashed value)
  password: {
    type: String,
    required: true,
    select: false,      // Exclude password from query results by default (security best practice)
  },

  // Used for real-time communication (e.g., Socket.io connection ID)
  socketId: {
    type: String,
  }

});

// Instance method to generate JWT token for authentication
// This method will be available on individual user documents
userSchema.methods.generateAuthToken = function () {
  // Create token containing user's MongoDB _id
  const token = jwt.sign(
    { _id: this._id },                // Payload (data inside token)
    process.env.JWT_SECRET,           // Secret key from environment variables
    { expiresIn: "1h" }               // Token expiry time
  );

  return token;
};

// Instance method to compare entered password with hashed password in DB
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Static method to hash a plain password before saving it to database
// Called using User.hashPassword()
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10); // 10 = salt rounds (security level)
};

// Create the User model from schema
const userModel = mongoose.model("user", userSchema);

// Export the model so it can be used in controllers
module.exports = userModel;