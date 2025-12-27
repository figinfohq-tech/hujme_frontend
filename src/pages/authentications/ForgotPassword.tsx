import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { baseURL } from "@/utils/constant/url";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Validation
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  // Submit handler
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    // try {
    //   const payload = {
    //     email: values.email,
    //   };

    //   await axios.post(`${baseURL}auth/forgot-password`, payload, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });

    //   toast.success("Password reset link sent to your email");
    //   resetForm();
    // } catch (error) {
    //   console.error(error);
    //   toast.error(error.response?.data?.message || "Something went wrong");
    // } finally {
    //   setSubmitting(false);
    // }
  };

  return (
    <>
      {/* Back Button */}
      <div
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer m-6 hover:text-primary"
      >
        <FaArrowLeft />
        Back to Login
      </div>
      <div className="flex flex-1 justify-center h-min">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="w-full max-w-sm mx-auto">
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                {/* Heading */}
                <h2 className="text-xl font-semibold text-gray-800 text-center">
                  Forgot Password
                </h2>

                <p className="text-sm text-gray-500 text-center">
                  Enter your registered email address. We’ll send you a password
                  reset link.
                </p>

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
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-primary transition-all"
                    />
                  </div>

                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 bg-gradient-button text-primary-foreground hover:opacity-90 transition-smooth font-semibold rounded-lg transition-all duration-200 disabled:opacity-70"
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
