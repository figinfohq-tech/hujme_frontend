// ProtectedRoute.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [agent, setAgent] = useState([]);

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    fetchAgent();
  }, []);

  const fetchAgent = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const url = `http://31.97.205.55:8080/api/agents/${userId}/exists`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // ⬅ token added
          "Content-Type": "application/json",
        },
      });
      setAgent(response.data); // return only backend data
    } catch (error) {
      console.error("GET API Error:", error);
      throw error;
    }
  };

  if (!agent) {
    return <Navigate to="/agent-registration" replace />;
  }

  return children;
};

export default ProtectedRoute;
