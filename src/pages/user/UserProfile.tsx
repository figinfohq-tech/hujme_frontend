import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { baseURL } from "@/utils/constant/url";

const UserProfle = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // ------------------------ FORM ------------------------

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      userEmail: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: () => {},
  });

  // ------------------------ VALIDATION ------------------------

  const signupSchema = Yup.object({
    firstName: Yup.string().min(2).required("First name required"),
    lastName: Yup.string().min(2).required("Last name required"),
    userEmail: Yup.string().email().required("Email required"),

    mobileNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid mobile")
      .notRequired(),

    // 🔹 Password OPTIONAL
    password: Yup.string()
      .nullable()
      .test(
        "password-validation",
        "Password must be exactly 6 digits",
        (value) => {
          if (!value) return true; // ✅ empty allowed
          return /^[0-9]{6}$/.test(value); // only 6 digit allowed
        },
      ),

    // 🔹 Confirm password ONLY when password entered
    confirmPassword: Yup.string()
      .nullable()
      .when("password", {
        is: (password: string) => password && password.length > 0,
        then: (schema) =>
          schema
            .required("Confirm password required")
            .oneOf([Yup.ref("password")], "Passwords do not match"),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

  const validateAndSetErrors = async () => {
    try {
      await signupSchema.validate(formik.values, { abortEarly: false });
      return true;
    } catch (err: any) {
      const errors: any = {};
      err.inner.forEach((e: any) => {
        errors[e.path] = e.message;
      });
      formik.setErrors(errors);
      return false;
    }
  };

  // ------------------------ API ------------------------

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${baseURL}users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = response.data;

      formik.setValues({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        userEmail: user.email || "",
        mobileNumber: user.phone || "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if (userId) fetchUser();
  }, [userId]);

  const handleSignup = async () => {
    const isValid = await validateAndSetErrors();
    if (!isValid) return;

    try {
      const payload = {
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        email: formik.values.userEmail,
        phone: formik.values.mobileNumber,
        password: formik.values.password,
        role: "AGENT",
      };

      await axios.put(`${baseURL}users/${userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Account details updated successfully");
      fetchUser();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // ------------------------ UI ------------------------

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Manage Profile
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Manage your personal information and account settings
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <Card>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-700" />
                    Account Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="space-y-2">
                      <Label>First Name *</Label>
                      <Input {...formik.getFieldProps("firstName")} disabled />
                      {formik.errors.firstName && (
                        <p className="text-red-600 text-sm">
                          {formik.errors.firstName}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <Label>Last Name *</Label>
                      <Input {...formik.getFieldProps("lastName")} disabled />
                      {formik.errors.lastName && (
                        <p className="text-red-600 text-sm">
                          {formik.errors.lastName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        {...formik.getFieldProps("userEmail")}
                        disabled
                      />
                      {formik.errors.userEmail && (
                        <p className="text-red-600 text-sm">
                          {formik.errors.userEmail}
                        </p>
                      )}
                    </div>

                    {/* Mobile */}
                    <div className="space-y-2">
                      <Label>Mobile *</Label>
                      <Input
                        maxLength={10}
                        inputMode="numeric"
                        value={formik.values.mobileNumber}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "mobileNumber",
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
                      />
                      {formik.errors.mobileNumber && (
                        <p className="text-red-600 text-sm">
                          {formik.errors.mobileNumber}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label>Password *</Label>
                      <Input
                        type="password"
                        {...formik.getFieldProps("password")}
                        placeholder="Enter your password"
                      />
                      {formik.errors.password && (
                        <p className="text-red-600 text-sm">
                          {formik.errors.password}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label>Confirm Password *</Label>
                      <Input
                        type="password"
                        {...formik.getFieldProps("confirmPassword")}
                        placeholder="Re-enter your password"
                      />
                      {formik.errors.confirmPassword && (
                        <p className="text-red-600 text-sm">
                          {formik.errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="button"
                      onClick={handleSignup}
                      className="w-48"
                    >
                      Update Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UserProfle;
