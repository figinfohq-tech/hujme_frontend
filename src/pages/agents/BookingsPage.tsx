import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Search,
  Calendar,
  MapPin,
  Users,
  Clock,
  Phone,
  Mail,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  MessageSquare,
  CreditCard,
  Plane,
  User,
  Shield,
  Receipt,
  History,
  Plus,
  FileText,
  AlertTriangle,
  RefreshCw,
  X,
  Banknote,
  ArrowLeft,
  Building,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency, formatDate } from "@/lib/utils";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";

interface PaymentTransaction {
  id: string;
  amount: number;
  date: Date;
  method: "credit_card" | "debit_card" | "upi" | "net_banking" | "cash";
  status: "completed" | "pending" | "failed";
  reference: string;
  description: string;
}

interface RefundTransaction {
  id: string;
  amount: number;
  date: Date;
  status: "initiated" | "processing" | "completed" | "failed";
  reference: string;
  reason: string;
  estimatedDays: number;
  pilgrimIds?: string[];
  refundMethod: "bank_account" | "original_payment" | "wallet";
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    accountHolder: string;
    bankName: string;
  };
  actualCompletionDate?: Date;
  failureReason?: string;
}

interface Pilgrim {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  passportNumber: string;
  relationship: string;
  status: "active" | "cancelled";
  cancellationDate?: Date;
  cancellationReason?: string;
  documentsStatus: {
    passport: boolean;
    visa: boolean;
    medicalCertificate: boolean;
    vaccinationCertificate: boolean;
  };
  milestones: {
    documentsSubmitted: boolean;
    documentsVerified: boolean;
    visaProcessing: boolean;
    visaApproved: boolean;
    ticketsIssued: boolean;
    tripCompleted: boolean;
  };
  documents: {
    visa: boolean;
    tickets: boolean;
    itinerary: boolean;
    insurance: boolean;
  };
}

interface CancellationPolicy {
  description: string;
  rules: {
    daysBeforeDeparture: number;
    refundPercentage: number;
    description: string;
  }[];
}

interface Booking {
  id: string;
  packageTitle: string;
  packageId: string;
  agentName: string;
  agentId: string;
  agentContact: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
  type: "hajj" | "umrah";
  status:
    | "pending"
    | "confirmed"
    | "rejected"
    | "cancelled"
    | "completed"
    | "partially_cancelled";
  bookingDate: Date;
  departureDate: Date;
  returnDate: Date;
  duration: number;
  location: string;
  pilgrims: Pilgrim[];
  totalAmount: number;
  amountPaid: number;
  roomPreference: string;
  emergencyContact: string;
  specialRequirements?: string;
  paymentStatus:
    | "pending"
    | "partial"
    | "completed"
    | "refunded"
    | "partially_refunded";
  paymentTransactions: PaymentTransaction[];
  refundTransactions: RefundTransaction[];
  cancellationPolicy: CancellationPolicy;
  refundableAmount?: number;
  cancellationDate?: Date;
  cancellationReason?: string;
}

