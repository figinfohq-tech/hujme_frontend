import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, ArrowLeft, Check, X } from "lucide-react";
// import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axios from "axios";

const ComparePackages = () => {
  const [searchParams] = useSearchParams();
  const [comparePackage, setComparePackage] = useState<any>([]);
  const navigate = useNavigate();
  const packageIds = searchParams.get("packages")?.split(",") || [];

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
        }
      );

      setComparePackage(response.data);
    } catch (error) {
      console.error("Compare API Error:", error);
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
    packageIds.includes(String(pkg.packageId))
  );

  const removePackage = (packageId: string) => {
    const updatedIds = packageIds.filter((id) => id !== packageId);
    if (updatedIds.length === 0) {
      navigate("/search");
    } else {
      navigate(`/compare?packages=${updatedIds.join(",")}`);
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
                    size="sm"
                    onClick={() => removePackage(String(pkg.packageId))}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  <CardHeader className="pb-4">
                    <div
                      className="h-32 bg-cover bg-center rounded-lg mb-4"
                      style={{
                        backgroundImage: `url(${
                          pkg.image || "/placeholder.svg"
                        })`,
                      }}
                    />
                    <CardTitle className="text-lg">{pkg.packageName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {pkg.agentName}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
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
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Location:
                        </span>
                        <span className="text-sm font-medium">
                          {pkg.cityName}
                        </span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Rating:
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {pkg.rating}
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
                        Features:
                      </h4>
                      <div className="space-y-1">
                        {pkg.features?.map((feature: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Check className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-muted-foreground">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Inclusions */}
                    <div>
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
                    </div>

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

      <Footer />
    </div>
  );
};

export default ComparePackages;
