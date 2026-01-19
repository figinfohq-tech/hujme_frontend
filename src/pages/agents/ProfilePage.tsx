import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  Shield,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { baseURL } from "@/utils/constant/url";

const ProfilePage = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // countries, cities and states api calling
  const [state, setState] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectdCitiesId, setSelectedCitiesId] = useState("");
  const [agent, setAgent] = useState<any>(null);

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedStateId) {
      fetchCities();
    }
  }, [selectedStateId]);

  const fetchStates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}states/byCountry/${1}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setState(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${baseURL}cities/byState/${selectedStateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching Cities:", error);
    }
  };
  const userId = localStorage.getItem("userId");

  const token = localStorage.getItem("token");

  const fetchAgent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}agents/byUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAgent(response.data);
    } catch (error) {
      console.error("Error fetching Cities:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${baseURL}users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = response.data;

      formik.setFieldValue("firstName", user.firstName || "");
      formik.setFieldValue("lastName", user.lastName || "");
      formik.setFieldValue("userEmail", user.email || "");
      formik.setFieldValue("mobileNumber", user.phone || "");
      formik.setFieldValue("password", "");
      formik.setFieldValue("confirmPassword", "");
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchAgency = async () => {
    try {
      const response = await axios.get(`${baseURL}agents/${agent.agentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const agency = response.data;

      formik.setFieldValue("agencyName", agency.agencyName || "");
      formik.setFieldValue("contactPerson", agency.contactPerson || "");
      formik.setFieldValue("email", agency.agencyEmail || "");
      formik.setFieldValue("phone", agency.agencyPhone || "");
      formik.setFieldValue("address", agency.address || "");
      formik.setFieldValue("experience", agency.experience || "");
      formik.setFieldValue("certificate", agency.certification || "");
      formik.setFieldValue("description", agency.description || "");
      formik.setFieldValue("website", agency.website || "");
      formik.setFieldValue("state", String(agency.stateId));
      formik.setFieldValue("city", String(agency.cityId));

      setSelectedStateId(String(agency.stateId));
      setSelectedCitiesId(String(agency.cityId));
    } catch (error) {
      console.error("Error fetching agency:", error);
    }
  };

  const fetchLogo = async () => {
    try {
      const res = await axios.get(
        `${baseURL}agents/get-logo/${Number(agent.agentId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        },
      );
      const imageUrl = URL.createObjectURL(res.data);
      setLogoPreview(imageUrl);
    } catch (error) {
      console.error("No logo found or error:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
      fetchAgent();
    }
  }, [userId]);

  useEffect(() => {
    if (agent?.agentId) {
      fetchAgency();
      fetchLogo();
    }
  }, [agent]);

  useEffect(() => {
    if (cities.length && selectdCitiesId) {
      formik.setFieldValue("city", selectdCitiesId);
    }
  }, [cities]);

  const uploadAgentLogo = async (agentId: any, file: any) => {
    if (!file) return;

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("agentId", agentId);
    formData.append("file", file);

    const response = await axios.post(
      `${baseURL}agents/upload-logo`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
  };

  // countries, cities and states api calling

  // ------------------------ FORM VALIDATION ------------------------

  const validateAndSetErrors = async (schema: any) => {
    try {
      await schema.validate(formik.values, { abortEarly: false });
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

  const signupSchema = Yup.object({
    firstName: Yup.string().min(2).required("First name required"),
    lastName: Yup.string().min(2).required("Last name required"),
    userEmail: Yup.string().email().required("Email required"),
    mobileNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid mobile")
      .required("Mobile required"),
    password: Yup.string().min(6).required("Password required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Confirm password required"),
  });

  const agentSchema = Yup.object({
    agencyName: Yup.string().min(5).required("Agency name required"),
    contactPerson: Yup.string().min(3).required("Contact person required"),
    email: Yup.string().email().required("Agency email required"),
    phone: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Invalid phone")
      .required("Phone required"),
    address: Yup.string().min(10).required("Address required"),
    state: Yup.string().required("State required"),
    city: Yup.string().required("City required"),
    experience: Yup.string().required("Experience required"),
    certificate: Yup.string().required("Certificate required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      userEmail: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",

      agencyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      experience: "",
      description: "",
      certificate: "",
      website: "",
      logo: null,
    },
    onSubmit: () => {},
  });

  // Logo Image Handler
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("logo", file);

    const imgUrl = URL.createObjectURL(file);
    setLogoPreview(imgUrl);
  };

  const handleSignup = async () => {
    const isValid = await validateAndSetErrors(signupSchema);
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

      const res = await axios.put(`${baseURL}users/${agent.agentId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Account details updated successfully");
      fetchUser();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  const handleAgentRegister = async () => {
    const isValid = await validateAndSetErrors(agentSchema);
    if (!isValid) return;

    try {
      if (!token || !userId) {
        toast.error("Please signup first");
        return;
      }

      const payload = {
        userId: Number(agent.agentId),
        agencyName: formik.values.agencyName,
        contactPerson: formik.values.contactPerson,
        agencyEmail: formik.values.email,
        agencyPhone: formik.values.phone,
        address: formik.values.address,
        stateId: Number(selectedStateId),
        cityId: Number(selectdCitiesId),
        experience: formik.values.experience,
        description: formik.values.description,
        certification: formik.values.certificate,
        website: formik.values.website,
      };

      const res = await axios.put(
        `${baseURL}agents/${agent.agentId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Agency details updated successfully");
      fetchAgency();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Agent registration failed");
    }
  };

  const handleLogoUploadApi = async () => {
    try {
      await uploadAgentLogo(agent.agentId, formik.values.logo);
      toast.success(
        logoPreview
          ? "Logo updated successfully"
          : "Logo uploaded successfully",
      );
      fetchLogo();
    } catch {
      toast.error(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Profile Settings
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Manage your personal information and account settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Registration Form */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6"> */}
            <div className="lg:col-span-3">
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* ------------------ USER DETAILS ------------------ */}
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
                          <div className="flex">
                            <Label>First Name</Label>
                            <span className="text-red-500">*</span>
                          </div>
                          <Input
                            {...formik.getFieldProps("firstName")}
                            placeholder="Enter your first name"
                            disabled
                          />
                          {formik.errors.firstName && (
                            <p className="text-red-600 text-sm">
                              {formik.errors.firstName}
                            </p>
                          )}
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                          <div className="flex">
                            <Label>Last Name</Label>
                            <span className="text-red-500">*</span>
                          </div>
                          <Input
                            {...formik.getFieldProps("lastName")}
                            placeholder="Enter your last name"
                            disabled
                          />
                          {formik.errors.lastName && (
                            <p className="text-red-600 text-sm">
                              {formik.errors.lastName}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <div className="flex">
                            <Label>Email Address</Label>
                            <span className="text-red-500">*</span>
                          </div>
                          <Input
                            type="email"
                            {...formik.getFieldProps("userEmail")}
                            placeholder="Enter your email"
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
                          <div className="flex">
                            <Label>Mobile Number</Label>
                            <span className="text-red-500">*</span>
                          </div>
                          <Input
                            maxLength={10}
                            inputMode="numeric"
                            placeholder="Enter your mobile number"
                            disabled
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
                          <div className="flex">
                            <Label>Password</Label>
                            <span className="text-red-500">*</span>
                          </div>
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
                          <div className="flex">
                            <Label>Confirm Password</Label>
                            <span className="text-red-500">*</span>
                          </div>
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
                          className="bg-primary text-white w-48"
                        >
                          Update Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ------------------ AGENCY INFORMATION ------------------ */}
                <Card>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Building className="w-5 h-5 mr-2 text-green-700" />
                        Agency Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex">
                            <Label>Agency Name</Label>
                            <span className="text-red-500">*</span>
                          </div>
                          <Input
                            {...formik.getFieldProps("agencyName")}
                            placeholder="Enter agency name"
                            disabled
                          />

                          {formik.errors.agencyName && (
                            <p className="text-red-600 text-sm">
                              {formik.errors.agencyName}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex">
                            <Label>Contact Person</Label>
                            <span className="text-red-500">*</span>
                          </div>
                          <Input
                            {...formik.getFieldProps("contactPerson")}
                            placeholder="Enter contact person name"
                          />
                          {formik.errors.contactPerson && (
                            <p className="text-red-600 text-sm">
                              {formik.errors.contactPerson}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex">
                            <Label>Agency Email Address</Label>
                            <span className="text-red-500">*</span>
                          </div>
                          <Input
                            type="email"
                            {...formik.getFieldProps("email")}
                            placeholder="Enter email"
                          />
                          {formik.errors.email && (
                            <p className="text-red-600 text-sm">
                              {formik.errors.email}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex">
                            <Label>Agency Phone Number</Label>
                            <span className="text-red-500">*</span>
                          </div>
                          <Input
                            name="phone"
                            placeholder="Enter phone number"
                            maxLength={10}
                            value={formik.values.phone}
                            inputMode="numeric"
                            onChange={(e) => {
                              const onlyNumbers = e.target.value.replace(
                                /\D/g,
                                "",
                              );
                              formik.setFieldValue("phone", onlyNumbers);
                            }}
                            onBlur={formik.handleBlur}
                          />
                          {formik.errors.phone && (
                            <p className="text-red-600 text-sm">
                              {formik.errors.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ------------------ LOCATION ------------------ */}

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex">
                          <Label>Business Address </Label>
                          <span className="text-red-500">*</span>
                        </div>
                        <Textarea
                          {...formik.getFieldProps("address")}
                          placeholder="Enter business address"
                          maxLength={101}
                        />
                        {formik.errors.address && (
                          <p className="text-red-600 text-sm">
                            {formik.errors.address}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex">
                            <Label>State</Label>
                            <span className="text-red-500">*</span>
                          </div>
                          <Select
                            value={formik.values.state}
                            onValueChange={(value) => {
                              formik.setFieldValue("state", value);
                              setSelectedStateId(value);
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {state.map((items) => {
                                return (
                                  <SelectItem
                                    key={items.stateId}
                                    value={String(items.stateId)}
                                  >
                                    {items.stateName}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          {formik.errors.state && (
                            <p className="text-red-600 text-sm">
                              {formik.errors.state}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex">
                            <Label>City</Label>
                            <span className="text-red-500">*</span>
                          </div>
                          <Select
                            value={formik.values.city}
                            onValueChange={(value) => {
                              formik.setFieldValue("city", value);
                              setSelectedCitiesId(value);
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((items) => {
                                return (
                                  <SelectItem
                                    key={items.cityId}
                                    value={String(items.cityId)}
                                  >
                                    {items.cityName}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          {formik.errors.city && (
                            <p className="text-red-600 text-sm">
                              {formik.errors.city}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ------------------ BUSINESS DETAILS ------------------ */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex">
                            <Label>Experience</Label>
                            <span className="text-red-500">*</span>
                          </div>
                          <Select
                            value={formik.values.experience}
                            onValueChange={(v) =>
                              formik.setFieldValue("experience", v)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Years of experience" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-2">1-2 Years</SelectItem>
                              <SelectItem value="3-5">3-5 Years</SelectItem>
                              <SelectItem value="6-10">6-10 Years</SelectItem>
                              <SelectItem value="10+">10+ Years</SelectItem>
                            </SelectContent>
                          </Select>
                          {formik.errors.experience && (
                            <p className="text-red-600 text-sm">
                              {formik.errors.experience}
                            </p>
                          )}
                        </div>

                        {/* Certificate (Text Input) */}
                        <div className="space-y-2">
                          <div className="flex">
                            <Label>IATA / HJTC Certificate</Label>
                            <span className="text-red-500">*</span>
                          </div>
                          <Input
                            {...formik.getFieldProps("certificate")}
                            placeholder="Enter certificate number"
                          />
                          {formik.errors.certificate && (
                            <p className="text-red-600 text-sm">
                              {formik.errors.certificate}
                            </p>
                          )}
                        </div>

                        {/* Website */}
                        <div className="space-y-2">
                          <Label>Agency Website</Label>
                          <Input
                            type="url"
                            placeholder="https://www.youragency.com"
                            {...formik.getFieldProps("website")}
                          />
                          {formik.errors.website && (
                            <p className="text-red-600 text-sm">
                              {formik.errors.website}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          {...formik.getFieldProps("description")}
                          placeholder="Describe your agency..."
                          rows={4}
                          maxLength={101}
                        />
                        {formik.errors.description && (
                          <p className="text-red-600 text-sm">
                            {formik.errors.description}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-center">
                        <Button
                          type="button"
                          onClick={handleAgentRegister}
                          className="bg-primary text-white w-48"
                        >
                          Update Agency Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ------------------ ADDITIONAL FIELDS ------------------ */}
                <Card>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Logo Upload */}
                      <div className="space-y-2">
                        <Label>Upload Agency Logo</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="logoUpload"
                            onChange={handleLogoUpload}
                          />
                          <label
                            htmlFor="logoUpload"
                            className="cursor-pointer"
                          >
                            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />

                            <p className="text-sm text-muted-foreground">
                              {logoPreview
                                ? "Click to change agency logo"
                                : "Click to upload agency logo"}
                            </p>
                          </label>

                          {logoPreview && (
                            <img
                              src={logoPreview}
                              alt="Logo Preview"
                              className="mx-auto mt-3 w-24 h-24 rounded object-cover"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    {/* ------------------ TERMS ------------------ */}
                    <div className="flex mt-4 justify-center">
                      <Button
                        type="button"
                        onClick={handleLogoUploadApi}
                        className="bg-primary text-white w-48"
                      >
                        {logoPreview ? "Update Logo" : "Upload Logo"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>
            {/* </div> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
