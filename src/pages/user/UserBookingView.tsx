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

const UserBookingView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pilgrimData, setPilgrimData] = useState<any>([]);
  const [details, setDetails] = useState<any>({});
  const [bookingDetails, setBookingDetails] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const { booking, myPackage, bookingUser } = location.state || {};
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [documentsData, setDocumentsData] = useState<Record<number, any[]>>({});

  console.log("documents--->", documentsData);

  const selectedBooking = booking;

  console.log("selectedBooking---->", selectedBooking);

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

  console.log("PilgrimData--->", pilgrimData);

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

  console.log("contact details---->", details);

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
  console.log("token-->", sessionStorage.getItem("token"));

  console.log("detaislll===>", bookingDetails);

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

  const getDocumentProgress = (travelerId: number) => {
    const docs = documentsData[travelerId];

    if (!docs || docs.length === 0) return 0;

    const totalDocs = docs.length;

    const uploadedDocs = docs.filter(
      (doc: any) => doc.documentStatus === "UPLOADED",
    ).length;

    return Math.round((uploadedDocs / totalDocs) * 100);
  };

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
                Complete information about your booking
              </p>
            </div>
          </div>
        </div>
        <div className="m-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-primary text-2xl">
                Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <Label className="text-primary/90">Room Preference</Label>
                  <p className="font-medium capitalize">
                    {selectedBooking?.roomPreference}
                  </p>
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
                Agent Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
              <div className="flex justify-between">
                <span className="text-primary/90 font-medium">
                  Remaining Amount
                </span>
                <span className="font-bold text-lg">
                  {formatCurrency(
                    selectedBooking.totalAmount - selectedBooking.amountPaid,
                  )}
                </span>
              </div>

              {selectedBooking.paymentStatus !== "completed" &&
                selectedBooking.status !== "cancelled" &&
                selectedBooking.status !== "rejected" && (
                  <Button
                    className="w-full"
                    onClick={() => setIsPaymentOpen(true)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Make Payment
                  </Button>
                )}
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
                Travelers / Pilgrims Details
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
                        <Label className="text-primary/90">
                          Passport Number
                        </Label>
                        <p className="font-medium">{pilgrim?.passportNumber}</p>
                      </div>

                      <div>
                        <Label className="text-primary/90 mb-2 block">
                          Document Status
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {documentsData[pilgrim.travelerId]?.length > 0 ? (
                            documentsData[pilgrim.travelerId].map(
                              (doc: any) => (
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
                              ),
                            )
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No documents found
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
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
                      </div>
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
    </>
  );
};

export default UserBookingView;
