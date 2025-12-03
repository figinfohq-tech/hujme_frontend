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
import { calculateDaysStay, cn, convertToISO } from "@/lib/utils";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";

const HOTELS = {
  Madina: [
    {
      id: 1,
      name: "Al Madinah Oberoi Hotel",
      address: "King Abdul Aziz Road, Al Madinah Al Munawwarah",
      rating: 5,
      distanceFromHaram: "100 meters",
    },
    {
      id: 2,
      name: "Shaza Al Madina",
      address: "Al Masjid Al Nabawi Road, Al Madinah Al Munawwarah",
      rating: 4,
      distanceFromHaram: "250 meters",
    },
    {
      id: 3,
      name: "Dar Al Iman InterContinental",
      address: "Ar Rawdah, Madinah",
      rating: 5,
      distanceFromHaram: "150 meters",
    },
  ],
  Makkah: [
    {
      id: 4,
      name: "Swissotel Makkah",
      address: "Ibrahim Al Khalil Street, Makkah",
      rating: 5,
      distanceFromHaram: "50 meters",
    },
    {
      id: 5,
      name: "Hilton Suites Makkah",
      address: "Abraj Al Bait Complex, Makkah",
      rating: 5,
      distanceFromHaram: "20 meters",
    },
    {
      id: 6,
      name: "Anjum Hotel Makkah",
      address: "Ajyad Street, Makkah",
      rating: 4,
      distanceFromHaram: "300 meters",
    },
  ],
};
interface SelectedHotel {
  id: string;
  city: "Madina" | "Makkah";
  hotelId: string;
  hotelName: string;
  checkInDate: Date;
  checkInTime: string;
  checkOutDate: Date;
  checkOutTime: string;
}

const HotelDetails = ({ pkg, packageId }) => {
  const [addedHotels, setAddedHotels] = useState<SelectedHotel[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState<any>([]);
  const [cities, setCities] = useState<any>([]);
  const [hotels, setHotels] = useState<any>([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectdCitiesId, setSelectedCitiesId] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedHotel, setSelectedHotel] = useState<string>("");
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [checkInTime, setCheckInTime] = useState<string>("14:00");
  const [checkOutTime, setCheckOutTime] = useState<string>("12:00");
  const [isLoader, setIsLoader] = useState(false);

  const [errors, setErrors] = useState({
    city: "",
    hotel: "",
    checkInDate: "",
    checkOutDate: "",
    country: "",
    state: "",
  });

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

    const hotelInfo = hotels.find((h) => h.hotelId == selectedHotel);
    if (!hotelInfo) return;

    const newHotel: SelectedHotel = {
      id: `${Date.now()}-${selectedHotel}`,
      hotelId: selectedHotel,
      hotelName: hotelInfo.hotelName,
      cityName: hotelInfo.cityName || "",
      address: hotelInfo.address || "-",
      rating: hotelInfo.starRating || 0,
      distanceFromHaram: hotelInfo.distanceFromHaram || "-",
      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime,
    };

    // TOP me add hoga
    setAddedHotels([newHotel, ...addedHotels]);

    // Reset fields
    setSelectedHotel("");
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
    setCheckInTime("14:00");
    setCheckOutTime("12:00");

    toast.success("Hotel added");
  };

  const handleRemoveHotel = (hotelId: string) => {
    setAddedHotels(addedHotels.filter((h) => h.id !== hotelId));
    toast.success("Hotel removed from package");
  };

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
      const response = await axios.get<any>(
        `${baseURL}states/byCountry/${selectedCountry}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStates(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<any>(
        `${baseURL}cities/byState/${selectedState}`,
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
  const fetchHolets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<any>(`${baseURL}hotels`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHotels(response.data);
    } catch (error) {
      console.error("Error fetching Cities:", error);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchHolets();
  }, []);
  useEffect(() => {
    if (selectedCountry) {
      fetchStates();
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      fetchCities();
    }
  }, [selectedState]);

  // Hotels api calling
  const handleSubmitHotels = async () => {
    try {
      setIsLoader(true);
      const token = localStorage.getItem("token");
      if (!packageId) {
        toast.error("package missing — once please create package");
        return;
      }
      for (const hotel of addedHotels) {
        const payload = {
          packageId: packageId,
          hotelId: hotel.hotelId,

          // FIXED: date + time → ISO string
          checkinDate: convertToISO(hotel.checkInDate, hotel.checkInTime),
          checkoutDate: convertToISO(hotel.checkOutDate, hotel.checkOutTime),

          checkinTime: convertToISO(hotel.checkInDate, hotel.checkInTime),
          checkoutTime: convertToISO(hotel.checkOutDate, hotel.checkOutTime),

          daysStay: calculateDaysStay(hotel.checkInDate, hotel.checkOutDate),
          createdBy: 0,
          updatedBy: 0,
        };

        await axios.post(
          "http://31.97.205.55:8080/api/package-hotels",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      toast.success("All hotels added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit package");
    } finally {
      setIsLoader(false);
    }
  };

  // Hotel api calling

  const selectedHotelData = hotels.find((h) => h.hotelId == selectedHotel);

  return (
    <>
      {/* Added Hotels List */}
      {addedHotels.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            Added Hotels ({addedHotels.length})
          </h4>
          <div className="space-y-3">
            {addedHotels.map((hotel) => {
              return (
                <div
                  key={hotel.id}
                  className="rounded-lg border bg-card p-4 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded">
                          {hotel.city}
                        </span>
                        <h5 className="font-semibold text-foreground">
                          {hotel.hotelName}
                        </h5>
                      </div>
                      {/* {hotelInfo && ( */}
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
                      {/* )} */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                        <div>
                          <span className="font-medium">Check-in:</span>{" "}
                          {format(hotel.checkInDate, "PPP")} at{" "}
                          {hotel.checkInTime}
                        </div>
                        <div>
                          <span className="font-medium">Check-out:</span>{" "}
                          {format(hotel.checkOutDate, "PPP")} at{" "}
                          {hotel.checkOutTime}
                        </div>
                      </div>
                    </div>
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
              );
            })}
          </div>
        </div>
      )}

      {/* Add New Hotel Section */}
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
                <SelectValue placeholder="Select city" />
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
                <SelectValue placeholder="Select city" />
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
                {cities.map((items) => {
                  return (
                    <SelectItem value={String(items.cityId)}>
                      {items.cityName}
                    </SelectItem>
                  );
                })}
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
                {hotels.map((hotel) => (
                  <SelectItem key={hotel.hotelId} value={hotel.hotelId}>
                    {hotel.hotelName}
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
              {selectedHotelData.name}
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
                  {selectedHotelData.rating} Star Hotel
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

        <Button
          type="button"
          onClick={handleAddHotel}
          variant="secondary"
          className="w-full"
        >
          Add Hotel to Package
        </Button>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline">Cancel</Button>
        {pkg ? (
          <Button onClick={handleSubmitHotels}>
            {isLoader ? "Updating..." : "Update Package"}
          </Button>
        ) : (
          <Button onClick={handleSubmitHotels}>
            {isLoader ? "Creating..." : "Create Package"}
          </Button>
        )}
      </div>
    </>
  );
};

export default HotelDetails;
