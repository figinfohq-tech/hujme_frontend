import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
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
  DialogTrigger,
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
import { toast } from "sonner";
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
  hotel_id: 0,
  hotel_name: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postal_code: "",
  phone: "",
  email: "",
  website: "",
  star_rating: 0,
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
  console.log("🏨 HotelMaster page rendered");

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

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [editingHotel, setEditingHotel] = useState<Hotel>(initialHotelState);
  const [newHotel, setNewHotel] = useState<Hotel>(initialHotelState);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState<string>("all");
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterStarRating, setFilterStarRating] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("hotel_name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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

    if (!hotel.hotel_name?.trim()) {
      errors.push("Hotel name is required");
    }

    if (hotel.hotel_name && hotel.hotel_name.length > 255) {
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
      hotel.star_rating !== undefined &&
      (hotel.star_rating < 0 || hotel.star_rating > 5)
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

  const handleCreateHotel = () => {
    const errors = validateHotel(newHotel);
    if (errors.length > 0) {
      toast.error(`Validation Error: ${errors.join(", ")}`);
      return;
    }

    const hotel: Hotel = {
      ...newHotel,
      hotel_id: Math.max(...hotels.map((h) => h.hotel_id), 0) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: "Admin User",
      updated_by: "Admin User",
    };

    console.log("✅ Creating new hotel:", hotel);
    setHotels((prev) => [hotel, ...prev]);
    setIsCreateDialogOpen(false);
    setNewHotel(initialHotelState);
    toast.success(`${hotel.hotel_name} has been added successfully`);
  };

  const handleEditHotel = () => {
    const errors = validateHotel(editingHotel);
    if (errors.length > 0) {
      toast.error(`Validation Error: ${errors.join(", ")}`);
      return;
    }

    const updatedHotel = {
      ...editingHotel,
      updated_at: new Date().toISOString(),
      updated_by: "Admin User",
    };

    console.log("✏️ Updating hotel:", updatedHotel);
    setHotels((prev) =>
      prev.map((hotel) =>
        hotel.hotel_id === updatedHotel.hotel_id ? updatedHotel : hotel,
      ),
    );
    setIsEditDialogOpen(false);
    setEditingHotel(initialHotelState);
    toast.success(`${updatedHotel.hotel_name} has been updated successfully`);
  };

  const handleDeleteHotel = (hotelId: number) => {
    const hotel = hotels.find((h) => h.hotel_id === hotelId);
    console.log("🗑️ Deleting hotel:", hotel?.hotel_name);
    setHotels((prev) => prev.filter((h) => h.hotel_id !== hotelId));
    toast.success(`${hotel?.hotel_name} has been deleted successfully`);
  };

  const openEditDialog = (hotel: Hotel) => {
    setEditingHotel({ ...hotel });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setIsViewDialogOpen(true);
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
    new Set(hotels.map((h) => h.country).filter(Boolean)),
  );

  // Apply filters and sorting
  const filteredAndSortedHotels = hotels
    .filter((hotel) => {
      const matchesSearch =
        hotel.hotel_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.country.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = filterCity === "all" || hotel.city === filterCity;
      const matchesCountry =
        filterCountry === "all" || hotel.country === filterCountry;
      const matchesRating =
        filterStarRating === "all" ||
        Math.floor(hotel.star_rating) === parseInt(filterStarRating);

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

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Hotel
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-[60vw] w-[100vw] h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Hotel</DialogTitle>
              <DialogDescription>
                Create a new hotel entry in the system
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="hotel-name">Hotel Name *</Label>
                  <Input
                    id="hotel-name"
                    placeholder="Enter hotel name"
                    value={newHotel.hotel_name}
                    onChange={(e) =>
                      setNewHotel((prev) => ({
                        ...prev,
                        hotel_name: e.target.value,
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
                    <Label htmlFor="city">City</Label>
                    <Input
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
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
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal-code">Postal Code</Label>
                    <Input
                      id="postal-code"
                      placeholder="Postal Code"
                      value={newHotel.postal_code}
                      onChange={(e) =>
                        setNewHotel((prev) => ({
                          ...prev,
                          postal_code: e.target.value,
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
                      value={newHotel.star_rating || ""}
                      onChange={(e) =>
                        setNewHotel((prev) => ({
                          ...prev,
                          star_rating: parseFloat(e.target.value) || 0,
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
                      hotelName={newHotel.hotel_name || "New Hotel"}
                      height="200px"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCreateHotel}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Add Hotel
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
              <p className="text-2xl font-bold">{hotels.length}</p>
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
                {hotels.length > 0
                  ? (
                      hotels.reduce(
                        (sum, hotel) => sum + hotel.star_rating,
                        0,
                      ) / hotels.length
                    ).toFixed(1)
                  : "0"}
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
            key={hotel.hotel_id}
            className="hover:shadow-md transition-shadow p-0"
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {hotel.hotel_name}
                    </h3>
                    <Badge variant="outline">ID: {hotel.hotel_id}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {hotel.city}, {hotel.country}
                        </span>
                      </div>
                      {hotel.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{hotel.phone}</span>
                        </div>
                      )}
                      {hotel.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{hotel.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {renderStars(hotel.star_rating)}
                      <div className="flex items-center gap-2 text-sm">
                        <Bed className="w-4 h-4 text-muted-foreground" />
                        <span>{hotel.number_of_rooms} rooms</span>
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
                      {hotel.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <a
                            href={hotel.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Website
                          </a>
                        </div>
                      )}
                      {hotel.latitude && hotel.longitude && (
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
                        {new Date(hotel.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {hotel.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {hotel.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openViewDialog(hotel)}
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
                    onClick={() => openEditDialog(hotel)}
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
                          onClick={() => handleDeleteHotel(hotel.hotel_id)}
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
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Map className="w-5 h-5 text-green-600" />
              {selectedHotel?.hotel_name} - Location
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
                      {selectedHotel.address}
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
                  hotelName={selectedHotel.hotel_name}
                  height="500px"
                  zoom={16}
                />
              </div>
            )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - Similar structure to Create Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hotel</DialogTitle>
            <DialogDescription>Update hotel information</DialogDescription>
          </DialogHeader>

          {/* Similar form structure as create dialog but with editingHotel state */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <div className="space-y-2">
                <Label htmlFor="edit-hotel-name">Hotel Name *</Label>
                <Input
                  id="edit-hotel-name"
                  placeholder="Enter hotel name"
                  value={editingHotel.hotel_name}
                  onChange={(e) =>
                    setEditingHotel((prev) => ({
                      ...prev,
                      hotel_name: e.target.value,
                    }))
                  }
                  maxLength={255}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea
                  id="edit-address"
                  placeholder="Enter hotel address"
                  value={editingHotel.address}
                  onChange={(e) =>
                    setEditingHotel((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    placeholder="City"
                    value={editingHotel.city}
                    onChange={(e) =>
                      setEditingHotel((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-state">State</Label>
                  <Input
                    id="edit-state"
                    placeholder="State"
                    value={editingHotel.state}
                    onChange={(e) =>
                      setEditingHotel((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-country">Country</Label>
                  <Input
                    id="edit-country"
                    placeholder="Country"
                    value={editingHotel.country}
                    onChange={(e) =>
                      setEditingHotel((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-postal-code">Postal Code</Label>
                  <Input
                    id="edit-postal-code"
                    placeholder="Postal Code"
                    value={editingHotel.postal_code}
                    onChange={(e) =>
                      setEditingHotel((prev) => ({
                        ...prev,
                        postal_code: e.target.value,
                      }))
                    }
                    maxLength={20}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact & Details</h3>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  placeholder="+1-234-567-8900"
                  value={editingHotel.phone}
                  onChange={(e) =>
                    setEditingHotel((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  maxLength={20}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="hotel@example.com"
                  value={editingHotel.email}
                  onChange={(e) =>
                    setEditingHotel((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-website">Website</Label>
                <Input
                  id="edit-website"
                  placeholder="https://hotel.com"
                  value={editingHotel.website}
                  onChange={(e) =>
                    setEditingHotel((prev) => ({
                      ...prev,
                      website: e.target.value,
                    }))
                  }
                  maxLength={255}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-star-rating">Star Rating</Label>
                  <Input
                    id="edit-star-rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="4.5"
                    value={editingHotel.star_rating || ""}
                    onChange={(e) =>
                      setEditingHotel((prev) => ({
                        ...prev,
                        star_rating: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-rooms">Number of Rooms</Label>
                  <Input
                    id="edit-rooms"
                    type="number"
                    min="0"
                    placeholder="100"
                    value={editingHotel.number_of_rooms || ""}
                    onChange={(e) =>
                      setEditingHotel((prev) => ({
                        ...prev,
                        number_of_rooms: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-checkin-time">Check-in Time</Label>
                  <Input
                    id="edit-checkin-time"
                    type="time"
                    value={editingHotel.checkin_time}
                    onChange={(e) =>
                      setEditingHotel((prev) => ({
                        ...prev,
                        checkin_time: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-checkout-time">Check-out Time</Label>
                  <Input
                    id="edit-checkout-time"
                    type="time"
                    value={editingHotel.checkout_time}
                    onChange={(e) =>
                      setEditingHotel((prev) => ({
                        ...prev,
                        checkout_time: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-latitude">Latitude</Label>
                  <Input
                    id="edit-latitude"
                    type="number"
                    step="0.0000001"
                    placeholder="21.4225"
                    value={editingHotel.latitude || ""}
                    onChange={(e) =>
                      setEditingHotel((prev) => ({
                        ...prev,
                        latitude: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-longitude">Longitude</Label>
                  <Input
                    id="edit-longitude"
                    type="number"
                    step="0.0000001"
                    placeholder="39.8262"
                    value={editingHotel.longitude || ""}
                    onChange={(e) =>
                      setEditingHotel((prev) => ({
                        ...prev,
                        longitude: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>

              <div className="space-y-2">
                <Label htmlFor="edit-amenities">Amenities</Label>
                <Textarea
                  id="edit-amenities"
                  placeholder="Wi-Fi, Restaurant, Pool, Gym, Spa..."
                  value={editingHotel.amenities}
                  onChange={(e) =>
                    setEditingHotel((prev) => ({
                      ...prev,
                      amenities: e.target.value,
                    }))
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Hotel description and highlights..."
                  value={editingHotel.description}
                  onChange={(e) =>
                    setEditingHotel((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              {/* Live Map Preview for Editing */}
              {editingHotel.latitude && editingHotel.longitude && (
                <div className="space-y-2">
                  <Label>Location Preview</Label>
                  <GoogleMap
                    latitude={editingHotel.latitude}
                    longitude={editingHotel.longitude}
                    hotelName={editingHotel.hotel_name || "Hotel"}
                    height="200px"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleEditHotel}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Update Hotel
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hotel Details</DialogTitle>
            <DialogDescription>
              View complete hotel information
            </DialogDescription>
          </DialogHeader>

          {selectedHotel && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Hotel Name
                    </Label>
                    <p className="text-lg font-semibold">
                      {selectedHotel.hotel_name}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Address
                    </Label>
                    <p className="text-sm">{selectedHotel.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        City
                      </Label>
                      <p className="text-sm">{selectedHotel.city}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        State
                      </Label>
                      <p className="text-sm">{selectedHotel.state}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Country
                      </Label>
                      <p className="text-sm">{selectedHotel.country}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Postal Code
                      </Label>
                      <p className="text-sm">{selectedHotel.postal_code}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Phone
                    </Label>
                    <p className="text-sm">{selectedHotel.phone}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Email
                    </Label>
                    <p className="text-sm">{selectedHotel.email}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Website
                    </Label>
                    <p className="text-sm">{selectedHotel.website}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Star Rating
                      </Label>
                      <div className="flex items-center gap-2">
                        {renderStars(selectedHotel.star_rating)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Rooms
                      </Label>
                      <p className="text-sm">{selectedHotel.number_of_rooms}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Check-in
                      </Label>
                      <p className="text-sm">{selectedHotel.checkin_time}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Check-out
                      </Label>
                      <p className="text-sm">{selectedHotel.checkout_time}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Amenities
                  </Label>
                  <p className="text-sm">{selectedHotel.amenities}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Description
                  </Label>
                  <p className="text-sm">{selectedHotel.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Latitude
                    </Label>
                    <p className="text-sm">{selectedHotel.latitude}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Longitude
                    </Label>
                    <p className="text-sm">{selectedHotel.longitude}</p>
                  </div>
                </div>

                {/* Map in View Dialog */}
                {selectedHotel.latitude && selectedHotel.longitude && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Location Map
                    </Label>
                    <div className="mt-2">
                      <GoogleMap
                        latitude={selectedHotel.latitude}
                        longitude={selectedHotel.longitude}
                        hotelName={selectedHotel.hotel_name}
                        height="300px"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Created
                    </Label>
                    <p className="text-sm">
                      {new Date(selectedHotel.created_at).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      by {selectedHotel.created_by}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </Label>
                    <p className="text-sm">
                      {new Date(selectedHotel.updated_at).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      by {selectedHotel.updated_by}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HotelMaster;
