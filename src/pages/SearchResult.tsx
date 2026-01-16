import { useEffect, useMemo, useState } from "react";
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
  CalendarDays,
  ArrowUpDown,
} from "lucide-react";
// import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axios from "axios";
import image from "../../public/placeholder.svg";
import { baseURL } from "@/utils/constant/url";
import { format } from "date-fns";
import { ReviewsDialog } from "@/components/ReviewsDialog";

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { countryId, stateId, cityId, travelTypeId } = location.state || {};

  const [priceRange, setPriceRange] = useState([50000, 500000]);
  const [ratingFilter, setRatingFilter] = useState([3]);
  const [durationFilter, setDurationFilter] = useState<string>("");
  const [agentFilter, setAgentFilter] = useState<string>("");
  const [packageTypeFilter, setPackageTypeFilter] = useState<string>("");
  const [compareList, setCompareList] = useState<string[]>([]);
  const [packages, setPackages] = useState<any>([]);
  const [agentLogos, setAgentLogos] = useState<{ [key: string]: string }>({});
  const [packageFacilities, setPackageFacilities] = useState({});
  const [sortBy, setSortBy] = useState<string>("rating");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [packageFilter, setPackageFilter] = useState<any>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const openReviewsDialog = (pkg: any) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  const formatRating = (rating?: number) => {
    if (rating === null || rating === undefined) return "0.0";
    return Number(rating).toFixed(1);
  };

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
      token
        ? role === "USER"
          ? navigate(`/customer/compare?packages=${compareList.join(",")}`)
          : null
        : navigate(`/compare?packages=${compareList.join(",")}`);
    }
  };

  useEffect(() => {
    fetchSearchResult();
  }, []);

  const fetchSearchResult = async () => {
    try {
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

      setPackages(response.data);
      fetchAgentLogos(response.data);
      fetchFacilitiesForPackages(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const fetchPackagefilters = async () => {
    try {
      const token = localStorage.getItem("token");

      const params: any = {};

      if (countryId) params.countryId = countryId;
      if (stateId) params.stateId = stateId;
      if (cityId) params.cityId = cityId;
      if (travelTypeId) params.travelTypeId = travelTypeId;

      const response = await axios.get(`${baseURL}packages/package-filters`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params,
      });

      setPackageFilter(response.data);
    } catch (error) {
      console.error("Error fetching packages by type:", error);
    }
  };

  useEffect(() => {
    fetchPackagefilters();
  }, [countryId, stateId, cityId, travelTypeId]);

  // fetching type

  // fetching logo
  const fetchAgentLogos = async (packagesData: any[]) => {
    try {
      const agentIds = [
        ...new Set(packagesData.map((pkg) => pkg.agentId).filter(Boolean)),
      ];

      const logoRequests = agentIds.map(async (agentId) => {
        try {
          const res = await axios.get(`${baseURL}agents/get-logo/${agentId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          });

          const imageUrl = URL.createObjectURL(res.data);

          return { agentId, logo: imageUrl };
        } catch (err) {
          return { agentId, logo: null };
        }
      });

      const logos = await Promise.all(logoRequests);

      const logoMap: any = {};
      logos.forEach(({ agentId, logo }) => {
        if (logo) {
          logoMap[agentId] = logo;
        }
      });

      setAgentLogos(logoMap);
    } catch (error) {
      console.error("Error fetching agent logos:", error);
    }
  };

  const fetchFacilitiesForPackages = async (packagesData) => {
    try {
      const facilitiesMap = {};

      await Promise.all(
        packagesData.map(async (pkg) => {
          if (!pkg.packageId) return;

          const res = await axios.get(
            `${baseURL}package-facilities/byPackage/${pkg.packageId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // ONLY featured facilities
          const featuredFacilities = res.data
            .filter((item) => item.featured === true)
            .map((item) => item.facilityDetails?.facilityName)
            .filter(Boolean);

          facilitiesMap[pkg.packageId] = featuredFacilities;
        })
      );

      setPackageFacilities(facilitiesMap);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };

  // Filter functions
  const parseDuration = (duration: any): number => {
    if (!duration) return 0;

    // If already a number
    if (typeof duration === "number") {
      return duration;
    }

    // If string like "7 Days", "10 Days"
    if (typeof duration === "string") {
      const match = duration.match(/\d+/);
      return match ? Number(match[0]) : 0;
    }

    return 0;
  };

  const parseDate = (date: any): number => {
    if (!date) return 0;

    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? 0 : parsed.getTime();
  };

  const getFilteredResults = () => {
    const filtered = packages.filter((result: any) => {
      // Price filter
      if (result.price < priceRange[0] || result.price > priceRange[1]) {
        return false;
      }

      // Rating filter
      if (result.rating < ratingFilter[0]) {
        return false;
      }

      // Duration filter (safe)
      if (durationFilter && durationFilter !== "all") {
        const durationValue = parseDuration(result.duration);
        if (durationValue !== Number(durationFilter)) {
          return false;
        }
      }
      // Agents filter (safe)
      if (agentFilter && agentFilter !== "all") {
        if (result.agentName !== agentFilter) {
          return false;
        }
      }

      // Package type filter
      if (packageTypeFilter && packageTypeFilter !== "all") {
        if (result.packageType !== packageTypeFilter) {
          return false;
        }
      }

      return true;
    });

    // Sort the filtered results
    return filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "rating":
          comparison = a.rating - b.rating;
          break;

        case "price":
          comparison = a.price - b.price;
          break;

        case "duration":
          comparison = parseDuration(a.duration) - parseDuration(b.duration);
          break;

        case "departureDate":
          comparison = parseDate(a.departureDate) - parseDate(b.departureDate);
          break;

        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  const filteredResults = getFilteredResults();

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
                {/* agent name */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Agency Name
                  </label>
                  <Select value={agentFilter} onValueChange={setAgentFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder=" Agency Name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Agency Name</SelectItem>
                      {packageFilter.agents?.map((item: any) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* agent name */}

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
                      {packageFilter.durations?.map((item: any) => (
                        <SelectItem key={item} value={item}>
                          {item} Days
                        </SelectItem>
                      ))}
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
                      {packageFilter.packageTypes?.map((item: any) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
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
            {/* --------------------------------------- */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort by:</span>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                  <SelectItem value="price">Package Price</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="departureDate">Departure Date</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">High to Low</SelectItem>
                  <SelectItem value="asc">Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* --------------------------------------- */}
            <div className="space-y-6">
              {filteredResults.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No packages found matching your criteria. Try adjusting your
                    filters.
                  </p>
                </Card>
              ) : (
                filteredResults?.map((result: any) => (
                  <Card
                    key={result.id}
                    className="overflow-hidden hover:shadow-elegant py-0 transition-smooth"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      {/* agency logo */}
                      <div className="md:col-span-1 h-48 md:h-full flex items-center justify-center bg-white border-r border-border">
                        <a
                          href={result.website || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full h-full flex items-center justify-center transition ${
                            result.website
                              ? "hover:opacity-90"
                              : "pointer-events-none"
                          }`}
                        >
                          <img
                            src={
                              agentLogos[result.agentId]
                                ? agentLogos[result.agentId]
                                : "/placeholder.svg"
                            }
                            alt="Agent Logo"
                            className="max-w-[90%] max-h-[90%] object-contain transition-transform duration-300 ease-in-out hover:scale-105 drop-shadow-sm"
                          />
                        </a>
                      </div>

                      {/* Package Details */}
                      <div className="md:col-span-2 p-3">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                          {/* LEFT CONTENT */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1 break-words">
                              {result.packageName}
                            </h3>

                            <p className="text-muted-foreground text-sm mb-2 truncate">
                              <a
                                href={result.website || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={
                                  result.website
                                    ? "cursor-pointer hover:underline"
                                    : "pointer-events-none"
                                }
                              >
                                By {result.agentName}
                              </a>
                            </p>

                            {/* LOCATION & DURATION */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                              <span className="flex items-center whitespace-nowrap">
                                <MapPin className="w-4 h-4 mr-1 shrink-0" />
                                {result.cityName}, {result.stateName}
                              </span>

                              <span className="flex items-center whitespace-nowrap">
                                <Calendar className="w-4 h-4 mr-1 shrink-0" />
                                {result.duration} Days
                              </span>
                            </div>

                            {/* DATES */}
                            {result.departureDate && result.arrivalDate && (
                              <div className="flex items-center text-sm text-muted-foreground mb-3 flex-wrap">
                                <CalendarDays className="w-4 h-4 mr-1 shrink-0" />
                                <span className="break-words">
                                  {format(
                                    new Date(result.departureDate),
                                    "dd MMM yyyy"
                                  )}
                                  {" – "}
                                  {format(
                                    new Date(result.arrivalDate),
                                    "dd MMM yyyy"
                                  )}
                                </span>
                              </div>
                            )}

                            {/* FACILITIES */}
                            {packageFacilities[result.packageId]?.length >
                              0 && (
                              <div className="flex flex-wrap gap-2">
                                {packageFacilities[result.packageId].map(
                                  (facility, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs whitespace-nowrap"
                                    >
                                      {facility}
                                    </Badge>
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          {/* RIGHT CONTENT */}
                          <div className="flex md:flex-col items-start md:items-end justify-between md:justify-start gap-2 md:text-right shrink-0">
                            <div
                              className="flex items-center gap-1 cursor-pointer"
                              onClick={() => openReviewsDialog(result)}
                            >
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">
                                {formatRating(result.ratingAverage)}
                              </span>
                              <span className="text-sm text-muted-foreground whitespace-nowrap">
                                ({result.reviewCount} reviews)
                              </span>
                            </div>

                            <Badge
                              variant="secondary"
                              className="text-xs w-fit"
                            >
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

                            {/* Seats Info */}
                            <p className="text-xs mt-1">
                              <span className="text-muted-foreground">
                                Total Seats:
                              </span>{" "}
                              <span className="font-medium">
                                {result.totalSeats}
                              </span>{" "}
                              •{" "}
                              {result.availableSeats === 0 ||
                              result.availableSeats === null ? (
                                <span className="text-gray-500 font-medium">
                                  Closed
                                </span>
                              ) : (
                                <span
                                  className={
                                    result.availableSeats <= 5
                                      ? "text-red-600 font-medium"
                                      : "text-green-600 font-medium"
                                  }
                                >
                                  {result.availableSeats} Available
                                </span>
                              )}
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
                              onClick={() => {
                                const token = localStorage.getItem("token");
                                const role = localStorage.getItem("role");
                                return token
                                  ? role === "USER"
                                    ? navigate(
                                        `/customer/package/${result.packageId}`,
                                        {
                                          state: {
                                            result: result,
                                          },
                                        }
                                      )
                                    : null
                                  : navigate(`/package/${result.packageId}`, {
                                      state: {
                                        result: result,
                                      },
                                    });
                              }}
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

      {selectedPackage && (
        <ReviewsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          packageId={selectedPackage.packageId}
          packageName={selectedPackage.packageName}
          agentName={selectedPackage.agentName}
          agentId={selectedPackage.agentId}
        />
      )}

      <Footer />
    </div>
  );
};

export default SearchResults;
