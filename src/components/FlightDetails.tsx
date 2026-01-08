import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import Loader from "./Loader";

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

const validationSchema = yup.object({
  airline: yup.string().required("Airline is required"),
  flightNumber: yup.string().required("Flight number is required"),
  flightClass: yup.string().required("Flight class is required"),
  departureCountries: yup.string().required("Departure country is required"),
  departureState: yup.string().required("Departure state is required"),
  departureCity: yup.string().required("Departure city is required"),
  arrivalCountries: yup.string().required("Arrival country is required"),
  arrivalState: yup.string().required("Arrival state is required"),
  arrivalCity: yup.string().required("Arrival city is required"),
  departureDate: yup.date().required("Departure date is required"),
  departureTime: yup.string().required("Departure time is required"),
  arrivalDate: yup.date().required("Arrival date is required"),
  arrivalTime: yup.string().required("Arrival time is required"),
});

interface StateType {
  stateId: number;
  stateName: string;
}

interface CityType {
  cityId: number;
  cityName: string;
}

const FlightDetails = ({ pkg, packageId }) => {
  const [addedFlights, setAddedFlights] = useState<FlightSegment[]>([]);
  const [flightDetails, setFlightDetails] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [countries, setCountries] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [state, setState] = useState<StateType[]>([]);
  const [state2, setState2] = useState<StateType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const [cities2, setCities2] = useState<CityType[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectdCitiesId, setSelectedCitiesId] = useState("");
  const [selectedCountryId2, setSelectedCountryId2] = useState("");
  const [selectedStateId2, setSelectedStateId2] = useState("");
  const [selectdCitiesId2, setSelectedCitiesId2] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [flightClass, setFlightClass] = useState<any>([]);
  const [selectedFlightClass, setSelectedFlightClass] = useState<any>([]);
  const [currentPackageId, setCurrentPackageId] = useState<number | null>(
    pkg?.packageId ?? packageId ?? null
  );
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState<any>(null);

  const id = pkg?.packageId;

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${baseURL}countries`);
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const fetchAirlines = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}airlines`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAirlines(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchAirlinesType = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}lookups/FLIGHT_CLASS`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFlightClass(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchStates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<StateType[]>(
        `http://31.97.205.55:8080/api/states/byCountry/${selectedCountryId}`,
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

  const fetchStates2 = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<StateType[]>(
        `http://31.97.205.55:8080/api/states/byCountry/${selectedCountryId2}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState2(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const token = localStorage.getItem("token");
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

  const fetchCities2 = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<CityType[]>(
        `http://31.97.205.55:8080/api/cities/byState/${selectedStateId2}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCities2(response.data);
    } catch (error) {
      console.error("Error fetching Cities:", error);
    }
  };

  const getFlightByID = async (pkgId?: number) => {
    try {
      setIsLoader(true);
      const token = localStorage.getItem("token");

      const finalId = pkgId ?? currentPackageId;
      if (!finalId) return;

      const response = await axios.get(
        `${baseURL}package-airlines/byPackage/${finalId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFlightDetails(response.data || []);
    } catch (error) {
      console.error("GET API Error:", error);
    } finally {
      setIsLoader(false);
    }
  };

  useEffect(() => {
    if (currentPackageId) {
      getFlightByID(currentPackageId);
    }
  }, [currentPackageId]);

  useEffect(() => {
    fetchCountries();
    fetchAirlines();
    fetchAirlinesType();
  }, []);

  useEffect(() => {
    if (selectedCountryId) {
      fetchStates();
    }
  }, [selectedCountryId]);

  useEffect(() => {
    if (selectedCountryId2) {
      fetchStates2();
    }
  }, [selectedCountryId2]);

  useEffect(() => {
    if (selectedStateId) {
      fetchCities();
    }
  }, [selectedStateId]);

  useEffect(() => {
    if (selectedStateId2) {
      fetchCities2();
    }
  }, [selectedStateId2]);
  7;

  useEffect(() => {
    if (!flightDetails) return;

    const mapped = flightDetails.map((item: any) => {
      return {
        id: String(item.id), // DB id
        flightId: item.id,
        airlineId: item.airlineDetails?.airlineId,
        airline: item.airlineDetails?.flightName,
        flightNumber: item.airlineDetails?.flightCode,
        flightClass: item.flightClass,

        departureCountries: item.departureCountryId,
        departureState: item.departureStateId,
        departureCity: item.departureCityId,
        arrivalCountries: item.arrivalCountryId,
        arrivalState: item.arrivalStateId,
        arrivalCity: item.arrivalCityId,

        departureDate: item.departureDate
          ? new Date(item.departureDate)
          : undefined,
        arrivalDate: item.arrivalDate ? new Date(item.arrivalDate) : undefined,

        departureTime: item.departureTime?.slice(11, 16),
        arrivalTime: item.arrivalTime?.slice(11, 16),

        isExisting: true, // ✅ VERY IMPORTANT
        isEdited: false,
      };
    });

    setAddedFlights(mapped);
  }, [flightDetails]);

  const formik = useFormik({
    initialValues: {
      airline: "",
      flightNumber: "",
      flightClass: "",
      departureCountries: "",
      departureState: "",
      departureCity: "",
      arrivalCountries: "",
      arrivalState: "",
      arrivalCity: "",
      departureDate: undefined,
      arrivalDate: undefined,
      departureTime: "09:00",
      arrivalTime: "12:00",
    },
    validationSchema,
    validateOnChange: false,   
  validateOnBlur: true,    
    onSubmit: (values, { resetForm }) => {
      const newFlight = {
        id: editIndex !== null ? addedFlights[editIndex].id : `${Date.now()}`,
        ...values,
        isExisting:
          editIndex !== null ? addedFlights[editIndex].isExisting : false, // ✅ NEW flight
        isEdited: editIndex !== null,
      };

      if (editIndex !== null) {
        // UPDATE MODE
        const copy = [...addedFlights];
        copy[editIndex] = newFlight;
        setAddedFlights(copy);
        toast.success("Flight segment updated!");
      } else {
        // ADD MODE
        setAddedFlights([...addedFlights, newFlight]);
        toast.success("Flight segment added!");
      }

      resetForm();
      setEditIndex(null); // reset edit mode
    },
  });

  const isEditMode = editIndex !== null;

  const deleteFlightFromBackend = async (flightId: string) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${baseURL}package-airlines/${flightId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Flight deleted successfully");
    } catch (error) {
      console.error("Delete API error:", error);
      toast.error("Failed to delete flight");
      throw error;
    }
  };

  const handleRemoveFlight = async (flightId: string) => {
    const flightToRemove = addedFlights.find((f) => f.id === flightId);
    if (!flightToRemove) return;

    // ✅ Case 1: Backend se aaya hua flight
    if (flightToRemove.isExisting) {
      try {
        setIsLoader(true);

        await deleteFlightFromBackend(flightToRemove.id);

        // UI se remove
        setAddedFlights((prev) => prev.filter((f) => f.id !== flightId));
      } finally {
        setIsLoader(false);
      }
    }
    // ✅ Case 2: Frontend-only added flight
    else {
      setAddedFlights((prev) => prev.filter((f) => f.id !== flightId));
      toast.success("Flight removed");
    }
  };

  const confirmDeleteFlight = async () => {
    if (!flightToDelete) return;

    try {
      setIsLoader(true);

      // Backend data → DELETE API
      if (flightToDelete.isExisting) {
        await deleteFlightFromBackend(flightToDelete.id);
      }

      // UI se remove (both cases)
      setAddedFlights((prev) => prev.filter((f) => f.id !== flightToDelete.id));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoader(false);
      setOpenDeleteDialog(false);
      setFlightToDelete(null);
    }
  };

  const handleCreatePackage = async () => {
    if (addedFlights.length === 0) {
      toast.error("Please add at least one flight!");
      return;
    }

    try {
      setIsLoader(true);
      const token = localStorage.getItem("token");

      for (const flight of addedFlights) {
        const payload = {
          packageId: id ?? packageId,
          airlineId: Number(flight.airline),
          flightNumber: flight.flightNumber,
          flightClass: flight.flightClass,
          departureDate: new Date(flight.departureDate).toISOString(),
          departureTime: new Date(
            `1970-01-01T${flight.departureTime}:00`
          ).toISOString(),
          arrivalDate: new Date(flight.arrivalDate).toISOString(),
          arrivalTime: new Date(
            `1970-01-01T${flight.arrivalTime}:00`
          ).toISOString(),
          notes: "Flight segment added",
        };

        // ✅ ONLY UPDATE IF EXISTING + EDITED
        if (flight.isExisting && flight.isEdited) {
          const response = await axios.put(
            `${baseURL}package-airlines/${flight.id}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }

        // ✅ ONLY CREATE IF NEW
        if (!flight.isExisting) {
          const response = await axios.post(
            `${baseURL}package-airlines`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const newPackageId =
            response.data?.packageId || response.data?.package?.packageId;

          if (newPackageId) {
            setCurrentPackageId(newPackageId);
            getFlightByID(newPackageId); // ✅ immediate refetch with correct ID
          }
        }
      }

      toast.success("Flights saved successfully!");
      // setAddedFlights([]);
      formik.resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save flights");
    } finally {
      setIsLoader(false);
    }
  };

  const handleEditFlight = (flight, index) => {
    setEditIndex(index);

    formik.setValues({
      airline: String(flight.airlineId ?? flight.airline),
      flightNumber: flight.flightNumber,
      flightClass: String(flight.flightClass),
      departureCountries: String(flight.departureCountries),
      departureState: String(flight.departureState),
      departureCity: String(flight.departureCity),
      arrivalCountries: String(flight.arrivalCountries),
      arrivalState: String(flight.arrivalState),
      arrivalCity: String(flight.arrivalCity),
      departureDate: new Date(flight.departureDate),
      arrivalDate: new Date(flight.arrivalDate),
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
    });
  };

  useEffect(() => {
    const dep = formik.values.departureDate;
    const arr = formik.values.arrivalDate;

    if (dep && arr && arr <= dep) {
      formik.setFieldValue("arrivalDate", undefined);
    }
  }, [formik.values.departureDate]);

  return (
    <>
      {/* Added Flights List */}
      {addedFlights.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            Added Flight Segments ({addedFlights.length})
          </h4>

          {addedFlights.map((flight, index) => (
            <div
              key={flight.id}
              className="rounded-lg border bg-card p-4 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-primary" />
                    <h5 className="font-semibold">
                      {flight.airline} - {flight.flightNumber}
                    </h5>
                    {/* Flight Class Badge */}
                    {flight?.flightClass && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                        {flight?.flightClass} Class
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {flight.departureCity} → {flight.arrivalCity}
                  </div>
                  <div className="text-xs text-muted-foreground pt-1">
                    Departure: {format(flight.departureDate, "PPP")} at{" "}
                    {flight.departureTime}
                    <br />
                    Arrival: {format(flight.arrivalDate, "PPP")} at{" "}
                    {flight.arrivalTime}
                  </div>
                </div>
                <div>
                  {pkg ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditFlight(flight, index)}
                    >
                      Edit
                    </Button>
                  ) : null}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFlightToDelete(flight);
                      setOpenDeleteDialog(true);
                    }}
                    className="text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Starts */}
      <form onSubmit={formik.handleSubmit} className="space-y-4 pt-4 border-t">
        <h4 className="text-sm font-semibold">Add Flight Segment</h4>

        {/* Airline + Flight */}
        <div className="grid grid-cols-3 gap-4">
          <FormItem>
            <FormLabel>Airline</FormLabel>
            <Select
              value={formik.values.airline}
              onValueChange={(value) => {
                formik.setFieldValue("airline", value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select departure country" />
              </SelectTrigger>
              <SelectContent>
                {airlines.map((items) => {
                  return (
                    <SelectItem value={String(items.airlineId)}>
                      {items.flightName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <FormMessage>{formik.errors.airline}</FormMessage>
          </FormItem>

          <FormItem>
            <FormLabel>Flight Number</FormLabel>
            <FormControl>
              <Input
                name="flightNumber"
                placeholder="e.g., SV123"
                value={formik.values.flightNumber}
                onChange={formik.handleChange}
              />
            </FormControl>
            <FormMessage>{formik.errors.flightNumber}</FormMessage>
          </FormItem>

          <FormItem>
            <FormLabel>Flight Class</FormLabel>
            <Select
              value={formik.values.flightClass}
              onValueChange={(value) => {
                formik.setFieldValue("flightClass", value);
                setSelectedFlightClass(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select flight class" />
              </SelectTrigger>
              <SelectContent>
                {flightClass.map((items: any) => {
                  return (
                    <SelectItem value={String(items.lookupName)}>
                      {items.lookupName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <FormMessage>{formik.errors.flightClass}</FormMessage>
          </FormItem>
        </div>

        {/* City Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-xl p-4 sm:p-5">
            {/* Heading */}
            <div className="flex items-center gap-2 mb-4">
              <PlaneTakeoff className="text-primary" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">
                Departure Details
              </h3>
            </div>
            <div className="grid gap-4">
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  value={formik.values.departureCountries}
                  onValueChange={(value) => {
                    formik.setFieldValue("departureCountries", value);
                    setSelectedCountryId(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select departure country" />
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
                <FormMessage>{formik.errors.departureCountries}</FormMessage>
              </FormItem>

              {/* State     */}
              <FormItem>
                <FormLabel>State</FormLabel>
                <Select
                  value={formik.values.departureState}
                  onValueChange={(value) => {
                    formik.setFieldValue("departureState", value);
                    setSelectedStateId(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select departure state" />
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
                <FormMessage>{formik.errors.departureState}</FormMessage>
              </FormItem>

              {/* city */}
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select
                  value={formik.values.departureCity}
                  onValueChange={(value) => {
                    formik.setFieldValue("departureCity", value);
                    setSelectedCitiesId(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select departure city" />
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
                <FormMessage>{formik.errors.departureCity}</FormMessage>
              </FormItem>

              {/* date & time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Departure Date */}
                <FormItem className="">
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    name="departureDate"
                    value={
                      formik.values.departureDate
                        ? format(formik.values.departureDate, "yyyy-MM-dd")
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue(
                        "departureDate",
                        value ? new Date(value) : null
                      );
                    }}
                  />
                  <FormMessage>{formik.errors.departureDate}</FormMessage>
                </FormItem>

                {/* Departure Time */}
                <FormItem className="">
                  <FormLabel>Time</FormLabel>
                  <Input
                    type="time"
                    name="departureTime"
                    value={formik.values.departureTime}
                    onChange={formik.handleChange}
                  />
                  <FormMessage>{formik.errors.departureTime}</FormMessage>
                </FormItem>
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-4 sm:p-5">
            {/* Heading */}
            <div className="flex items-center gap-2 mb-4">
              <PlaneLanding className="text-primary" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">
                Arrival Details
              </h3>
            </div>
            <div className="grid gap-4">
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  value={formik.values.arrivalCountries}
                  onValueChange={(value) => {
                    formik.setFieldValue("arrivalCountries", value);
                    setSelectedCountryId2(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select arrival country" />
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
                <FormMessage>{formik.errors.arrivalCountries}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>States</FormLabel>
                <Select
                  value={formik.values.arrivalState}
                  onValueChange={(value) => {
                    formik.setFieldValue("arrivalState", value);
                    setSelectedStateId2(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select arrival state" />
                  </SelectTrigger>
                  <SelectContent>
                    {state2.map((items) => {
                      return (
                        <SelectItem value={String(items.stateId)}>
                          {items.stateName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage>{formik.errors.arrivalState}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>City</FormLabel>
                <Select
                  value={formik.values.arrivalCity}
                  onValueChange={(value) => {
                    formik.setFieldValue("arrivalCity", value);
                    setSelectedCitiesId2(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select arrival city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities2.map((items) => {
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
                <FormMessage>{formik.errors.arrivalCity}</FormMessage>
              </FormItem>

              {/* date & time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Arrival Date */}
                <FormItem className="">
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    name="arrivalDate"
                    value={
                      formik.values.arrivalDate
                        ? format(formik.values.arrivalDate, "yyyy-MM-dd")
                        : ""
                    }
                    min={
                      formik.values.departureDate
                        ? format(formik.values.departureDate, "yyyy-MM-dd")
                        : undefined
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue(
                        "arrivalDate",
                        value ? new Date(value) : null
                      );
                    }}
                  />
                  <FormMessage>{formik.errors.arrivalDate}</FormMessage>
                </FormItem>

                {/* Arrival Time */}
                <FormItem className="">
                  <FormLabel>Time</FormLabel>
                  <Input
                    type="time"
                    name="arrivalTime"
                    value={formik.values.arrivalTime}
                    onChange={formik.handleChange}
                  />
                  <FormMessage>{formik.errors.arrivalTime}</FormMessage>
                </FormItem>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" variant="secondary" className="w-full">
          {isEditMode ? "Update Flight" : "Add Flight to Package"}
        </Button>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">Cancel</Button>
          {!isEditMode && (
            <Button onClick={handleCreatePackage}>
              {isLoader ? "Saving..." : "Save Package"}
            </Button>
          )}
        </div>
      </form>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Flight Segment</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this flight?
              <br />
              <span className="font-medium text-foreground">
                {flightToDelete?.airline} – {flightToDelete?.flightNumber}
              </span>
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpenDeleteDialog(false);
                setFlightToDelete(null);
              }}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={confirmDeleteFlight}
              disabled={isLoader}
            >
              {isLoader ? "Deleting..." : "OK, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FlightDetails;
