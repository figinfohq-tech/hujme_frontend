import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  FileText,
  Building2,
  User,
  Plane,
  Clock,
  CreditCard,
} from "lucide-react";
// import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router";
import { baseURL } from "@/utils/constant/url";
import axios from "axios";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface BookingConfirmationProps {
  bookingId: string;
  onClose: () => void;
}

interface BookingDetails {
  id: string;
  booking_reference: string;
  package_id: string;
  total_amount: number;
  booking_status: string;
  payment_status: string;
  departure_date: string;
  created_at: string;
  travelers: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    passport_number: string;
    nationality: string;
    is_primary: boolean;
  }>;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  onClose,
}) => {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [agent, setAgent] = useState<any>("");
  const [packageDetails, setpackageDetails] = useState<any>("");
  const [airlineDetails, setAirlineDetails] = useState<any>([]);
  const [travelers, setTravelers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = location.state?.booking?.bookingId;

  useEffect(() => {
    fetchBookingDetails();
    fetchTravelers();
  }, [bookingId]);
  useEffect(() => {
    fetchAgnet();
  }, [packageDetails]);

  useEffect(() => {
    if (booking?.userId) {
      fetchPackage();
      fetchAirline();
    }
  }, [booking?.userId]);

  const fetchBookingDetails = async () => {
    try {
      setIsLoading(true);

      const token = sessionStorage.getItem("token");

      if (!bookingId) {
        throw new Error("Booking ID not found");
      }

      const response = await axios.get(
        `${baseURL}bookings/${bookingId}`, // 👈 API path
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setBooking(response.data);
    } catch (error: any) {
      console.error("Fetch Booking Error:", error);

      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to fetch booking details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAgnet = async () => {
    try {
      setIsLoading(true);

      const token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("userId");

      if (!bookingId) {
        throw new Error("Booking ID not found");
      }

      const response = await axios.get(
        `${baseURL}agents/contact/${packageDetails?.agentId}`, // 👈 API path
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setAgent(response.data);
    } catch (error: any) {
      console.error("Fetch Agent Error:", error);

      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to fetch Agent details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const fetchPackage = async () => {
    try {
      setIsLoading(true);

      const token = sessionStorage.getItem("token");
      if (!bookingId) {
        throw new Error("Booking ID not found");
      }

      const response = await axios.get(
        `${baseURL}packages/${booking?.packageId}`, // 👈 API path
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setpackageDetails(response.data);
    } catch (error: any) {
      console.error("Fetch Agent Error:", error);

      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to fetch Agent details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const fetchAirline = async () => {
    try {
      setIsLoading(true);

      const token = sessionStorage.getItem("token");
      if (!bookingId) {
        throw new Error("Booking ID not found");
      }

      const response = await axios.get(
        `${baseURL}package-airlines/byPackage/${booking?.packageId}`, // 👈 API path
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setAirlineDetails(response.data);
    } catch (error: any) {
      console.error("Fetch airline Error:", error);

      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to fetch airline details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const fetchTravelers = async () => {
    try {
      setIsLoading(true);

      const token = sessionStorage.getItem("token");
      if (!bookingId) {
        throw new Error("Booking ID not found");
      }

      const response = await axios.get(
        `${baseURL}travelers/byBooking/${bookingId}`, // 👈 API path
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      setTravelers(response.data);
    } catch (error: any) {
      console.error("Fetch Travelers Error:", error);

      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to fetch Travelers details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              Loading booking details...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center p-8">
            <h2 className="text-xl font-semibold text-destructive">
              Booking Not Found
            </h2>
            <p className="text-muted-foreground mt-2">
              Unable to retrieve booking details.
            </p>
            <Button onClick={onClose} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="text-center p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-800">
                Booking Confirmed!
              </h1>
              <p className="text-green-700 mt-2">
                Thank you for your booking. Your confirmation details are below.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Reference & Date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Booking Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Booking Reference
              </p>
              <p className="text-xl font-bold text-primary">
                {booking?.bookingRef}
              </p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Booking Date
              </p>
              <p className="text-lg font-semibold">
                {format(new Date(booking?.bookingDate), "dd MMM yyyy")}
              </p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Status
              </p>
              <Badge
                variant={
                  booking?.bookingStatus === "confirmed"
                    ? "default"
                    : "secondary"
                }
                className="text-sm"
              >
                {booking?.bookingStatus.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5 text-primary" />
            Agent Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Agent Name</p>
                <p className="font-semibold">{agent?.agencyName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Contact Number</p>
                <p className="font-semibold">{agent?.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-semibold text-sm">{agent?.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package & Travel Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plane className="h-5 w-5 text-primary" />
            Package & Travel Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="font-bold text-lg">{packageDetails?.packageName}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              {packageDetails?.description}
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{packageDetails?.cityName},</span>
              <span>{packageDetails?.stateName},</span>
              <span>{"India"}</span>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>{`${packageDetails?.duration} Days`}</span>
            </div>
          </div>

          {airlineDetails.map((item, index) => (
            <div
              key={index}
              className="relative grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Serial Number */}
              <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center z-10">
                {index + 1}
              </div>

              {/* Departure */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Plane className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-semibold text-green-700">
                    Departure
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold">
                    {item?.departureDate &&
                      format(
                        new Date(item?.departureDate),
                        "EEEE, dd MMMM yyyy",
                      )}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {`From: ${item?.departureCityName}, ${item?.departureStateName}, ${item?.departureCountryName}`}
                  </p>
                </div>
              </div>

              {/* Return */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Plane className="h-4 w-4 text-blue-600 rotate-180" />
                  </div>
                  <span className="font-semibold text-blue-700">Return</span>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold">
                    {item?.arrivalDate &&
                      format(new Date(item?.arrivalDate), "EEEE, dd MMMM yyyy")}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {`To: ${item?.arrivalCityName}, ${item?.arrivalStateName}, ${item?.arrivalCountryName}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Travelers Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            Traveler Details ({travelers?.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {travelers.map((traveler: any, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {traveler.firstName} {traveler.lastName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {traveler?.is_primary
                          ? "Primary Traveler"
                          : `Traveler ${index + 1}`}
                      </p>
                    </div>
                  </div>
                  {/* {traveler.is_primary && ( */}
                  <Badge variant="secondary" className="text-xs">
                    Primary
                  </Badge>
                  {/* )} */}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Date of Birth
                    </p>
                    <p className="font-medium">
                      {format(new Date(traveler?.dateOfBirth), "dd MMM yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nationality</p>
                    <p className="font-medium">{traveler?.nationality}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{traveler?.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-xs">{traveler?.emailId}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">
                Package Price (per person)
              </span>
              <span className="font-medium">
                {/* ₹{packageDetails?.price.toLocaleString()} */}₹
                {packageDetails?.price}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Number of Travelers</span>
              <span className="font-medium">{travelers.length}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Total Amount</span>
              {/* <span className="font-bold text-lg">₹{booking?.totalAmt.toLocaleString()}</span> */}
              <span className="font-bold text-lg">₹{booking?.totalAmt}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Amount Paid</span>
              {/* <span className="font-semibold text-green-600">₹{paidAmount.toLocaleString()}</span> */}
              <span className="font-semibold text-green-600">
                {" "}
                ₹{booking?.totalAmt}
              </span>
            </div>
            {/* {pendingAmount > 0 && (
              <div className="flex justify-between items-center py-2 bg-amber-50 px-3 rounded-lg">
                <span className="text-amber-700">Pending Amount</span>
                <span className="font-semibold text-amber-700">₹{pendingAmount.toLocaleString()}</span>
              </div>
            )} */}
            <Separator />
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Payment Status</span>
              <Badge
                variant={
                  booking?.paymentStatus === "paid" ? "default" : "secondary"
                }
                className={
                  booking?.paymentStatus === "paid" ? "bg-green-600" : ""
                }
              >
                {/* {booking?.paymentStatus === 'paid' ? 'FULLY PAID' : 
                 booking?.paymentStatus === 'partial' ? 'PARTIALLY PAID' : 
                 booking?.paymentStatus.toUpperCase()} */}
                FULLY PAID
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card>
        <CardHeader>
          <CardTitle>Important Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <p>
              Please save this confirmation for your records. You'll need your
              booking reference ({booking?.bookingRef}) for all future
              communications.
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <p>
              Our travel consultant will contact you within 24 hours to confirm
              the itinerary details and provide further assistance.
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <p>
              Please ensure all travelers have valid passports and necessary
              visas if traveling internationally.
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <p>
              A detailed itinerary and travel documents will be sent to your
              email address closer to your departure date.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => navigate("/customer/search")}
          variant="outline"
          className="flex-1"
        >
          Continue Browsing
        </Button>
        <Button
          onClick={() => window.print()}
          variant="default"
          className="flex-1"
        >
          Print Confirmation
        </Button>
      </div>
    </div>
  );
};
