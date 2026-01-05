import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
// import { toast } from "sonner";
// import { supabase } from "@/integrations/supabase/client";
import {
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  Shield,
  Star,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { baseURL } from "@/utils/constant/url";
// import Header from "@/components/Header";

const AgentRegistration = () => {
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState(null);

  // countries, cities and states api calling
  const [state, setState] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectdCitiesId, setSelectedCitiesId] = useState("");

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
      const response = await axios.get(
        `http://31.97.205.55:8080/api/states/byCountry/${1}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://31.97.205.55:8080/api/cities/byState/${selectedStateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching Cities:", error);
    }
  };

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
      }
    );
  };

  // countries, cities and states api calling

  // ------------------------ FORM VALIDATION ------------------------
  const formik = useFormik({
    initialValues: {
      agencyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      experience: "",
      license: "",
      description: "",
      speciality: "",
      totalPackages: "",
      trusted: false,
      logo: null,
      certificate: "",
      website: "",
      termsAccepted: false,
    },

    validationSchema: Yup.object({
      agencyName: Yup.string()
        .min(5, "Minimum 5 characters")
        .max(100, "Maximum 100 characters")
        .required("Required"),
      contactPerson: Yup.string().min(3).max(60).required("Required"),
      email: Yup.string()
        .trim()
        .email("Please enter a valid email address (e.g. name@example.com)")
        .required("Email address is required"),

      phone: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
        .required("Phone number is required"),
      address: Yup.string()
        .min(10, "Address must be at least 10 characters long")
        .max(500, "Address cannot exceed 500 characters")
        .required("Address is required"),

      city: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      experience: Yup.string().required("Required"),
      certificate: Yup.string()
        .min(5, "Too short")
        .max(30, "Too long")
        .required("Certificate required"),
      description: Yup.string()
        .min(10, "Minimum 10 characters")
        .max(100, "Maximum 100 characters"),
      termsAccepted: Yup.bool().oneOf([true], "You must accept T&C"),
      website: Yup.string()
        .url("Enter a valid website URL (https://...)")
        .nullable(),
    }),
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const payload = {
          userId: Number(userId),
          agencyName: values.agencyName,
          contactPerson: values.contactPerson,
          agencyEmail: values.email,
          agencyPhone: values.phone,
          address: values.address,
          stateId: Number(selectedStateId),
          cityId: Number(selectdCitiesId),
          experience: values.experience,
          description: values.description,
          certification: values.certificate,
          website: values.website,
          termsAccepted: values.termsAccepted,
        };

        const response = await axios.post(
          `${baseURL}agents/register`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const agentId = response.data.agentId;
        localStorage.setItem("agentId", agentId);

        //  Upload Logo (ONLY if selected)
        if (values.logo) {
          await uploadAgentLogo(agentId, values.logo);
        }

        toast.success("Agent Registration Successful!");
        navigate("/");
      } catch (error) {
        console.error("API Error:", error.response?.data || error);
        toast.error(error.response?.data?.message || "Something went wrong!");
      }
    },
  });

  // Logo Image Handler
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("logo", file);

    const imgUrl = URL.createObjectURL(file);
    setLogoPreview(imgUrl);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Join as Travel Agent
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Partner with us to offer your Hajj & Umrah packages to thousands
              of pilgrims
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Benefits */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
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

            {/* Registration Form */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6"> */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Agent Registration Form
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* ------------------ AGENCY INFORMATION ------------------ */}
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
                          />

                          {formik.touched.agencyName &&
                            formik.errors.agencyName && (
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
                          {formik.touched.contactPerson &&
                            formik.errors.contactPerson && (
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
                          {formik.touched.email && formik.errors.email && (
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
                                ""
                              );
                              formik.setFieldValue("phone", onlyNumbers);
                            }}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.phone && formik.errors.phone && (
                            <p className="text-red-600 text-sm">
                              {formik.errors.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ------------------ LOCATION ------------------ */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-green-700" />
                        Location
                      </h3>

                      <div className="space-y-2">
                        <div className="flex">
                          <Label>Business Address </Label>
                          <span className="text-red-500">*</span>
                        </div>
                        <Textarea
                          {...formik.getFieldProps("address")}
                          placeholder="Enter business address"
                        />
                        {formik.touched.address && formik.errors.address && (
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
                          {formik.touched.state && formik.errors.state && (
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
                          {formik.touched.city && formik.errors.city && (
                            <p className="text-red-600 text-sm">
                              {formik.errors.city}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ------------------ BUSINESS DETAILS ------------------ */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-green-700" />
                        Business Details
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex">
                            <Label>Experience</Label>
                            <span className="text-red-500">*</span>
                          </div>
                          <Select
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
                          {formik.touched.experience &&
                            formik.errors.experience && (
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
                          {formik.touched.certificate &&
                            formik.errors.certificate && (
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
                          {formik.touched.website && formik.errors.website && (
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
                        {formik.touched.description &&
                          formik.errors.description && (
                            <p className="text-red-600 text-sm">
                              {formik.errors.description}
                            </p>
                          )}
                      </div>
                    </div>

                    {/* ------------------ ADDITIONAL FIELDS ------------------ */}
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
                            Upload Logo
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
                    <div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formik.values.termsAccepted}
                          onCheckedChange={(v) =>
                            formik.setFieldValue("termsAccepted", v)
                          }
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the{" "}
                          <span className="text-primary underline cursor-pointer">
                            Terms & Conditions
                          </span>{" "}
                          and{" "}
                          <span className="text-primary underline cursor-pointer">
                            Privacy Policy
                          </span>
                        </Label>
                      </div>
                      <div>
                        {formik.touched.termsAccepted &&
                          formik.errors.termsAccepted && (
                            <p className="text-red-600 text-sm">
                              {formik.errors.termsAccepted}
                            </p>
                          )}
                      </div>
                    </div>

                    {/* ------------------ SUBMIT ------------------ */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-button text-primary-foreground hover:opacity-90 transition-smooth"
                    >
                      Submit Registration
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            {/* </div> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentRegistration;
