import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      {/* Big 404 text */}
      <h1 className="text-9xl font-extrabold text-gray-800 tracking-widest">
        404
      </h1>

      {/* Divider line */}
      <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm mt-4">
        Page Not Found
      </div>

      {/* Description */}
      <p className="text-gray-600 mt-6 max-w-md">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* Back button */}
      <Link
        to="/"
        className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition duration-200"
      >
        Go Back Home
      </Link>

      {/* Optional footer text */}
      <p className="mt-10 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </p>
    </div>
  );
};

export default PageNotFound;
