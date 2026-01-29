import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import { toast } from "react-toastify";
import FlightDetails from "@/components/FlightDetails";
import Facilities from "@/components/Facilities";
import HotelDetails from "@/components/HotelDetails";

const packageFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(200),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  duration: z.string().min(1, "Duration is required").max(100),
  accommodation: z.string().min(3, "Accommodation details required").max(500),
  transportation: z.string().min(3, "Transportation details required").max(500),
  inclusions: z
    .string()
    .min(10, "Inclusions must be at least 10 characters")
    .max(1000),
  exclusions: z.string().optional(),
  max_travelers: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Max travelers must be a positive number",
    }),
});

type PackageFormValues = z.infer<typeof packageFormSchema>;

interface FlightSegment {
  id: string;
  airline: string;
  flightNumber: string;
  departureCity: string;
  arrivalCity: string;
  departureDate: Date;
  departureTime: string;
  arrivalDate: Date;
  arrivalTime: string;
}

interface PackageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package?: any;
  onSuccess: () => void;
}
interface StateType {
  stateId: number;
  stateName: string;
}

interface CityType {
  cityId: number;
  cityName: string;
}

interface LookupType {
  lookupId: number;
  lookupName: string;
}

export function AddNewPackage({
  package: editPackage,
}: PackageFormDialogProps) {
  const [packageData, setPackagesData] = useState<any>("");
  const [isEditInitialized, setIsEditInitialized] = useState(false);

  // Flight Details state
  const [addedFlights, setAddedFlights] = useState<FlightSegment[]>([]);

  // Facilities state
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  const [travelType, setTravelType] = useState<LookupType[]>([]);
  const [packageType, setPackageType] = useState<LookupType[]>([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState<StateType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectdCitiesId, setSelectedCitiesId] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [isDuration, setIsDuration] = useState<Number>();

  const navigate = useNavigate();
  const { state } = useLocation();
  const pkg: any = state?.pkg;

  const calculateDurationInDays = (startDate, endDate) => {
    if (!startDate || !endDate) return "";

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : "";
  };
  // without time
  //   const calculateDurationInDays = (startDate, endDate) => {
  //   if (!startDate || !endDate) return "";

  //   const start = new Date(startDate);
  //   const end = new Date(endDate);

  //   // Time reset to avoid timezone issues
  //   start.setHours(0, 0, 0, 0);
  //   end.setHours(0, 0, 0, 0);

  //   const diffTime = end.getTime() - start.getTime();
  //   const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  //   return diffDays > 0 ? `${diffDays} Days` : "";
  // };

  const extractTime = (isoString: any) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toISOString().slice(11, 16); // HH:mm
  };
  useEffect(() => {
    if (pkg) {
      formik.setValues({
        agentId: pkg.agentId || "",
        countryId: pkg.countryId?.toString() || "",
        stateId: pkg.stateId?.toString() || "",
        cityId: pkg.cityId?.toString() || "",
        packageName: pkg.packageName || "",
        packageType: pkg.packageType?.toString() || "",
        travelType: pkg.travelType || "",
        description: pkg.description || "",
        price: pkg.price || "",
        originalPrice: pkg.originalPrice || "",
        duration: pkg.duration || "",
        departureDate: pkg.departureDate?.split("T")[0] || "",
        arrivalDate: pkg.arrivalDate?.split("T")[0] || "",
        departureTime: extractTime(pkg.departureTime),
        arrivalTime: extractTime(pkg.arrivalTime),
        flightStops: pkg.flightStops || "",
        totalSeats: pkg.totalSeats || "",
        notes: pkg.notes || "",
      });

      setSelectedCountryId(pkg.countryId?.toString());
      setSelectedStateId(pkg.stateId?.toString());
      setSelectedCitiesId(pkg.cityId?.toString());
    }
  }, [pkg]);

  const isArrivalAfterDeparture = (depDate, depTime, arrDate, arrTime) => {
    if (!depDate || !depTime || !arrDate || !arrTime) return true;

    const departure = new Date(`${depDate}T${depTime}:00`);
    const arrival = new Date(`${arrDate}T${arrTime}:00`);

    return arrival > departure;
  };

  // ⭐ FIX FOR ALL 5 DROPDOWNS ⭐
  useEffect(() => {
    if (
      pkg &&
      !isEditInitialized &&
      countries.length > 0 &&
      states.length > 0 &&
      cities.length > 0 &&
      travelType.length > 0 &&
      packageType.length > 0
    ) {
      formik.setValues({
        ...formik.values,
        countryId: pkg.countryId?.toString() || "",
        stateId: pkg.stateId?.toString() || "",
        cityId: pkg.cityId?.toString() || "",
        travelType: pkg.travelType?.toString() || "",
        packageType: pkg.packageType?.toString() || "",
      });

      setSelectedCountryId(pkg.countryId?.toString());
      setSelectedStateId(pkg.stateId?.toString());
      setSelectedCitiesId(pkg.cityId?.toString());
      setIsEditInitialized(true);
    }
  }, [pkg, countries, states, cities, travelType, packageType]);

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      name: editPackage?.name || "",
      description: editPackage?.description || "",
      price: editPackage?.price?.toString() || "",
      duration: editPackage?.duration || "",
      accommodation: editPackage?.accommodation || "",
      transportation: editPackage?.transportation || "",
      inclusions: editPackage?.inclusions || "",
      exclusions: editPackage?.exclusions || "",
      max_travelers: editPackage?.max_travelers?.toString() || "",
    },
  });

  const agentId = localStorage.getItem("agentID");

  useEffect(() => {
    // fetchStates();
    fetchCountries();
    fetchPackageType();
    fetchTravelType();
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedStateId) {
      fetchCities();
    }
  }, [selectedStateId]);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${baseURL}countries`);
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchStates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<StateType[]>(
        `${baseURL}states/byCountry/${1}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setStates(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<CityType[]>(
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
  // countries, cities and states api calling

  const fetchTravelType = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<LookupType[]>(
        `${baseURL}lookups/TRAVEL_TYPE`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setTravelType(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchPackageType = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}lookups/PACKAGE_TYPE`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPackageType(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      agentId: agentId,
      countryId: "",
      stateId: "",
      cityId: "",
      packageName: "",
      packageType: "",
      travelType: "",
      description: "",
      price: "",
      originalPrice: "",
      duration: "",
      departureDate: "",
      arrivalDate: "",
      departureTime: "",
      arrivalTime: "",
      flightStops: "",
      totalSeats: "",
      notes: "",
    },

    validationSchema: Yup.object({
      packageName: Yup.string().required("Package name is required"),
      travelType: Yup.string().required("Travel type required"),
      price: Yup.number().required("Price is required"),
      description: Yup.string().max(
        100,
        "Description can be maximum 100 characters",
      ),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const token = localStorage.getItem("token");
        setIsLoader(true);
        // Convert required fields to number

        const combineDateAndTime = (date, time) => {
          if (!date || !time) return null;

          // date = "2025-12-27"
          // time = "12:30"
          return new Date(`${date}T${time}:00`).toISOString();
        };

        const payload = {
          ...values,
          agentId: Number(values.agentId),
          countryId: Number(1),
          stateId: Number(values.stateId),
          cityId: Number(values.cityId),
          packageType: String(values.packageType),
          travelType: String(values.travelType),
          price: Number(values.price),
          originalPrice: Number(values.originalPrice),
          totalSeats: Number(values.totalSeats),
          // Convert date inputs into ISO format
          departureDate: values.departureDate
            ? new Date(values.departureDate).toISOString()
            : null,
          arrivalDate: values.arrivalDate
            ? new Date(values.arrivalDate).toISOString()
            : null,
          departureTime: combineDateAndTime(
            values.departureDate,
            values.departureTime,
          ),
          arrivalTime: combineDateAndTime(
            values.arrivalDate,
            values.arrivalTime,
          ),
          duration: Number(values.duration),
        };
        let response;

        if (pkg) {
          // ---------------------------------
          //       UPDATE API (PUT)
          // ---------------------------------
          response = await axios.put(
            `${baseURL}packages/${pkg.packageId}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          );
          setIsLoader(false);

          toast.success("Package updated successfully!");
        } else {
          // ---------------------------------
          //       CREATE API (POST)
          // ---------------------------------
          response = await axios.post(`${baseURL}packages/create`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          setIsLoader(false);
          setPackagesData(response.data);

          toast.success("Package created successfully!");
        }

        // resetForm();
        // onOpenChange(false);
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Something went wrong!");
        setIsLoader(false);
      }
    },
  });

  useEffect(() => {
    if (formik.values.departureDate && formik.values.arrivalDate) {
      const duration = calculateDurationInDays(
        formik.values.departureDate,
        formik.values.arrivalDate,
      );
      setIsDuration(duration);
      formik.setFieldValue("duration", duration);
    }
  }, [formik.values.departureDate, formik.values.arrivalDate]);

  return (
    <div className="min-h-full rounded-lg border py-4 bg-background">
      <main className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/packages")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Packages
        </Button>

        <div className="space-y-1 mb-5">
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight">
            {pkg ? "Update Package" : "Add New Package"}
          </h1>

          <p className="text-muted-foreground">
            {pkg
              ? "Update the package details below"
              : "Fill in the details to create a new package"}
          </p>
        </div>

        <Form {...form}>
          {/* <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4"> */}
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Details</TabsTrigger>
              <TabsTrigger value="hotel">Hotel Details </TabsTrigger>
              <TabsTrigger value="flights">
                Flight Details{" "}
                {addedFlights.length > 0 && `(${addedFlights.length})`}
              </TabsTrigger>
              <TabsTrigger value="facilities">
                Facilities{" "}
                {selectedFacilities.length > 0 &&
                  `(${selectedFacilities.length})`}
              </TabsTrigger>
            </TabsList>

            {/* create package */}

            <TabsContent value="basic" className="space-y-4 mt-4">
              <form onSubmit={formik.handleSubmit}>
                {/* Package Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label>Package Name *</Label>
                    <Input
                      name="packageName"
                      placeholder="Enter the package name..."
                      onChange={formik.handleChange}
                      value={formik.values.packageName}
                      maxLength={255}
                    />
                    {formik.errors.packageName && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.packageName}
                      </p>
                    )}
                  </div>

                  {/* Package Type */}

                  {/* Travel Type Dropdown */}
                  <div className="grid gap-2">
                    <Label>Travel Type *</Label>
                    <Select
                      onValueChange={(value) => {
                        formik.setFieldValue("travelType", value);
                      }}
                      value={formik.values.travelType}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose Travel Type" />
                      </SelectTrigger>

                      <SelectContent>
                        {travelType.slice(0, 2).map((items) => {
                          return (
                            <SelectItem value={items.lookupName}>
                              {items.lookupName}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {formik.errors.travelType && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.travelType}
                      </p>
                    )}
                  </div>
                  {/* State Dropdown */}
                  <div className="grid gap-2">
                    <Label>Select Country *</Label>
                    <Select
                      value={"1"}
                      // value={formik.values.countryId}
                      disabled
                      onValueChange={(value) => {
                        formik.setFieldValue("countryId", value);
                        setSelectedCountryId(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((items) => {
                          return (
                            <SelectItem value={String(items.countryId)}>
                              {items.countryName}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Select State *</Label>
                    <Select
                      value={formik.values.stateId}
                      onValueChange={(value) => {
                        formik.setFieldValue("stateId", value);
                        setSelectedStateId(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((items) => {
                          return (
                            <SelectItem value={String(items.stateId)}>
                              {items.stateName}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* City Dropdown */}
                  <div className="grid gap-2">
                    <Label>Select City *</Label>
                    <Select
                      value={formik.values.cityId}
                      onValueChange={(value) => {
                        formik.setFieldValue("cityId", value);
                        setSelectedCitiesId(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select state" />
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
                  </div>

                  {/* packageType Dropdown */}
                  <div className="grid gap-2">
                    <Label>Packege Type *</Label>
                    <Select
                      onValueChange={(value) => {
                        formik.setFieldValue("packageType", value);
                      }}
                      value={formik.values.packageType?.toString()}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder=" select package type" />
                      </SelectTrigger>

                      <SelectContent>
                        {packageType.map((items) => {
                          return (
                            <SelectItem value={String(items.lookupName)}>
                              {items.lookupName}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="grid gap-2 md:col-span-2">
                    <Label>Description</Label>
                    <textarea
                      name="description"
                      className="border p-2 rounded-md"
                      placeholder="Description..."
                      maxLength={101}
                      rows={2}
                      onChange={formik.handleChange}
                      value={formik.values.description}
                    />
                    {formik.errors.description && (
                      <span className="text-red-500">
                        {formik.errors.description}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="grid gap-2">
                    <Label>Price *</Label>
                    {/* <Input
                      type="number"
                      name="price"
                      placeholder="350000"
                      maxLength={38}
                      onChange={formik.handleChange}
                      value={formik.values.price}
                    /> */}
                    <Input
                      type="text"
                      name="price"
                      placeholder="350000.00"
                      value={formik.values.price}
                      onChange={(e) => {
                        const value = e.target.value;

                        // allow only numbers with max 38 digits and 2 decimals
                        const regex = /^\d{0,36}(\.\d{0,2})?$/;

                        if (regex.test(value)) {
                          formik.setFieldValue("price", value);
                        }
                      }}
                    />
                    {formik.errors.price && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.price}
                      </p>
                    )}
                  </div>

                  {/* Original Price */}
                  <div className="grid gap-2">
                    <Label>Original Price</Label>
                    {/* <Input
                      type="number"
                      name="originalPrice"
                      placeholder="550000"
                      onChange={formik.handleChange}
                      value={formik.values.originalPrice}
                    /> */}
                    <Input
                      type="text"
                      name="price"
                      placeholder="350000.00"
                      value={formik.values.originalPrice}
                      onChange={(e) => {
                        const value = e.target.value;

                        // allow only numbers with max 38 digits and 2 decimals
                        const regex = /^\d{0,36}(\.\d{0,2})?$/;

                        if (regex.test(value)) {
                          formik.setFieldValue("originalPrice", value);
                        }
                      }}
                    />
                  </div>

                  {/* Departure Date & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Departure Date</Label>
                      <Input
                        type="date"
                        name="departureDate"
                        onChange={formik.handleChange}
                        value={formik.values.departureDate}
                      />
                    </div>
                    {/* Departure Time */}
                    <div className="grid gap-2">
                      <Label>Departure Time</Label>
                      <Input
                        type="time"
                        name="departureTime"
                        onChange={formik.handleChange}
                        value={formik.values.departureTime}
                      />
                    </div>
                  </div>

                  {/* Arrival Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Arrival Date</Label>
                      <Input
                        type="date"
                        name="arrivalDate"
                        min={formik.values.departureDate || undefined}
                        onChange={formik.handleChange}
                        value={formik.values.arrivalDate}
                      />
                    </div>
                    {/* Arrival Time */}
                    <div className="grid gap-2">
                      <Label>Arrival Time</Label>
                      <Input
                        type="time"
                        name="arrivalTime"
                        onChange={formik.handleChange}
                        value={formik.values.arrivalTime}
                      />
                    </div>
                  </div>

                  {/* Package Duration (Auto Calculated) */}
                  <div className="grid gap-2">
                    <Label>Package Duration</Label>
                    <Input
                      value={isDuration ? `${isDuration} Days` : ""}
                      disabled
                      className="bg-muted cursor-not-allowed"
                      placeholder="Package duration"
                    />
                  </div>

                  {/* Seats */}
                  <div className="grid gap-2">
                    <Label>Total Seats</Label>
                    <Input
                      type="number"
                      name="totalSeats"
                      placeholder="350"
                      onChange={formik.handleChange}
                      value={formik.values.totalSeats}
                    />
                  </div>

                  {/* Notes */}
                  <div className="grid gap-2 md:col-span-2">
                    <div className="flex items-center gap-1">
                      <Label>Notes</Label>
                      <span className="text-sm text-muted-foreground">
                        (For internal use)
                      </span>
                    </div>
                    <textarea
                      name="notes"
                      placeholder="Notes..."
                      className="border p-2 rounded-md"
                      rows={2}
                      onChange={formik.handleChange}
                      value={formik.values.notes}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  {pkg ? (
                    <Button type="submit">
                      {isLoader ? "Updating..." : "Update Package"}
                    </Button>
                  ) : (
                    <Button type="submit">
                      {isLoader ? "Creating..." : "Create Package"}
                    </Button>
                  )}
                </div>
              </form>
            </TabsContent>

            <TabsContent value="hotel" className="space-y-6 mt-4">
              <HotelDetails pkg={pkg} packageId={packageData.packageId} />
            </TabsContent>

            <TabsContent value="flights" className="space-y-6 mt-4">
              {/* Add New Flight Section */}
              <FlightDetails pkg={pkg} packageId={packageData.packageId} />
            </TabsContent>
            <TabsContent value="facilities" className="space-y-6 mt-4">
              <Facilities pkg={pkg} packageId={packageData.packageId} />
            </TabsContent>
          </Tabs>
          {/* </form> */}
        </Form>
      </main>
    </div>
  );
}
