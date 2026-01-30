import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Calendar,
  ArrowLeft,
  Check,
  X,
  CalendarDays,
} from "lucide-react";
// import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axios from "axios";
import { format } from "date-fns";
import { ReviewsDialog } from "@/components/ReviewsDialog";
import { baseURL } from "@/utils/constant/url";

const ComparePackages = () => {
  const [searchParams] = useSearchParams();
  const [comparePackage, setComparePackage] = useState<any>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [packageFacilities, setPackageFacilities] = useState<any>({});
  const [agentLogos, setAgentLogos] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const packageIds = searchParams.get("packages")?.split(",") || [];

  const token = localStorage.getItem("token");

  useEffect(() => {
    comparePackages();
  }, []);

  const comparePackages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://31.97.205.55:8080/api/packages/compare",
        packageIds,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setComparePackage(response.data);
      fetchAgentLogos(response.data);
      fetchFacilitiesForPackages(response.data);
    } catch (error) {
      console.error("Compare API Error:", error);
    }
  };

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

  // Mock package data - in real app, fetch based on packageIds
  const allPackages = [
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
      inclusions: [
        "Round-trip flights",
        "5-star hotel",
        "All meals",
        "Visa processing",
        "Guide service",
        "Transportation",
      ],
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
      inclusions: [
        "Round-trip flights",
        "5-star hotel",
        "All meals",
        "VIP transport",
        "24/7 support",
        "Visa processing",
      ],
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
      inclusions: [
        "Round-trip flights",
        "3-star hotel",
        "Basic meals",
        "Group transport",
        "Visa processing",
      ],
    },
  ];

  const packages = comparePackage.filter((pkg: any) =>
    packageIds.includes(String(pkg.packageId)),
  );

  const removePackage = (packageId: string) => {
    const updatedIds = packageIds.filter((id) => id !== packageId);
    if (updatedIds.length === 0) {
      navigate("/search");
    } else {
      navigate(`/compare?packages=${updatedIds.join(",")}`);
    }
  };

  const formatRating = (rating?: number) => {
    if (rating === null || rating === undefined) return "0.0";
    return Number(rating).toFixed(1);
  };
  const openReviewsDialog = (pkg: any) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  const fetchFacilitiesForPackages = async (packagesData) => {
    try {
      const facilitiesMap = {};

      await Promise.all(
        packagesData.map(async (pkg) => {
          if (!pkg.packageId) return;
          const token = localStorage.getItem("token");

          const res = await axios.get(
            `${baseURL}package-facilities/byPackage/${pkg.packageId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          // ONLY featured facilities
          const featuredFacilities = res.data
            .filter((item) => item.featured === true)
            .map((item) => item.facilityDetails?.facilityName)
            .filter(Boolean);

          facilitiesMap[pkg.packageId] = featuredFacilities;
        }),
      );

      setPackageFacilities(facilitiesMap);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search Results
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Compare Packages
          </h1>
          <p className="text-muted-foreground">
            Compare {packages.length} selected packages side by side
          </p>
        </div>

        {packages.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                No packages selected for comparison
              </p>
              <Button onClick={() => navigate("/search")}>
                Back to Search
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-max">
              {packages.map((pkg: any) => (
                <Card
                  key={pkg.packageId}
                  className="w-full min-w-[300px] relative"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePackage(String(pkg.packageId))}
                    className="absolute top-2 right-2 rounded-full bg-primary text-white h-8 w-8 hover:bg-primary/30 focus:ring-2 focus:ring-black/30"
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <CardHeader className="">
                    <div className="h-32 rounded-lg flex items-center justify-center bg-white border">
                      <a
                        href={pkg.website || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full h-full flex items-center justify-center transition ${
                          pkg.website
                            ? "hover:opacity-90"
                            : "pointer-events-none"
                        }`}
                      >
                        <img
                          src={
                            agentLogos[pkg.agentId]
                              ? agentLogos[pkg.agentId]
                              : "/placeholder.svg"
                          }
                          alt="Agent Logo"
                          className="max-w-[100%] max-h-[100%] object-contain"
                        />
                      </a>
                    </div>
                    <CardTitle className="text-lg">{pkg.packageName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {pkg.agentName}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center whitespace-nowrap">
                        <MapPin className="w-4 h-4 mr-1 shrink-0" />
                        {pkg.cityName}, {pkg.stateName}
                      </span>

                      <span className="flex items-center whitespace-nowrap">
                        <Calendar className="w-4 h-4 mr-1 shrink-0" />
                        {pkg.duration} Days
                      </span>
                    </div>

                    {/* DATES */}
                    {pkg.departureDate && pkg.arrivalDate && (
                      <div className="flex items-center text-sm text-muted-foreground flex-wrap">
                        <CalendarDays className="w-4 h-4 mr-1 shrink-0" />
                        <span className="break-words">
                          {format(new Date(pkg.departureDate), "dd MMM yyyy")}
                          {" – "}
                          {format(new Date(pkg.arrivalDate), "dd MMM yyyy")}
                        </span>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-2">
                    {/* Basic Info */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Type:
                        </span>
                        <Badge variant="secondary">{pkg.packageType}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Duration:
                        </span>
                        <span className="text-sm font-medium">
                          {`${pkg.duration} Days`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Package:
                        </span>
                        <span className="text-sm font-medium">
                          {pkg.packageType}
                        </span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Rating:
                      </span>
                      <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => openReviewsDialog(pkg)}
                      >
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {formatRating(pkg.ratingAverage)}
                        </span>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          ({pkg.reviewCount} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="border-t border-border pt-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-xl font-bold text-primary">
                            ₹{pkg.price?.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{pkg.originalPrice?.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Per person
                        </p>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">
                        Facilities :
                      </h4>
                      <div className="space-y-1">
                        {/* {pkg.features?.map((feature: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Check className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-muted-foreground">
                              {feature}
                            </span>
                          </div>
                        ))} */}
                        {/* FACILITIES */}
                        {packageFacilities[pkg.packageId]?.length > 0 && (
                          <div className="gap-2">
                            {[...packageFacilities[pkg.packageId]]
                              .sort((a, b) => a.localeCompare(b))
                              .map((facility, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <Check className="w-4 h-4 text-green-600" />
                                  <span className="text-xs text-muted-foreground">
                                    {facility}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Inclusions */}
                    {/* <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">
                        Inclusions:
                      </h4>
                      <div className="space-y-1">
                        {pkg.inclusions?.map((inc: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Check className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-muted-foreground">
                              {inc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div> */}

                    {/* Actions */}
                    <div className="space-y-2 pt-4">
                      <Button
                        className="w-full bg-gradient-button text-primary-foreground hover:opacity-90 transition-smooth"
                        onClick={() => navigate(`/package/${pkg.packageId}`)}
                      >
                        View Details
                      </Button>
                      <Button variant="outline" className="w-full">
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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

export default ComparePackages;
