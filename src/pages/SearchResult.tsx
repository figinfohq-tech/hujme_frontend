import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Star,
  MapPin,
  Calendar,
  Users,
  Phone,
  Mail,
  Filter,
} from "lucide-react";
// import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axios from "axios";

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { stateId, cityId, travelTypeId } = location.state || {};

  console.log("state data---->", cityId);
  

  const [priceRange, setPriceRange] = useState([50000, 500000]);
  const [ratingFilter, setRatingFilter] = useState([3]);
  const [durationFilter, setDurationFilter] = useState<string>("");
  const [packageTypeFilter, setPackageTypeFilter] = useState<string>("");
  const [compareList, setCompareList] = useState<string[]>([]);
  const [packages, setPackages] = useState<any>([]);

  const toggleCompare = (packageId: string) => {
    setCompareList((prev) =>
      prev.includes(packageId)
        ? prev.filter((id) => id !== packageId)
        : prev.length < 3
        ? [...prev, packageId]
        : prev
    );
  };

  const goToCompare = () => {
    if (compareList.length > 0) {
      navigate(`/compare?packages=${compareList.join(",")}`);
    }
  };

  // Mock search results data
  const searchResults = [
    {
      id: "1",
      agentName: "Al-Haramain Tours",
      packageName: "Umrah Premium Package",
      type: "Umrah",
      duration: "10 Days",
      price: 125000,
      originalPrice: 150000,
      rating: 4.8,
      reviews: 234,
      packageType: "Deluxe",
      city: "Mumbai",
      state: "Maharashtra",
      features: [
        "5 Star Hotel",
        "Direct Flight",
        "Visa Included",
        "Guide Service",
      ],
      image: "/placeholder.svg",
    },
    {
      id: "2",
      agentName: "Makkah Travels",
      packageName: "Hajj Complete Package",
      type: "Hajj",
      duration: "15 Days",
      price: 285000,
      originalPrice: 320000,
      rating: 4.6,
      reviews: 189,
      packageType: "Super Deluxe",
      city: "Delhi",
      state: "Delhi",
      features: ["5 Star Hotel", "VIP Transport", "All Meals", "24/7 Support"],
      image: "/placeholder.svg",
    },
    {
      id: "3",
      agentName: "Ziyarat Express",
      packageName: "Umrah Economy Package",
      type: "Umrah",
      duration: "7 Days",
      price: 89000,
      originalPrice: 99000,
      rating: 4.2,
      reviews: 156,
      packageType: "Economy",
      city: "Bangalore",
      state: "Karnataka",
      features: [
        "3 Star Hotel",
        "Group Package",
        "Visa Included",
        "Meals Included",
      ],
      image: "/placeholder.svg",
    },
    {
      id: "4",
      agentName: "Baitul Haram Tours",
      packageName: "Hajj & Umrah Combo",
      type: "Both",
      duration: "21 Days",
      price: 450000,
      originalPrice: 500000,
      rating: 4.9,
      reviews: 312,
      packageType: "Super Deluxe",
      city: "Hyderabad",
      state: "Telangana",
      features: [
        "5 Star Hotel",
        "Private Transport",
        "Premium Meals",
        "Expert Guide",
      ],
      image: "/placeholder.svg",
    },
  ];


  useEffect(() => {
    fetchSearchResult();
}, []);

