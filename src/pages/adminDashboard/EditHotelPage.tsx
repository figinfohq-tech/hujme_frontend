import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import SearchableSelect from "@/components/SearchableSelect";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import { toast } from "react-toastify";
import GoogleMap from "@/components/ui/google-map";

interface Hotel {
  hotel_id: number;
  hotel_name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
  email: string;
  website: string;
  star_rating: number;
  number_of_rooms: number;
  amenities: string;
  description: string;
  checkin_time: string;
  checkout_time: string;
  latitude: number;
  longitude: number;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

const initialHotelState = {
  hotelId: 0,
  hotelName: "",
  address: "",
  city: "",
  cityId: "",
  state: "",
  stateId: "",
  country: "",
  countryId: "",
  postalCode: "",
  phone: "",
  email: "",
  website: "",
  starRating: 0,
  number_of_rooms: 0,
  amenities: "",
  description: "",
  checkin_time: "",
  checkout_time: "",
  latitude: 0,
  longitude: 0,
  created_by: "Admin User",
  updated_by: "Admin User",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function EditHotelPage() {
  const [newHotel, setNewHotel] = useState<Hotel>(initialHotelState);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState<any>([]);
  const [cities, setCities] = useState<any>([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectdCitiesId, setSelectedCitiesId] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState("");

  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const location = useLocation();
  const hotel = location.state?.hotel;

  // Validation functions
  const validateEmail = (email: string) => {
    if (!email) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[-\s]/g, ""));
  };

  const validateWebsite = (website: string) => {
    if (!website) return true; // Optional field
    try {
      new URL(website);
      return true;
    } catch {
      return false;
    }
  };

  const validateTimes = (checkinTime: string, checkoutTime: string) => {
    if (!checkinTime || !checkoutTime) return true;
    return checkinTime < checkoutTime;
  };

  const validateHotel = (hotel: Partial<Hotel>) => {
    const errors: string[] = [];

    if (!hotel.hotelName?.trim()) {
      errors.push("Hotel name is required");
    }

    if (hotel.hotelName && hotel.hotelName.length > 255) {
      errors.push("Hotel name must be less than 255 characters");
    }

    if (hotel.email && !validateEmail(hotel.email)) {
      errors.push("Please enter a valid email address");
    }

    if (hotel.phone && !validatePhone(hotel.phone)) {
      errors.push("Please enter a valid phone number");
    }

    if (hotel.website && !validateWebsite(hotel.website)) {
      errors.push("Please enter a valid website URL");
    }

    if (
      hotel.starRating !== undefined &&
      (hotel.starRating < 0 || hotel.starRating > 5)
    ) {
      errors.push("Star rating must be between 0.0 and 5.0");
    }

    if (hotel.number_of_rooms !== undefined && hotel.number_of_rooms < 0) {
      errors.push("Number of rooms cannot be negative");
    }

    if (!validateTimes(hotel.checkin_time || "", hotel.checkout_time || "")) {
      errors.push("Check-in time must be before check-out time");
    }

    return errors;
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
      const token = sessionStorage.getItem("token");
      const response = await axios.get<any>(
        `${baseURL}states/byCountry/${selectedCountryId}`,
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
      const response = await axios.get<any>(
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

  const handleUpdateHotel = async () => {
    const errors = validateHotel(newHotel);

    if (errors.length > 0) {
      toast.error(`Validation Error: ${errors.join(", ")}`);
      return;
    }

    try {
      const payload = {
        hotelName: newHotel.hotelName || "",
        address: newHotel.address || "",
        cityId: newHotel.cityId,
        stateId: newHotel.stateId,
        countryId: newHotel.countryId,
        postalCode: newHotel.postalCode || "",
        distance: "",
        phone: newHotel.phone || "",
        email: newHotel.email || "",
        website: newHotel.website || "",
        starRating: newHotel.starRating || 0,
        latitude: newHotel.latitude || 0,
        longitude: newHotel.longitude || 0,
      };

      const response = await axios.put(
        `${baseURL}hotels/${hotel.hotelId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Hotel Update successfully");

      setNewHotel(initialHotelState);
      //   resetHotelForm();
      await navigate(-1);
    } catch (error) {
      const message =
        error?.response?.data?.errorMessage || "Failed to update hotel";
      toast.error(message);
      console.error("Update Hotel Error:", error);
    }
  };

  useEffect(() => {
    fetchCountries();
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

  useEffect(() => {
    if (hotel) {
      setNewHotel({
        hotelName: hotel.hotelName,
        address: hotel.address,
        country: hotel.country,
        state: hotel.state,
        city: hotel.city,
        postalCode: hotel.postalCode,
        phone: hotel.phone,
        email: hotel.email,
        website: hotel.website,
        starRating: hotel.starRating,
        number_of_rooms: hotel.number_of_rooms,
        latitude: hotel.latitude,
        longitude: hotel.longitude,
        description: hotel.description,
      });
      setSelectedCountryId(hotel.countryId);
      setSelectedStateId(hotel.stateId);
      setSelectedCitiesId(hotel.cityId);
    }
  }, [hotel]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft /> Back
          </Button>

          <div>
            <h2 className="text-xl font-semibold">Edit Hotel</h2>
            <p className="text-sm text-muted-foreground">
              Update hotel information
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <div className="space-y-2">
                <Label htmlFor="hotel-name">Hotel Name *</Label>
                <Input
                  id="hotel-name"
                  placeholder="Enter hotel name"
                  value={newHotel.hotelName}
                  onChange={(e) =>
                    setNewHotel((prev) => ({
                      ...prev,
                      hotelName: e.target.value,
                    }))
                  }
                  maxLength={255}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter hotel address"
                  value={newHotel.address}
                  onChange={(e) =>
                    setNewHotel((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  {/* <Input
                      id="country"
                      placeholder="Country"
                      value={newHotel.country}
                      onChange={(e) =>
                        setNewHotel((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      maxLength={100}
                    /> */}
                  <SearchableSelect
                    value={selectedCountryId}
                    placeholder="Select Country"
                    items={countries}
                    labelKey="countryName"
                    valueKey="countryId"
                    onChange={(value) => {
                      const selectedCountry = countries.find(
                        (c) => c.countryId === value,
                      );

                      setSelectedCountryId(value);

                      setNewHotel((prev) => ({
                        ...prev,
                        country: selectedCountry?.countryName || "",
                        countryId: value,
                      }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  {/* <Input
                      id="state"
                      placeholder="State"
                      value={newHotel.state}
                      onChange={(e) =>
                        setNewHotel((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      maxLength={100}
                    /> */}

                  <SearchableSelect
                    value={selectedStateId}
                    placeholder="Select State"
                    items={states}
                    labelKey="stateName"
                    valueKey="stateId"
                    onChange={(value) => {
                      const selectedState = states.find(
                        (c) => c.stateId === value,
                      );

                      setSelectedStateId(value);

                      setNewHotel((prev) => ({
                        ...prev,
                        state: selectedState?.countryName || "",
                        stateId: value,
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  {/* <Input
                      id="city"
                      placeholder="City"
                      value={newHotel.city}
                      onChange={(e) =>
                        setNewHotel((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      maxLength={100}
                    /> */}
                  <SearchableSelect
                    value={selectdCitiesId}
                    placeholder="Select City"
                    items={cities}
                    labelKey="cityName"
                    valueKey="cityId"
                    onChange={(value) => {
                      const selectedCity = cities.find(
                        (c) => c.cityId === value,
                      );

                      setSelectedCitiesId(value);

                      setNewHotel((prev) => ({
                        ...prev,
                        city: selectedCity?.cityName || "",
                        cityId: value,
                      }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal-code">Postal Code</Label>
                  <Input
                    id="postal-code"
                    placeholder="Postal Code"
                    value={newHotel.postalCode}
                    onChange={(e) =>
                      setNewHotel((prev) => ({
                        ...prev,
                        postalCode: e.target.value,
                      }))
                    }
                    maxLength={20}
                  />
                </div>
              </div>
            </div>

            {/* Contact & Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact & Details</h3>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+1-234-567-8900"
                  value={newHotel.phone}
                  onChange={(e) =>
                    setNewHotel((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  maxLength={20}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hotel@example.com"
                  value={newHotel.email}
                  onChange={(e) =>
                    setNewHotel((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://hotel.com"
                  value={newHotel.website}
                  onChange={(e) =>
                    setNewHotel((prev) => ({
                      ...prev,
                      website: e.target.value,
                    }))
                  }
                  maxLength={255}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="star-rating">Star Rating</Label>
                  <Input
                    id="star-rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="4.5"
                    value={newHotel.starRating || ""}
                    onChange={(e) =>
                      setNewHotel((prev) => ({
                        ...prev,
                        starRating: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rooms">Number of Rooms</Label>
                  <Input
                    id="rooms"
                    type="number"
                    min="0"
                    placeholder="100"
                    value={newHotel.number_of_rooms || ""}
                    onChange={(e) =>
                      setNewHotel((prev) => ({
                        ...prev,
                        number_of_rooms: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="checkin-time">Check-in Time</Label>
                  <Input
                    id="checkin-time"
                    type="time"
                    value={newHotel.checkin_time}
                    onChange={(e) =>
                      setNewHotel((prev) => ({
                        ...prev,
                        checkin_time: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout-time">Check-out Time</Label>
                  <Input
                    id="checkout-time"
                    type="time"
                    value={newHotel.checkout_time}
                    onChange={(e) =>
                      setNewHotel((prev) => ({
                        ...prev,
                        checkout_time: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.0000001"
                    placeholder="21.4225"
                    value={newHotel.latitude || ""}
                    onChange={(e) =>
                      setNewHotel((prev) => ({
                        ...prev,
                        latitude: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.0000001"
                    placeholder="39.8262"
                    value={newHotel.longitude || ""}
                    onChange={(e) =>
                      setNewHotel((prev) => ({
                        ...prev,
                        longitude: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>

              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities</Label>
                <Textarea
                  id="amenities"
                  placeholder="Wi-Fi, Restaurant, Pool, Gym, Spa..."
                  value={newHotel.amenities}
                  onChange={(e) =>
                    setNewHotel((prev) => ({
                      ...prev,
                      amenities: e.target.value,
                    }))
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Hotel description and highlights..."
                  value={newHotel.description}
                  onChange={(e) =>
                    setNewHotel((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              {/* Live Map Preview */}
              {newHotel.latitude && newHotel.longitude && (
                <div className="space-y-2">
                  <Label>Location Preview</Label>
                  <GoogleMap
                    latitude={newHotel.latitude}
                    longitude={newHotel.longitude}
                    hotelName={newHotel.hotelName || "New Hotel"}
                    height="200px"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6">
            <Button
              onClick={handleUpdateHotel}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Update Hotel
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                // resetHotelForm();
                navigate(-1);
              }}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
