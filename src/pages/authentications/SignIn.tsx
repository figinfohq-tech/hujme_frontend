import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { baseURL } from "@/utils/constant/url";

const SignIn = ({ packageId }) => {
  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const navigate = useNavigate();

  // Handle submit
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const payload = {
        email: values.email,
        password: values.password,
      };

      const response = await axios.post(`${baseURL}auth/login`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("userId", response.data.user.userId);
      localStorage.setItem("userDetails", JSON.stringify(response.data.user));

      toast.success("Login successful!");
        
      // Wait for toast → then redirect → then reload
      setTimeout(() => {
        if (response.data.user.role === "AGENT") {
          {
            packageId
              ? navigate(`/package/${packageId}`)
              : navigate("/");
          }
        } else if (response.data.user.role === "USER") {
          {
            packageId
              ? navigate(`/package/${packageId}`)
              : navigate("/");
          }
        } else {
          navigate("/auth");
        }

        window.location.reload();
      }, 1200);

      resetForm();
    } catch (error) {
      console.error("Error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Login failed!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            {/* Email Field */}
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="email"
                className="text-gray-700 font-semibold text-sm"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FaEnvelope />
                </span>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-primary transition-all"
                />
              </div>
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="password"
                className="text-gray-700 font-semibold text-sm"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FaLock />
                </span>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-primary transition-all"
                />
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
              <div className="text-right mt-1">
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-primary cursor-pointer hover:underline"
                >
                  Forgot password?
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-gradient-button text-primary-foreground hover:opacity-90 transition-smooth font-semibold rounded-lg transition-all duration-200 disabled:opacity-70"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </div>

            {/* Terms Text */}
            <div className="text-center text-sm text-gray-500 mt-4">
              By continuing, you agree to our{" "}
              <span className="text-primary font-medium cursor-pointer hover:underline">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-primary font-medium cursor-pointer hover:underline">
                Privacy Policy
              </span>
              .
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignIn;
