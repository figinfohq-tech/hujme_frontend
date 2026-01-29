import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import { toast } from "react-toastify";

const SignUp = () => {
  // ✅ Validation Schema
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(2, "First name must be at least 2 characters")
      .required("First name is required"),
    lastName: Yup.string()
      .min(2, "Last name must be at least 2 characters")
      .required("Last name is required"),
    email: Yup.string()
      .trim()
      .email("Please enter a valid email address (e.g. name@example.com)")
      .required("Email address is required"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number")
      .required("Mobile number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  // ✅ Handle Submit
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.mobile,
        password: values.password,
        role: "User", // fixed value as per your API
      };

      const response = await axios.post(
        "http://31.97.205.55:8080/api/auth/signup",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Sign up successful!");
      resetForm();
    } catch (error) {
      console.error("❌ Error during sign up:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Sign up failed!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          mobile: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            {/* First + Last Name Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* First Name */}
              <div className="flex-1 space-y-1">
                <label
                  htmlFor="firstName"
                  className="text-gray-700 font-semibold text-sm"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <FaUser />
                  </span>
                  <Field
                    type="text"
                    id="firstName"
                    name="firstName"
                    maxLength={255}
                    placeholder="Enter your first name"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-900 outline-none transition-all"
                  />
                </div>
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Last Name */}
              <div className="flex-1 space-y-1">
                <label
                  htmlFor="lastName"
                  className="text-gray-700 font-semibold text-sm"
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    type="text"
                    id="lastName"
                    name="lastName"
                    maxLength={255}
                    placeholder="Enter your last name"
                    className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-900 outline-none transition-all"
                  />
                </div>
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            {/* Email */}
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
                  maxLength={255}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-900 outline-none transition-all"
                />
              </div>
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Mobile */}
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="mobile"
                className="text-gray-700 font-semibold text-sm"
              >
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FaPhone />
                </span>
                <Field name="mobile">
                  {({ field, form }) => (
                    <input
                      {...field}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      placeholder="Enter your mobile number"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-900 outline-none transition-all"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // remove non-numeric
                        if (value.length <= 10) {
                          form.setFieldValue("mobile", value);
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasted = e.clipboardData
                          .getData("text")
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        form.setFieldValue("mobile", pasted);
                      }}
                    />
                  )}
                </Field>
              </div>
              <ErrorMessage
                name="mobile"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Password */}
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
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-900 outline-none transition-all"
                />
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="confirmPassword"
                className="text-gray-700 font-semibold text-sm"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FaLock />
                </span>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-900 outline-none transition-all"
                />
              </div>
              <ErrorMessage
                name="confirmPassword"
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
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>
            </div>

            {/* Terms and Policy */}
            <div className="text-center text-sm text-gray-500 mt-4">
              By continuing, you agree to our{" "}
              <span className="text-green-900 font-medium cursor-pointer hover:underline">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-green-900 font-medium cursor-pointer hover:underline">
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

export default SignUp;