const mockBookings: Booking[] = [
  {
    id: "BK001",
    packageTitle: "Premium Hajj Package 2024",
    packageId: "PKG001",
    agentName: "Al-Haramain Tours",
    agentId: "AGT001",
    agentContact: {
      phone: "+91 9876543210",
      email: "support@alharamain.com",
      whatsapp: "+91 9876543210",
    },
    type: "hajj",
    status: "confirmed",
    bookingDate: new Date("2024-01-15"),
    departureDate: new Date("2024-06-15"),
    returnDate: new Date("2024-07-30"),
    duration: 45,
    location: "Mecca & Medina",
    pilgrims: [
      {
        id: "P001",
        name: "Ahmed Ibrahim",
        age: 45,
        gender: "male",
        passportNumber: "A1234567",
        relationship: "self",
        status: "active",
        documentsStatus: {
          passport: true,
          visa: true,
          medicalCertificate: true,
          vaccinationCertificate: true,
        },
        milestones: {
          documentsSubmitted: true,
          documentsVerified: true,
          visaProcessing: true,
          visaApproved: true,
          ticketsIssued: false,
          tripCompleted: false,
        },
        documents: {
          visa: true,
          tickets: false,
          itinerary: true,
          insurance: true,
        },
      },
      {
        id: "P002",
        name: "Fatima Ibrahim",
        age: 42,
        gender: "female",
        passportNumber: "B7654321",
        relationship: "spouse",
        status: "active",
        documentsStatus: {
          passport: true,
          visa: false,
          medicalCertificate: true,
          vaccinationCertificate: true,
        },
        milestones: {
          documentsSubmitted: true,
          documentsVerified: true,
          visaProcessing: true,
          visaApproved: false,
          ticketsIssued: false,
          tripCompleted: false,
        },
        documents: {
          visa: false,
          tickets: false,
          itinerary: true,
          insurance: true,
        },
      },
    ],
    totalAmount: 370000,
    amountPaid: 185000,
    roomPreference: "double",
    emergencyContact: "+91 9876543211",
    specialRequirements: "Wheelchair assistance required for spouse",
    paymentStatus: "partial",
    paymentTransactions: [
      {
        id: "TXN001",
        amount: 185000,
        date: new Date("2024-01-15"),
        method: "upi",
        status: "completed",
        reference: "UPI123456789",
        description: "Initial booking payment - 50% advance",
      },
    ],
    refundTransactions: [],
    cancellationPolicy: {
      description:
        "Cancellation charges apply based on timing before departure",
      rules: [
        {
          daysBeforeDeparture: 90,
          refundPercentage: 100,
          description: "Full refund (100%)",
        },
        {
          daysBeforeDeparture: 60,
          refundPercentage: 75,
          description: "75% refund",
        },
        {
          daysBeforeDeparture: 30,
          refundPercentage: 50,
          description: "50% refund",
        },
        {
          daysBeforeDeparture: 15,
          refundPercentage: 25,
          description: "25% refund",
        },
        {
          daysBeforeDeparture: 0,
          refundPercentage: 0,
          description: "No refund",
        },
      ],
    },
  },
  {
    id: "BK002",
    packageTitle: "Umrah Express Package",
    packageId: "PKG002",
    agentName: "Blessed Journey Tours",
    agentId: "AGT002",
    agentContact: {
      phone: "+91 8765432109",
      email: "info@blessedjourney.com",
    },
    type: "umrah",
    status: "pending",
    bookingDate: new Date("2024-02-20"),
    departureDate: new Date("2024-04-10"),
    returnDate: new Date("2024-04-24"),
    duration: 14,
    location: "Mecca & Medina",
    pilgrims: [
      {
        id: "P003",
        name: "Ahmed Ibrahim",
        age: 45,
        gender: "male",
        passportNumber: "A1234567",
        relationship: "self",
        status: "active",
        documentsStatus: {
          passport: true,
          visa: false,
          medicalCertificate: true,
          vaccinationCertificate: false,
        },
        milestones: {
          documentsSubmitted: true,
          documentsVerified: false,
          visaProcessing: false,
          visaApproved: false,
          ticketsIssued: false,
          tripCompleted: false,
        },
        documents: {
          visa: false,
          tickets: false,
          itinerary: false,
          insurance: false,
        },
      },
    ],
    totalAmount: 75000,
    amountPaid: 15000,
    roomPreference: "single",
    emergencyContact: "+91 9876543211",
    paymentStatus: "partial",
    paymentTransactions: [
      {
        id: "TXN002",
        amount: 15000,
        date: new Date("2024-02-20"),
        method: "credit_card",
        status: "completed",
        reference: "CC987654321",
        description: "Booking confirmation payment - 20% advance",
      },
    ],
    refundTransactions: [],
    cancellationPolicy: {
      description: "Flexible cancellation policy with reasonable charges",
      rules: [
        {
          daysBeforeDeparture: 30,
          refundPercentage: 100,
          description: "Full refund (100%)",
        },
        {
          daysBeforeDeparture: 15,
          refundPercentage: 75,
          description: "75% refund",
        },
        {
          daysBeforeDeparture: 7,
          refundPercentage: 50,
          description: "50% refund",
        },
        {
          daysBeforeDeparture: 0,
          refundPercentage: 25,
          description: "25% refund",
        },
      ],
    },
  },
];

