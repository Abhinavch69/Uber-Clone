import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import uberLogo from "../assets/uber-driver-logo.png";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CaptainSignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const{captain, setCaptain} = useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const captainData = {
      fullname: {
        firstname: firstname,
        lastname: lastname,
      },
      email: email,
      password: password,
      vehicle :{
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
      }
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData);

    if(response.status === 201) {
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem('token',data.token)
      navigate("/captain-home");
    }

    setEmail("");
    setPassword("");
    setFirstname("");
    setLastname("");
    setVehicleCapacity("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleType("");
  };
  return (
    <div>
      <div className="px-5 py-5 h-screen flex flex-col justify-between">
        <div>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <img className="w-16 mb-5" src={uberLogo} alt="Uber Logo" />
            <h3 className="text-lg font-medium mb-2">
              What's our Captain's name?
            </h3>
            <div className="flex gap-4 mb-6">
              <input
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholer:text-sm"
                required
                type="text"
                placeholder="First name"
              />
              <input
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholer:text-sm"
                required
                type="text"
                placeholder="Last name"
              />
            </div>
            <h3 className="text-lg font-medium mb-2">
              What's our Captain's email
            </h3>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-base placeholer:text-sm"
              required
              type="email"
              placeholder="email@example.com"
            />
            <h3 className="text-lg font-medium mb-2">Enter Password</h3>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-base placeholer:text-sm"
              required
              type="password"
              placeholder="Password"
            />
            <h3 className="text-lg font-medium mb-2">
              Vehicle Information
            </h3>
            <div className="flex gap-4 mb-6">
              <input
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholer:text-sm"
                required
                type="text"
                placeholder="Vehicle color"
              />
              <input
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholer:text-sm"
                required
                type="text"
                placeholder="Vehicle plate"
              />
            </div>
            <div className="flex gap-4 mb-6">
              <input
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
                className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholer:text-sm"
                required
                type="number"
                placeholder="Vehicle capacity"
              />
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base"
                required
              >
                <option value="">Select vehicle type</option>
                <option value="car">Car</option>
                <option value="auto">Auto</option>
                <option value="motorcycle">Motorcycle</option>
              </select>
            </div>
            <button className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholer:text-base">
              Create Captain Account
            </button>
          </form>
          <p className="text-center">
            Already have an account?{" "}
            <Link to="/captain-login" className="text-blue-600">
              Login here
            </Link>
          </p>
        </div>
        <div>
          <p className="text-[10px] leading-tight">
            This site is protected by reCAPTCHA and the{" "}
            <span className="underline">Google Privacy Policy</span> and{" "}
            <span className="underline">Terms of Service apply</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainSignup;
