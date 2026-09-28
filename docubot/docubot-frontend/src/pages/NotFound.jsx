import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="text-6xl font-bold text-[#2454ff]">404</p>
      <p className="mt-3 text-[#4b5468]">This page doesn't exist.</p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-5 py-2.5 rounded-lg bg-[#2454ff] text-white text-sm font-medium hover:bg-[#1b3fd1] transition"
      >
        Go home
      </button>
    </div>
  );
};

export default NotFound;
