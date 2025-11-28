import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedBookFlow = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const passedState = location.state; // <-- YOUR PARAMS HERE


  if (!token) {
    return <Navigate to="/auth" replace state={{
          packageData: passedState?.packageData || null,
        }} />;
  }

  return children;
};

export default ProtectedBookFlow;
