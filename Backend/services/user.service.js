const userModel = require("../models/user.model");

module.exports.createUser = async({
  firstname, lastname, email, password
}) => {
  if (!firstname) throw new Error("First name is required");
  if (!lastname) throw new Error("Last name is required");
  if (!email) throw new Error("Email is required");
  if (!password) throw new Error("Password is required");
  const user = await userModel.create({
    fullname:{
      firstname,
      lastname
    },
    email,password
  })
  return user;
}