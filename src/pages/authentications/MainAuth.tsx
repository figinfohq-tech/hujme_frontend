import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const MainAuth = () => {
  const [activeTab, setActiveTab] = useState("login");

  const location = useLocation();
  const packageState = location.state;

  const packageId = packageState?.packageData.id;

  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex flex-col">
    <div className="min-h-screen flex flex-col">
      {/* Back Button */}
      <div className="p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:opacity-90 transition-smooth font-semibold text-lg transition"
        >
          <IoMdArrowRoundBack size={25} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Card Container */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-6">
          {/* Title */}
          <div className="flex justify-center items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Welcome</h3>
          </div>

          {/* Toggle Buttons */}
          <div className="flex mb-6 rounded-lg overflow-hidden border border-primary">
            <button
              className={`flex-1 py-2 text-lg font-semibold transition ${
                activeTab === "login"
                  ? "bg-primary text-white"
                  : "bg-transparent text-primary hover:opacity-90 transition-smooth"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 text-lg font-semibold transition ${
                activeTab === "signup"
                  ? "bg-primary text-white"
                  : "bg-transparent text-primary hover:opacity-90 transition-smooth"
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          <div className="animate-fade-in">
            {activeTab === "login" ? (
              <SignIn packageId={packageId} />
            ) : (
              <SignUp />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainAuth;
