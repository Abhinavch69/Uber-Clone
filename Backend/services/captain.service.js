const captainModel = require("../models/captain.model");


module.exports.createCaptain = async({
  firstname, lastname , email, password, color, plate, capacity, vehicleType
})=>{
  if(!firstname) throw new Error("First name is required");
  if(!email) throw new Error("Email is required");
  if(!password) throw new Error("Password is required");
  if(!color) throw new Error("Vehicle color is required");
  if(!plate) throw new Error("Vehicle plate is required");
  if(!capacity) throw new Error("Vehicle capacity is required");
  if(!vehicleType) throw new Error("Vehicle type is required");

  const captain = captainModel.create({
    fullname:{
      firstname,
      lastname
    },
    email,
    password,
    vehicle:{
      color,plate,capacity,vehicleType
    }
  })

  return captain;
}

