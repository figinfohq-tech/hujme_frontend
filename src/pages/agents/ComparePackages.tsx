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

  const allFacilities = Array.from(
    new Set(
      Object.values(packageFacilities)
        .flat() // multiple arrays → single array
        .filter(Boolean),
    ),
  );

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
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="border p-3 text-left font-semibold w-56">
                    Package Details
                  </th>
                  {packages.map((pkg) => (
                    <th
                      key={pkg.packageId}
                      className="border p-3 text-center min-w-[260px]"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={agentLogos[pkg.agentId] || "/placeholder.svg"}
                          className="h-16 object-contain"
                        />
                        <div className="font-bold text-lg">
                          {pkg.packageName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {pkg.agentName}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3 font-medium">Tour Operator</td>
                  {packages.map((pkg) => (
                    <td key={pkg.packageId} className="border p-3 text-center">
                      {pkg.agentName}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="border p-3 font-medium">From Location</td>
                  {packages.map((pkg) => (
                    <td key={pkg.packageId} className="border p-3 text-center">
                      {pkg.cityName}, {pkg.stateName}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="border p-3 font-medium">Start Date</td>
                  {packages.map((pkg) => (
                    <td key={pkg.packageId} className="border p-3 text-center">
                      {pkg.departureDate
                        ? format(new Date(pkg.departureDate), "dd-MMM-yyyy")
                        : "-"}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="border p-3 font-medium">End Date</td>
                  {packages.map((pkg) => (
                    <td key={pkg.packageId} className="border p-3 text-center">
                      {pkg.arrivalDate
                        ? format(new Date(pkg.arrivalDate), "dd-MMM-yyyy")
                        : "-"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Duration</td>
                  {packages.map((pkg) => (
                    <td key={pkg.packageId} className="border p-3 text-center">
                      {`${pkg?.duration} Days`}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Package Type</td>
                  {packages.map((pkg) => (
                    <td key={pkg.packageId} className="border p-3 text-center">
                      {pkg?.packageType}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-3 font-medium">Rating</td>
                  {packages.map((pkg) => (
                    <td key={pkg.packageId} className="border p-3 text-center">
                      {pkg?.ratingAverage}
                    </td>
                  ))}
                </tr>
                <tr className="bg-muted/40">
                  <td className="border p-3 font-medium">Price Per Seat</td>
                  {packages.map((pkg) => (
                    <td
                      key={pkg.packageId}
                      className="border p-3 text-center text-lg font-bold text-primary"
                    >
                      ₹{pkg.price?.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-medium">Facilities</td>
                </tr>

                {allFacilities.map((facilityName, index) => (
                  <tr key={facilityName}>
                    <td className="border p-3 font-medium">{facilityName}</td>

                    {packages.map((pkg) => {
                      const hasFacility =
                        packageFacilities[pkg.packageId]?.includes(
                          facilityName,
                        );

                      return (
                        <td
                          key={pkg.packageId}
                          className="border p-3 text-center"
                        >
                          {hasFacility ? (
                            <Check className="mx-auto text-green-600" />
                          ) : (
                            <X className="mx-auto text-red-500" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                <tr>
                  <td className="border p-3 font-medium">Action</td>

                  {packages.map((pkg) => (
                    <td
                      key={pkg.packageId}
                      className="border p-3 text-center align-middle"
                    >
                      <div className="flex flex-col gap-2 items-center">
                        <Button
                          size="sm"
                          className="w-full bg-primary hover:bg-primary/90"
                          onClick={() =>
                            navigate("/booking-detail", {
                              state: {
                                packageData: {
                                  id: pkg?.packageId.toLocaleString(),
                                  title: pkg?.packageName,
                                  price: pkg?.price,
                                  duration: pkg?.duration,
                                },
                              },
                            })
                          }
                        >
                          Book Now
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate(`/package/${pkg.packageId}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
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
