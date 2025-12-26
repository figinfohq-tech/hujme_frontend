import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  X,
  AlertCircle,
  Users,
} from "lucide-react";
// import { TravelerDocumentCard } from "./TravelerDocumentCard";
import { useLocation, useNavigate } from "react-router-dom";
import { TravelerDocumentCard } from "@/components/TravelerDocumentCard";
import { toast } from "react-toastify";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TravelerDocument {
  id: string;
  type: string;
  status: "verified" | "pending" | "rejected" | "needs_reupload";
  uploaded_at: string;
  rejection_reason?: string;
}

interface Traveler {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  passport_number: string;
  nationality: string;
  is_primary: boolean;
  documents: TravelerDocument[];
}

interface PaymentInstallment {
  id: string;
  amount: number;
  paid_at: string;
  payment_method: string;
}

interface BookingDetailsDialogProps {
  booking: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookingUpdated: () => void;
}

export const BookingDetailsPage = ({
  open,
  onOpenChange,
  onBookingUpdated,
}: any) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isTraveler, setIsTraveler] = useState<any>([]);
  const [selectedTravelerId, setSelectedTravelerId] = useState<string | null>(
    null
  );
  const [travelersWithDocs, setTravelersWithDocs] = useState<any[]>([]);

  const { state } = useLocation();
  const navigate = useNavigate();

  const booking = state?.booking;
  const customer = state?.customer;

  // Hardcoded travelers with documents for testing
  const travelers: Traveler[] = [
    {
      id: "1",
      first_name: "Ahmed",
      last_name: "Khan",
      email: "ahmed.khan@email.com",
      phone: "+91 98765 43210",
      date_of_birth: "1985-03-15",
      passport_number: "P1234567",
      nationality: "Indian",
      is_primary: true,
      documents: [
        {
          id: "d1",
          type: "Passport Copy",
          status: "verified",
          uploaded_at: "2024-01-15",
        },
        {
          id: "d2",
          type: "Aadhaar Card",
          status: "verified",
          uploaded_at: "2024-01-16",
        },
        {
          id: "d3",
          type: "Passport Photo",
          status: "verified",
          uploaded_at: "2024-01-17",
        },
        {
          id: "d4",
          type: "Vaccination Certificate",
          status: "verified",
          uploaded_at: "2024-01-18",
        },
      ],
    },
    {
      id: "2",
      first_name: "Fatima",
      last_name: "Khan",
      email: "fatima.khan@email.com",
      phone: "+91 98765 43211",
      date_of_birth: "1987-07-22",
      passport_number: "P1234568",
      nationality: "Indian",
      is_primary: false,
      documents: [
        {
          id: "d5",
          type: "Passport Copy",
          status: "verified",
          uploaded_at: "2024-01-15",
        },
        {
          id: "d6",
          type: "Aadhaar Card",
          status: "pending",
          uploaded_at: "2024-01-16",
        },
        {
          id: "d7",
          type: "Passport Photo",
          status: "verified",
          uploaded_at: "2024-01-17",
        },
        {
          id: "d8",
          type: "Medical Certificate",
          status: "pending",
          uploaded_at: "2024-01-18",
        },
        {
          id: "d9",
          type: "Vaccination Certificate",
          status: "verified",
          uploaded_at: "2024-01-19",
        },
      ],
    },
    {
      id: "3",
      first_name: "Mohammad",
      last_name: "Ali",
      email: "mohammad.ali@email.com",
      phone: "+91 98765 43212",
      date_of_birth: "2010-11-10",
      passport_number: "P1234569",
      nationality: "Indian",
      is_primary: false,
      documents: [
        {
          id: "d10",
          type: "Passport Copy",
          status: "verified",
          uploaded_at: "2024-01-15",
        },
        {
          id: "d11",
          type: "Aadhaar Card",
          status: "rejected",
          uploaded_at: "2024-01-16",
          rejection_reason:
            "Document is not clear. Please upload a high-resolution scan.",
        },
        {
          id: "d12",
          type: "Passport Photo",
          status: "needs_reupload",
          uploaded_at: "2024-01-17",
          rejection_reason: "Photo does not meet size requirements",
        },
        {
          id: "d13",
          type: "Medical Certificate",
          status: "pending",
          uploaded_at: "2024-01-18",
        },
      ],
    },
  ];

  // Hardcoded payment installments
  const installments: PaymentInstallment[] = [
    {
      id: "p1",
      amount: 50000,
      paid_at: "2024-01-10",
      payment_method: "Credit Card",
    },
    { id: "p2", amount: 30000, paid_at: "2024-02-15", payment_method: "UPI" },
  ];

  const totalAmount = booking.total_amount;
  const totalReceived = installments.reduce(
    (sum, inst) => sum + inst.amount,
    0
  );
  const balanceRemaining = totalAmount - totalReceived;

  const updateBookingStatus = async (newStatus: string) => {
    toast({
      title: "Success",
      description: `Booking ${newStatus} successfully`,
    });
    onBookingUpdated();
    onOpenChange(false);
  };

  const handleCancelBooking = async () => {
    toast({
      title: "Refund Initiated",
      description: `Full refund of ₹${totalReceived.toLocaleString()} has been initiated. Processing time: 5-7 business days.`,
    });
    onBookingUpdated();
    setShowCancelDialog(false);
    onOpenChange(false);
  };

  const handlePartialCancel = async (
    travelerId: string,
    travelerName: string
  ) => {
    const refundAmount = Math.floor(totalAmount / travelers.length);
    toast({
      title: "Partial Cancellation",
      description: `${travelerName} has been removed. Refund of ₹${refundAmount.toLocaleString()} initiated.`,
    });
    onBookingUpdated();
  };

  const getDocumentStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      verified: "Verified",
      pending: "Awaiting Review",
      rejected: "Rejected",
      needs_reupload: "Needs Attention",
    };
    return labels[status] || status;
  };

  const fetchTravelersWithDocuments = async () => {
    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Fetch travelers by booking
      const travelerRes = await axios.get(
        `${baseURL}travelers/byBooking/${booking.bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const travelers = travelerRes.data;

      // 2️⃣ Loop & fetch documents for each traveler
      const travelersData = await Promise.all(
        travelers.map(async (traveler: any) => {
          const docRes = await axios.get(
            `${baseURL}documents/byTraveler/${traveler.travelerId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          return {
            traveler,
            documents: docRes.data,
          };
        })
      );

      setTravelersWithDocs(travelersData);
    } catch (error) {
      console.error("Traveler / Document Fetch Error:", error);
    }
  };

  useEffect(() => {
    if (booking.bookingId) {
      fetchTravelersWithDocuments();
    }
  }, [booking.bookingId]);

  return (
    <>
      <div className="space-y-4">
        {/* header */}
        <h1 className="text-3xl font-bold text-primary">
          Booking Details - {booking.bookingId}
        </h1>
        {/* Booking Summary */}
        <Card className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Customer</p>
              <p className="font-medium">
                {customer
                  ? `${customer.firstName} ${customer.lastName}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                variant={
                  booking.booking_status === "confirmed"
                    ? "default"
                    : "secondary"
                }
              >
                {booking.paymentStatus}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Departure</p>
              <p className="font-medium">
                {new Date(booking.departure_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Travelers</p>
              <p className="font-medium">
                {travelersWithDocs.length} person(s)
              </p>
            </div>
          </div>
        </Card>

        {/* Payment Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
              <p className="text-2xl font-bold">
                ₹{booking?.totalAmt?.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Amount Received
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₹{booking?.receivedAmt?.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Balance Remaining
              </p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                ₹{booking?.balanceAmt?.toLocaleString()}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <h4 className="font-medium mb-3">Payment History</h4>
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
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {booking.booking_status === "pending" && (
            <>
              <Button
                onClick={() => setShowConfirmDialog(true)}
                className="flex-1"
              >
                Confirm Booking
              </Button>
              <Button
                onClick={() => setShowRejectDialog(true)}
                variant="destructive"
                className="flex-1"
              >
                Reject Booking
              </Button>
            </>
          )}
          {booking.booking_status === "confirmed" && (
            <Button
              onClick={() => setShowCancelDialog(true)}
              variant="destructive"
            >
              Cancel Entire Booking
            </Button>
          )}
        </div>

        {/* Travelers List with Documents */}
        <Card className="p-6 mb-3">
          <h3 className="text-lg font-semibold">Travelers & Documents</h3>

          {/* NO TRAVELERS STATE */}
          {travelersWithDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">No travelers added yet</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Travelers information will appear here once they are added to
                this booking.
              </p>
            </div>
          ) : (
            <div className="space-y-6 mt-4">
              {travelersWithDocs.map(({ traveler, documents }) => (
                <div
                  key={traveler.travelerId}
                  className="border rounded-lg p-4"
                >
                  {/* Traveler Info (ALWAYS VISIBLE) */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">
                        {traveler.firstName} {traveler.lastName}
                      </h4>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mt-2">
                        <div>
                          <p className="text-muted-foreground">Email</p>
                          <p className="font-medium">{traveler.emailId}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p className="font-medium">{traveler.phoneNumber}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">DOB</p>
                          <p className="font-medium">
                            {new Date(
                              traveler.dateOfBirth
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Passport</p>
                          <p className="font-medium">
                            {traveler.passportNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  {/* Documents (COLLAPSIBLE) */}
                  <Collapsible defaultOpen={false}>
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center justify-between w-full text-sm font-medium">
                        <span className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Documents ({documents.length})
                        </span>
                        <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="mt-4">
                      {documents.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-sm font-medium">
                            No documents uploaded
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Documents will appear here once uploaded for this
                            traveler.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {documents.map((doc: any) => (
                            <TravelerDocumentCard
                              key={doc.documentId}
                              document={{
                                id: doc.documentId,
                                type: doc.documentType,
                                status: doc.documentStatus.toLowerCase(),
                                uploaded_at: doc.createdAt,
                                rejection_reason: doc.remarks,
                              }}
                              onStatusUpdate={() => {}}
                            />
                          ))}
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Confirmation Dialogs */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to confirm this booking? This action will
            notify the customer.
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => updateBookingStatus("confirmed")}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Booking</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to reject this booking? This action will
            notify the customer.
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => updateBookingStatus("rejected")}
            >
              Reject
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Entire Booking</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            This will cancel the booking for all {travelers.length} traveler(s)
            and initiate a refund of ₹{totalReceived.toLocaleString()}. The
            refund will be processed within 5–7 business days.
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Cancel & Refund
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
