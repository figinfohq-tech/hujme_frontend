import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { baseURL } from "@/utils/constant/url";
import axios from "axios";
import { Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

const PaymentProcessComfirm = () => {
  const [packageDetails, setpackageDetails] = useState<any>("");
  const [isLoading, setIsLoading] = useState(true);
  const [paymentType, setPaymentType] = useState<"full" | "partial" | null>(
    null,
  );

  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  const fetchPackage = async () => {
    try {
      setIsLoading(true);

      const token = sessionStorage.getItem("token");
      if (!booking?.bookingId) {
        throw new Error("Booking ID not found");
      }

      const response = await axios.get(
        `${baseURL}packages/${booking?.packageId}`,
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

      toast.error(
        error?.response?.data?.message || "Failed to fetch Agent details",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackage();
  }, [booking]);

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
                <span className="font-medium">
                  {packageDetails?.packageName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Travelers:</span>
                <span className="font-medium">{booking?.travelerCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-medium">
                  ₹{booking?.totalAmt.toLocaleString()}
                  {/* ₹{90000} */}
                </span>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-3">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-bold text-green-600">
                  ₹
                  {/* {(paymentType === "full"
                    ? totalAmount??
                    : partialAmount??
                  ).toLocaleString()} */}
                  {booking?.totalAmt}
                </span>
              </div>
              {paymentType === "partial" && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Remaining:</span>
                  <span className="font-medium text-orange-600">
                    {/* ₹{(totalAmount? - partialAmount?).toLocaleString()} */}₹
                    {booking?.totalAmt.toLocaleString()}
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
              disabled={!booking}
              onClick={() =>
                navigate("/booking-confirmation", {
                  state: { booking: booking },
                })
              }
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

export default PaymentProcessComfirm;
