import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation(); // Get the current URL
  const navigate = useNavigate(); // For navigation

  const handleRedirect = (path) => {
    navigate(path); // Navigate to the specified path
  };

  const handleLogout = () => {
    // Clear the token and user data from localStorage
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login page
  };

  return (
    <nav className="bg-gray-200 px-6 py-3 shadow-lg flex justify-between items-center">
      {/* Left Section: Navigation Links */}
      <div className="flex space-x-6">
        <div
          onClick={() => handleRedirect("/dashboard")}
          className={`text-sm font-semibold cursor-pointer transition-all duration-300 ease-in-out ${
            location.pathname === "/dashboard"
              ? "text-purple-600 underline"
              : "text-gray-700 hover:text-purple-600"
          }`}
        >
          Dashboard
        </div>
        <div
          onClick={() => handleRedirect("/task-list")}
          className={`text-sm font-semibold cursor-pointer transition-all duration-300 ease-in-out ${
            location.pathname === "/task-list"
              ? "text-purple-600 underline"
              : "text-gray-700 hover:text-purple-600"
          }`}
        >
          Task List
        </div>
      </div>

      {/* Right Section: Sign Out Button */}
      <button
        onClick={handleLogout}
        className="px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-200 ease-in-out"
      >
        Sign Out
      </button>
    </nav>
  );
};

export default Navbar;
