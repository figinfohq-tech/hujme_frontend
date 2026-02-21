import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import {
  User,
  Plus,
  CheckCircle,
  X,
  History,
  CreditCard,
  RefreshCw,
  Clock,
  FileText,
  MessageSquare,
  Mail,
  Phone,
  Download,
  Plane,
  Receipt,
  ArrowLeft,
  XCircle,
  Upload,
  Eye,
  AlertCircle,
  MapPin,
  Star,
  Calendar,
  PlaneLanding,
  PlaneTakeoff,
  Hotel,
  UploadIcon,
  XCircleIcon,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserTravelersDocumentCard } from "@/components/ui/UserTravelersDocumentCard";
import { format } from "date-fns";

// Hardcoded payment installments
const installments = [
  {
    id: "p1",
    amount: 50000,
    paid_at: "2024-01-10",
    payment_method: "Credit Card",
  },
  { id: "p2", amount: 30000, paid_at: "2024-02-15", payment_method: "UPI" },
];

const UserBookingView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pilgrimData, setPilgrimData] = useState<any>([]);
  const [details, setDetails] = useState<any>({});
  const [hotelDetails, setHotelDetails] = useState<any>([]);
  const [facilities, setFacilities] = useState<any>([]);
  const [flightDetails, setFlightDetails] = useState<any>([]);
  const [bookingDetails, setBookingDetails] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [documentsData, setDocumentsData] = useState<Record<number, any[]>>({});
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [selectedTravelerId, setSelectedTravelerId] = useState<number | null>(
    null,
  );
  const [isRemoving, setIsRemoving] = useState(false);

  const { booking, myPackage, bookingUser } = location.state || {};
  const selectedBooking = booking;

  const fetchHotelByPackageID = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${baseURL}package-hotels/byPackage/${selectedBooking?.packageDetails?.packageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setHotelDetails(response.data);
    } catch (error) {
      console.error("Package Fetch Error:", error);
    }
  };
  const fetchFacilitiesByPackageID = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${baseURL}package-facilities/byPackage/${selectedBooking?.packageDetails?.packageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setFacilities(response.data);
    } catch (error) {
      console.error("Package Fetch Error:", error);
    }
  };

  const fetchFlightByPackageID = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${baseURL}package-airlines/byPackage/${selectedBooking?.packageDetails?.packageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setFlightDetails(response.data);
    } catch (error) {
      console.error("Package Fetch Error:", error);
    }
  };

  const fetchTravelersByID = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${baseURL}travelers/byBooking/${selectedBooking.bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setPilgrimData(response.data);
    } catch (error) {
      console.error("Package Fetch Error:", error);
    }
  };

  const fetchDocumentsByTravelers = async (travelers: any[]) => {
    try {
      const token = sessionStorage.getItem("token");

      const requests = travelers.map((traveler) =>
        axios.get(`${baseURL}documents/byTraveler/${traveler.travelerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      const responses = await Promise.all(requests);

      const docsObject: any = {};

      responses.forEach((res, index) => {
        const travelerId = travelers[index].travelerId;
        docsObject[travelerId] = res.data;
      });

      setDocumentsData(docsObject);
    } catch (error) {
      console.error("Document Fetch Error:", error);
    }
  };

  useEffect(() => {
    if (pilgrimData && pilgrimData.length > 0) {
      fetchDocumentsByTravelers(pilgrimData);
    }
  }, [pilgrimData]);

  const fetchDetailByAgentID = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${baseURL}agents/contact/${myPackage.packageDetails?.agentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setDetails(response.data);
    } catch (error) {
      console.error("Package Fetch Error:", error);
    }
  };

  const fetchBookingDetails = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${baseURL}bookings/${selectedBooking.bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setBookingDetails(response.data);
    } catch (error) {
      console.error("Package Fetch Error:", error);
    }
  };

  useEffect(() => {
    if (selectedBooking) {
      fetchHotelByPackageID();
      fetchFlightByPackageID();
      fetchFacilitiesByPackageID();
    }
  }, [selectedBooking]);

  useEffect(() => {
    if (pilgrimData) {
    }
    fetchBookingDetails();
  }, [pilgrimData]);

  useEffect(() => {
    if (myPackage.packageDetails.agentId) {
      fetchTravelersByID();
      fetchDetailByAgentID();
    }
  }, [myPackage]);

  if (!selectedBooking) {
    return (
      <div className="p-10 text-center text-xl font-semibold">
        No Booking Selected
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "partially_cancelled":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "partial":
        return "text-yellow-600";
      case "pending":
        return "text-red-600";
      case "refunded":
        return "text-blue-600";
      case "partially_refunded":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const getMilestoneProgress = (milestones: any) => {
    const total = Object.keys(milestones).length;
    const completed = Object.values(milestones).filter(Boolean).length;
    return (completed / total) * 100;
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
      case "debit_card":
        return <CreditCard className="h-4 w-4" />;
      case "upi":
        return <Plane className="h-4 w-4" />;
      case "net_banking":
        return <Receipt className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Credit Card";
      case "debit_card":
        return "Debit Card";
      case "upi":
        return "UPI";
      case "net_banking":
        return "Net Banking";
      case "cash":
        return "Cash";
      default:
        return method;
    }
  };

  const handleMakePayment = async () => {
    if (!selectedBooking || !paymentAmount || !paymentMethod) {
      toast.error("Please fill in all payment details");
      return;
    }

    // const getMilestoneProgress = (milestones: Pilgrim["milestones"]) => {
    //   const total = Object.keys(milestones).length;
    //   const completed = Object.values(milestones).filter(Boolean).length;
    //   return (completed / total) * 100;
    // };

    const calculateRefundAmount = (booking: Booking, pilgrimIds?: string[]) => {
      const daysToDeparture = Math.ceil(
        (booking.departureDate.getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      );

      // Find applicable refund percentage
      const applicableRule =
        booking.cancellationPolicy.rules
          .sort((a, b) => b.daysBeforeDeparture - a.daysBeforeDeparture)
          .find((rule) => daysToDeparture >= rule.daysBeforeDeparture) ||
        booking.cancellationPolicy.rules[
          booking.cancellationPolicy.rules.length - 1
        ];

      let refundPercentage = applicableRule.refundPercentage;

      // Calculate refund based on pilgrim count
      let refundAmount = 0;
      if (pilgrimIds && pilgrimIds.length > 0) {
        // Partial cancellation - calculate per pilgrim
        const perPilgrimAmount = booking.amountPaid / booking.pilgrims.length;
        refundAmount =
          (perPilgrimAmount * pilgrimIds.length * refundPercentage) / 100;
      } else {
        // Full cancellation
        refundAmount = (booking.amountPaid * refundPercentage) / 100;
      }

      return {
        refundAmount,
        refundPercentage,
        daysToDeparture,
        rule: applicableRule,
      };
    };

    const getActiveCount = (booking: any) => {
      const tc = booking?.travelerCount;

      // API case → number
      if (typeof tc === "number") {
        return tc;
      }

      // Old mock case → array
      if (Array.isArray(tc)) {
        return tc.filter((p) => p.status === "active").length;
      }

      return 0;
    };

    const getCancelledCount = (booking: any) => {
      const tc = booking?.travelerCount;

      // API case → number (no cancelled info available)
      if (typeof tc === "number") {
        return 0;
      }

      // Old mock case → array
      if (Array.isArray(tc)) {
        return tc.filter((p) => p.status === "cancelled").length;
      }

      return 0;
    };
  };

  const handleRemoveTraveler = async () => {
    if (!selectedTravelerId) return;

    try {
      setIsRemoving(true);
      const token = sessionStorage.getItem("token");

      await axios.delete(`${baseURL}travelers/${selectedTravelerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Traveler removed successfully");

      setIsRemoveDialogOpen(false);
      setSelectedTravelerId(null);

      // Refresh travelers list
      fetchTravelersByID();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to remove traveler");
    } finally {
      setIsRemoving(false);
    }
  };

  const TOTAL_REQUIRED_DOCS = 6;
  const getDocumentProgress = (travelerId: number) => {
    const docs = documentsData[travelerId];

    if (!docs || docs.length === 0) return 0;

    const uploadedDocs = docs.filter(
      (doc: any) => doc.documentStatus === "UPLOADED",
    ).length;

    return Math.round((uploadedDocs / TOTAL_REQUIRED_DOCS) * 100);
  };

  const getDocumentStatusBadge = (status) => {
    switch (status) {
      case "PENDING_VERIFICATION":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending Verification
          </Badge>
        );

      case "VERIFIED":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );

      case "REJECT":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );

      case "PENDING_UPLOAD":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Upload className="h-3 w-3 mr-1" />
            Pending Upload
          </Badge>
        );

      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };
  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      {
        icon: any;
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
        color: string;
      }
    > = {
      verified: {
        icon: CheckCircle,
        variant: "default",
        label: "Verified",
        color: "text-green-600 dark:text-green-400",
      },
      pending: {
        icon: Clock,
        variant: "secondary",
        label: "Awaiting",
        color: "text-orange-600 dark:text-orange-400",
      },
      rejected: {
        icon: XCircle,
        variant: "destructive",
        label: "Rejected",
        color: "text-red-600 dark:text-red-400",
      },
      needs_reupload: {
        icon: AlertCircle,
        variant: "outline",
        label: "Needs Attention",
        color: "text-amber-600 dark:text-amber-400",
      },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(document.status);
  const StatusIcon = statusConfig.icon;

  const calculateAge = (dob: string) => {
    if (!dob) return "";

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Agar birthday is saal abhi nahi aaya
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const safeFormatDate = (dateValue: any, formatStr = "PPP") => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) return "-";

    return format(date, formatStr);
  };

  return (
    <>
      <div className="pb-8 ">
        {/* Back Button */}
        <div className="max-w-full container mx-auto px-4  ">
          <div className="flex my-3">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-primary/90 hover:text-foreground my-3"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
            <div className="my-2">
              <h1 className="text-2xl font-bold text-primary">
                Booking Details
              </h1>

              <p className="text-primary/90 text-sm mt-1">
                Complete information about your boo
              </p>
            </div>
          </div>
        </div>
        <div className="m-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-primary text-2xl">
                {selectedBooking?.bookingRef}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <Label className="text-primary/90">Package Type</Label>
                  <p className="font-medium capitalize">
                    {selectedBooking?.packageDetails?.packageType}
                  </p>
                </div>
                <div>
                  <Label className="text-primary/90">Location</Label>
                  <p className="font-medium">{`${selectedBooking?.packageDetails?.cityName}, ${selectedBooking?.packageDetails?.stateName}`}</p>
                </div>
                <div>
                  <Label className="text-primary/90">Departure Date</Label>
                  <p className="font-medium">
                    {formatDate(selectedBooking?.packageDetails?.departureDate)}
                  </p>
                </div>
                <div>
                  <Label className="text-primary/90">Return Date</Label>
                  <p className="font-medium">
                    {formatDate(selectedBooking?.packageDetails?.arrivalDate)}
                  </p>
                </div>
                <div>
                  <Label className="text-primary/90">Duration</Label>
                  <p className="font-medium">
                    {selectedBooking?.packageDetails?.duration} days
                  </p>
                </div>
              </div>
              <Separator />
              {/* Hotel Section */}
              <div className="mb-6">
                <div className="mb-4">
                  <div>
                    <div className="flex text-center gap-2">
                      <h3 className="text-xl font-semibold text-primary">
                        Hotel Details
                      </h3>
                      {hotelDetails?.length > 0 && (
                        <span className="text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                          {hotelDetails.length}{" "}
                          {hotelDetails.length > 1 ? "Hotels" : "Hotel"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Hotels List */}
                <div className="space-y-4">
                  {hotelDetails && hotelDetails.length > 0 ? (
                    hotelDetails.map((hotel: any, index: any) => {
                      return (
                        <div
                          key={index}
                          className="rounded-lg border bg-card p-4 space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded">
                                  {hotel?.hotelDetails?.hotelId}
                                </span>
                                <h5 className="font-semibold text-foreground">
                                  {hotel?.hotelDetails?.hotelName}
                                </h5>
                              </div>

                              <div className="space-y-1 text-sm">
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-muted-foreground">
                                    {`${hotel?.hotelDetails?.address}, ${hotel?.hotelDetails?.cityName}, ${hotel?.hotelDetails?.stateName}, ${hotel?.hotelDetails?.countryName}`}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs font-medium">
                                      {hotel?.hotelDetails?.rating} Star
                                    </span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    •
                                  </span>
                                  <span className="text-xs font-medium text-primary">
                                    {hotel?.hotelDetails?.distance} from Haram
                                  </span>
                                  <div className="text-xs text-muted-foreground">
                                    <span className="font-medium">
                                      Days Stay:
                                    </span>{" "}
                                    {hotel?.daysStay}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                                <div>
                                  <span className="font-medium">Check-in:</span>{" "}
                                  {hotel?.checkinDate
                                    ? format(new Date(hotel.checkinDate), "PPP")
                                    : "-"}{" "}
                                  at {hotel?.checkinTime}
                                </div>
                                <div>
                                  <span className="font-medium">
                                    Check-out:
                                  </span>{" "}
                                  {hotel?.checkoutDate
                                    ? format(
                                        new Date(hotel?.checkoutDate),
                                        "PPP",
                                      )
                                    : "-"}{" "}
                                  at {hotel?.checkoutTime}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="border rounded-lg p-6 text-center bg-muted/30">
                      <Hotel className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <h4 className="text-sm font-medium text-foreground">
                        No Hotel Details Available
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Hotel accommodation information has not been added for
                        this booking.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />

              {/* flight Section */}
              <div className="mb-6">
                <div className="mb-4">
                  <div>
                    <div className="flex text-center gap-2">
                      <h3 className="text-xl font-semibold text-primary">
                        Flight Details
                      </h3>
                      {flightDetails?.length > 0 && (
                        <span className="text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                          {flightDetails.length}{" "}
                          {flightDetails.length > 1 ? "Hotels" : "Hotel"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* flight List */}
                <div className="space-y-4">
                  {flightDetails && flightDetails.length > 0 ? (
                    flightDetails.map((flight: any, index: any) => (
                      <div key={index} className="w-full rounded-lg bg-card">
                        <div className="flex gap-3">
                          {/* MAIN CARD */}
                          <div className="w-full border rounded-lg shadow-sm bg-white">
                            {/* Header */}
                            {/* <div className="px-3 py-2 border-b flex items-center justify-between">
                              <div className="space-y-0.5 text-sm">
                                <div className="flex items-center gap-2">
                                  <PlaneTakeoff className="text-primary h-4 w-4" />
                                  <span className="font-medium">
                                    Flight No: {flight.flightNumber}
                                  </span>

                                   <p className="text-xs text-gray-600">
                                  <span className="font-medium">
                                    Flight Name:
                                  </span>{" "}
                                  {flight.airlineDetails.flightName}
                                </p>

                                  {flight.flightClass && (
                                    <span className="px-2 py-0.5 text-[11px] rounded-full bg-blue-100 text-blue-700 font-medium">
                                      {flight.flightClass} Class
                                    </span>
                                  )}
                                </div>

                               
                              </div>
                            </div> */}
                            <div className="px-3 py-2 border-b flex items-center justify-between">
                              <div className="space-y-0.5 text-sm">
                                <div className="flex items-center gap-2">
                                  <PlaneTakeoff className="text-primary h-4 w-4" />

                                  {/* Flight Number */}
                                  <span className="font-semibold tracking-wide text-foreground">
                                    Flight No: {flight.flightNumber}
                                  </span>

                                  {/* Flight Name (Differentiated Font Only) */}
                                  <p className="text-sm font-semibold text-primary tracking-wide ml-2">
                                    {flight.airlineDetails.flightName}
                                  </p>

                                  {/* Flight Class */}
                                  {flight.flightClass && (
                                    <span className="px-2 py-0.5 text-[11px] rounded-full bg-blue-100 text-blue-700 font-medium">
                                      {flight.flightClass} Class
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="px-3 py-2 text-xs">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Journey Start */}
                                <div className="border rounded-md p-2 bg-gray-50 space-y-1">
                                  <h3 className="font-medium text-primary flex items-center gap-1">
                                    <PlaneTakeoff size={14} />
                                    Journey Start
                                  </h3>

                                  <div className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    <span className="text-gray-700">
                                      {flight.departureCityName},{" "}
                                      {flight.departureStateName},{" "}
                                      {flight.departureCountryName}
                                    </span>
                                  </div>
                                  <div className="flex gap-3">
                                    <div className="flex items-center gap-1">
                                      <Calendar size={14} />
                                      <span className="text-gray-700">
                                        {format(
                                          new Date(flight.departureDate),
                                          "yyyy-MM-dd",
                                        )}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <Clock size={14} />
                                      <span className="text-gray-700">
                                        {flight.departureTime}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Journey End */}
                                <div className="border rounded-md p-2 bg-gray-50 space-y-1">
                                  <h3 className="font-medium text-primary flex items-center gap-1">
                                    <PlaneLanding size={14} />
                                    Journey End
                                  </h3>

                                  <div className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    <span className="text-gray-700">
                                      {flight.arrivalCityName},{" "}
                                      {flight.arrivalStateName},{" "}
                                      {flight.arrivalCountryName}
                                    </span>
                                  </div>
                                  <div className="flex gap-3">
                                    <div className="flex items-center gap-1">
                                      <Calendar size={14} />
                                      <span className="text-gray-700">
                                        {format(
                                          new Date(flight.arrivalDate),
                                          "yyyy-MM-dd",
                                        )}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <Clock size={14} />
                                      <span className="text-gray-700">
                                        {flight.arrivalTime}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="border rounded-lg p-6 text-center bg-muted/30">
                      <PlaneTakeoff className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <h4 className="text-sm font-medium text-foreground">
                        No Flight Details Available
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Flight information has not been added for this booking.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {selectedBooking?.specialRequirements && (
                <div>
                  <Label className="text-primary/90">
                    Special Requirements
                  </Label>
                  <p className="font-medium">
                    {selectedBooking?.specialRequirements}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-primary text-2xl">
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-primary/90">Total Amount</span>
                <span className="font-semibold">
                  {formatCurrency(selectedBooking?.totalAmt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary/90">Amount Paid</span>
                <span
                  className={`font-semibold ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}
                >
                  {formatCurrency(bookingDetails?.receivedAmt)}
                </span>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium text-primary mb-3">
                  Payment History
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {installments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {new Date(payment.paid_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          ₹{payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{payment.payment_method}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* {selectedBooking.paymentStatus !== "completed" &&
                selectedBooking.status !== "cancelled" &&
                selectedBooking.status !== "rejected" && (
                  <Button
                    className="w-full"
                    onClick={() => setIsPaymentOpen(true)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Make Payment
                  </Button>
                )} */}
            </CardContent>
          </Card>

          {/* {pilgrimData?.map((pilgrim: any) => (
            <Card
              key={pilgrim.travelerId}
              className={`${pilgrim?.status === "cancelled" ? "opacity-60" : ""} mb-4`}
            >
                <CardHeader>
              <CardTitle className="text-primary text-2xl">
                 Travelers / Pilgrims Details
              </CardTitle>
            </CardHeader>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-primary">
                      {`${pilgrim?.firstName} ${pilgrim.lastName}`}
                    </CardTitle>
                    <CardDescription className="text-primary/90">
                      {calculateAge(pilgrim.dateOfBirth)} years •{" "}
                      {pilgrim.gender} • {pilgrim?.relationship}
                    </CardDescription>
                  </div>
                  {pilgrim?.status === "cancelled" ? (
                    <Badge className="bg-red-100 text-red-800">
                      <XCircle className="h-3 w-3 mr-1" />
                      Cancelled
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {pilgrim?.status === "cancelled" &&
                  pilgrim?.cancellationDate && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 font-medium">
                        Cancelled on {formatDate(pilgrim?.cancellationDate)}
                      </p>
                      {pilgrim.cancellationReason && (
                        <p className="text-xs text-red-700 mt-1">
                          {pilgrim?.cancellationReason}
                        </p>
                      )}
                    </div>
                  )}

                <div>
                  <Label className="text-primary/90">Passport Number</Label>
                  <p className="font-medium">{pilgrim?.passportNumber}</p>
                </div>
                <div>
                  <Label className="text-primary/90 mb-2 block">
                    Document Status
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {documentsData[pilgrim.travelerId]?.length > 0 ? (
                      documentsData[pilgrim.travelerId].map((doc: any) => (
                        <div
                          key={doc.documentId}
                          className="flex items-center gap-2"
                        >
                          {doc.documentStatus === "UPLOADED" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm capitalize">
                            {doc.documentType}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-primary/90">
                        No documents found
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-primary/90 mb-2 block">Progress</Label>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Document Completion</span>
                      <span>{getDocumentProgress(pilgrim.travelerId)}%</span>
                    </div>

                    <Progress
                      value={getDocumentProgress(pilgrim.travelerId)}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))} */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-primary text-2xl">
                Travelers & Documents
              </CardTitle>
            </CardHeader>

            <CardContent>
              {pilgrimData && pilgrimData.length > 0 ? (
                pilgrimData.map((pilgrim: any) => (
                  <Card
                    key={pilgrim.travelerId}
                    className={`${
                      pilgrim?.status === "cancelled" ? "opacity-60" : ""
                    } mb-4 border`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <Label className="text-primary/90">
                            {`${pilgrim?.firstName} ${pilgrim.lastName}`}
                          </Label>
                          <CardDescription className="text-primary/90">
                            {calculateAge(pilgrim.dateOfBirth)} years •{" "}
                            {pilgrim.gender} • {pilgrim?.relationship}
                          </CardDescription>
                        </div>
                        <div>
                          <Label className="text-primary/90">
                            Passport Number
                          </Label>
                          <p className="font-medium">
                            {pilgrim?.passportNumber}
                          </p>
                        </div>
                        {/*  Upload Button Per Pilgrim */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate("/ducoments", {
                              state: {
                                bookingId: selectedBooking?.bookingId,
                                travelerId: pilgrim?.travelerId,
                              },
                            })
                          }
                        >
                          <UploadIcon /> Upload
                        </Button>
                        {/* remove pilgrims */}
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1"
                          onClick={() => {
                            setSelectedTravelerId(pilgrim?.travelerId);
                            setIsRemoveDialogOpen(true);
                          }}
                        >
                          <XCircleIcon className="w-4 h-4" />
                          Remove
                        </Button>

                        {getDocumentStatusBadge(pilgrim?.documentStatus)}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {pilgrim?.status === "cancelled" &&
                        pilgrim?.cancellationDate && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800 font-medium">
                              Cancelled on{" "}
                              {formatDate(pilgrim?.cancellationDate)}
                            </p>
                            {pilgrim.cancellationReason && (
                              <p className="text-xs text-red-700 mt-1">
                                {pilgrim?.cancellationReason}
                              </p>
                            )}
                          </div>
                        )}
                      <div>
                        <Label className="text-primary/90 mb-2 block">
                          Document Status
                        </Label>
                        <div className="grid grid-cols-2 md:grid.cols-3 lg:grid-cols-6 gap-2">
                          {documentsData[pilgrim.travelerId]?.length > 0 ? (
                            documentsData[pilgrim.travelerId].map(
                              (doc: any) => (
                                <>
                                  {/* <div
                                    key={doc.documentId}
                                    className="flex items-center gap-2"
                                  >
                                    {doc.documentStatus === "UPLOADED" ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-red-600" />
                                    )}
                                    <span className="text-sm capitalize">
                                      {doc.documentType}
                                    </span>
                                  </div> */}
                                  <div key={doc.documentId}>
                                    <UserTravelersDocumentCard
                                      document={{
                                        id: doc.documentId,
                                        type: doc.documentType,
                                        status:
                                          doc.documentStatus.toLowerCase(),
                                        uploaded_at: doc.createdAt,
                                        rejection_reason: doc.remarks,
                                      }}
                                      onStatusUpdate={() => {}}
                                    />
                                  </div>
                                </>
                              ),
                            )
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No documents found
                            </p>
                          )}
                        </div>
                      </div>

                      {/* <div>
                        <Label className="text-primary/90 mb-2 block">
                          Progress
                        </Label>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Document Completion</span>
                            <span>
                              {getDocumentProgress(pilgrim.travelerId)}%
                            </span>
                          </div>
                          <Progress
                            value={getDocumentProgress(pilgrim.travelerId)}
                            className="h-2"
                          />
                        </div>
                      </div> */}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground text-sm">
                    No Travelers / Pilgrims Found
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-primary text-2xl">
                Package Facilities
              </CardTitle>
            </CardHeader>

            <CardContent>
              {facilities && facilities.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {facilities.map((facility: any, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-2 py-1 hover:bg-green-100  text-sm flex items-center gap-2 hover:shadow-md transition-all duration-200"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {facility?.facilityDetails?.facilityName}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg p-6 text-center bg-muted/30">
                  <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <h4 className="text-sm font-medium text-foreground">
                    No Facilities Available
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Facilities information has not been added for this package.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-primary text-2xl">
                Agent Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary/90" />
                <span>{details?.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary/90" />
                <span>{details?.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-primary/90" />
                <span>{details?.phone}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Make Payment Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="z-[9999]">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>Pay for your booking securely</DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-primary/90">Total Amount</span>
                  <span className="font-medium">
                    {formatCurrency(bookingDetails?.totalAmt)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary/90">Already Paid</span>
                  <span className="font-medium">
                    {formatCurrency(bookingDetails?.receivedAmt)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Remaining Amount</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(
                      selectedBooking.totalAmount - selectedBooking.amountPaid,
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-amount">Payment Amount *</Label>
                <Input
                  id="payment-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  max={selectedBooking.totalAmount - selectedBooking.amountPaid}
                />
                <p className="text-xs text-primary/90">
                  Maximum:{" "}
                  {formatCurrency(
                    selectedBooking.totalAmount - selectedBooking.amountPaid,
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method *</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment-method">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent className="z-[10000]">
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="net_banking">Net Banking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsPaymentOpen(false);
                setPaymentAmount("");
                setPaymentMethod("");
              }}
              disabled={isProcessingPayment}
            >
              Cancel
            </Button>
            <Button onClick={handleMakePayment} disabled={isProcessingPayment}>
              {isProcessingPayment ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* remove dialog */}
      {/* Remove Traveler Confirmation Dialog */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircleIcon className="w-5 h-5" />
              Remove Traveler
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this traveler? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRemoveDialogOpen(false)}
              disabled={isRemoving}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleRemoveTraveler}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <XCircleIcon className="w-4 h-4 mr-2" />
                  Yes, Remove
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserBookingView;
