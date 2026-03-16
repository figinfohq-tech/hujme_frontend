import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Search,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Bed,
  Clock,
  Eye,
  Filter,
  Map,
} from "lucide-react";
import GoogleMap from "@/components/ui/google-map";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import { useNavigate } from "react-router";

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

function HotelMaster() {
  const [hotels, setHotels] = useState<Hotel[]>([
    {
      hotel_id: 1,
      hotel_name: "Grand Makkah Hotel",
      address: "Ibrahim Al Khalil Street, Makkah",
      city: "Makkah",
      state: "Makkah Province",
      country: "Saudi Arabia",
      postal_code: "24231",
      phone: "+966-12-5612000",
      email: "info@grandmakkah.com",
      website: "https://grandmakkah.com",
      star_rating: 5.0,
      number_of_rooms: 850,
      amenities:
        "Wi-Fi, Restaurant, Prayer Room, Shuttle Service, 24/7 Room Service, Spa, Fitness Center",
      description:
        "Luxury hotel with direct view of Masjid al-Haram, offering premium accommodation for pilgrims.",
      checkin_time: "15:00",
      checkout_time: "12:00",
      latitude: 21.4225,
      longitude: 39.8262,
      created_by: "Admin User",
      updated_by: "Admin User",
      created_at: "2024-01-15T08:30:00Z",
      updated_at: "2024-03-10T14:22:00Z",
    },
    {
      hotel_id: 2,
      hotel_name: "Medina Palace Hotel",
      address: "King Fahd Road, Medina",
      city: "Medina",
      state: "Al Madinah Province",
      country: "Saudi Arabia",
      postal_code: "42311",
      phone: "+966-14-8472000",
      email: "reservations@medinapalace.com",
      website: "https://medinapalace.com",
      star_rating: 4.5,
      number_of_rooms: 600,
      amenities:
        "Wi-Fi, Halal Restaurant, Prayer Facilities, Air Conditioning, Concierge Service",
      description:
        "Modern hotel near Prophet's Mosque with excellent facilities for Umrah pilgrims.",
      checkin_time: "14:00",
      checkout_time: "11:00",
      latitude: 24.4686,
      longitude: 39.6142,
      created_by: "Admin User",
      updated_by: "Admin User",
      created_at: "2024-02-10T09:15:00Z",
      updated_at: "2024-02-28T16:45:00Z",
    },
    {
      hotel_id: 3,
      hotel_name: "Al-Haram View Residence",
      address: "Ajyad Street, Near Haram, Makkah",
      city: "Makkah",
      state: "Makkah Province",
      country: "Saudi Arabia",
      postal_code: "24231",
      phone: "+966-12-5698000",
      email: "info@alharamview.com",
      website: "https://alharamview.com",
      star_rating: 4.8,
      number_of_rooms: 400,
      amenities:
        "Direct Haram View, Wi-Fi, Restaurant, Prayer Area, Elevator, AC, Room Service",
      description:
        "Premium residence with stunning Kaaba views, perfect for Hajj and Umrah pilgrims.",
      checkin_time: "15:00",
      checkout_time: "12:00",
      latitude: 21.4205,
      longitude: 39.8256,
      created_by: "Admin User",
      updated_by: "Admin User",
      created_at: "2024-03-01T10:00:00Z",
      updated_at: "2024-03-15T16:30:00Z",
    },
  ]);
  const [hotels1, setHotels1] = useState<Hotel[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [editingHotel, setEditingHotel] = useState<Hotel>(initialHotelState);
  const [newHotel, setNewHotel] = useState<Hotel>(initialHotelState);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState<any>([]);
  const [cities, setCities] = useState<any>([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectdCitiesId, setSelectedCitiesId] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState<string>("all");
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterStarRating, setFilterStarRating] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("hotel_name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const navigate = useNavigate();

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

  const resetHotelForm = () => {
    setNewHotel(initialHotelState);
    setEditingHotel(initialHotelState);

    setSelectedCountryId("");
    setSelectedStateId("");
    setSelectedCitiesId("");
  };

  const token = sessionStorage.getItem("token");

  const handleDeleteHotel = async (hotelId: number) => {
    try {
      const hotel = hotels1.find((h) => h.hotel_id === hotelId);

      const response = await axios.delete(`${baseURL}hotels/${hotelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(`Hotel has been deleted successfully`);

      fetchHotels(); // refresh hotel list
    } catch (error: any) {
      const message =
        error?.response?.data?.errorMessage || "Failed to delete hotel";

      toast.error(message);
      console.error("Delete Hotel Error:", error);
    }
  };

  const openMapDialog = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setIsMapDialogOpen(true);
  };

  // Get unique values for filters
  const uniqueCities = Array.from(
    new Set(hotels.map((h) => h.city).filter(Boolean)),
  );
  const uniqueCountries = Array.from(
    new Set(hotels1.map((h) => h.countryName).filter(Boolean)),
  );

  // Apply filters and sorting
  const filteredAndSortedHotels = hotels1
    .filter((hotel) => {
      const matchesSearch =
        hotel?.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel?.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel?.stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel?.countryName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity =
        filterCity === "all" || hotel?.cityName === filterCity;
      const matchesCountry =
        filterCountry === "all" || hotel?.countryName === filterCountry;
      const matchesRating =
        filterStarRating === "all" ||
        Math.floor(hotel?.starRating) === parseInt(filterStarRating);

      return matchesSearch && matchesCity && matchesCountry && matchesRating;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof Hotel];
      let bValue: any = b[sortBy as keyof Hotel];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">{rating}</span>
      </div>
    );
  };

  //  ---------------------------- Api Calling --------------------------------
  const fetchHotels = async () => {
    try {
      const token = sessionStorage.getItem("token");
      setIsLoading(true);
      const response = await axios.get(`${baseURL}hotels`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHotels1(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Hotels API Error", error);
      setIsLoading(false);
    }
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
      const token = sessionStorage.getItem("token");
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

  useEffect(() => {
    fetchHotels();
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

  //  ---------------------------- Api Calling --------------------------------

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Hotel Master</h2>
          <p className="text-muted-foreground">
            Manage hotel inventory and details
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => navigate("/add-hotel")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Hotel
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-0">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hotels by name, city, state, or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {uniqueCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterCountry} onValueChange={setFilterCountry}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {uniqueCountries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filterStarRating}
              onValueChange={setFilterStarRating}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Star Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hotel_name">Name</SelectItem>
                <SelectItem value="city">City</SelectItem>
                <SelectItem value="star_rating">Rating</SelectItem>
                <SelectItem value="number_of_rooms">Rooms</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-0">
          <CardContent className="flex items-center gap-4 p-4">
            <Building2 className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Hotels</p>
              <p className="text-2xl font-bold">{hotels1.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="flex items-center gap-4 p-4">
            <Bed className="w-8 h-8 text-primary/90" />
            <div>
              <p className="text-sm text-muted-foreground">Total Rooms</p>
              <p className="text-2xl font-bold">
                {hotels.reduce((sum, hotel) => sum + hotel.number_of_rooms, 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="flex items-center gap-4 p-4">
            <Star className="w-8 h-8 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="text-2xl font-bold">
                {hotels1.length > 0
                  ? (
                      hotels1.reduce(
                        (sum, hotel) => sum + hotel.starRating,
                        0,
                      ) / hotels1.length
                    ).toFixed(1)
                  : 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="flex items-center gap-4 p-4">
            <MapPin className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Countries</p>
              <p className="text-2xl font-bold">{uniqueCountries.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hotels List */}
      <div className="space-y-4">
        {filteredAndSortedHotels.map((hotel) => (
          <Card
            key={hotel?.hotelId}
            className="hover:shadow-md transition-shadow p-0"
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {hotel?.hotelName}
                    </h3>
                    <Badge variant="outline">ID: {hotel?.hotelId}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {hotel?.cityName}, {hotel?.countryName}
                        </span>
                      </div>
                      {hotel?.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{hotel?.phone}</span>
                        </div>
                      )}
                      {hotel?.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{hotel?.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {renderStars(hotel?.starRating)}
                      <div className="flex items-center gap-2 text-sm">
                        <Bed className="w-4 h-4 text-muted-foreground" />
                        <span>{2} rooms</span>
                      </div>
                      {(hotel.checkin_time || hotel.checkout_time) && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {hotel.checkin_time} - {hotel.checkout_time}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {hotel?.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <a
                            href={hotel?.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Website
                          </a>
                        </div>
                      )}
                      {hotel?.latitude && hotel?.longitude && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <button
                            onClick={() => openMapDialog(hotel)}
                            className="text-green-600 hover:underline"
                          >
                            View on Map
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Created:{" "}
                        {new Date(hotel?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* {hotel.description && ( */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {
                      "Modern hotel near Prophet's Mosque with excellent facilities for Umrah pilgrims."
                    }
                  </p>
                  {/* )} */}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate("/view-hotel", {
                        state: { hotel },
                      })
                    }
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>

                  {hotel.latitude && hotel.longitude && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openMapDialog(hotel)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Map className="w-4 h-4 mr-1" />
                      Map
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate("/edit-hotel", {
                        state: { hotel: hotel },
                      })
                    }
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Hotel</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete{" "}
                          <strong>{hotel.hotel_name}</strong>? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteHotel(hotel.hotelId)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedHotels.length === 0 && (
        <Card className="p-0">
          <CardContent className="text-center py-12">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hotels found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      )}

      {/* Map Dialog */}
      <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
        <DialogContent className="!max-w-[60vw] w-[100vw] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Map className="w-5 h-5 text-green-600" />
              {selectedHotel?.hotelName} - Location
            </DialogTitle>
            <DialogDescription>
              Interactive map showing hotel location and nearby landmarks
            </DialogDescription>
          </DialogHeader>

          {selectedHotel &&
            selectedHotel.latitude &&
            selectedHotel.longitude && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedHotel?.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Coordinates</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedHotel.latitude.toFixed(6)},{" "}
                      {selectedHotel.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>

                <GoogleMap
                  latitude={selectedHotel.latitude}
                  longitude={selectedHotel.longitude}
                  hotelName={selectedHotel.hotelName}
                  height="500px"
                  zoom={16}
                />
              </div>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HotelMaster;
