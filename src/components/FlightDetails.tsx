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

  airlineId: number;
  airlineName: string;

  flightNumber: string;
  flightClass: string;

  departureCountryId: number;
  departureCountryName: string;
  departureStateId: number;
  departureStateName: string;
  departureCityId: number;
  departureCityName: string;

  arrivalCountryId: number;
  arrivalCountryName: string;
  arrivalStateId: number;
  arrivalStateName: string;
  arrivalCityId: number;
  arrivalCityName: string;

  departureDate: Date;
  departureTime: string;
  arrivalDate: Date;
  arrivalTime: string;

  isExisting: boolean;
  isEdited: boolean;
}

const validationSchema = yup.object({
  airline: yup.string().required("Airline is required"),
  departureAirport: yup.string().required("Departure airport is required"),
  arrivalAirport: yup.string().required("Arrival airport is required"),
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
  const [airports, setAirports] = useState<any>([]);
  const [selectedFlightClass, setSelectedFlightClass] = useState<any>([]);
  const [currentPackageId, setCurrentPackageId] = useState<number | null>(
    pkg?.packageId ?? packageId ?? null,
  );
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState<any>(null);
  const [formKey, setFormKey] = useState(0);
  const [pendingEditFlight, setPendingEditFlight] = useState<any>(null);
  const [previewDepartureAirport, setPreviewDepartureAirport] =
    useState<any>(null);
  const [previewArrivalAirport, setPreviewArrivalAirport] = useState<any>(null);

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
  const fetchAirport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}airports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAirports(response.data);
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
        `${baseURL}states/byCountry/${selectedCountryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
        `${baseURL}states/byCountry/${selectedCountryId2}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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

  const fetchCities2 = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<CityType[]>(
        `${baseURL}cities/byState/${selectedStateId2}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
        },
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
    fetchAirport();
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
    if (!flightDetails || flightDetails.length === 0) return;

    const mapped = flightDetails.map((item: any) => {
      const airlineFromList = airlines.find(
        (a) => Number(a.airlineId) === Number(item.airlineId),
      );

      return {
        id: String(item.id),

        airlineId: Number(item.airlineDetails?.airlineId),

        // ✅ MOST IMPORTANT FIX
        airlineName: item.airlineDetails?.flightName,

        flightNumber: item.flightNumber,
        flightClass: item.flightClass,

        departureCountryId: item.departureCountryId,
        departureCountryName: item.departureCountryName,

        departureStateId: item.departureStateId,
        departureStateName: item.departureStateName,

        departureCityId: item.departureCityId,
        departureCityName: item.departureCityName,

        arrivalCountryId: item.arrivalCountryId,
        arrivalCountryName: item.arrivalCountryName,

        arrivalStateId: item.arrivalStateId,
        arrivalStateName: item.arrivalStateName,

        arrivalCityId: item.arrivalCityId,
        arrivalCityName: item.arrivalCityName,

        departureDate: new Date(item.departureDate),
        arrivalDate: new Date(item.arrivalDate),

        departureTime: item.departureTime?.slice(11, 16),
        arrivalTime: item.arrivalTime?.slice(11, 16),

        isExisting: true,
        isEdited: false,
      };
    });

    setAddedFlights(mapped);
  }, [flightDetails, airlines]);

  const formik = useFormik({
    initialValues: {
      airline: "",
      departureAirport: "",
      arrivalAirport: "",

      // 👇 hidden values (airport se fill honge)
      departureCountries: "",
      departureState: "",
      departureCity: "",

      arrivalCountries: "",
      arrivalState: "",
      arrivalCity: "",

      flightNumber: "",
      flightClass: "",
      departureDate: undefined,
      arrivalDate: undefined,
      departureTime: "09:00",
      arrivalTime: "12:00",
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values, { resetForm }) => {
      const newFlight: FlightSegment = {
        id: editIndex !== null ? addedFlights[editIndex].id : `${Date.now()}`,

        airlineId: Number(values.airline),
        airlineName:
          airlines.find((a) => a.airlineId === Number(values.airline))
            ?.flightName || "",

        flightNumber: values.flightNumber,
        flightClass: values.flightClass,

        departureCountryId: Number(values.departureCountries),
        departureCountryName:
          countries.find(
            (c) => c.countryId === Number(values.departureCountries),
          )?.countryName || "",

        departureStateId: Number(values.departureState),
        departureStateName:
          state.find((s) => s.stateId === Number(values.departureState))
            ?.stateName || "",

        departureCityId: Number(values.departureCity),
        departureCityName:
          cities.find((c) => c.cityId === Number(values.departureCity))
            ?.cityName || "",

        arrivalCountryId: Number(values.arrivalCountries),
        arrivalCountryName:
          countries.find((c) => c.countryId === Number(values.arrivalCountries))
            ?.countryName || "",

        arrivalStateId: Number(values.arrivalState),
        arrivalStateName:
          state2.find((s) => s.stateId === Number(values.arrivalState))
            ?.stateName || "",

        arrivalCityId: Number(values.arrivalCity),
        arrivalCityName:
          cities2.find((c) => c.cityId === Number(values.arrivalCity))
            ?.cityName || "",

        departureDate: values.departureDate!,
        arrivalDate: values.arrivalDate!,
        departureTime: values.departureTime,
        arrivalTime: values.arrivalTime,

        isExisting:
          editIndex !== null ? addedFlights[editIndex].isExisting : false,
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
      setPreviewDepartureAirport(null);
      setPreviewArrivalAirport(null);
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
          airlineId: flight.airlineId,
          flightNumber: flight.flightNumber,
          flightClass: flight.flightClass,

          departureDate: flight.departureDate.toISOString(),
          departureTime: new Date(
            `1970-01-01T${flight.departureTime}:00`,
          ).toISOString(),

          arrivalDate: flight.arrivalDate.toISOString(),
          arrivalTime: new Date(
            `1970-01-01T${flight.arrivalTime}:00`,
          ).toISOString(),

          departureCountryId: flight.departureCountryId,
          departureStateId: flight.departureStateId,
          departureCityId: flight.departureCityId,

          arrivalCountryId: flight.arrivalCountryId,
          arrivalStateId: flight.arrivalStateId,
          arrivalCityId: flight.arrivalCityId,

          notes: flight.isEdited ? "Flight updated" : "Flight added",
          createdBy: 0,
          updatedBy: 0,
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
            },
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
            },
          );
          const newPackageId =
            response.data?.packageId || response.data?.package?.packageId;

          if (newPackageId) {
            setCurrentPackageId(newPackageId);
            getFlightByID(newPackageId); // ✅ immediate refetch with correct ID
          }
        }
      }
      await getFlightByID(id ?? packageId ?? currentPackageId);
      toast.success("Flights saved successfully!");
      // setAddedFlights([]);
      setFormKey((prev) => prev + 1);
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

    // store IDs only
    setSelectedCountryId(String(flight.departureCountryId));
    setSelectedStateId(String(flight.departureStateId));

    setSelectedCountryId2(String(flight.arrivalCountryId));
    setSelectedStateId2(String(flight.arrivalStateId));

    // store flight temporarily
    setPendingEditFlight(flight);
  };

  useEffect(() => {
    if (!pendingEditFlight) return;
    if (!airports.length) return;
    if (!state.length || !state2.length) return;
    if (!cities.length || !cities2.length) return;

    const flight = pendingEditFlight;

    const departureAirportObj = airports.find(
      (a) =>
        a.countryId === flight.departureCountryId &&
        a.stateId === flight.departureStateId &&
        a.cityId === flight.departureCityId,
    );

    const arrivalAirportObj = airports.find(
      (a) =>
        a.countryId === flight.arrivalCountryId &&
        a.stateId === flight.arrivalStateId &&
        a.cityId === flight.arrivalCityId,
    );

    formik.setValues({
      airline: String(flight.airlineId),

      departureAirport: departureAirportObj
        ? String(departureAirportObj.airportId)
        : "",

      arrivalAirport: arrivalAirportObj
        ? String(arrivalAirportObj.airportId)
        : "",

      flightNumber: flight.flightNumber,
      flightClass: flight.flightClass,

      departureCountries: String(flight.departureCountryId),
      departureState: String(flight.departureStateId),
      departureCity: String(flight.departureCityId),

      arrivalCountries: String(flight.arrivalCountryId),
      arrivalState: String(flight.arrivalStateId),
      arrivalCity: String(flight.arrivalCityId),

      departureDate: flight.departureDate,
      arrivalDate: flight.arrivalDate,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
    });

    // ✅ MOST IMPORTANT PART
    setPreviewDepartureAirport(departureAirportObj || null);
    setPreviewArrivalAirport(arrivalAirportObj || null);

    setPendingEditFlight(null);
  }, [pendingEditFlight, airports, state, state2, cities, cities2]);

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
                      {flight.airlineName} - {flight.flightNumber}
                    </h5>
                    {/* Flight Class Badge */}
                    {flight?.flightClass && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                        {flight?.flightClass} Class
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {`${flight.departureCityName}, ${flight.departureStateName}, ${flight.departureCountryName} → ${flight.arrivalCityName}, ${flight.arrivalStateName}, ${flight.arrivalCountryName}`}
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
      <form
        onSubmit={formik.handleSubmit}
        key={formKey}
        className="space-y-4 pt-4 border-t"
      >
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
                <SelectValue placeholder="Select airline" />
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
              {/* airports */}
              <FormItem>
                <FormLabel>Departure Airport</FormLabel>
                <Select
                  value={formik.values.departureAirport}
                  onValueChange={(value) => {
                    formik.setFieldValue("departureAirport", value);

                    const airport = airports.find(
                      (a) => String(a.airportId) === value,
                    );

                    if (airport) {
                      // 👇 hidden fields auto fill
                      formik.setFieldValue(
                        "departureCountries",
                        airport.countryId,
                      );
                      formik.setFieldValue("departureState", airport.stateId);
                      formik.setFieldValue("departureCity", airport.cityId);
                      setPreviewDepartureAirport(airport);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select departure airport" />
                  </SelectTrigger>
                  <SelectContent>
                    {airports.map((a) => (
                      <SelectItem key={a.airportId} value={String(a.airportId)}>
                        {a.airportName} ({a.iataCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage>{formik.errors.departureAirport}</FormMessage>
              </FormItem>
              {previewDepartureAirport && (
                <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <PlaneTakeoff className="h-4 w-4 text-primary" />
                    <h5 className="font-semibold text-sm">
                      {previewDepartureAirport.airportName} (
                      {previewDepartureAirport.iataCode})
                    </h5>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {previewDepartureAirport.cityName},{" "}
                    {previewDepartureAirport.stateName},{" "}
                    {previewDepartureAirport.countryName}
                  </div>
                </div>
              )}

              {/* <FormItem>
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
              </FormItem> */}

              {/* State     */}
              {/* <FormItem>
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
              </FormItem> */}

              {/* city */}
              {/* <FormItem>
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
              </FormItem> */}

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
                        value ? new Date(value) : null,
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
              {/* airports */}
              <FormItem>
                <FormLabel>Arrival Airport</FormLabel>
                <Select
                  value={formik.values.arrivalAirport}
                  onValueChange={(value) => {
                    formik.setFieldValue("arrivalAirport", value);

                    const airport = airports.find(
                      (a) => String(a.airportId) === value,
                    );

                    if (airport) {
                      formik.setFieldValue(
                        "arrivalCountries",
                        airport.countryId,
                      );
                      formik.setFieldValue("arrivalState", airport.stateId);
                      formik.setFieldValue("arrivalCity", airport.cityId);
                      setPreviewArrivalAirport(airport);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select arrival airport" />
                  </SelectTrigger>
                  <SelectContent>
                    {airports.map((a) => (
                      <SelectItem key={a.airportId} value={String(a.airportId)}>
                        {a.airportName} ({a.iataCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage>{formik.errors.arrivalAirport}</FormMessage>
              </FormItem>
              {previewArrivalAirport && (
                <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <PlaneLanding className="h-4 w-4 text-primary" />
                    <h5 className="font-semibold text-sm">
                      {previewArrivalAirport.airportName} (
                      {previewArrivalAirport.iataCode})
                    </h5>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {previewArrivalAirport.cityName},{" "}
                    {previewArrivalAirport.stateName},{" "}
                    {previewArrivalAirport.countryName}
                  </div>
                </div>
              )}

              {/* <FormItem>
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
              </FormItem> */}

              {/* <FormItem>
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
              </FormItem> */}

              {/* <FormItem>
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
              </FormItem> */}

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
                        value ? new Date(value) : null,
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
          <Button
            variant="outline"
            onClick={() => {
              setEditIndex(null);
              setFormKey((prev) => prev + 1);
            }}
          >
            Cancel
          </Button>
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
                {flightToDelete?.airlineName} – {flightToDelete?.flightNumber}
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
