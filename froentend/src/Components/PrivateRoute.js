import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Check if the token is in localStorage
  const token = localStorage.getItem("token");

  // If the user is not logged in, redirect to the login page
  if (!token) {
    return <Navigate to="/" />;
  }

  // If the user is logged in, render the child components
  return children;
};

export default PrivateRoute;
