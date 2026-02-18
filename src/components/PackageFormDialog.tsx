import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import { baseURL } from "@/utils/constant/url";

interface PackageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package?: any;
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

export function PackageFormDialog({
  open,
  onOpenChange,
  package: pkg,
}: PackageFormDialogProps) {
  const [travelType, setTravelType] = useState<LookupType[]>([]);
  const [packageType, setPackageType] = useState<LookupType[]>([]);
  const [countries, setCountries] = useState([]);
  const [state, setState] = useState<StateType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectdCitiesId, setSelectedCitiesId] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [isLoader, setIsLoader] = useState(false);

  useEffect(() => {
    if (!open) {
      formik.resetForm();
      setSelectedStateId("");
      setSelectedCitiesId("");
    }
  }, [open]);

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
        departureTime: pkg.departureTime || "",
        arrivalTime: pkg.arrivalTime || "",
        flightStops: pkg.flightStops || "",
        departureAirlines: pkg.departureAirlines || "",
        arrivalAirlines: pkg.arrivalAirlines || "",
        bookedSeats: pkg.bookedSeats || "",
        totalSeats: pkg.totalSeats || "",
        availableSeats: pkg.availableSeats || "",
        featured: pkg.featured || false,
        notes: pkg.notes || "",
      });

      // 👇 State drop-down ke liye values set karna zaroori hai
      setSelectedStateId(pkg.stateId);
      setSelectedCitiesId(pkg.cityId);
    }
  }, [pkg]);

  const agentId = sessionStorage.getItem("agentID");
  
  useEffect(() => {
    fetchTravelType();
  }, []);

  // countries, cities and states api calling

  useEffect(() => {
    // fetchStates();
    fetchCountries();
    fetchPackageType();
  }, []);
  useEffect(() => {
    if (selectedCountryId) {
      fetchStates();
    }
  }, [selectedCountryId]);

  useEffect(() => {
    if (selectedStateId) {
      fetchCities();
    }
  }, [selectedStateId]);

   const fetchCountries = async () => {
    try {
      const response = await axios.get(
        `${baseURL}countries`);
      setCountries(response.data);
      
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchStates = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get<StateType[]>(
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
      const token = sessionStorage.getItem("token");
      const response = await axios.get<CityType[]>(
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
  // countries, cities and states api calling

  const fetchTravelType = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get<LookupType[]>(
        "http://31.97.205.55:8080/api/lookups/TRAVEL_TYPE",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTravelType(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchPackageType = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        "http://31.97.205.55:8080/api/lookups/PACKAGE_TYPE",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPackageType(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      agentId: agentId,
      countryId:"",
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
      departureAirlines: "",
      arrivalAirlines: "",
      bookedSeats: "",
      totalSeats: "",
      availableSeats: "",
      featured: false,
      notes: "",
    },

    validationSchema: Yup.object({
      packageName: Yup.string().required("Package name is required"),
      travelType: Yup.string().required("Travel type required"),
      price: Yup.number().required("Current Price  is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const token = sessionStorage.getItem("token");
        setIsLoader(true);
        // Convert required fields to number
        const payload = {
          ...values,
          agentId: agentId,
          countryId: Number(values.countryId),
          stateId: Number(values.stateId),
          cityId: Number(values.cityId),
          packageType: String(values.packageType),
          travelType: String(values.travelType),
          price: Number(values.price),
          originalPrice: Number(values.originalPrice),
          bookedSeats: Number(values.bookedSeats),
          totalSeats: Number(values.totalSeats),
          availableSeats: Number(values.availableSeats),
          // Convert date inputs into ISO format
          departureDate: values.departureDate
            ? new Date(values.departureDate).toISOString()
            : null,
          arrivalDate: values.arrivalDate
            ? new Date(values.arrivalDate).toISOString()
            : null,
          departureTime: values.departureTime
            ? new Date(values.departureTime).toISOString()
            : null,
          arrivalTime: values.arrivalTime
            ? new Date(values.arrivalTime).toISOString()
            : null,
        };
        let response;
        if (pkg) {
          // ---------------------------------
          //       UPDATE API (PUT)
          // ---------------------------------
          response = await axios.put(
            `http://31.97.205.55:8080/api//${pkg.packageId}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          setIsLoader(false);
          toast.success("Package updated successfully!");
        } else {
          // ---------------------------------
          //       CREATE API (POST)
          // ---------------------------------
          
          response = await axios.post(
            "http://31.97.205.55:8080/api//create",
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          setIsLoader(false);
          toast.success("Package created successfully!");
        }

        resetForm();
        onOpenChange(false);
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Something went wrong!");
        setIsLoader(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[70%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {pkg ? "Update Package" : "Add New Package"}
          </DialogTitle>
          <DialogDescription>
            {`Fill all required fields to ${
              pkg ? "update" : "create"
            } a package.`}
          </DialogDescription>
        </DialogHeader>

        {/* FORM */}
        <form
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Package Name */}
          <div className="grid gap-2">
            <Label>Package Name *</Label>
            <Input
              name="packageName"
              onChange={formik.handleChange}
              value={formik.values.packageName}
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
                {travelType.map((items) => {
                  return (
                    <SelectItem value={items.lookupName}>
                      {items.lookupName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {formik.errors.travelType && (
              <p className="text-red-500 text-sm">{formik.errors.travelType}</p>
            )}
          </div>
          {/* State Dropdown */}
          <div className="grid gap-2">
            <Label>Select Country *</Label>
            <Select
              value={formik.values.countryId}
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
                {state.map((items) => {
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
                    <SelectItem key={items.cityId} value={String(items.cityId)}>
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

          {/* Trusted */}
          <div className="flex items-center pt-3 space-x-3">
            <Checkbox
              id="featured"
              checked={formik.values.featured}
              onCheckedChange={(v) => formik.setFieldValue("featured", v)}
            />
            <Label htmlFor="featured">Featured Package</Label>
          </div>

          {/* Description */}
          <div className="grid gap-2 md:col-span-2">
            <Label>Description</Label>
            <textarea
              name="description"
              className="border p-2 rounded-md"
              rows={3}
              onChange={formik.handleChange}
              value={formik.values.description}
            />
          </div>

          {/* Price */}
          <div className="grid gap-2">
            <Label>Current Price  *</Label>
            <Input
              type="number"
              name="price"
              onChange={formik.handleChange}
              value={formik.values.price}
            />
            {formik.errors.price && (
              <p className="text-red-500 text-sm">{formik.errors.price}</p>
            )}
          </div>

          {/* Original Price */}
          <div className="grid gap-2">
            <Label>Original Price</Label>
            <Input
              type="number"
              name="originalPrice"
              onChange={formik.handleChange}
              value={formik.values.originalPrice}
            />
          </div>

          {/* Duration */}
          <div className="grid gap-2">
            <Label>Duration</Label>
            <Input
              name="duration"
              onChange={formik.handleChange}
              value={formik.values.duration}
            />
          </div>

          {/* Departure Date */}
          <div className="grid gap-2">
            <Label>Departure Date</Label>
            <Input
              type="date"
              name="departureDate"
              onChange={formik.handleChange}
              value={formik.values.departureDate}
            />
          </div>

          {/* Arrival Date */}
          <div className="grid gap-2">
            <Label>Arrival Date</Label>
            <Input
              type="date"
              name="arrivalDate"
              onChange={formik.handleChange}
              value={formik.values.arrivalDate}
            />
          </div>

          {/* Departure Time */}
          <div className="grid gap-2">
            <Label>Departure Time</Label>
            <Input
              type="datetime-local"
              name="departureTime"
              onChange={formik.handleChange}
              value={formik.values.departureTime}
            />
          </div>

          {/* Arrival Time */}
          <div className="grid gap-2">
            <Label>Arrival Time</Label>
            <Input
              type="datetime-local"
              name="arrivalTime"
              onChange={formik.handleChange}
              value={formik.values.arrivalTime}
            />
          </div>

          {/* Airlines */}
          <div className="grid gap-2">
            <Label>Departure Airlines</Label>
            <Input
              name="departureAirlines"
              onChange={formik.handleChange}
              value={formik.values.departureAirlines}
            />
          </div>

          <div className="grid gap-2">
            <Label>Arrival Airlines</Label>
            <Input
              name="arrivalAirlines"
              onChange={formik.handleChange}
              value={formik.values.arrivalAirlines}
            />
          </div>

          {/* Seats */}
          <div className="grid gap-2">
            <Label>Total Seats</Label>
            <Input
              type="number"
              name="totalSeats"
              onChange={formik.handleChange}
              value={formik.values.totalSeats}
            />
          </div>

          <div className="grid gap-2">
            <Label>Booked Seats</Label>
            <Input
              type="number"
              name="bookedSeats"
              onChange={formik.handleChange}
              value={formik.values.bookedSeats}
            />
          </div>

          <div className="grid gap-2">
            <Label>Available Seats</Label>
            <Input
              type="number"
              name="availableSeats"
              onChange={formik.handleChange}
              value={formik.values.availableSeats}
            />
          </div>

          {/* Notes */}
          <div className="grid gap-2 md:col-span-2">
            <Label>Notes</Label>
            <textarea
              name="notes"
              className="border p-2 rounded-md"
              rows={2}
              onChange={formik.handleChange}
              value={formik.values.notes}
            />
          </div>

          {/* Footer */}
          <DialogFooter className="md:col-span-2 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {pkg ? (
              <Button type="submit">
                {isLoader ? "Updating..." : "Update Package"}
              </Button>
            ) : (
              <Button type="submit">
                {isLoader ? "Creating..." : "Create Package"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
