import { format } from "date-fns";
import { CalendarIcon, MapPin, Star, X } from "lucide-react";
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
import { FormLabel } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { calculateDaysStay, cn, convertToISO } from "@/lib/utils";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";

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
  const [errors, setErrors] = useState<any>({
    city: "",
    hotel: "",
    checkInDate: "",
    checkOutDate: "",
    country: "",
    state: "",
  });

  const id = pkg?.packageId;

  // Fetch lists
  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${baseURL}countries`);
      setCountries(response.data || []);
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
  const getPackagesByID = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${baseURL}package-hotels/byPackage/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBasicHotelDetails(response.data || []);
    } catch (error) {
      console.error("GET API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) getPackagesByID();
  }, [id]);

  // Map the GET response to local addedHotels (auto-fill top card)
  useEffect(() => {
    if (!basicHotelDetails || basicHotelDetails.length === 0) {
      setAddedHotels([]);
      return;
    }

    const mapped = basicHotelDetails.map((item: any) => {
      // item may look like your sample; pick values safely
      const packageHotelId =
        item.packageHotelId ??
        item.id ??
        item.packageHotel_Id ??
        item.packageHotelId;
      const hotelDetails = item.hotelDetails ?? {};
      return {
        id: String(packageHotelId ?? `${Date.now()}-${Math.random()}`),
        packageHotelId,
        hotelId: hotelDetails.hotelId ?? item.hotelId ?? null,
        hotelName: hotelDetails.hotelName ?? item.hotelName ?? "Unknown",
        city: hotelDetails.cityId ? undefined : item.cityName ?? item.city, // leave string if present
        cityId: hotelDetails.cityId ?? item.cityId ?? item.city?.id,
        stateId: hotelDetails.stateId ?? item.stateId,
        countryId:
          hotelDetails.countryId ?? item.countryId ?? hotelDetails.countryId,
        address: hotelDetails.address ?? item.address,
        rating: hotelDetails.starRating ?? item.starRating ?? 0,
        distanceFromHaram:
          hotelDetails.distanceFromHaram ?? item.distanceFromHaram ?? "-",
        checkInDate: item.checkinDate ? new Date(item.checkinDate) : undefined,
        checkInTime: item.checkinTime
          ? item.checkinTime.slice
            ? item.checkinTime.slice(11, 16)
            : item.checkinTime
          : "14:00",
        checkOutDate: item.checkoutDate
          ? new Date(item.checkoutDate)
          : undefined,
        checkOutTime: item.checkoutTime
          ? item.checkoutTime.slice
            ? item.checkoutTime.slice(11, 16)
            : item.checkoutTime
          : "12:00",
      } as SelectedHotel;
    });

    setAddedHotels(mapped);
  }, [basicHotelDetails]);

  // Add new hotel (local)
  const handleAddHotel = () => {
    const newErrors: any = {};
    if (!selectedCountry) newErrors.country = "Country is required";
    if (!selectedState) newErrors.state = "State is required";
    if (!selectedCity) newErrors.city = "City is required";
    if (!selectedHotel) newErrors.hotel = "Hotel is required";
    if (!checkInDate) newErrors.checkInDate = "Check-in date is required";
    if (!checkOutDate) newErrors.checkOutDate = "Check-out date is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    const hotelInfo = hotels.find(
      (h) => String(h.hotelId) === String(selectedHotel)
    );
    if (!hotelInfo) return;

    const newHotel: SelectedHotel = {
      id: `${Date.now()}-${selectedHotel}`,
      hotelId: hotelInfo.hotelId,
      hotelName: hotelInfo.hotelName,
      cityId: selectedCity,
      stateId: selectedState,
      countryId: selectedCountry,
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

    // keep packageHotelId if exists
    updated[editIndex] = {
      ...target,
      hotelId: selectedHotel || target.hotelId,
      hotelName:
        hotels.find((h) => String(h.hotelId) === String(selectedHotel))
          ?.hotelName ?? target.hotelName,
      countryId: selectedCountry ?? target.countryId,
      stateId: selectedState ?? target.stateId,
      cityId: selectedCity ?? target.cityId,
      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime,
    };

    setAddedHotels(updated);
    setEditIndex(null);

    // reset form values (preserve dropdowns cleared)
    setSelectedHotel("");
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
    setCheckInTime("14:00");
    setCheckOutTime("12:00");
    setSelectedCountry("");
    setSelectedState("");
    setSelectedCity("");

    toast.success("Hotel updated locally");
  };

  // Submit handler: loop & POST or PUT based on packageHotelId presence

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
          packageId: packageId,
          hotelId: Number(hotel.hotelId),
          checkinDate: convertToISO(hotel.checkInDate, hotel.checkInTime),
          checkoutDate: convertToISO(hotel.checkOutDate, hotel.checkOutTime),
          checkinTime: convertToISO(hotel.checkInDate, hotel.checkInTime),
          checkoutTime: convertToISO(hotel.checkOutDate, hotel.checkOutTime),
          daysStay: calculateDaysStay(hotel.checkInDate, hotel.checkOutDate),
          createdBy: 0,
          updatedBy: 0,
        };

        if (pkg) {
          // Update existing record

          const response = await axios.put(
            `${baseURL}package-hotels/${hotel.packageHotelId}`,
            {
              packageId: Number(id),
              hotelId: Number(hotel.hotelId),
              checkinDate: convertToISO(hotel.checkInDate, hotel.checkInTime),
              checkoutDate: convertToISO(
                hotel.checkOutDate,
                hotel.checkOutTime
              ),
              checkinTime: convertToISO(hotel.checkInDate, hotel.checkInTime),
              checkoutTime: convertToISO(
                hotel.checkOutDate,
                hotel.checkOutTime
              ),
              daysStay: calculateDaysStay(
                hotel.checkInDate,
                hotel.checkOutDate
              ),
              createdBy: 0,
              updatedBy: 0,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          // Create new record
          await axios.post(`${baseURL}package-hotels`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        }
      }

      toast.success(
        pkg ? "Hotels updated successfully!" : "All hotels added successfully!"
      );
      // after saving, refetch to sync server ids and data
      if (id) await getPackagesByID();
      else setAddedHotels([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit package");
    } finally {
      setIsLoader(false);
    }
  };

  const selectedHotelData = hotels.find(
    (h) => String(h.hotelId) === String(selectedHotel)
  );

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
                          {hotel.city ?? (hotel.cityId ? "—" : "")}
                        </span>
                        <h5 className="font-semibold text-foreground">
                          {hotel.hotelName}
                        </h5>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">
                            {hotel.address}
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
                        onClick={() => handleRemoveHotel(hotel.id)}
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormLabel>Select Country</FormLabel>
            <Select
              value={selectedCountry}
              onValueChange={(value) => {
                setSelectedCountry(value);
                setErrors({ ...errors, country: "" });
              }}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.countryId} value={String(c.countryId)}>
                    {c.countryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-red-500 text-xs mt-1">{errors.country}</p>
            )}
          </div>

          <div>
            <FormLabel>Select State</FormLabel>
            <Select
              value={selectedState}
              onValueChange={(value) => {
                setSelectedState(value);
                setErrors({ ...errors, state: "" });
              }}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((s) => (
                  <SelectItem key={s.stateId} value={String(s.stateId)}>
                    {s.stateName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-red-500 text-xs mt-1">{errors.state}</p>
            )}
          </div>

          <div>
            <FormLabel>Select City</FormLabel>
            <Select
              value={selectedCity}
              onValueChange={(value) => {
                setSelectedCity(value);
                setErrors({ ...errors, city: "" });
              }}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c.cityId} value={String(c.cityId)}>
                    {c.cityName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <FormLabel>Select Hotel</FormLabel>
            <Select
              value={selectedHotel}
              onValueChange={(value) => {
                setSelectedHotel(value);
                setErrors({ ...errors, hotel: "" });
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
                  {selectedHotelData.address}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-foreground font-medium">
                  {selectedHotelData.starRating ?? selectedHotelData.rating}{" "}
                  Star Hotel
                </span>
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormLabel>Check-in Date & Time</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkInDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkInDate ? (
                    format(checkInDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <Input
              type="time"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              className="w-full"
            />
            {errors.checkInDate && (
              <p className="text-red-500 text-xs mt-1">{errors.checkInDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <FormLabel>Check-out Date & Time</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkOutDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOutDate ? (
                    format(checkOutDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={setCheckOutDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <Input
              type="time"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              className="w-full"
            />
            {errors.checkOutDate && (
              <p className="text-red-500 text-xs mt-1">{errors.checkOutDate}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={pkg ? updateHotel : handleAddHotel}
            variant="secondary"
            className="w-full"
          >
            {pkg ? "Update Hotel" : "Add Hotel to Package"}
          </Button>
          {/* small helper to add quickly without switching */}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmitHotels}>
          {isLoader
            ? pkg
              ? "Updating..."
              : "Saving..."
            : pkg
            ? "Update Package"
            : "Create Package"}
        </Button>
      </div>
    </>
  );
};

export default HotelDetails;
