// AddNewPackage.optimized.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Formik, Form as FormikForm, FastField } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";

import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

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
import { Label } from "@/components/ui/label";

import FlightDetails from "@/components/FlightDetails";
import Facilities from "@/components/Facilities";
import HotelDetails from "@/components/HotelDetails";

import { baseURL } from "@/utils/constant/url"; // keep your existing constant

// ----------------- Types -----------------
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

interface PackagePayload {
  // keep minimal keys used in UI; expand as needed
  agentId?: number | string;
  countryId?: number;
  stateId?: number;
  cityId?: number;
  packageName?: string;
  packageType?: string;
  travelType?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  duration?: string;
  departureDate?: string | null;
  arrivalDate?: string | null;
  departureTime?: string | null;
  arrivalTime?: string | null;
  flightStops?: string;
  departureAirlines?: string;
  arrivalAirlines?: string;
  bookedSeats?: number;
  totalSeats?: number;
  availableSeats?: number;
  featured?: boolean;
  notes?: string;
}

// ----------------- Validation (Yup) -----------------
const PackageSchema = Yup.object().shape({
  packageName: Yup.string().required("Package name is required").min(3),
  travelType: Yup.string().required("Travel type is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
  countryId: Yup.string().required("Country is required"),
  stateId: Yup.string().required("State is required"),
  cityId: Yup.string().required("City is required"),
});

// ----------------- Memoized small components -----------------
const MemoSelect = React.memo(function MemoSelect({
  value,
  onValueChange,
  placeholder,
  items,
  mapKey = (i: any) => String(i.lookupId || i.countryId || i.stateId || i.cityId),
  mapLabel = (i: any) => i.lookupName || i.countryName || i.stateName || i.cityName,
}: {
  value: string;
  onValueChange: (v: string) => void;
  placeholder?: string;
  items: any[];
  mapKey?: (item: any) => string;
  mapLabel?: (item: any) => string;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((it) => (
          <SelectItem key={mapKey(it)} value={mapKey(it)}>
            {mapLabel(it)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

// ----------------- Main Component -----------------
export function AddNewPackage({
  open,
  onOpenChange,
  package: editPackage,
  onSuccess,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  package?: any;
  onSuccess?: () => void;
}) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const pkg: any = state?.pkg || editPackage; // support both ways

  // ---------- UI state ----------
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<StateType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const [packageType, setPackageType] = useState<LookupType[]>([]);
  const [travelType, setTravelType] = useState<LookupType[]>([]);
  const [packageData, setPackageData] = useState<any>(null); // response after create
  const [isLoader, setIsLoader] = useState(false);

  // group location IDs as strings (Select uses string values)
  const initialLocation = {
    countryId: pkg?.countryId?.toString() || "",
    stateId: pkg?.stateId?.toString() || "",
    cityId: pkg?.cityId?.toString() || "",
  };
  const [locationIds, setLocationIds] = useState(initialLocation);

  // ---------- Memoized defaults ----------
  const initialValues = useMemo(
    () => ({
      packageName: pkg?.packageName || "",
      travelType: pkg?.travelType || "",
      packageType: pkg?.packageType?.toString() || "",
      countryId: initialLocation.countryId,
      stateId: initialLocation.stateId,
      cityId: initialLocation.cityId,
      description: pkg?.description || "",
      price: pkg?.price ?? "",
      originalPrice: pkg?.originalPrice ?? "",
      duration: pkg?.duration || "",
      departureDate: pkg?.departureDate ? pkg.departureDate.split("T")[0] : "",
      arrivalDate: pkg?.arrivalDate ? pkg.arrivalDate.split("T")[0] : "",
      departureTime: pkg?.departureTime || "",
      arrivalTime: pkg?.arrivalTime || "",
      departureAirlines: pkg?.departureAirlines || "",
      arrivalAirlines: pkg?.arrivalAirlines || "",
      totalSeats: pkg?.totalSeats ?? "",
      bookedSeats: pkg?.bookedSeats ?? "",
      availableSeats: pkg?.availableSeats ?? "",
      featured: pkg?.featured || false,
      notes: pkg?.notes || "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pkg]
  );

  // ---------- API functions (memoized) ----------
  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const fetchCountries = useCallback(async () => {
    try {
      const { data } = await axios.get(`${baseURL}countries`);
      setCountries(data || []);
    } catch (err) {
      console.error("fetchCountries error", err);
    }
  }, []);

  const fetchStates = useCallback(
    async (countryId?: string) => {
      if (!countryId) {
        setStates([]);
        return;
      }
      try {
        const header = getAuthHeader();
        // use provided endpoint structure; adjust if your API expects numeric id
        const response = await axios.get<StateType[]>(
          `http://31.97.205.55:8080/api/states/byCountry/${countryId}`,
          { headers: header }
        );
        setStates(response.data || []);
      } catch (err) {
        console.error("fetchStates error", err);
      }
    },
    [getAuthHeader]
  );

  const fetchCities = useCallback(
    async (stateId?: string) => {
      if (!stateId) {
        setCities([]);
        return;
      }
      try {
        const header = getAuthHeader();
        const response = await axios.get<CityType[]>(
          `http://31.97.205.55:8080/api/cities/byState/${stateId}`,
          { headers: header }
        );
        setCities(response.data || []);
      } catch (err) {
        console.error("fetchCities error", err);
      }
    },
    [getAuthHeader]
  );

  const fetchLookups = useCallback(async () => {
    try {
      const header = getAuthHeader();
      const [tResp, pResp] = await Promise.all([
        axios.get<LookupType[]>(
          "http://31.97.205.55:8080/api/lookups/TRAVEL_TYPE",
          { headers: header }
        ),
        axios.get<LookupType[]>(
          "http://31.97.205.55:8080/api/lookups/PACKAGE_TYPE",
          { headers: header }
        ),
      ]);
      setTravelType(tResp.data || []);
      setPackageType(pResp.data || []);
    } catch (err) {
      console.error("fetchLookups error", err);
    }
  }, [getAuthHeader]);

  // ---------- Effects ----------
  useEffect(() => {
    fetchCountries();
    fetchLookups();
    // if edit package already has country/state -> prefetch states/cities
    if (initialLocation.countryId) fetchStates(initialLocation.countryId);
    if (initialLocation.stateId) fetchCities(initialLocation.stateId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when user changes the grouped location state, load dependent lists
  useEffect(() => {
    if (locationIds.countryId) {
      fetchStates(locationIds.countryId);
      // resetting dependent selects
      setLocationIds((prev) => ({ ...prev, stateId: "", cityId: "" }));
    } else {
      setStates([]);
      setCities([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationIds.countryId]);

  useEffect(() => {
    if (locationIds.stateId) {
      fetchCities(locationIds.stateId);
      setLocationIds((prev) => ({ ...prev, cityId: "" }));
    } else {
      setCities([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationIds.stateId]);

  // ---------- Submit handler ----------
  const handleSubmit = useCallback(
    async (values: any, { resetForm }: any) => {
      setIsLoader(true);
      try {
        const tokenHeader = getAuthHeader();
        // prepare payload
        const payload: PackagePayload = {
          agentId: Number(localStorage.getItem("agentID") || undefined),
          countryId: values.countryId ? Number(values.countryId) : undefined,
          stateId: values.stateId ? Number(values.stateId) : undefined,
          cityId: values.cityId ? Number(values.cityId) : undefined,
          packageName: values.packageName,
          packageType: values.packageType,
          travelType: values.travelType,
          description: values.description,
          price: values.price ? Number(values.price) : undefined,
          originalPrice: values.originalPrice ? Number(values.originalPrice) : undefined,
          duration: values.duration,
          departureDate: values.departureDate ? new Date(values.departureDate).toISOString() : null,
          arrivalDate: values.arrivalDate ? new Date(values.arrivalDate).toISOString() : null,
          departureTime: values.departureTime ? new Date(values.departureTime).toISOString() : null,
          arrivalTime: values.arrivalTime ? new Date(values.arrivalTime).toISOString() : null,
          departureAirlines: values.departureAirlines,
          arrivalAirlines: values.arrivalAirlines,
          totalSeats: values.totalSeats ? Number(values.totalSeats) : undefined,
          bookedSeats: values.bookedSeats ? Number(values.bookedSeats) : undefined,
          availableSeats: values.availableSeats ? Number(values.availableSeats) : undefined,
          featured: !!values.featured,
          notes: values.notes,
        };

        let response;
        if (pkg?.packageId) {
          response = await axios.put(
            `http://31.97.205.55:8080/api/packages/${pkg.packageId}`,
            payload,
            { headers: { ...tokenHeader, "Content-Type": "application/json" } }
          );
          toast.success("Package updated successfully!");
        } else {
          response = await axios.post(
            "http://31.97.205.55:8080/api/packages/create",
            payload,
            { headers: { ...tokenHeader, "Content-Type": "application/json" } }
          );
          toast.success("Package created successfully!");
          setPackageData(response.data);
        }

        resetForm();
        // optionally close modal / navigate or call onSuccess
        onSuccess && onSuccess();
      } catch (err) {
        console.error("submit error:", err);
        toast.error("Something went wrong while saving package");
      } finally {
        setIsLoader(false);
      }
    },
    [pkg, getAuthHeader, onSuccess]
  );

  // ---------- UI helpers ----------
  const countriesMemo = useMemo(() => countries, [countries]);
  const statesMemo = useMemo(() => states, [states]);
  const citiesMemo = useMemo(() => cities, [cities]);

  // ---------- Render ----------
  return (
    <div className="min-h-full rounded-lg border py-4 bg-background">
      <main className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/packages")}
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
            {pkg ? "Update the package details below" : "Fill in the details to create a new package"}
          </p>
        </div>

        {/* Wrap Formik in your UI Form container */}
        <Form>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={PackageSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <FormikForm className="space-y-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Details</TabsTrigger>
                    <TabsTrigger value="hotel">Hotel Details </TabsTrigger>
                    <TabsTrigger value="flights">
                      Flight Details { /* count can be added if available */ }
                    </TabsTrigger>
                    <TabsTrigger value="facilities">Facilities</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Package Name */}
                      <div className="grid gap-2">
                        <Label>Package Name *</Label>
                        <FastField name="packageName">
                          {({ field }: any) => (
                            <Input {...field} placeholder="Enter the package name..." />
                          )}
                        </FastField>
                        {errors.packageName && touched.packageName && (
                          <p className="text-red-500 text-sm">{errors.packageName}</p>
                        )}
                      </div>

                      {/* Travel Type */}
                      <div className="grid gap-2">
                        <Label>Travel Type *</Label>
                        <MemoSelect
                          value={values.travelType}
                          onValueChange={(v) => setFieldValue("travelType", v)}
                          placeholder="Choose Travel Type"
                          items={travelType}
                          mapKey={(i) => i.lookupName}
                          mapLabel={(i) => i.lookupName}
                        />
                        {errors.travelType && touched.travelType && (
                          <p className="text-red-500 text-sm">{errors.travelType}</p>
                        )}
                      </div>

                      {/* Country */}
                      <div className="grid gap-2">
                        <Label>Select Country *</Label>
                        <MemoSelect
                          value={values.countryId}
                          onValueChange={(v) => {
                            setFieldValue("countryId", v);
                            setLocationIds((prev) => ({ ...prev, countryId: v }));
                          }}
                          placeholder="Select Country"
                          items={countriesMemo}
                          mapKey={(i) => String(i.countryId)}
                          mapLabel={(i) => i.countryName}
                        />
                        {errors.countryId && touched.countryId && (
                          <p className="text-red-500 text-sm">{errors.countryId}</p>
                        )}
                      </div>

                      {/* State */}
                      <div className="grid gap-2">
                        <Label>Select State *</Label>
                        <MemoSelect
                          value={values.stateId}
                          onValueChange={(v) => {
                            setFieldValue("stateId", v);
                            setLocationIds((prev) => ({ ...prev, stateId: v }));
                          }}
                          placeholder="Select State"
                          items={statesMemo}
                          mapKey={(i) => String(i.stateId)}
                          mapLabel={(i) => i.stateName}
                        />
                        {errors.stateId && touched.stateId && (
                          <p className="text-red-500 text-sm">{errors.stateId}</p>
                        )}
                      </div>

                      {/* City */}
                      <div className="grid gap-2">
                        <Label>Select City *</Label>
                        <MemoSelect
                          value={values.cityId}
                          onValueChange={(v) => {
                            setFieldValue("cityId", v);
                            setLocationIds((prev) => ({ ...prev, cityId: v }));
                          }}
                          placeholder="Select City"
                          items={citiesMemo}
                          mapKey={(i) => String(i.cityId)}
                          mapLabel={(i) => i.cityName}
                        />
                        {errors.cityId && touched.cityId && (
                          <p className="text-red-500 text-sm">{errors.cityId}</p>
                        )}
                      </div>

                      {/* Package Type */}
                      <div className="grid gap-2">
                        <Label>Package Type</Label>
                        <MemoSelect
                          value={values.packageType}
                          onValueChange={(v) => setFieldValue("packageType", v)}
                          placeholder="Select package type"
                          items={packageType}
                          mapKey={(i) => i.lookupName}
                          mapLabel={(i) => i.lookupName}
                        />
                      </div>

                      {/* Featured */}
                      <div className="flex items-center pt-3 space-x-3">
                        <Checkbox
                          id="featured"
                          checked={!!values.featured}
                          onCheckedChange={(v: any) => setFieldValue("featured", !!v)}
                        />
                        <Label htmlFor="featured">Featured Package</Label>
                      </div>

                      {/* Description */}
                      <div className="grid gap-2 md:col-span-2">
                        <Label>Description</Label>
                        <FastField name="description">
                          {({ field }: any) => (
                            <textarea
                              {...field}
                              name="description"
                              className="border p-2 rounded-md"
                              placeholder="Description..."
                              rows={3}
                            />
                          )}
                        </FastField>
                      </div>

                      {/* Price */}
                      <div className="grid gap-2">
                        <Label>Price *</Label>
                        <FastField name="price">
                          {({ field }: any) => (
                            <Input {...field} type="number" placeholder="350000" />
                          )}
                        </FastField>
                        {errors.price && touched.price && (
                          <p className="text-red-500 text-sm">{errors.price}</p>
                        )}
                      </div>

                      {/* Original Price */}
                      <div className="grid gap-2">
                        <Label>Original Price</Label>
                        <FastField name="originalPrice">
                          {({ field }: any) => (
                            <Input {...field} type="number" placeholder="550000" />
                          )}
                        </FastField>
                      </div>

                      {/* Duration */}
                      <div className="grid gap-2">
                        <Label>Duration</Label>
                        <FastField name="duration">
                          {({ field }: any) => <Input {...field} placeholder="45 Days" />}
                        </FastField>
                      </div>

                      {/* Departure Date */}
                      <div className="grid gap-2">
                        <Label>Departure Date</Label>
                        <FastField name="departureDate">
                          {({ field }: any) => <Input {...field} type="date" />}
                        </FastField>
                      </div>

                      {/* Arrival Date */}
                      <div className="grid gap-2">
                        <Label>Arrival Date</Label>
                        <FastField name="arrivalDate">
                          {({ field }: any) => <Input {...field} type="date" />}
                        </FastField>
                      </div>

                      {/* Departure Time */}
                      <div className="grid gap-2">
                        <Label>Departure Time</Label>
                        <FastField name="departureTime">
                          {({ field }: any) => <Input {...field} type="datetime-local" />}
                        </FastField>
                      </div>

                      {/* Arrival Time */}
                      <div className="grid gap-2">
                        <Label>Arrival Time</Label>
                        <FastField name="arrivalTime">
                          {({ field }: any) => <Input {...field} type="datetime-local" />}
                        </FastField>
                      </div>

                      {/* Airlines */}
                      <div className="grid gap-2">
                        <Label>Departure Airlines</Label>
                        <FastField name="departureAirlines">
                          {({ field }: any) => <Input {...field} placeholder="India Airlines" />}
                        </FastField>
                      </div>

                      <div className="grid gap-2">
                        <Label>Arrival Airlines</Label>
                        <FastField name="arrivalAirlines">
                          {({ field }: any) => <Input {...field} placeholder="Saudi" />}
                        </FastField>
                      </div>

                      {/* Seats */}
                      <div className="grid gap-2">
                        <Label>Total Seats</Label>
                        <FastField name="totalSeats">
                          {({ field }: any) => <Input {...field} type="number" placeholder="350" />}
                        </FastField>
                      </div>

                      <div className="grid gap-2">
                        <Label>Booked Seats</Label>
                        <FastField name="bookedSeats">
                          {({ field }: any) => <Input {...field} type="number" placeholder="200" />}
                        </FastField>
                      </div>

                      <div className="grid gap-2">
                        <Label>Available Seats</Label>
                        <FastField name="availableSeats">
                          {({ field }: any) => <Input {...field} type="number" placeholder="50" />}
                        </FastField>
                      </div>

                      {/* Notes */}
                      <div className="grid gap-2 md:col-span-2">
                        <Label>Notes</Label>
                        <FastField name="notes">
                          {({ field }: any) => (
                            <textarea {...field} placeholder="Notes..." className="border p-2 rounded-md" rows={2} />
                          )}
                        </FastField>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" type="button" onClick={() => navigate("/dashboard/packages")}>
                        Cancel
                      </Button>
                      <Button type="submit">{isLoader ? (pkg ? "Updating..." : "Creating...") : (pkg ? "Update Package" : "Create Package")}</Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="hotel" className="space-y-6 mt-4">
                    <HotelDetails pkg={pkg} packageId={packageData?.packageId || pkg?.packageId} />
                  </TabsContent>

                  <TabsContent value="flights" className="space-y-6 mt-4">
                    <FlightDetails pkg={pkg} packageId={packageData?.packageId || pkg?.packageId} />
                  </TabsContent>

                  <TabsContent value="facilities" className="space-y-6 mt-4">
                    <Facilities />
                  </TabsContent>
                </Tabs>
              </FormikForm>
            )}
          </Formik>
        </Form>
      </main>
    </div>
  );
}

export default AddNewPackage;
