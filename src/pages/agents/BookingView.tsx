import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";

const BookingViewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pilgrimData, setPilgrimData] = useState<any>([]);
  const [details, setDetails] = useState<any>({});
  const [bookingDetails, setBookingDetails] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const { booking, myPackage, bookingUser } = location.state || {};
  const selectedBooking = booking;

  const fetchTravelersByID = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${baseURL}travelers/byBooking/${selectedBooking.bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPilgrimData(response.data);
    } catch (error) {
      console.error("Package Fetch Error:", error);
    }
  };

  const fetchDetailByAgentID = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${baseURL}agents/contact/${myPackage.packageDetails?.agentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDetails(response.data);
    } catch (error) {
      console.error("Package Fetch Error:", error);
    }
  };

  const fetchBookingDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${baseURL}bookings/${pilgrimData[0].bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookingDetails(response.data);
    } catch (error) {
      console.error("Package Fetch Error:", error);
    }
  };

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

  const getMilestoneProgress = (milestones: Pilgrim["milestones"]) => {
    const total = Object.keys(milestones).length;
    const completed = Object.values(milestones).filter(Boolean).length;
    return (completed / total) * 100;
  };

  const calculateRefundAmount = (booking: Booking, pilgrimIds?: string[]) => {
    const daysToDeparture = Math.ceil(
      (booking.departureDate.getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
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

  const calculateAgeOnlyYear = (dob) => {
    if (!dob) return 0;

    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();

    const age = currentYear - birthYear;

    return age; // future date → 0
  };

  return (
    <div className="pb-8 ">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to My Bookings
      </Button>
      <div className="max-w-full container mx-auto px-4  ">
        <div className="my-5">
          <h1 className="text-2xl font-bold text-gray-800">
            Booking Details - {selectedBooking?.id}
          </h1>

          <p className="text-gray-600 text-sm mt-1">
            Complete information about your booking
          </p>
        </div>

        {selectedBooking && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="pilgrims">Pilgrims</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Package Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Package</span>
                      <span className="font-medium">
                        {myPackage.packageDetails?.packageName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Agent</span>
                      <span className="font-medium">
                        {myPackage.packageDetails?.agentName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <Badge>{myPackage.packageDetails?.travelType}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">
                        {myPackage.packageDetails?.duration}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium">
                        {myPackage.packageDetails?.cityName}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Booking Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Booking ID</span>
                      <span className="font-mono">
                        {bookingDetails ? bookingDetails?.bookingId : "NA"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge
                        className={getStatusColor(
                          selectedBooking.bookingStatus
                        )}
                      >
                        {selectedBooking.bookingStatus
                          ?.charAt(0)
                          .toUpperCase() +
                          selectedBooking.bookingStatus
                            ?.slice(1)
                            .replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Booked On</span>
                      <span className="font-medium">
                        {formatDate(
                          bookingDetails ? bookingDetails.bookingDate : "NA"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Departure</span>
                      <span className="font-medium">
                        {formatDate(myPackage.packageDetails?.departureDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Return</span>
                      <span className="font-medium">
                        {formatDate(myPackage.packageDetails?.arrivalDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Active Pilgrims
                      </span>
                      <span className="font-medium">
                        {myPackage.travelerCount}
                      </span>
                      {/* <span className="font-medium">
                        {getActiveCount(selectedBooking)}
                        {getCancelledCount(selectedBooking) > 0 && (
                          <span className="text-red-600 ml-2">
                            ({getCancelledCount(selectedBooking)} cancelled)
                          </span>
                        )}
                      </span> */}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Room Preference
                      </span>
                      <span className="font-medium capitalize">
                        {selectedBooking.roomPreference}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Emergency Contact
                      </span>
                      <span className="font-medium">
                        {selectedBooking.emergencyContact}
                      </span>
                    </div>
                    {selectedBooking && (
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-sm">
                          Special Requirements:
                        </span>
                        <p className="text-sm bg-muted p-2 rounded">
                          {selectedBooking.specialRequirements}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Payment Summary</CardTitle>
                      {selectedBooking.paymentStatus !== "completed" &&
                        selectedBooking.status !== "cancelled" && (
                          <Button
                            size="sm"
                            onClick={() => setIsPaymentOpen(true)}
                            className="bg-primary"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Make Payment
                          </Button>
                        )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Amount
                      </span>
                      <span className="font-semibold text-lg">
                        {formatCurrency(bookingDetails.totalAmt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount Paid</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(selectedBooking.amountPaid)}
                      </span>
                    </div>
                    {selectedBooking.status !== "cancelled" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Remaining</span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(
                            selectedBooking.totalAmount -
                              selectedBooking.amountPaid
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Payment Status
                      </span>
                      <Badge
                        className={getPaymentStatusColor(
                          selectedBooking.paymentStatus
                        )}
                      >
                        {selectedBooking.paymentStatus
                          ?.charAt(0)
                          .toUpperCase() +
                          selectedBooking.paymentStatus
                            ?.slice(1)
                            .replace("_", " ")}
                      </Badge>
                    </div>

                    {/* Payment Progress */}
                    {selectedBooking.status !== "cancelled" && (
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-sm">
                          <span>Payment Progress</span>
                          <span>
                            {Math.round(
                              (selectedBooking.amountPaid /
                                selectedBooking.totalAmount) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            (selectedBooking.amountPaid /
                              selectedBooking.totalAmount) *
                            100
                          }
                        />
                      </div>
                    )}

                    {/* Refund Information for Cancelled Bookings */}
                    {/* {selectedBooking.refundTransactions.length > 0 && (
                      <div className="pt-2 border-t">
                        {selectedBooking.refundTransactions.map(
                          (refund, index) => (
                            <div key={refund.id} className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Refund Amount
                                </span>
                                <span className="font-medium text-blue-600">
                                  {formatCurrency(refund.amount)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Refund Status
                                </span>
                                <Badge
                                  className={getRefundStatusColor(
                                    refund.status
                                  )}
                                >
                                  {refund.status.charAt(0).toUpperCase() +
                                    refund.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Refund Method
                                </span>
                                <span className="text-sm">
                                  {getRefundMethodName(refund.refundMethod)}
                                </span>
                              </div>
                              {refund.status === "completed" &&
                                refund.actualCompletionDate && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Completed On
                                    </span>
                                    <span className="text-sm">
                                      {formatDate(refund.actualCompletionDate)}
                                    </span>
                                  </div>
                                )}
                              {index <
                                selectedBooking.refundTransactions.length -
                                  1 && <Separator />}
                            </div>
                          )
                        )}
                      </div>
                    )} */}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="payment" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(selectedBooking.amountPaid)}
                        </p>
                        <p className="text-sm text-muted-foreground">Paid</p>
                      </div>
                      {selectedBooking.status !== "cancelled" && (
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600">
                            {formatCurrency(
                              selectedBooking.totalAmount -
                                selectedBooking.amountPaid
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Remaining
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedBooking.status !== "cancelled" && (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Payment Progress</span>
                            <span>
                              {Math.round(
                                (selectedBooking.amountPaid /
                                  selectedBooking.totalAmount) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              (selectedBooking.amountPaid /
                                selectedBooking.totalAmount) *
                              100
                            }
                            className="h-3"
                          />
                        </div>

                        {selectedBooking.paymentStatus !== "completed" && (
                          <Button
                            className="w-full"
                            onClick={() => setIsPaymentOpen(true)}
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Make Payment
                          </Button>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Transaction History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Payment Transactions */}
                      {/* {selectedBooking.paymentTransactions.map(
                        (transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {getPaymentMethodIcon(transaction.method)}
                              <div>
                                <p className="font-medium text-green-600">
                                  +{formatCurrency(transaction.amount)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {getPaymentMethodName(transaction.method)} •{" "}
                                  {formatDate(transaction.date)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {transaction.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                className={
                                  transaction.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : transaction.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {transaction.status}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                Ref: {transaction.reference}
                              </p>
                            </div>
                          </div>
                        )
                      )} */}

                      {/* Refund Transactions */}
                      {/* {selectedBooking.refundTransactions.map((refund) => (
                        <div
                          key={refund.id}
                          className="flex items-center justify-between p-3 border rounded-lg border-blue-200 bg-blue-50"
                        >
                          <div className="flex items-center gap-3">
                            <RefreshCw className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="font-medium text-blue-600">
                                -{formatCurrency(refund.amount)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Refund via{" "}
                                {getRefundMethodName(refund.refundMethod)} •{" "}
                                {formatDate(refund.date)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {refund.reason}
                              </p>
                              {refund.pilgrimIds && (
                                <p className="text-xs text-muted-foreground">
                                  Partial cancellation (
                                  {refund.pilgrimIds.length} pilgrim
                                  {refund.pilgrimIds.length > 1 ? "s" : ""})
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={getRefundStatusColor(refund.status)}
                            >
                              {refund.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              Ref: {refund.reference}
                            </p>
                            {refund.status === "initiated" && (
                              <p className="text-xs text-muted-foreground">
                                ETA: {refund.estimatedDays} days
                              </p>
                            )}
                            {refund.status === "completed" &&
                              refund.actualCompletionDate && (
                                <p className="text-xs text-muted-foreground">
                                  Completed:{" "}
                                  {formatDate(refund.actualCompletionDate)}
                                </p>
                              )}
                          </div>
                        </div>
                      ))} */}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="pilgrims" className="space-y-6">
              <div className="grid gap-6">
                {pilgrimData?.map((pilgrim, index) => (
                  <Card
                    key={pilgrim.id}
                    className={
                      pilgrim.status === "cancelled"
                        ? "opacity-60 border-red-200"
                        : ""
                    }
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Pilgrim {index + 1} - {pilgrim.firstName}
                        {pilgrim.status === "cancelled" && (
                          <Badge variant="destructive" className="ml-2">
                            <X className="h-3 w-3 mr-1" />
                            Cancelled
                          </Badge>
                        )}
                      </CardTitle>
                      {/* {pilgrim.status === "cancelled" &&
                        pilgrim.cancellationDate && (
                          <CardDescription className="text-red-600">
                            Cancelled on {formatDate(pilgrim.cancellationDate)}
                            {pilgrim.cancellationReason &&
                              ` - ${pilgrim.cancellationReason}`}
                          </CardDescription>
                        )} */}
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Full Name
                            </span>
                            <span className="font-medium">
                              {pilgrim.firstName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Age</span>
                            <span className="font-medium">
                              {calculateAgeOnlyYear(pilgrim.dateOfBirth)} years
                              {/* {pilgrim.dateOfBirth} years */}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Gender
                            </span>
                            <span className="font-medium capitalize">
                              {pilgrim.gender}
                            </span>
                          </div>
                          {/* <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Relationship
                            </span>
                            <span className="font-medium capitalize">
                              {pilgrim.relationship}
                            </span>
                          </div> */}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Passport Number
                            </span>
                            <span className="font-mono">
                              {pilgrim.passportNumber}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium">Document Status</h4>
                          <div className="space-y-2">
                            {/* {Object.entries(pilgrim.documentsStatus).map(
                              ([doc, status]) => (
                                <div
                                  key={doc}
                                  className="flex items-center justify-between"
                                >
                                  <span className="text-sm capitalize">
                                    {doc.replace(/([A-Z])/g, " $1").trim()}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {status ? (
                                      <>
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="text-sm text-green-600">
                                          Verified
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <Clock className="h-4 w-4 text-yellow-600" />
                                        <span className="text-sm text-yellow-600">
                                          Pending
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )
                            )} */}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* <TabsContent value="progress" className="space-y-6">
              {selectedBooking.pilgrims.map((pilgrim, index) => (
                <Card
                  key={pilgrim.id}
                  className={
                    pilgrim.status === "cancelled"
                      ? "opacity-60 border-red-200"
                      : ""
                  }
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {pilgrim.name} - Progress Tracker
                      {pilgrim.status === "cancelled" && (
                        <Badge variant="destructive" className="ml-2">
                          <X className="h-3 w-3 mr-1" />
                          Cancelled
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Track the milestones for this pilgrim's journey
                      preparation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      {Object.entries(pilgrim.milestones).map(
                        ([key, completed]) => (
                          <div key={key} className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                completed
                                  ? "bg-green-500 border-green-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {completed && (
                                <CheckCircle className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <span
                              className={`capitalize ${
                                completed
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                          </div>
                        )
                      )}
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress for {pilgrim.name}</span>
                        <span>
                          {Math.round(getMilestoneProgress(pilgrim.milestones))}
                          %
                        </span>
                      </div>
                      <Progress
                        value={getMilestoneProgress(pilgrim.milestones)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              {selectedBooking.pilgrims.map((pilgrim, index) => (
                <Card
                  key={pilgrim.id}
                  className={
                    pilgrim.status === "cancelled"
                      ? "opacity-60 border-red-200"
                      : ""
                  }
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {pilgrim.name} - Travel Documents
                      {pilgrim.status === "cancelled" && (
                        <Badge variant="destructive" className="ml-2">
                          <X className="h-3 w-3 mr-1" />
                          Cancelled
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Status of travel documents and tickets for this pilgrim
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(pilgrim.documents).map(
                        ([doc, available]) => (
                          <div
                            key={doc}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <span className="capitalize font-medium">
                              {doc}
                            </span>
                            <div className="flex items-center gap-2">
                              {available ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={pilgrim.status === "cancelled"}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-600" />
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent> */}

            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Contact Information</CardTitle>
                  <CardDescription>
                    Get in touch with your travel agent for any queries
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {details.agencyName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{details.agencyName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Travel Agent
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{details.phone}</span>
                      <Button variant="outline" size="sm">
                        Call
                      </Button>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{details.email}</span>
                      <Button variant="outline" size="sm">
                        Email
                      </Button>
                    </div>

                    {selectedBooking?.agentContact?.whatsapp && (
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span>{details?.phone}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600"
                        >
                          WhatsApp
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Cancellation Policy */}
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-yellow-800">
                    Cancellation Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700 text-sm mb-4">
                    {selectedBooking?.cancellationPolicy?.description}
                  </p>
                  <div className="space-y-2">
                    {selectedBooking.cancellationPolicy?.rules?.map(
                      (rule, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm text-yellow-700"
                        >
                          <span>
                            {rule.daysBeforeDeparture}+ days before departure:
                          </span>
                          <span className="font-medium">
                            {rule.description}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  {selectedBooking.status !== "cancelled" &&
                    getActiveCount(selectedBooking) > 0 &&
                    (selectedBooking.status === "confirmed" ||
                      selectedBooking.status === "pending" ||
                      selectedBooking.status === "partially_cancelled") && (
                      <div className="mt-4 pt-4 border-t border-yellow-200">
                        <p className="font-medium text-yellow-800 mb-2">
                          Current Refund Amount (Full Cancellation):
                        </p>
                        <p className="text-lg font-bold text-yellow-900">
                          {formatCurrency(
                            calculateRefundAmount(selectedBooking).refundAmount
                          )}
                          <span className="text-sm font-normal ml-2">
                            (
                            {
                              calculateRefundAmount(selectedBooking)
                                .refundPercentage
                            }
                            % of paid amount)
                          </span>
                        </p>
                      </div>
                    )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default BookingViewPage;
