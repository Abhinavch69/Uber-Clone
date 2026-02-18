import React from "react";
import uberLogo from "../assets/uber-logo.png";
import uberbg from "../assets/bg-image-uber.jpg";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div
        className="h-screen pt-8 w-full flex flex-col justify-between"
        style={{
          backgroundImage: `url(${uberbg})`,
          backgroundSize: "cover",
          backgroundPosition: "right",
        }}
      >
        <img className="w-16 ml-8" src={uberLogo} alt="Uber Logo" />
        <div className="bg-white pb-7 py-4 px-4">
          <h2 className="text-3xl font-bold">Get Started with Uber</h2>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
