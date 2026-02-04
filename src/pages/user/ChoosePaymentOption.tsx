import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router";

const ChoosePaymentOption = () => {
  const [paymentType, setPaymentType] = useState<"full" | "partial" | null>(
    null,
  );
  const [partialAmount, setPartialAmount] = useState<number>(0);

  const navigate = useNavigate();

  const location = useLocation();
  const booking = location.state?.booking;
  const totalAmount = booking?.totalAmt;
  const minPartialAmount = Math.ceil(booking?.totalAmt * 0.2);

  const handlePaymentOptionSubmit = () => {
    if (!paymentType) {
      toast.success("Please select a payment option");
      return;
    }

    if (paymentType === "partial" && (!partialAmount || partialAmount <= 0)) {
      toast.error("Please enter a valid partial payment amount");
      return;
    }

    toast.success("Payment Successful");

    navigate("/payment-corfirm", {
      state: { booking: booking },
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Choose Payment Option</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Package Summary */}
          <div className="p-4 bg-accent rounded-lg">
            <h3 className="font-semibold text-lg">
              {totalAmount.toLocaleString()}
            </h3>
            <p className="text-sm text-muted-foreground">
              {booking?.travelerCount} traveler(s)
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
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handlePaymentOptionSubmit}
              disabled={
                !paymentType ||
                (paymentType === "partial" && partialAmount < minPartialAmount)
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
};

export default ChoosePaymentOption;
