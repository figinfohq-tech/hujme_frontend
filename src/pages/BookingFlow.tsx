import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "react-toastify";
import { useRef } from "react";

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
  const [booking, setBooking] = useState<any>(null);
  const [paymentType, setPaymentType] = useState<"full" | "partial" | null>(
    null,
  );
  const [partialAmount, setPartialAmount] = useState<number>(0);

  const bookingApiCalledRef = useRef(false);

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

  type TravelerErrors = Partial<Record<keyof TravelerState, string>>;

  const [errors, setErrors] = useState<TravelerErrors[]>([]);

  const validateTraveler = (t: TravelerState): TravelerErrors => {
    const e: TravelerErrors = {};

    if (!t.firstName.trim()) e.firstName = "First name is required";
    // if (!t.middleName.trim()) e.middleName = "Middle name is required";
    if (!t.lastName.trim()) e.lastName = "Last name is required";

    if (!t.emailId.trim()) {
      e.emailId = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(t.emailId)) {
      e.emailId = "Enter a valid email address";
    }

    if (!t.phoneNumber.trim()) {
      e.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(t.phoneNumber)) {
      e.phoneNumber = "Enter a valid 10-digit phone number";
    }

    if (!t.gender) e.gender = "Gender is required";
    if (!t.dateOfBirth) e.dateOfBirth = "Date of birth is required";
    if (!t.nationality.trim()) e.nationality = "Nationality is required";
    if (!t.passportNumber.trim())
      e.passportNumber = "Password Number is required";

    return e;
  };

  const bookingPackages = async (travelerCount: number) => {
    try {
      const token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("userId");
      const pricePerPerson = Number(packageData?.price || 0);
      const totalAmt = pricePerPerson * travelerCount;
      // ✅ Your payload object
      const payloadBooking = {
        // balanceAmt: 0,
        // bookingRef: "string",
        // bookingStatus: "string",
        // discountAmt: 0,
        // paymentStatus: "string",
        // receivedAmt: 0,
        // startDate: "string",
        totalAmt: totalAmt,
        travelerCount: travelerCount,
        packageId: packageData?.id,
        userId: userId, // 👈 userId from sessionStorage
      };
      const response = await axios.post(`${baseURL}bookings`, payloadBooking, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
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
    if (bookingApiCalledRef.current) return; // ⛔ already called
    const validationResults = travelers.map(validateTraveler);
    setErrors(validationResults);

    const hasError = validationResults.some((e) => Object.keys(e).length > 0);

    if (hasError) {
      toast.error("Please fix the highlighted errors");
      return;
    }
    setIsProcessing(true);

    try {
      bookingApiCalledRef.current = true;
      const token = sessionStorage.getItem("token") || "";

      // ✅ BOOKING API — ONLY ONCE
      const newBooking = await bookingPackages(travelers.length);
      setBooking(newBooking);

      // Loop through ALL travelers
      for (let t of travelers) {
        const payload: TravelerPayload = {
          bookingId: Number(newBooking?.bookingId),
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
      navigate("/payment-option", {
        state: { booking: newBooking },
      });
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
      bookingApiCalledRef.current = false;
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
    navigate("/payment-corfirm");
    // setStep(3);
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: `Your ${paymentType} payment has been processed successfully.`,
      });
    }, 1500);
  };

  const travelerCount = travelers.length;
  const totalAmount = (packageData?.price || 0) * travelerCount;

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
                        <Label className="mb-2">
                          First Name <span className="text-red-500">*</span>
                        </Label>

                        <Input
                          id={`firstName-${index}`}
                          value={traveler.firstName}
                          onChange={(e) =>
                            updateTraveler(index, "firstName", e.target.value)
                          }
                          placeholder="Enter first name"
                        />
                        {errors[index]?.firstName && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors[index].firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="mb-2">
                          Middle Name
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
                        <Label className="mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </Label>

                        <Input
                          id={`lastName-${index}`}
                          value={traveler.lastName}
                          onChange={(e) =>
                            updateTraveler(index, "lastName", e.target.value)
                          }
                          placeholder="Enter last name"
                        />
                        {errors[index]?.lastName && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors[index].lastName}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="mb-2">
                          Email <span className="text-red-500">*</span>
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
                        {errors[index]?.emailId && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors[index].emailId}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="mb-2">
                          Phone Number <span className="text-red-500">*</span>
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
                        {errors[index]?.phoneNumber && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors[index].phoneNumber}
                          </p>
                        )}
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
                        <Label className="mb-2">
                          Gender <span className="text-red-500">*</span>
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
                        {errors[index]?.gender && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors[index].gender}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="mb-2">
                          Date of Birth <span className="text-red-500">*</span>
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
                        {errors[index]?.dateOfBirth && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors[index].dateOfBirth}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="mb-2">
                          Nationality <span className="text-red-500">*</span>
                        </Label>

                        <Input
                          value={traveler.nationality}
                          onChange={(e) =>
                            updateTraveler(index, "nationality", e.target.value)
                          }
                          placeholder="Enter nationality"
                        />
                        {errors[index]?.nationality && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors[index].nationality}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`passport-${index}`} className="mb-2">
                          Passport Number <span className="text-red-500">*</span>
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
                        {errors[index]?.passportNumber && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors[index].passportNumber}
                          </p>
                        )}
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
                          max={formatDateFn(new Date(), "yyyy-MM-dd")}
                          onChange={(e) =>
                            updateTraveler(
                              index,
                              "passportIssueDate",
                              e.target.value ? new Date(e.target.value) : null,
                            )
                          }
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
                    (packageData?.price || 0) * travelers.length
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
};

export default BookingFlow;
