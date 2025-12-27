import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { baseURL } from "@/utils/constant/url";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Token usually comes from email link
  const token = searchParams.get("token");

  // Validation
  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Submit handler
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const payload = {
        token,
        newPassword: values.newPassword,
      };

      await axios.post(`${baseURL}auth/reset-password`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Password reset successfully");

      setTimeout(() => {
        navigate("/auth");
      }, 1200);

      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Password reset failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
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
              initialValues={{
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  {/* Heading */}
                  <h2 className="text-xl font-semibold text-gray-800 text-center">
                    Reset Password
                  </h2>

                  <p className="text-sm text-gray-500 text-center">
                    Create a new password for your account
                  </p>

                  {/* New Password */}
                  <div className="flex flex-col space-y-1">
                    <label
                      htmlFor="newPassword"
                      className="text-gray-700 font-semibold text-sm"
                    >
                      New Password <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <FaLock />
                      </span>

                      <Field
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        placeholder="Enter new password"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-primary transition-all"
                      />
                    </div>

                    <ErrorMessage
                      name="newPassword"
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
                        placeholder="Confirm new password"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-primary transition-all"
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
                      {isSubmitting ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
