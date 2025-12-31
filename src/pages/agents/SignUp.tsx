import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import { baseURL } from "@/utils/constant/url";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Shield } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(2, "First name must be at least 2 characters")
      .required("First name is required"),
    lastName: Yup.string()
      .min(2, "Last name must be at least 2 characters")
      .required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
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

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.mobile,
        password: values.password,
        role: "AGENT", // fixed value as per your API
      };

      const response = await axios.post(`${baseURL}auth/signup`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Sign up successful!");
      navigate("/auth");
      resetForm();
    } catch (error) {
      console.error("❌ Error during sign up:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Sign up failed!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Back Link */}
      <div className="p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-green-900 font-semibold text-lg transition hover:text-green-700"
        >
          <IoMdArrowRoundBack size={25} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Form Card */}
      <div className="max-w-4xl mx-auto">
         <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Join as Travel Agent
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Partner with us to offer your Hajj & Umrah packages to thousands
              of pilgrims
            </p>
          </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-4">
          <div className="lg:col-span-1">
              <Card className="sticky top-18">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-primary" />
                    Why Join Us?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-700 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Reach More Customers</h4>
                      <p className="text-sm text-muted-foreground">
                        Access thousands of potential pilgrims
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-700 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Easy Management</h4>
                      <p className="text-sm text-muted-foreground">
                        Simple dashboard to manage packages
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-700 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Secure Payments</h4>
                      <p className="text-sm text-muted-foreground">
                        Safe and secure payment processing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-700 mt-0.5" />
                    <div>
                      <h4 className="font-medium">24/7 Support</h4>
                      <p className="text-sm text-muted-foreground">
                        Dedicated support for agents
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
        <Card className="w-full p-6 sm:p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">Welcome</h3>
          </div>

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
              <Form className="space-y-4">
                {/* Name Fields */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="firstName"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-gray-50">
                      <span className="px-3 text-gray-500">
                        <FaUser />
                      </span>
                      <Field
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="w-full px-3 py-2 outline-none bg-gray-50"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="lastName"
                      className="block text-gray-700 font-medium mb-1"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-gray-50">
                      <Field
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="w-full px-3 py-2 outline-none bg-gray-50"
                        placeholder="Enter your last name"
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
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-gray-50">
                    <span className="px-3 text-gray-500">
                      <FaEnvelope />
                    </span>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 outline-none bg-gray-50"
                      placeholder="Enter your email"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-gray-50">
                    <span className="px-3 text-gray-500">
                      <FaPhone />
                    </span>
                    <Field
                      type="text"
                      id="mobile"
                      name="mobile"
                      className="w-full px-3 py-2 outline-none bg-gray-50"
                      placeholder="Enter your mobile number"
                    />
                  </div>
                  <ErrorMessage
                    name="mobile"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-gray-50">
                    <span className="px-3 text-gray-500">
                      <FaLock />
                    </span>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      className="w-full px-3 py-2 outline-none bg-gray-50"
                      placeholder="Enter your password"
                    />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-gray-50">
                    <span className="px-3 text-gray-500">
                      <FaLock />
                    </span>
                    <Field
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="w-full px-3 py-2 outline-none bg-gray-50"
                      placeholder="Re-enter your password"
                    />
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-button text-primary-foreground hover:opacity-90 transition-smooth font-semibold py-2 rounded-lg transition mt-4"
                >
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </button>

                <p className="text-center text-gray-500 text-sm mt-3">
                  By continuing, you agree to our{" "}
                  <span className="text-green-900">Terms of Service</span> and{" "}
                  <span className="text-green-900">Privacy Policy</span>.
                </p>
              </Form>
            )}
          </Formik>
        </Card>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