export const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [bookingUser, setBookingUser] = useState<any>("");
  const [myPackage, setMyPackge] = useState<any>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isProcessingCancellation, setIsProcessingCancellation] =
    useState(false);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  const [selectedPilgrims, setSelectedPilgrims] = useState<string[]>([]);
  const [cancellationType, setCancellationType] = useState<"full" | "partial">(
    "full"
  );
  const [refundMethod, setRefundMethod] = useState<
    "bank_account" | "original_payment" | "wallet"
  >("original_payment");
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    accountHolder: "",
    bankName: "",
  });

  const navigate = useNavigate();

  // Fetch Booking By User
  const fetchBookingByUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await axios.get(`${baseURL}bookings/byUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookingUser(response.data);
    } catch (error) {
      console.error("Package Fetch Error:", error);
    }
  };
  // Fetch Booking By User
  const ActiveUser = bookingUser.length;

  useEffect(() => {
    fetchBookingByUser();
  }, []);

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${baseURL}packages/${bookingUser[0]?.packageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMyPackge(response.data);
    } catch (error) {
      console.error("Package Fetch Error:", error);
    }
  };
  // Fetch Booking By User

  useEffect(() => {
    if (bookingUser) {
      fetchPackages();
    }
  }, [bookingUser]);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.packageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "partially_cancelled":
        return <AlertTriangle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
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

  const getRefundStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "initiated":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const getRefundMethodName = (method: string) => {
    switch (method) {
      case "bank_account":
        return "Bank Account";
      case "original_payment":
        return "Original Payment Method";
      case "wallet":
        return "Digital Wallet";
      default:
        return method;
    }
  };

  const getMilestoneProgress = (milestones: Pilgrim["milestones"]) => {
    const total = Object.keys(milestones).length;
    const completed = Object.values(milestones).filter(Boolean).length;
    return (completed / total) * 100;
  };

  const getOverallMilestoneProgress = (pilgrims: Pilgrim[]) => {
    const activePilgrims = pilgrims.filter((p) => p.status === "active");
    if (activePilgrims.length === 0) return 0;
    const totalProgress = activePilgrims.reduce(
      (sum, pilgrim) => sum + getMilestoneProgress(pilgrim.milestones),
      0
    );
    return totalProgress / activePilgrims.length;
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

  const handleMakePayment = async () => {
    if (!selectedBooking || !paymentAmount || !paymentMethod) {
      toast.error("Please fill in all payment details");
      return;
    }

    const amount = parseFloat(paymentAmount);
    const remainingAmount =
      selectedBooking.totalAmount - selectedBooking.amountPaid;

    if (amount <= 0 || amount > remainingAmount) {
      toast.error(
        `Please enter a valid amount (max: ${formatCurrency(remainingAmount)})`
      );
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Mock payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const newTransaction: PaymentTransaction = {
        id: `TXN${Date.now()}`,
        amount,
        date: new Date(),
        method: paymentMethod as PaymentTransaction["method"],
        status: "completed",
        reference: `REF${Date.now()}`,
        description:
          amount === remainingAmount
            ? "Final payment - booking complete"
            : "Partial payment",
      };

      const newAmountPaid = selectedBooking.amountPaid + amount;
      const newPaymentStatus =
        newAmountPaid >= selectedBooking.totalAmount ? "completed" : "partial";

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === selectedBooking.id
            ? {
                ...booking,
                amountPaid: newAmountPaid,
                paymentStatus: newPaymentStatus,
                paymentTransactions: [
                  ...booking.paymentTransactions,
                  newTransaction,
                ],
                status:
                  newPaymentStatus === "completed" &&
                  booking.status === "pending"
                    ? "confirmed"
                    : booking.status,
              }
            : booking
        )
      );

      // Update selected booking for immediate UI update
      const updatedBooking = {
        ...selectedBooking,
        amountPaid: newAmountPaid,
        paymentStatus: newPaymentStatus,
        paymentTransactions: [
          ...selectedBooking.paymentTransactions,
          newTransaction,
        ],
      };
      setSelectedBooking(updatedBooking);

      toast.success(
        `Payment of ${formatCurrency(amount)} processed successfully!`
      );
      setPaymentAmount("");
      setPaymentMethod("");
      setIsPaymentOpen(false);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment processing failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking || !cancellationReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    if (cancellationType === "partial" && selectedPilgrims.length === 0) {
      toast.error("Please select at least one pilgrim to cancel");
      return;
    }

    setIsProcessingCancellation(true);

    try {
      // Mock cancellation processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const pilgrimIdsToCancel =
        cancellationType === "full" ? undefined : selectedPilgrims;
      const refundCalculation = calculateRefundAmount(
        selectedBooking,
        pilgrimIdsToCancel
      );

      // Create refund transaction if there's a refund amount
      const refundTransaction: RefundTransaction | null =
        refundCalculation.refundAmount > 0
          ? {
              id: `REF${Date.now()}`,
              amount: refundCalculation.refundAmount,
              date: new Date(),
              status: "initiated",
              reference: `REFUND${Date.now()}`,
              reason: cancellationReason,
              estimatedDays: 5,
              pilgrimIds: pilgrimIdsToCancel,
              refundMethod: "original_payment",
            }
          : null;

      // Update booking with cancellation details
      setBookings((prev) =>
        prev.map((booking) => {
          if (booking.id !== selectedBooking.id) return booking;

          let newStatus = booking.status;
          let updatedPilgrims = [...booking.pilgrims];
          let newPaymentStatus = booking.paymentStatus;

          if (cancellationType === "full") {
            newStatus = "cancelled";
            updatedPilgrims = updatedPilgrims.map((pilgrim) => ({
              ...pilgrim,
              status: "cancelled" as const,
              cancellationDate: new Date(),
              cancellationReason: cancellationReason,
            }));
            if (refundTransaction) {
              newPaymentStatus = "refunded";
            }
          } else {
            // Partial cancellation
            updatedPilgrims = updatedPilgrims.map((pilgrim) => {
              if (selectedPilgrims.includes(pilgrim.id)) {
                return {
                  ...pilgrim,
                  status: "cancelled" as const,
                  cancellationDate: new Date(),
                  cancellationReason: cancellationReason,
                };
              }
              return pilgrim;
            });

            const activePilgrims = updatedPilgrims.filter(
              (p) => p.status === "active"
            );
            const cancelledPilgrims = updatedPilgrims.filter(
              (p) => p.status === "cancelled"
            );

            if (activePilgrims.length === 0) {
              newStatus = "cancelled";
              newPaymentStatus = "refunded";
            } else if (cancelledPilgrims.length > 0) {
              newStatus = "partially_cancelled";
              newPaymentStatus = "partially_refunded";
            }
          }

          return {
            ...booking,
            status: newStatus as any,
            pilgrims: updatedPilgrims,
            paymentStatus: newPaymentStatus,
            cancellationDate:
              cancellationType === "full"
                ? new Date()
                : booking.cancellationDate,
            cancellationReason:
              cancellationType === "full"
                ? cancellationReason
                : booking.cancellationReason,
            refundTransactions: refundTransaction
              ? [...booking.refundTransactions, refundTransaction]
              : booking.refundTransactions,
          };
        })
      );

      if (refundCalculation.refundAmount > 0) {
        toast.success(
          `Cancellation successful! Refund of ${formatCurrency(
            refundCalculation.refundAmount
          )} has been initiated.`
        );

        // Auto-open refund dialog for bank details if needed
        if (refundCalculation.refundAmount > 0) {
          const updatedBooking = bookings.find(
            (b) => b.id === selectedBooking.id
          );
          if (updatedBooking) {
            setSelectedBooking(updatedBooking);
            setIsRefundOpen(true);
          }
        }
      } else {
        toast.success(
          "Cancellation successful. No refund applicable as per cancellation policy."
        );
      }

      setIsCancelOpen(false);
      setCancellationReason("");
      setSelectedPilgrims([]);
      setCancellationType("full");
      setIsDetailsOpen(false);
    } catch (error) {
      console.error("Cancellation error:", error);
      toast.error("Failed to process cancellation. Please try again.");
    } finally {
      setIsProcessingCancellation(false);
    }
  };

  const handleProcessRefund = async () => {
    if (!selectedBooking) return;

    const pendingRefund = selectedBooking.refundTransactions.find(
      (r) => r.status === "initiated"
    );
    if (!pendingRefund) {
      toast.error("No pending refund found");
      return;
    }

    if (refundMethod === "bank_account") {
      if (
        !bankDetails.accountNumber ||
        !bankDetails.ifscCode ||
        !bankDetails.accountHolder ||
        !bankDetails.bankName
      ) {
        toast.error("Please fill in all bank details");
        return;
      }
    }

    setIsProcessingRefund(true);

    try {
      // Mock refund processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Update refund transaction with method and bank details
      const updatedRefund: RefundTransaction = {
        ...pendingRefund,
        status: "processing",
        refundMethod,
        bankDetails:
          refundMethod === "bank_account" ? { ...bankDetails } : undefined,
      };

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === selectedBooking.id
            ? {
                ...booking,
                refundTransactions: booking.refundTransactions.map((refund) =>
                  refund.id === pendingRefund.id ? updatedRefund : refund
                ),
              }
            : booking
        )
      );

      // Simulate refund completion after delay
      setTimeout(() => {
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === selectedBooking.id
              ? {
                  ...booking,
                  refundTransactions: booking.refundTransactions.map((refund) =>
                    refund.id === pendingRefund.id
                      ? {
                          ...refund,
                          status: "completed" as const,
                          actualCompletionDate: new Date(),
                        }
                      : refund
                  ),
                }
              : booking
          )
        );

        toast.success(
          `Refund of ${formatCurrency(
            pendingRefund.amount
          )} completed successfully!`
        );
      }, 5000);

      toast.success(
        `Refund processing initiated. You will receive ${formatCurrency(
          pendingRefund.amount
        )} in ${
          refundMethod === "bank_account"
            ? "3-5 business days"
            : "1-2 business days"
        }.`
      );
      setIsRefundOpen(false);
      setBankDetails({
        accountNumber: "",
        ifscCode: "",
        accountHolder: "",
        bankName: "",
      });
      setRefundMethod("original_payment");
    } catch (error) {
      console.error("Refund processing error:", error);
      toast.error("Failed to process refund. Please try again.");
    } finally {
      setIsProcessingRefund(false);
    }
  };

  const getActiveCount = (booking: Booking) => {
    return booking.pilgrims.filter((p) => p.status === "active").length;
  };

  const getCancelledCount = (booking: Booking) => {
    return booking.pilgrims.filter((p) => p.status === "cancelled").length;
  };

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const activeCount = getActiveCount(booking);
    const cancelledCount = getCancelledCount(booking);
    const hasPendingRefund = booking.refundTransactions.some(
      (r) => r.status === "initiated"
    );

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">
                {myPackage?.packageName}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span>{myPackage?.agentName}</span>
                <Badge variant="outline" className="text-xs">
                  {myPackage?.travelType.toUpperCase()}
                </Badge>
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2">
              <Badge className={getStatusColor(booking.status)}>
                {getStatusIcon(booking.status)}
                <span className="ml-1 capitalize">
                  {booking.status.replace("_", " ")}
                </span>
              </Badge>
              {hasPendingRefund && (
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  <Banknote className="h-3 w-3 mr-1" />
                  Refund Pending
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {myPackage?.departureDate
                  ? formatDate(myPackage.departureDate)
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{myPackage?.cityName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {ActiveUser} Active
                {cancelledCount > 0 && (
                  <span className="text-red-600 ml-1">
                    ({cancelledCount} Cancelled)
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{myPackage?.duration}</span>
            </div>
          </div>

          {booking.status === "cancelled" && booking.cancellationDate && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 text-sm font-medium">
                <XCircle className="h-4 w-4" />
                <span>Cancelled on {formatDate(booking.cancellationDate)}</span>
              </div>
              {booking.cancellationReason && (
                <p className="text-red-700 text-xs mt-1">
                  {booking.cancellationReason}
                </p>
              )}
              {booking.refundTransactions.length > 0 && (
                <div className="mt-2">
                  <Badge
                    className={getRefundStatusColor(
                      booking.refundTransactions[0].status
                    )}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Refund {booking.refundTransactions[0].status}
                  </Badge>
                  <p className="text-xs text-red-700 mt-1">
                    Refund amount:{" "}
                    {formatCurrency(booking.refundTransactions[0].amount)}
                  </p>
                </div>
              )}
            </div>
          )}

          {booking.status === "partially_cancelled" && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800 text-sm font-medium">
                <AlertTriangle className="h-4 w-4" />
                <span>
                  Partially Cancelled - {cancelledCount} pilgrim(s) cancelled
                </span>
              </div>
              {booking.refundTransactions.length > 0 && (
                <div className="mt-2">
                  <Badge
                    className={getRefundStatusColor(
                      booking.refundTransactions[0].status
                    )}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Refund {booking.refundTransactions[0].status}
                  </Badge>
                  <p className="text-xs text-orange-700 mt-1">
                    Refund amount:{" "}
                    {formatCurrency(booking.refundTransactions[0].amount)}
                  </p>
                </div>
              )}
            </div>
          )}

          {booking.status !== "cancelled" && activeCount > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Trip Progress</span>
                <span>
                  {Math.round(getOverallMilestoneProgress(booking.pilgrims))}%
                </span>
              </div>
              <Progress
                value={getOverallMilestoneProgress(booking.pilgrims)}
                className="h-2"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <p className="text-lg font-semibold">
                {formatCurrency(myPackage?.price * ActiveUser)}
              </p>
              <p
                className={`text-sm ${getPaymentStatusColor(
                  booking.paymentStatus
                )}`}
              >
                Paid: {formatCurrency(myPackage?.price)}
              </p>
            </div>

            <div className="flex gap-2">
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedBooking(booking)
                  setIsDetailsOpen(true)
                }}
              >
                <Eye className="h-4 w-4 mr-1" />
                Details
              </Button> */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigate("/booking-view", {
                    state: {
                      booking: booking,
                      myPackage: myPackage,
                      bookingUser: bookingUser,
                    },
                  });
                }}
              >
                <Eye className="h-4 w-4 mr-1" />
                Details
              </Button>

              {/* Refund Process Button */}
              {hasPendingRefund && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setIsRefundOpen(true);
                  }}
                >
                  <Banknote className="h-4 w-4 mr-1" />
                  Process Refund
                </Button>
              )}

              {/* Cancel Button */}
              {(booking.status === "confirmed" ||
                booking.status === "pending" ||
                booking.status === "partially_cancelled") &&
                activeCount > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setSelectedPilgrims([]);
                      setCancellationType(
                        booking.pilgrims.filter((p) => p.status === "active")
                          .length > 1
                          ? "full"
                          : "full"
                      );
                      setIsCancelOpen(true);
                    }}
                  >
                    Cancel
                  </Button>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8 container mx-auto px-4 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">My Bookings</h1>
        <p className="text-muted-foreground mt-2">
          Track and manage your pilgrimage bookings
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="partially_cancelled">
                  Partially Cancelled
                </SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="hover:bg-secondary" asChild>
              <Link to="/packages">Book New Package</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No bookings found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Start your spiritual journey by booking a package"}
            </p>
            <Button asChild>
              <Link to="/packages">Browse Packages</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Booking Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl bg-green-300  max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details - {selectedBooking?.id}</DialogTitle>
            <DialogDescription>
              Complete information about your booking
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="pilgrims">Pilgrims</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
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
                          {selectedBooking.packageTitle}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Agent</span>
                        <span className="font-medium">
                          {selectedBooking.agentName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type</span>
                        <Badge>{selectedBooking.type.toUpperCase()}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">
                          {selectedBooking.duration} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">
                          {selectedBooking.location}
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
                        <span className="text-muted-foreground">
                          Booking ID
                        </span>
                        <span className="font-mono">{selectedBooking.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge
                          className={getStatusColor(selectedBooking.status)}
                        >
                          {selectedBooking.status.charAt(0).toUpperCase() +
                            selectedBooking.status.slice(1).replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Booked On</span>
                        <span className="font-medium">
                          {formatDate(selectedBooking.bookingDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Departure</span>
                        <span className="font-medium">
                          {formatDate(selectedBooking.departureDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Return</span>
                        <span className="font-medium">
                          {formatDate(selectedBooking.returnDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Active Pilgrims
                        </span>
                        <span className="font-medium">
                          {getActiveCount(selectedBooking)}
                          {getCancelledCount(selectedBooking) > 0 && (
                            <span className="text-red-600 ml-2">
                              ({getCancelledCount(selectedBooking)} cancelled)
                            </span>
                          )}
                        </span>
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
                      {selectedBooking.specialRequirements && (
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
                        <CardTitle className="text-lg">
                          Payment Summary
                        </CardTitle>
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
                          {formatCurrency(selectedBooking.totalAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Amount Paid
                        </span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(selectedBooking.amountPaid)}
                        </span>
                      </div>
                      {selectedBooking.status !== "cancelled" && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Remaining
                          </span>
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
                            .charAt(0)
                            .toUpperCase() +
                            selectedBooking.paymentStatus
                              .slice(1)
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
                      {selectedBooking.refundTransactions.length > 0 && (
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
                                        {formatDate(
                                          refund.actualCompletionDate
                                        )}
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
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="payment" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Payment Overview
                      </CardTitle>
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
                        {selectedBooking.paymentTransactions.map(
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
                        )}

                        {/* Refund Transactions */}
                        {selectedBooking.refundTransactions.map((refund) => (
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
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="pilgrims" className="space-y-6">
                <div className="grid gap-6">
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
                          Pilgrim {index + 1} - {pilgrim.name}
                          {pilgrim.status === "cancelled" && (
                            <Badge variant="destructive" className="ml-2">
                              <X className="h-3 w-3 mr-1" />
                              Cancelled
                            </Badge>
                          )}
                        </CardTitle>
                        {pilgrim.status === "cancelled" &&
                          pilgrim.cancellationDate && (
                            <CardDescription className="text-red-600">
                              Cancelled on{" "}
                              {formatDate(pilgrim.cancellationDate)}
                              {pilgrim.cancellationReason &&
                                ` - ${pilgrim.cancellationReason}`}
                            </CardDescription>
                          )}
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Full Name
                              </span>
                              <span className="font-medium">
                                {pilgrim.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Age</span>
                              <span className="font-medium">
                                {pilgrim.age} years
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
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Relationship
                              </span>
                              <span className="font-medium capitalize">
                                {pilgrim.relationship}
                              </span>
                            </div>
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
                              {Object.entries(pilgrim.documentsStatus).map(
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
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
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
                            {Math.round(
                              getMilestoneProgress(pilgrim.milestones)
                            )}
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
              </TabsContent>

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
                          {selectedBooking.agentName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {selectedBooking.agentName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Travel Agent
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedBooking.agentContact.phone}</span>
                        <Button variant="outline" size="sm">
                          Call
                        </Button>
                      </div>

                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedBooking.agentContact.email}</span>
                        <Button variant="outline" size="sm">
                          Email
                        </Button>
                      </div>

                      {selectedBooking.agentContact.whatsapp && (
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedBooking.agentContact.whatsapp}</span>
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
                      {selectedBooking.cancellationPolicy.description}
                    </p>
                    <div className="space-y-2">
                      {selectedBooking.cancellationPolicy.rules.map(
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
                              calculateRefundAmount(selectedBooking)
                                .refundAmount
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
        </DialogContent>
      </Dialog>

      {/* Make Payment Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>
              Complete your payment for {selectedBooking?.packageTitle}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold">
                      {formatCurrency(selectedBooking.totalAmount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Amount
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(
                        selectedBooking.totalAmount - selectedBooking.amountPaid
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentAmount">Payment Amount</Label>
                  <Input
                    id="paymentAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    max={
                      selectedBooking.totalAmount - selectedBooking.amountPaid
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum:{" "}
                    {formatCurrency(
                      selectedBooking.totalAmount - selectedBooking.amountPaid
                    )}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="debit_card">Debit Card</SelectItem>
                      <SelectItem value="net_banking">Net Banking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
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
                <Button
                  onClick={handleMakePayment}
                  disabled={
                    isProcessingPayment || !paymentAmount || !paymentMethod
                  }
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay{" "}
                      {paymentAmount
                        ? formatCurrency(parseFloat(paymentAmount))
                        : ""}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent className="max-w-lg max-h-[100vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Choose cancellation type and provide reason for cancellation
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium">{selectedBooking.packageTitle}</h4>
                <p className="text-sm text-muted-foreground">
                  Booking ID: {selectedBooking.id}
                </p>
                <p className="text-sm text-muted-foreground">
                  Departure: {formatDate(selectedBooking.departureDate)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Active Pilgrims: {getActiveCount(selectedBooking)}
                </p>
              </div>

              {/* Cancellation Type Selection */}
              {getActiveCount(selectedBooking) > 1 && (
                <div className="space-y-4">
                  <Label>Cancellation Type</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="full"
                        name="cancellationType"
                        value="full"
                        checked={cancellationType === "full"}
                        onChange={(e) =>
                          setCancellationType(
                            e.target.value as "full" | "partial"
                          )
                        }
                      />
                      <Label htmlFor="full" className="font-normal">
                        Full Cancellation - Cancel entire booking for all
                        pilgrims
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="partial"
                        name="cancellationType"
                        value="partial"
                        checked={cancellationType === "partial"}
                        onChange={(e) =>
                          setCancellationType(
                            e.target.value as "full" | "partial"
                          )
                        }
                      />
                      <Label htmlFor="partial" className="font-normal">
                        Partial Cancellation - Cancel for specific pilgrims only
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Pilgrim Selection for Partial Cancellation */}
              {cancellationType === "partial" && (
                <div className="space-y-3">
                  <Label>Select Pilgrims to Cancel</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedBooking.pilgrims
                      .filter((pilgrim) => pilgrim.status === "active")
                      .map((pilgrim) => (
                        <div
                          key={pilgrim.id}
                          className="flex items-center space-x-2 p-2 border rounded"
                        >
                          <Checkbox
                            id={pilgrim.id}
                            checked={selectedPilgrims.includes(pilgrim.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedPilgrims((prev) => [
                                  ...prev,
                                  pilgrim.id,
                                ]);
                              } else {
                                setSelectedPilgrims((prev) =>
                                  prev.filter((id) => id !== pilgrim.id)
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={pilgrim.id}
                            className="flex-1 font-normal"
                          >
                            {pilgrim.name} ({pilgrim.relationship})
                          </Label>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Refund Information */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h5 className="font-medium text-yellow-800 mb-2">
                  Refund Information
                </h5>
                <div className="space-y-2">
                  {(() => {
                    const pilgrimIds =
                      cancellationType === "partial"
                        ? selectedPilgrims
                        : undefined;
                    const refundInfo = calculateRefundAmount(
                      selectedBooking,
                      pilgrimIds
                    );
                    return (
                      <>
                        <p className="text-sm text-yellow-700">
                          Days to departure: {refundInfo.daysToDeparture}
                        </p>
                        <p className="text-sm text-yellow-700">
                          Applicable rule: {refundInfo.rule.description}
                        </p>
                        <p className="font-medium text-yellow-800">
                          Refund Amount:{" "}
                          {formatCurrency(refundInfo.refundAmount)}
                          <span className="text-sm font-normal ml-2">
                            ({refundInfo.refundPercentage}% of{" "}
                            {cancellationType === "partial" &&
                            selectedPilgrims.length > 0
                              ? `${formatCurrency(
                                  (selectedBooking.amountPaid /
                                    selectedBooking.pilgrims.length) *
                                    selectedPilgrims.length
                                )} (${selectedPilgrims.length} pilgrim${
                                  selectedPilgrims.length > 1 ? "s" : ""
                                })`
                              : formatCurrency(selectedBooking.amountPaid)}
                            )
                          </span>
                        </p>
                        {cancellationType === "partial" &&
                          selectedPilgrims.length > 0 && (
                            <p className="text-xs text-yellow-700">
                              Cancelling {selectedPilgrims.length} out of{" "}
                              {getActiveCount(selectedBooking)} active pilgrims
                            </p>
                          )}
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellationReason">
                  Reason for Cancellation
                </Label>
                <Textarea
                  id="cancellationReason"
                  placeholder="Please provide a reason for cancelling this booking..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCancelOpen(false);
                    setCancellationReason("");
                    setSelectedPilgrims([]);
                    setCancellationType("full");
                  }}
                  disabled={isProcessingCancellation}
                >
                  Keep Booking
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelBooking}
                  disabled={
                    isProcessingCancellation ||
                    !cancellationReason.trim() ||
                    (cancellationType === "partial" &&
                      selectedPilgrims.length === 0)
                  }
                >
                  {isProcessingCancellation ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Confirm ${
                      cancellationType === "partial" ? "Partial " : ""
                    }Cancellation`
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Refund Process Dialog */}
      <Dialog open={isRefundOpen} onOpenChange={setIsRefundOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              Process Refund
            </DialogTitle>
            <DialogDescription>
              Complete your refund process for {selectedBooking?.packageTitle}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Refund Summary */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Banknote className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900">
                        Refund Amount
                      </h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedBooking.refundTransactions.length > 0
                          ? formatCurrency(
                              selectedBooking.refundTransactions[0].amount
                            )
                          : "₹0"}
                      </p>
                      <p className="text-sm text-blue-700">
                        Will be processed within 3-7 business days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Refund Method Selection */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Select Refund Method
                </Label>
                <div className="grid gap-4">
                  <Card
                    className={`cursor-pointer border-2 transition-colors ${
                      refundMethod === "original_payment"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    }`}
                    onClick={() => setRefundMethod("original_payment")}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="refundMethod"
                          value="original_payment"
                          checked={refundMethod === "original_payment"}
                          onChange={() => setRefundMethod("original_payment")}
                          className="w-4 h-4"
                        />
                        <div>
                          <h4 className="font-medium">
                            Original Payment Method
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Refund to the same method used for payment
                            (Recommended)
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Processing Time: 1-2 business days
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer border-2 transition-colors ${
                      refundMethod === "bank_account"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    }`}
                    onClick={() => setRefundMethod("bank_account")}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="refundMethod"
                          value="bank_account"
                          checked={refundMethod === "bank_account"}
                          onChange={() => setRefundMethod("bank_account")}
                          className="w-4 h-4"
                        />
                        <div>
                          <h4 className="font-medium">Bank Account Transfer</h4>
                          <p className="text-sm text-muted-foreground">
                            Direct transfer to your bank account
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">
                            Processing Time: 3-5 business days
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer border-2 transition-colors ${
                      refundMethod === "wallet"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    }`}
                    onClick={() => setRefundMethod("wallet")}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="refundMethod"
                          value="wallet"
                          checked={refundMethod === "wallet"}
                          onChange={() => setRefundMethod("wallet")}
                          className="w-4 h-4"
                        />
                        <div>
                          <h4 className="font-medium">Digital Wallet</h4>
                          <p className="text-sm text-muted-foreground">
                            Refund to your digital wallet (PayTM, PhonePe, etc.)
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Processing Time: Instant - 1 business day
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Bank Details Form (shown only when bank_account is selected) */}
              {refundMethod === "bank_account" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Bank Account Details
                    </CardTitle>
                    <CardDescription>
                      Please provide your bank account information for the
                      refund transfer
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountHolder">
                          Account Holder Name
                        </Label>
                        <Input
                          id="accountHolder"
                          placeholder="Enter account holder name"
                          value={bankDetails.accountHolder}
                          onChange={(e) =>
                            setBankDetails((prev) => ({
                              ...prev,
                              accountHolder: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          placeholder="Enter account number"
                          value={bankDetails.accountNumber}
                          onChange={(e) =>
                            setBankDetails((prev) => ({
                              ...prev,
                              accountNumber: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ifscCode">IFSC Code</Label>
                        <Input
                          id="ifscCode"
                          placeholder="Enter IFSC code"
                          value={bankDetails.ifscCode}
                          onChange={(e) =>
                            setBankDetails((prev) => ({
                              ...prev,
                              ifscCode: e.target.value.toUpperCase(),
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          placeholder="Enter bank name"
                          value={bankDetails.bankName}
                          onChange={(e) =>
                            setBankDetails((prev) => ({
                              ...prev,
                              bankName: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Refund Timeline */}
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Refund Processing Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Refund request initiated</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">
                        Processing with payment gateway (1-2 days)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">
                        Amount credited to your account (
                        {refundMethod === "original_payment"
                          ? "1-2"
                          : refundMethod === "bank_account"
                          ? "3-5"
                          : "0-1"}{" "}
                        business days)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsRefundOpen(false);
                    setBankDetails({
                      accountNumber: "",
                      ifscCode: "",
                      accountHolder: "",
                      bankName: "",
                    });
                    setRefundMethod("original_payment");
                  }}
                  disabled={isProcessingRefund}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleProcessRefund}
                  disabled={isProcessingRefund}
                  className="min-w-[120px]"
                >
                  {isProcessingRefund ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Banknote className="h-4 w-4 mr-2" />
                      Process Refund
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
