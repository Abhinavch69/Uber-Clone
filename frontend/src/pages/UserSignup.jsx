import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import uberLogo from "../assets/uber-logo.png";
import axios from "axios";
import { UserDataContext } from "../context/UserContext.jsx";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      fullname: {
        firstname: firstname,
        lastname: lastname,
      },
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser,
      );

      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        
        // Clear form before navigation
        setEmail("");
        setPassword("");
        setFirstname("");
        setLastname("");
        
        // Navigate after successful signup
        navigate("/home");
      }
    } catch (error) {
      console.error("Signup error:", error);
      
      let errorMessage = "Error signing up";
      
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        // Extract validation errors from backend
        const validationErrors = error.response.data.errors.map(err => err.msg).join(", ");
        errorMessage = validationErrors;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    }
  };
  return (
    <div>
      <div className="p-7 h-screen flex flex-col justify-between">
        <div>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <img className="w-16 mb-10" src={uberLogo} alt="Uber Logo" />
            <h3 className="text-lg font-medium mb-2">What's your name?</h3>
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
            <h3 className="text-lg font-medium mb-2">What's your email</h3>
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
            <button className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholer:text-base">
              Sign Up
            </button>
          </form>
          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
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

export default UserSignup;
