import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  MapPin,
  Calendar,
  Users,
  Phone,
  Mail,
  ArrowLeft,
  Check,
  Plane,
  Hotel,
  Car,
  Utensils,
} from "lucide-react";
// import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import { BookingFlow } from "../BookingFlow";
import { useLocation } from "react-router-dom";
import { BookingConfirmation } from "@/components/BookingConfirmation";
import PackageBasicView from "./PackageBasicView";
import HotelViewDetails from "./HotelViewDetails";
import FlightViewDetails from "./FlightViewDetails";
import FacilitiesViewDetails from "./FacilitiesViewDetails";
// import { BookingFlow } from "@/components/BookingFlow";
// import { BookingConfirmation } from "@/components/BookingConfirmation";

const PackageDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { result } = location.state || {};
  const navigate = useNavigate();
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [packageDetail, setPackageDetail] = useState();

  // Mock package data - in real app, fetch based on id
  const packageData = {
    id: 1,
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
    description:
      "Experience a spiritual journey with our premium Umrah package. This comprehensive package includes luxury accommodations, direct flights, and expert guidance throughout your pilgrimage.",
    itinerary: [
      {
        day: 1,
        title: "Departure from Mumbai",
        description: "Direct flight to Jeddah, transfer to Makkah hotel",
      },
      {
        day: 2,
        title: "Umrah Rituals",
        description: "Perform Umrah with guided assistance",
      },
      {
        day: 3,
        title: "Madinah Visit",
        description: "Travel to Madinah, visit Prophet's Mosque",
      },
      {
        day: 4,
        title: "Historical Sites",
        description: "Visit historical Islamic sites in Madinah",
      },
      {
        day: 5,
        title: "Return to Makkah",
        description: "Journey back to Makkah for additional prayers",
      },
    ],
    inclusions: [
      "Round-trip flights from Mumbai",
      "5-star hotel accommodation in Makkah and Madinah",
      "All meals (breakfast, lunch, dinner)",
      "Visa processing and documentation",
      "Professional guide and religious scholar",
      "Airport transfers and local transportation",
      "Zam Zam water and prayer items",
    ],
    exclusions: [
      "Personal expenses and shopping",
      "Additional meals not mentioned",
      "Travel insurance (optional)",
      "Tips and gratuities",
    ],
  };
  useEffect(() => {
    fetchPackages();
  }, []);

  //   fetch package details
  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${baseURL}packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackageDetail(response.data);
    } catch (error) {
      console.error("Package Fetch Error:", error);
    }
  };
  //   fetch package details

  const handleBookingComplete = (completedBookingId: string) => {
    setBookingId(completedBookingId);
    setShowBookingFlow(false);
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setBookingId(null);
  };

  if (showConfirmation && bookingId) {
    return (
      <div className="min-h-screen bg-background">
        {/* <Header /> */}
        <main className="container mx-auto px-4 py-8">
          <BookingConfirmation
            bookingId={bookingId}
            onClose={handleCloseConfirmation}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // if (showBookingFlow) {
  //   return (
  //     <div className="min-h-screen bg-background">
  //       {/* <Header /> */}

  //         <BookingFlow
  //           packageData={{
  //             id: packageDetail.packageId.toString(),
  //             title: packageDetail.packageName,
  //             price: packageDetail.price,
  //             duration: packageDetail.duration,
  //           }}
  //           onComplete={handleBookingComplete}
  //         />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/costomer/search")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search Results
        </Button>

        <div className="grid grid-cols-1 bg-white-900 border rounded-xl shadow p-10 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Package Header */}
            <div className="mb-8">
              <div
                className="h-64 bg-cover bg-center rounded-lg mb-6"
                style={{ backgroundImage: `url(${packageData.image})` }}
              />

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {packageDetail?.packageName}
                  </h1>
                  <p className="text-lg text-muted-foreground mb-3">
                    by {packageDetail?.agentName}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {packageDetail?.cityName}, {packageDetail?.stateName}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {packageDetail?.duration}
                    </span>
                    <Badge variant="secondary">
                      {packageDetail?.packageType}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">
                      {packageData.rating}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({packageData.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-6">
                {packageData.features.map((feature, index) => (
                  <Badge key={index} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic View</TabsTrigger>
                <TabsTrigger value="hotel">Hotel View</TabsTrigger>
                <TabsTrigger value="flights">Flight View</TabsTrigger>
                <TabsTrigger value="facilities">Facilities View</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-2">
                <Card>
                  {/* <CardHeader>
                    <CardTitle>Package Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {packageDetail?.description}
                    </p>
                  </CardContent> */}
                  <PackageBasicView packageId={id} />
                </Card>
              </TabsContent>

              <TabsContent value="hotel" className="mt-2">
                <Card>
                  {/* <CardHeader>
                    <CardTitle>Day-wise Itinerary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {packageData.itinerary.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-4 p-4 border border-border rounded-lg"
                        >
                          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-primary">
                              {item.day}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">
                              {item.title}
                            </h4>
                            <p className="text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent> */}
                  <HotelViewDetails packageId={id} />
                </Card>
              </TabsContent>

              <TabsContent value="flights" className="mt-2">
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
                {/* <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600">
                        Inclusions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {packageData.inclusions.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600">Exclusions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {packageData.exclusions.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0">
                              ×
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card> */}
                {/* </div> */}
                <Card>
                  <FlightViewDetails packageId={id} />
                </Card>
              </TabsContent>

              <TabsContent value="facilities" className="mt-2">
                <Card>
                  {/* <CardHeader>
                    <CardTitle>Agent Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">
                        {packageData.agentName}
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {packageData.rating}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({packageData.reviews} reviews)
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">+91 98765 43210</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            info@alharamaintours.com
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {packageData.city}, {packageData.state}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent> */}
                  <FacilitiesViewDetails packageId={id} />
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary">
                      ₹{packageDetail?.price.toLocaleString()}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{packageDetail?.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Per person (all inclusive)
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <Button
                    onClick={() =>
                      navigate("/booking-detail", {
                        state: {
                          packageData: {
                            id: packageDetail?.packageId.toLocaleString(),
                            title: packageDetail?.packageName,
                            price: packageDetail?.price,
                            duration: packageDetail?.duration,
                          },
                        },
                      })
                    }
                    className="w-full bg-gradient-button text-primary-foreground hover:opacity-90 transition-smooth"
                  >
                    Book Now
                  </Button>      
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PackageDetails;
