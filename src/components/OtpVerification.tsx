import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { baseURL } from "@/utils/constant/url";
import { toast } from "react-toastify";

interface OtpVerificationProps {
  type: "email" | "phone";
  value: string;
  isVerified: boolean;
  onVerified: () => void;
  disabled?: boolean;
}

const OtpVerification = ({
  type,
  value,
  isVerified,
  onVerified,
  disabled = false,
}: OtpVerificationProps) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const token = localStorage.getItem("token");

  const handleSendOtp = async (showToast = true) => {
    if (!value) {
      toast.error(
        `Please enter your ${type === "email" ? "email address" : "phone number"} first`,
      );
      return;
    }

    try {
      setIsSending(true);

      const url =
        type === "email"
          ? `http://31.97.205.55:8080/api/otp/email/send-otp?email=${String(value)}`
          : `http://31.97.205.55:8080/api/otp/whatsapp/send-otp?phoneNumber=${String(value)}`;

      await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOtpSent(true);

      if (showToast) {
        toast.success(
          `OTP sent successfully to your ${type === "email" ? "email" : "WhatsApp"}`,
        );
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter valid 6 digit OTP");
      return;
    }

    try {
      setIsVerifying(true);

      const url =
        type === "email"
          ? `http://31.97.205.55:8080/api/otp/email/verify-otp?email=${String(value)}&otp=${String(otp)}`
          : `http://31.97.205.55:8080/api/otp/whatsapp/verify-otp?phoneNumber=${String(value)}&otp=${String(otp)}`;

      await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(
        `${type === "email" ? "Email" : "Phone"} verified successfully`,
      );
      onVerified();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Invalid OTP. Please try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setOtp("");
      await handleSendOtp(false);
      toast.success("OTP resent. Please check your messages");
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  if (isVerified) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-700">
        <CheckCircle className="w-4 h-4" />
        <span>{type === "email" ? "Email" : "Phone"} verified</span>
      </div>
    );
  }

  if (!otpSent) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleSendOtp}
        disabled={disabled || isSending || !value}
        className="mt-1"
      >
        {isSending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send OTP
          </>
        )}
      </Button>
    );
  }

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          maxLength={6}
          className="w-32"
        />
        <Button
          type="button"
          size="sm"
          onClick={handleVerifyOtp}
          disabled={isVerifying || otp.length !== 6}
        >
          {isVerifying ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Verify"
          )}
        </Button>
      </div>

      <button
        type="button"
        onClick={handleResendOtp}
        className="text-xs text-primary hover:underline"
      >
        Resend OTP
      </button>
    </div>
  );
};

export default OtpVerification;
