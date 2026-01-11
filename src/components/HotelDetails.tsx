import { format } from "date-fns";
import { CalendarIcon, Globe, MapPin, Star, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
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
import { FormLabel } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { calculateDaysStay, cn, convertToISO } from "@/lib/utils";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import { useNavigate } from "react-router";
import { Label } from "./ui/label";

interface SelectedHotel {
  id: string;
  packageHotelId?: number | string; // present for existing entries
  hotelId: number | string;
  hotelName: string;
  city?: string;
  cityId?: number | string;
  stateId?: number | string;
  countryId?: number | string;
  address?: string;
  rating?: number;
  distanceFromHaram?: string;
  checkInDate?: Date;
  checkInTime?: string;
  checkOutDate?: Date;
  checkOutTime?: string;
  daysStay?: string;
}

const HotelDetails = ({ pkg, packageId }: any) => {
  const [addedHotels, setAddedHotels] = useState<SelectedHotel[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedHotel, setSelectedHotel] = useState<string>("");

  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [checkInTime, setCheckInTime] = useState<string>("14:00");
  const [checkOutTime, setCheckOutTime] = useState<string>("12:00");

  const [isLoader, setIsLoader] = useState(false);
  const [basicHotelDetails, setBasicHotelDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [selectedHotelData, setSelectedHotelData] = useState<any>("");
  const [errors, setErrors] = useState<any>({
    city: "",
    hotel: "",
    checkInDate: "",
    checkOutDate: "",
    country: "",
    state: "",
  });
  const [currentPackageId, setCurrentPackageId] = useState<number | null>(
    pkg?.packageId ?? packageId ?? null
  );
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState<SelectedHotel | null>(
    null
  );

  const id = pkg?.packageId;
  const navigate = useNavigate();

  // Fetch lists
  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${baseURL}countries`);
      setCountries(response.data || []);
      const data = response.data || [];

      // Default Saudi select
      const saudiExists = data.some((c: any) => String(c.countryId) === "5");

      if (saudiExists) {
        setSelectedCountry("5");
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (countryId?: string) => {
    try {
      const token = localStorage.getItem("token");
      const cId = countryId ?? selectedCountry;
      if (!cId) {
        setStates([]);
        return;
      }
      const response = await axios.get<any>(
        `${baseURL}states/byCountry/${cId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStates(response.data || []);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (stateId?: string) => {
    try {
      const token = localStorage.getItem("token");
      const sId = stateId ?? selectedState;
      if (!sId) {
        setCities([]);
        return;
      }
      const response = await axios.get<any>(`${baseURL}cities/byState/${sId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCities(response.data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchHotels = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<any>(`${baseURL}hotels`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHotels(response.data || []);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedCountry) fetchStates(selectedCountry);
    else setStates([]);
    // reset downstream
    setSelectedState("");
    setSelectedCity("");
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) fetchCities(selectedState);
    else setCities([]);
    setSelectedCity("");
  }, [selectedState]);

  // GET package hotels
  const getPackagesByID = async (pkgId?: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const finalId = pkgId ?? currentPackageId;
      if (!finalId) return;

      const response = await axios.get(
        `${baseURL}package-hotels/byPackage/${finalId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBasicHotelDetails(response.data || []);
      
    } catch (error) {
      console.error("GET API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const getPackagesByHotelId = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(`${baseURL}hotels/${selectedHotel}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedHotelData(response.data);
    } catch (error) {
      console.error("GET API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) getPackagesByID();
  }, [id]);
  useEffect(() => {
    if (selectedHotel) getPackagesByHotelId();
  }, [selectedHotel]);

  // Map the GET response to local addedHotels (auto-fill top card)
  useEffect(() => {
    if (!basicHotelDetails || basicHotelDetails.length === 0) {
      setAddedHotels([]);
      return;
    }

    const mapped = basicHotelDetails.map((item: any) => {
      const hotelDetails = item.hotelDetails ?? {};

      return {
        id: String(item.id ?? `${Date.now()}-${Math.random()}`),
        packageHotelId: item.id,

        hotelId: hotelDetails.hotelId,
        hotelName: hotelDetails.hotelName,

        cityId: hotelDetails.cityId,
        cityName: hotelDetails.cityName,

        stateId: hotelDetails.stateId,
        stateName: hotelDetails.stateName,

        countryId: hotelDetails.countryId,
        countryName: hotelDetails.countryName,

        address: hotelDetails.address,
        rating: hotelDetails.starRating ?? 0,
        distanceFromHaram: hotelDetails.distanceFromHaram ?? "-",

        checkInDate: item.checkinDate ? new Date(item.checkinDate) : undefined,
        checkInTime: item.checkinTime?.slice(11, 16),
        checkOutDate: item.checkoutDate
          ? new Date(item.checkoutDate)
          : undefined,
        checkOutTime: item.checkoutTime?.slice(11, 16),
        daysStay: item.daysStay,
      } as SelectedHotel;
    });

    setAddedHotels(mapped);
  }, [basicHotelDetails]);

  // Add new hotel (local)
  const handleAddHotel = () => {
    const newErrors: any = {};
    if (!selectedHotel) newErrors.hotel = "Hotel is required";
    if (!checkInDate) newErrors.checkInDate = "Check-in date is required";
    if (!checkOutDate) newErrors.checkOutDate = "Check-out date is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    const hotelInfo = hotels.find(
      (h) => String(h.hotelId) === String(selectedHotel)
    );
    if (!hotelInfo) return;

    const country = countries.find(
      (c) => String(c.countryId) === selectedCountry
    );
    const state = states.find((s) => String(s.stateId) === selectedState);
    const city = cities.find((c) => String(c.cityId) === selectedCity);

    const newHotel: SelectedHotel = {
      id: `${Date.now()}-${selectedHotel}`,

      hotelId: hotelInfo.hotelId,
      hotelName: hotelInfo.hotelName,

      countryId: selectedCountry,
      countryName: country?.countryName,

      stateId: selectedState,
      stateName: state?.stateName,

      cityId: selectedCity,
      cityName: city?.cityName,

      address: hotelInfo.address || "-",
      rating: hotelInfo.starRating || 0,
      distanceFromHaram: hotelInfo.distanceFromHaram || "-",

      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime,
    };

    setAddedHotels([newHotel, ...addedHotels]);

    // reset local form
    setSelectedHotel("");
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
    setCheckInTime("14:00");
    setCheckOutTime("12:00");
    setSelectedCountry("");
    setSelectedState("");
    setSelectedCity("");
    toast.success("Hotel added");
  };

  // Remove local hotel
  const handleRemoveHotel = (hotelId: string) => {
    setAddedHotels(addedHotels.filter((h) => h.id !== hotelId));
    toast.success("Hotel removed from package");
  };

  // Edit: populate single form from clicked hotel
  const handleEditHotel = (index: number) => {
    const hotel = addedHotels[index];

    if (!hotel) return;

    setEditIndex(index);

    // populate dropdowns & dependent lists carefully
    if (hotel.countryId) {
      setSelectedCountry(String(hotel.countryId));
    } else if (hotel.countryId === undefined && hotel.countryId !== null) {
      setSelectedCountry("");
    }

    // fetch states for that country and then set state/city
    if (hotel.countryId) {
      fetchStates(String(hotel.countryId)).then(() => {
        if (hotel.stateId) {
          setSelectedState(String(hotel.stateId));
          fetchCities(String(hotel.stateId)).then(() => {
            if (hotel.cityId) {
              setSelectedCity(String(hotel.cityId));
            }
          });
        } else {
          setSelectedState("");
          setSelectedCity("");
        }
      });
    } else {
      setSelectedState("");
      setSelectedCity("");
    }

    // set hotel select
    setSelectedHotel(String(hotel.hotelId ?? ""));

    // dates & times
    setCheckInDate(hotel.checkInDate ? new Date(hotel.checkInDate) : undefined);
    setCheckOutDate(
      hotel.checkOutDate ? new Date(hotel.checkOutDate) : undefined
    );
    setCheckInTime(hotel.checkInTime ?? "14:00");
    setCheckOutTime(hotel.checkOutTime ?? "12:00");
  };

  // Update local hotel (from single form)

  const updateHotel = () => {
    if (editIndex === null) return;

    const updated = [...addedHotels];
    const target = updated[editIndex];
    if (!target) return;

    const hotelInfo = hotels.find(
      (h) => String(h.hotelId) === String(selectedHotel)
    );

    const country = countries.find(
      (c) => String(c.countryId) === selectedCountry
    );
    const state = states.find((s) => String(s.stateId) === selectedState);
    const city = cities.find((c) => String(c.cityId) === selectedCity);

    updated[editIndex] = {
      ...target,

      // ✅ HOTEL UPDATE (THIS WAS MISSING)
      hotelId: hotelInfo?.hotelId ?? target.hotelId,
      hotelName: hotelInfo?.hotelName ?? target.hotelName,
      address: hotelInfo?.address ?? target.address,
      rating: hotelInfo?.starRating ?? target.rating,
      distanceFromHaram:
        hotelInfo?.distanceFromHaram ?? target.distanceFromHaram,

      // ✅ LOCATION UPDATE
      countryId: selectedCountry,
      countryName: country?.countryName ?? target.countryName,

      stateId: selectedState,
      stateName: state?.stateName ?? target.stateName,

      cityId: selectedCity,
      cityName: city?.cityName ?? target.cityName,

      // ✅ DATE UPDATE
      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime,

      // ✅ DAYS STAY UPDATE
      daysStay: calculateDaysStay(checkInDate, checkOutDate),
    };

    setAddedHotels(updated);
    setEditIndex(null);

    // reset form
    setSelectedHotel("");
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
    setCheckInTime("14:00");
    setCheckOutTime("12:00");
    setSelectedCountry("");
    setSelectedState("");
    setSelectedCity("");

    toast.success("Hotel updated successfully");
  };

  const confirmDeleteHotel = async () => {
    if (!hotelToDelete) return;

    try {
      setIsLoader(true);

      // Existing backend hotel → DELETE API
      if (hotelToDelete.packageHotelId) {
        await deleteHotelFromBackend(hotelToDelete.packageHotelId);
      }

      // Remove from UI (both cases)
      setAddedHotels((prev) => prev.filter((h) => h.id !== hotelToDelete.id));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoader(false);
      setOpenDeleteDialog(false);
      setHotelToDelete(null);
    }
  };

  const deleteHotelFromBackend = async (packageHotelId: string | number) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${baseURL}package-hotels/${packageHotelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Hotel deleted successfully");
    } catch (error) {
      console.error("Hotel delete API error:", error);
      toast.error("Failed to delete hotel");
      throw error;
    }
  };

  const handleSubmitHotels = async () => {
    try {
      setIsLoader(true);
      const token = localStorage.getItem("token");
      if (!pkg) {
        if (!packageId) {
          toast.error("package missing — once please create package");
          return;
        }
      }

      for (const hotel of addedHotels) {
        const payload = {
          packageId: id ?? packageId,
          hotelId: Number(hotel.hotelId),
          checkinDate: convertToISO(hotel.checkInDate, hotel.checkInTime),
          checkoutDate: convertToISO(hotel.checkOutDate, hotel.checkOutTime),
          checkinTime: convertToISO(hotel.checkInDate, hotel.checkInTime),
          checkoutTime: convertToISO(hotel.checkOutDate, hotel.checkOutTime),
          daysStay: calculateDaysStay(hotel.checkInDate, hotel.checkOutDate),
          createdBy: 0,
          updatedBy: 0,
        };

        if (hotel.packageHotelId) {
          //  UPDATE only edited/existing records
          await axios.put(
            `${baseURL}package-hotels/${hotel.packageHotelId}`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          // CREATE only new records
          const response = await axios.post(
            `${baseURL}package-hotels`,
            payload,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const newPackageId =
            response.data?.packageId || response.data?.package?.packageId;

          if (newPackageId) {
            setCurrentPackageId(newPackageId);
          }

          getPackagesByID(newPackageId);
        }
      }
      await getPackagesByID();
      toast.success(
        pkg ? "Hotels updated successfully!" : "All hotels added successfully!"
      );
      // after saving, refetch to sync server ids and data
      // setAddedHotels([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit package");
    } finally {
      setIsLoader(false);
    }
  };

  useEffect(() => {
    if (checkInDate && checkOutDate && checkOutDate <= checkInDate) {
      setCheckOutDate(undefined);
    }
  }, [checkInDate]);

  const calculatedDays =
    checkInDate && checkOutDate
      ? calculateDaysStay(checkInDate, checkOutDate)
      : "";

  return (
    <>
      {/* Added Hotels List */}
      {addedHotels.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            Added Hotels ({addedHotels.length})
          </h4>
          <div className="space-y-3">
            {addedHotels.map((hotel, index) => {
              return (
                <div
                  key={hotel.id}
                  className="rounded-lg border bg-card p-4 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded">
                          {hotel.cityId ?? (hotel.cityId ? "—" : "")}
                        </span>
                        <h5 className="font-semibold text-foreground">
                          {hotel.hotelName}
                        </h5>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">
                            {`${hotel.address}, ${hotel.cityName}, ${hotel.stateName}, ${hotel.countryName}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-medium">
                              {hotel.rating} Star
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <span className="text-xs font-medium text-primary">
                            {hotel.distanceFromHaram} from Haram
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                        <div>
                          <span className="font-medium">Check-in:</span>{" "}
                          {hotel.checkInDate
                            ? format(hotel.checkInDate, "PPP")
                            : "-"}{" "}
                          at {hotel.checkInTime}
                        </div>
                        <div>
                          <span className="font-medium">Check-out:</span>{" "}
                          {hotel.checkOutDate
                            ? format(hotel.checkOutDate, "PPP")
                            : "-"}{" "}
                          at {hotel.checkOutTime}
                        </div>
                        <div>
                          <span className="font-medium">Days Stay:</span>{" "}
                          {hotel.daysStay}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      {pkg ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditHotel(index)}
                        >
                          Edit
                        </Button>
                      ) : null}

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setHotelToDelete(hotel);
                          setOpenDeleteDialog(true);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Form */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-sm font-semibold text-foreground">Add Hotel</h4>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <FormLabel>Select Hotel</FormLabel>
            <Select
              value={selectedHotel}
              onValueChange={(value) => {
                setSelectedHotel(value);
                setErrors({ ...errors, hotel: "" });

                const hotelData = hotels.find(
                  (h) => String(h.hotelId) === String(value)
                );

                if (hotelData) {
                  setSelectedCountry(String(hotelData.countryId ?? ""));
                  setSelectedState(String(hotelData.stateId ?? ""));
                  setSelectedCity(String(hotelData.cityId ?? ""));
                }
              }}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Choose a hotel" />
              </SelectTrigger>
              <SelectContent>
                {hotels.map((h) => (
                  <SelectItem key={h.hotelId} value={String(h.hotelId)}>
                    {h.hotelName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.hotel && (
              <p className="text-red-500 text-xs mt-1">{errors.hotel}</p>
            )}
          </div>
        </div>

        {selectedHotelData && (
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <h4 className="font-semibold text-foreground">
              {selectedHotelData.hotelName ?? selectedHotelData.name}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  {`${selectedHotelData.address} ${selectedHotelData?.cityName}, ${selectedHotelData?.stateName}, ${selectedHotelData?.countryName}`}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-foreground">
                    {selectedHotelData.starRating ?? selectedHotelData.rating}{" "}
                    Star Hotel
                  </span>
                </div>

                <span className="text-muted-foreground">•</span>

                {/* Website */}
                {selectedHotelData.website && (
                  <a
                    href={selectedHotelData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-foreground">
                  <span className="font-medium">
                    {selectedHotelData.distanceFromHaram}
                  </span>{" "}
                  from Haram Shareef
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Check-in Date */}
          <div className="grid gap-2">
            <FormLabel>Check-in Date</FormLabel>
            <Input
              type="date"
              value={checkInDate ? format(checkInDate, "yyyy-MM-dd") : ""}
              onChange={(e) => {
                const value = e.target.value;
                setCheckInDate(value ? new Date(value) : null);
              }}
            />
            {errors.checkInDate && (
              <p className="text-red-500 text-xs">{errors.checkInDate}</p>
            )}
          </div>

          {/* Check-in Time */}
          <div className="grid gap-2">
            <FormLabel>Check-in Time</FormLabel>
            <Input
              type="time"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
            />
          </div>

          {/* Check-out Date */}
          <div className="grid gap-2">
            <FormLabel>Check-out Date</FormLabel>
            <Input
              type="date"
              value={checkOutDate ? format(checkOutDate, "yyyy-MM-dd") : ""}
              min={checkInDate ? format(checkInDate, "yyyy-MM-dd") : undefined}
              onChange={(e) => {
                const value = e.target.value;
                setCheckOutDate(value ? new Date(value) : null);
              }}
            />
            {errors.checkOutDate && (
              <p className="text-red-500 text-xs">{errors.checkOutDate}</p>
            )}
          </div>

          {/* Check-out Time */}
          <div className="grid gap-2">
            <FormLabel>Check-out Time</FormLabel>
            <Input
              type="time"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <FormLabel>Total Stay (Days)</FormLabel>
            <Input
              value={calculatedDays ? `${calculatedDays} Days` : ""}
              disabled
              placeholder="Auto calculated from dates"
              className="bg-muted cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={editIndex !== null ? updateHotel : handleAddHotel}
            variant="secondary"
            className="w-full"
          >
            {editIndex !== null ? "Update Hotel" : "Add Hotel to Package"}
          </Button>
          {/* small helper to add quickly without switching */}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button onClick={handleSubmitHotels}>
          {isLoader
            ? editIndex !== null
              ? "Updating..."
              : "Saving..."
            : pkg
            ? "Save Package"
            : "Create Package"}
        </Button>
      </div>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Hotel</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this hotel from the package?
              <br />
              <span className="font-medium text-foreground">
                {hotelToDelete?.hotelName}
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
                setHotelToDelete(null);
              }}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={confirmDeleteHotel}
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

export default HotelDetails;