const fetchSearchResult = async () => {
  try {
    const token = localStorage.getItem("token");
    const params: any = {};
    if (cityId) params.cityId = cityId;
    if (stateId) params.stateId = stateId;
    if (travelTypeId) params.type = travelTypeId;

    const response = await axios.get(
      "http://31.97.205.55:8080/api/packages/search",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params,
      }
    );
    console.log("Search result-1 =>", response);
    console.log("Search result-2 =>", response.data);
    setPackages(response.data);
    // handle response.data
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
};

  // Filter function
  const getFilteredResults = () => {
    return packages.filter((result) => {
      // Price filter
      if (result.price < priceRange[0] || result.price > priceRange[1]) {
        return false;
      }

      // Rating filter
      if (result.rating < ratingFilter[0]) {
        return false;
      }

      // Duration filter
      if (
        durationFilter &&
        durationFilter !== "all" &&
        !result.duration.includes(durationFilter)
      ) {
        return false;
      }

      // Package type filter
      if (packageTypeFilter && packageTypeFilter !== "all") {
        const filterMap: { [key: string]: string } = {
          economy: "Economy",
          deluxe: "Deluxe",
          "super-deluxe": "Super Deluxe",
        };
        if (result.packageType !== filterMap[packageTypeFilter]) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredResults = getFilteredResults();
                    console.log("result===>", filteredResults);


  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}

      <main className="container mx-auto px-4 py-8">
        {/* Search Summary */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Search Results for Hajj & Umrah Packages
          </h1>
          <p className="text-muted-foreground">
            Found {filteredResults.length} packages matching your criteria
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <h3 className="font-semibold text-foreground flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-primary" />
                  Filters
                </h3>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Number of Days */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Duration
                  </label>
                  <Select
                    value={durationFilter}
                    onValueChange={setDurationFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Durations</SelectItem>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="10">10 Days</SelectItem>
                      <SelectItem value="15">15 Days</SelectItem>
                      <SelectItem value="21">21 Days</SelectItem>
                      <SelectItem value="30">30+ Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Package Type */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Package Type
                  </label>
                  <Select
                    value={packageTypeFilter}
                    onValueChange={setPackageTypeFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select package type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                      <SelectItem value="super-deluxe">Super Deluxe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground !mb-3 block">
                    Price Range: ₹{priceRange[0].toLocaleString()} - ₹
                    {priceRange[1].toLocaleString()}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500000}
                    min={50000}
                    step={10000}
                    className="w-full"
                  />
                </div>

                {/* User Rating */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground !mb-3 block">
                    Minimum Rating: {ratingFilter[0]} Stars
                  </label>
                  <Slider
                    value={ratingFilter}
                    onValueChange={setRatingFilter}
                    max={5}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                {/* Apply Filters Button */}
                <Button className="w-full bg-gradient-button text-primary-foreground hover:opacity-90 transition-smooth">
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {filteredResults.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No packages found matching your criteria. Try adjusting your
                    filters.
                  </p>
                </Card>
              ) : (
                filteredResults?.map((result) => (
                  <Card
                    key={result.id}
                    className="overflow-hidden hover:shadow-elegant transition-smooth"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      {/* Package Image */}
                      <div className="md:col-span-1">
                        <div
                          className="h-48 md:h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${result.image})` }}
                        />
                      </div>

                      {/* Package Details */}
                      <div className="md:col-span-2 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-foreground mb-1">
                              {result.packageName}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-2">
                              by {result.agentName}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {result.cityName}, {result.stateName}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {result.duration}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">
                                {result.rating}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                ({result.reviews} reviews)
                              </span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {result.packageType}
                            </Badge>
                          </div>
                        </div>

                        {/* Features */}
                        {/* <div className="flex flex-wrap gap-2 mb-4">
                          {result.features.map((feature, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div> */}

                        {/* Price and Actions */}
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-primary">
                                ₹{result.price.toLocaleString()}
                              </span>
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{result.originalPrice.toLocaleString()}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Per person (all inclusive)
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant={
                                compareList.includes(result.packageId)
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => toggleCompare(result.packageId)}
                              disabled={
                                !compareList.includes(result.packageId) &&
                                compareList.length >= 3
                              }
                            >
                              {compareList.includes(result.packageId)
                                ? "Remove"
                                : "Compare"}
                            </Button>
                            <Button
                              size="sm"
                              className="bg-gradient-button text-primary-foreground hover:opacity-90 transition-smooth"
                              onClick={() =>
                                navigate(`/package/${result.packageId}`, {
                                  state: {
                                    result: result,
                                  },
                                })
                              }
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Compare Panel */}
        {compareList.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg shadow-elegant p-4 min-w-[300px]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-foreground">
                Compare Packages
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCompareList([])}
              >
                Clear All
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {compareList.length} package{compareList.length > 1 ? "s" : ""}{" "}
              selected (max 3)
            </p>
            <Button
              onClick={goToCompare}
              className="w-full bg-gradient-button text-primary-foreground hover:opacity-90 transition-smooth"
              disabled={compareList.length < 2}
            >
              Compare Selected
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
