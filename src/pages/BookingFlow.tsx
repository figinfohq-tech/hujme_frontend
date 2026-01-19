import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "react-toastify";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format as formatDateFn } from "date-fns";
import { CalendarIcon, Plus, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";

/** --- Types --- **/
interface PackageData {
  id: string | number;
  title: string;
  price: number;
  duration: string;
}

/**
 * State used inside the form (dates as Date objects for calendar)
 */
interface TravelerState {
  bookingId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  alternateNumber: string;
  gender: string;
  nationality: string;
  dateOfBirth: Date | null;
  passportNumber: string;
  passportIssueDate: Date | null;
  passportExpiryDate: Date | null;
  visaStatus: string;
  visaType: string;
  createdBy: string;
  updatedBy: string;
  isPrimary?: boolean;
}

/**
 * Payload format expected by backend (dates as yyyy-MM-dd strings)
 */
type TravelerPayload = Omit<
  TravelerState,
  "dateOfBirth" | "passportIssueDate" | "passportExpiryDate"
> & {
  dateOfBirth: string;
  passportIssueDate: string;
  passportExpiryDate: string;
};

export const BookingFlow: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { packageData } = (location.state || {}) as {
    packageData?: PackageData;
  };
  const bookingIdNumber = Number(packageData?.id) || 0;

  const [step, setStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [paymentType, setPaymentType] = useState<"full" | "partial" | null>(
    null,
  );
  const [partialAmount, setPartialAmount] = useState<number>(0);

  // initial traveler object matching backend keys (dates as Date | null)
  const initialTraveler: TravelerState = {
    bookingId: bookingIdNumber,
    firstName: "",
    middleName: "",
    lastName: "",
    emailId: "",
    phoneNumber: "",
    alternateNumber: "",
    gender: "",
    nationality: "india",
    dateOfBirth: null,
    passportNumber: "",
    passportIssueDate: null,
    passportExpiryDate: null,
    visaStatus: "",
    visaType: "",
    createdBy: "string",
    updatedBy: "string",
    isPrimary: true,
  };

  const [travelers, setTravelers] = useState<TravelerState[]>([
    initialTraveler,
  ]);

  const bookingPackages = async (travelerCount: number) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      // ✅ Your payload object
      const payloadBooking = {
        // balanceAmt: 0,
        // bookingRef: "string",
        // bookingStatus: "string",
        // discountAmt: 0,
        // paymentStatus: "string",
        // receivedAmt: 0,
        // startDate: "string",
        totalAmt: packageData?.price,
        travelerCount: travelerCount,
        packageId: packageData?.id,
        userId: userId, // 👈 userId from localStorage
      };
      const response = await axios.post(`${baseURL}bookings`, payloadBooking, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.bookingId;
    } catch (error) {
      console.error("Compare API Error:", error);
    }
  };

  /** Helper: format Date -> 'yyyy-MM-dd' or empty string */
  const formatDate = (d: Date | null | undefined) => {
    if (!d) return "";
    try {
      return formatDateFn(d, "yyyy-MM-dd");
    } catch {
      return "";
    }
  };

  const addTraveler = () => {
    setTravelers((prev) => [
      ...prev,
      {
        ...initialTraveler,
        bookingId: bookingIdNumber,
        isPrimary: false,
      },
    ]);
  };

  const removeTraveler = (index: number) => {
    setTravelers((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTraveler = (
    index: number,
    field: keyof TravelerState,
    value: any,
  ) => {
    setTravelers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  /** Basic validation for required fields before submit */
  const validateStep1 = () => {
    // all travelers must have these required fields
    return travelers.every(
      (t) =>
        t.firstName &&
        t.lastName &&
        t.emailId &&
        t.phoneNumber &&
        t.dateOfBirth, // date object presence
    );
  };

  /** Submit single traveler (backend expects one object as in Postman) */
  const handleBookingSubmit = async () => {
    if (!validateStep1()) {
      toast.error("Please fill all required fields and select departure date.");
      return;
    }

    // setStep(2);
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token") || "";
      const newBookingId = await bookingPackages(travelers.length);
      setBookingId(newBookingId);
      // Loop through ALL travelers
      for (let t of travelers) {
        const payload: TravelerPayload = {
          bookingId: Number(newBookingId),
          alternateNumber: t.alternateNumber || "",
          createdBy: t.createdBy || "string",
          dateOfBirth: formatDate(t.dateOfBirth),
          emailId: t.emailId || "",
          firstName: t.firstName || "",
          middleName: t.middleName || "",
          lastName: t.lastName || "",
          gender: (t.gender || "").toLowerCase(),
          nationality: t.nationality || "",
          passportExpiryDate: formatDate(t.passportExpiryDate),
          passportIssueDate: formatDate(t.passportIssueDate),
          passportNumber: t.passportNumber || "",
          phoneNumber: t.phoneNumber || "",
          updatedBy: t.updatedBy || "string",
          visaStatus: t.visaStatus || "",
          visaType: t.visaType || "",
        };

        // API CALL in each loop
        const response = await axios.post(`${baseURL}travelers`, payload, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          timeout: 15000,
        });

        toast.success(`${t.firstName} ${t.lastName} added successfully`);
      }

      // When ALL traveler APIs are successful:

      toast.success("All travelers submitted successfully!");
      setStep(2);

      // 🔥 RESET FORM HERE
      setTravelers([
        {
          bookingId: bookingIdNumber,
          firstName: "",
          middleName: "",
          lastName: "",
          emailId: "",
          phoneNumber: "",
          gender: "",
          dateOfBirth: "",
          nationality: "",
          passportNumber: "",
          passportIssueDate: "",
          passportExpiryDate: "",
          visaStatus: "",
          visaType: "",
          alternateNumber: "",
        },
      ]);
    } catch (err: any) {
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Something went wrong!";
      toast.error(backendMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentOptionSubmit = () => {
    if (!paymentType) {
      toast({
        title: "Selection Required",
        description: "Please select a payment option",
        variant: "destructive",
      });
      return;
    }

    if (paymentType === "partial" && (!partialAmount || partialAmount <= 0)) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid partial payment amount",
        variant: "destructive",
      });
      return;
    }

    setStep(3);
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: `Your ${paymentType} payment has been processed successfully.`,
      });
    }, 1500);
  };

  const totalAmount = (packageData?.price || 0) * travelers.length;
  const minPartialAmount = Math.ceil(totalAmount * 0.2);

  /** --- UI Renders --- **/
  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Package Summary */}
            <div className="p-4 bg-accent rounded-lg">
              <h3 className="font-semibold text-lg">{packageData?.title}</h3>
              <p className="text-sm text-muted-foreground">
                {packageData?.duration}
              </p>
              <p className="font-semibold text-lg">
                ₹{(packageData?.price || 0).toLocaleString()} per person
              </p>
            </div>

            {/* Travelers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Travelers</Label>
                <Button onClick={addTraveler} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Traveler
                </Button>
              </div>

              {travelers.map((traveler, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {traveler.isPrimary
                          ? "Primary Traveler"
                          : `Traveler ${index + 1}`}
                      </CardTitle>
                      {!traveler.isPrimary && travelers.length > 1 && (
                        <Button
                          onClick={() => removeTraveler(index)}
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`firstName-${index}`} className="mb-2">
                          First Name *
                        </Label>
                        <Input
                          id={`firstName-${index}`}
                          value={traveler.firstName}
                          onChange={(e) =>
                            updateTraveler(index, "firstName", e.target.value)
                          }
                          placeholder="Enter first name"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`middleName-${index}`} className="mb-2">
                          Middle Name *
                        </Label>
                        <Input
                          value={traveler.middleName}
                          onChange={(e) =>
                            updateTraveler(index, "middleName", e.target.value)
                          }
                          placeholder="Enter middle name"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`lastName-${index}`} className="mb-2">
                          Last Name *
                        </Label>
                        <Input
                          id={`lastName-${index}`}
                          value={traveler.lastName}
                          onChange={(e) =>
                            updateTraveler(index, "lastName", e.target.value)
                          }
                          placeholder="Enter last name"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`email-${index}`} className="mb-2">
                          Email *
                        </Label>
                        <Input
                          id={`emailId-${index}`}
                          type="email"
                          value={traveler.emailId}
                          onChange={(e) =>
                            updateTraveler(index, "emailId", e.target.value)
                          }
                          placeholder="Enter email"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`phone-${index}`} className="mb-2">
                          Phone *
                        </Label>
                        <Input
                          id={`phone-${index}`}
                          maxLength={10}
                          inputMode="numeric"
                          value={traveler.phoneNumber}
                          onChange={(e) =>
                            updateTraveler(index, "phoneNumber", e.target.value)
                          }
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor={`alternateNumber-${index}`}
                          className="mb-2"
                        >
                          Alternate Number
                        </Label>
                        <Input
                          value={traveler.alternateNumber}
                          maxLength={10}
                          inputMode="numeric"
                          onChange={(e) =>
                            updateTraveler(
                              index,
                              "alternateNumber",
                              e.target.value,
                            )
                          }
                          placeholder="Enter alternate number"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`gender-${index}`} className="mb-2">
                          Gender *
                        </Label>
                        <select
                          className="border rounded p-2 w-full"
                          value={traveler.gender}
                          onChange={(e) =>
                            updateTraveler(index, "gender", e.target.value)
                          }
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor={`dob-${index}`} className="mb-2">
                          Date of Birth *
                        </Label>
                        <Input
                          type="date"
                          value={
                            traveler.dateOfBirth
                              ? formatDateFn(traveler.dateOfBirth, "yyyy-MM-dd")
                              : ""
                          }
                          max={formatDateFn(new Date(), "yyyy-MM-dd")}
                          onChange={(e) =>
                            updateTraveler(
                              index,
                              "dateOfBirth",
                              e.target.value ? new Date(e.target.value) : null,
                            )
                          }
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor={`nationality-${index}`}
                          className="mb-2"
                        >
                          Nationality *
                        </Label>
                        <Input
                          value={traveler.nationality}
                          onChange={(e) =>
                            updateTraveler(index, "nationality", e.target.value)
                          }
                          placeholder="Enter nationality"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`passport-${index}`} className="mb-2">
                          Passport Number
                        </Label>
                        <Input
                          id={`passport-${index}`}
                          value={traveler.passportNumber}
                          onChange={(e) =>
                            updateTraveler(
                              index,
                              "passportNumber",
                              e.target.value,
                            )
                          }
                          placeholder="Enter passport number"
                        />
                      </div>

                      <div>
                        <Label className="mb-2">Passport Issue Date</Label>
                        <Input
                          type="date"
                          value={
                            traveler.passportIssueDate
                              ? formatDateFn(
                                  traveler.passportIssueDate,
                                  "yyyy-MM-dd",
                                )
                              : ""
                          }
                          // max={formatDateFn(new Date(), "yyyy-MM-dd")}
                          // onChange={(e) =>
                          //   updateTraveler(
                          //     index,
                          //     "passportIssueDate",
                          //     e.target.value ? new Date(e.target.value) : null,
                          //   )
                          // }
                        />
                      </div>

                      <div>
                        <Label className="mb-2">Passport Expiry Date</Label>
                        <Input
                          type="date"
                          value={
                            traveler.passportExpiryDate
                              ? formatDateFn(
                                  traveler.passportExpiryDate,
                                  "yyyy-MM-dd",
                                )
                              : ""
                          }
                          min={
                            traveler.passportIssueDate
                              ? formatDateFn(
                                  traveler.passportIssueDate,
                                  "yyyy-MM-dd",
                                )
                              : undefined
                          }
                          max="2100-01-01"
                          onChange={(e) =>
                            updateTraveler(
                              index,
                              "passportExpiryDate",
                              e.target.value ? new Date(e.target.value) : null,
                            )
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Total Amount */}
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount:</span>
                <span className="font-bold text-xl">
                  ₹
                  {(
                    packageData?.price || 0 * travelers.length
                  ).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {travelers.length} traveler(s) × ₹
                {(packageData?.price || 0).toLocaleString()}
              </p>
            </div>

            <Button
              onClick={handleBookingSubmit}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? "Processing..." : "Proceed to Payment"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Choose Payment Option</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Package Summary */}
            <div className="p-4 bg-accent rounded-lg">
              <h3 className="font-semibold text-lg">{packageData?.title}</h3>
              <p className="text-sm text-muted-foreground">
                {travelers.length} traveler(s)
              </p>
              <p className="font-bold text-xl mt-2">
                Total: ₹{totalAmount.toLocaleString()}
              </p>
            </div>

            {/* Payment Options */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                Select Payment Type
              </Label>

              <Card
                className={cn(
                  "cursor-pointer transition-all",
                  paymentType === "full" &&
                    "border-primary ring-2 ring-primary/20",
                )}
                onClick={() => setPaymentType("full")}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={paymentType === "full"}
                        onChange={() => setPaymentType("full")}
                        className="mt-1"
                      />
                      <div>
                        <h4 className="font-semibold">Full Payment</h4>
                        <p className="text-sm text-muted-foreground">
                          Pay the complete amount now
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-lg">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={cn(
                  "cursor-pointer transition-all",
                  paymentType === "partial" &&
                    "border-primary ring-2 ring-primary/20",
                )}
                onClick={() => setPaymentType("partial")}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          checked={paymentType === "partial"}
                          onChange={() => setPaymentType("partial")}
                          className="mt-1"
                        />
                        <div>
                          <h4 className="font-semibold">Partial Payment</h4>
                          <p className="text-sm text-muted-foreground">
                            Pay a portion now, rest later (minimum ₹
                            {minPartialAmount.toLocaleString()})
                          </p>
                        </div>
                      </div>
                    </div>

                    {paymentType === "partial" && (
                      <div className="pl-7">
                        <Label htmlFor="partial-amount" className="text-sm">
                          Enter Amount
                        </Label>
                        <Input
                          id="partial-amount"
                          type="number"
                          placeholder={`Min: ₹${minPartialAmount.toLocaleString()}`}
                          min={minPartialAmount}
                          max={totalAmount}
                          value={partialAmount || ""}
                          onChange={(e) =>
                            setPartialAmount(Number(e.target.value))
                          }
                          className="mt-1"
                        />
                        {partialAmount > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Remaining: ₹
                            {(totalAmount - partialAmount).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handlePaymentOptionSubmit}
                disabled={
                  !paymentType ||
                  (paymentType === "partial" &&
                    partialAmount < minPartialAmount)
                }
                className="flex-1"
              >
                Proceed to Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 3 - Payment Processing / Confirmation
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardContent className="text-center p-8">
          <div className="space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Payment Processing</h2>
              <p className="text-muted-foreground">
                Your {paymentType} payment is being processed
              </p>
            </div>

            <div className="bg-accent p-6 rounded-lg text-left space-y-3">
              <h3 className="font-semibold text-lg mb-4">Payment Summary</h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Package:</span>
                <span className="font-medium">{packageData?.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Travelers:</span>
                <span className="font-medium">{travelers.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-medium">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-3">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-bold text-green-600">
                  ₹
                  {(paymentType === "full"
                    ? totalAmount
                    : partialAmount
                  ).toLocaleString()}
                </span>
              </div>
              {paymentType === "partial" && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Remaining:</span>
                  <span className="font-medium text-orange-600">
                    ₹{(totalAmount - partialAmount).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {paymentType === "full"
                  ? "Your booking will be confirmed shortly. You will receive a confirmation email with all the details."
                  : "Partial payment received. Please pay the remaining amount before your departure date to confirm your booking."}
              </p>
            </div>

            <Button
              onClick={() => navigate("/booking-confirmation")}
              className="w-full"
              size="lg"
            >
              View Booking Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingFlow;
