import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Users,
  AlertCircle,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import Loader from "@/components/Loader";
import { useNavigate } from "react-router";
import { NotificationDialog } from "@/components/NotificationDialog";
// import { BookingDetailsDialog } from "./BookingDetailsDialog";
// import { NotificationDialog } from "./NotificationDialog";

interface Booking {
  id: string;
  booking_reference: string;
  departure_date: string;
  total_amount: number;
  payment_status: string;
  booking_status: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  travelers_count: number;
}

interface Package {
  id: string;
  package_id: string;
  package_name: string;
  destination: string;
  departure_date: string;
  available_seats: number;
  total_seats: number;
  bookings: Booking[];
}

export const ManageBookings = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPackages, setExpandedPackages] = useState<Set<string>>(
    new Set()
  );
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [agentPackages, setAgentPackages] = useState<any[]>([]);
  const [packageBookings, setPackageBookings] = useState<any[]>([]);
  const [usersMap, setUsersMap] = useState<Record<number, any>>({});

  const navigate = useNavigate();

  // Fetch Booking By agent
  const fetchBookingByAgent = async () => {
    try {
      const token = localStorage.getItem("token");
      const agentId = localStorage.getItem("agentID");
      const response = await axios.get(
        `${baseURL}packages/byAgent/${agentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAgentPackages(response.data);
    } catch (error) {
      console.error("Package Fetch Error:", error);
    }
  };
  // Fetch Booking By agent
  // Fetch Booking By agent
  const fetchBookingByPackage = async (packageIds: number[]) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const requests = packageIds.map((id) =>
        axios.get(`${baseURL}bookings/byPackage/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const responses = await Promise.all(requests);

      const allBookings = responses.flatMap((res) => res.data);
      setLoading(false);
      setPackageBookings(allBookings);
    } catch (error) {
      console.error("Booking Fetch Error:", error);
      setLoading(false);
    }
  };

  // Fetch Booking By agent

  // fetching user
  const fetchUsersByIds = async (userIds: number[]) => {
    try {
      const token = localStorage.getItem("token");

      const requests = userIds.map((id) =>
        axios.get(`${baseURL}users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const responses = await Promise.all(requests);

      const usersObject: Record<number, any> = {};
      responses.forEach((res) => {
        usersObject[res.data.userId] = res.data;
      });

      setUsersMap(usersObject);
    } catch (error) {
      console.error("User Fetch Error:", error);
    }
  };

  useEffect(() => {
    if (packageBookings.length > 0) {
      const uniqueUserIds = [...new Set(packageBookings.map((b) => b.userId))];

      fetchUsersByIds(uniqueUserIds);
    }
  }, [packageBookings]);

  // fetching user

  useEffect(() => {
    fetchBookingByAgent();
  }, []);

  useEffect(() => {
    if (agentPackages.length > 0) {
      const packageIds = agentPackages.map((pkg) => pkg.packageId);
      fetchBookingByPackage(packageIds);
    }
  }, [agentPackages]);

  const getBookingsByPackageId = (packageId: number) => {
    return packageBookings.filter((booking) => booking.packageId === packageId);
  };

  const togglePackage = (packageId: string) => {
    const newExpanded = new Set(expandedPackages);
    if (newExpanded.has(packageId)) {
      newExpanded.delete(packageId);
    } else {
      newExpanded.add(packageId);
    }
    setExpandedPackages(newExpanded);
  };

  const handleViewBooking = (booking: Booking) => {
    const user = usersMap[booking.userId];
    navigate("/bookings-details", {
      state: {
        booking,
        customer: user
          ? {
              firstName: user.firstName,
              lastName: user.lastName,
            }
          : null,
      },
    });
  };

  const handleSendNotification = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowNotificationDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      pending: "outline",
      confirmed: "default",
      rejected: "destructive",
      cancelled: "secondary",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const filteredPackages = agentPackages.filter((pkg) =>
    pkg.packageName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">My Bookings</h1>
        <p className="text-muted-foreground mt-2">
          Track and manage your pilgrimage bookings
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {!filteredPackages ? (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No packages found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPackages.map((pkg) => {
            const bookings = getBookingsByPackageId(pkg.packageId);

            return (
              <Card key={pkg.packageId} className="p-0">
                <Collapsible
                  open={expandedPackages.has(pkg.packageId)}
                  onOpenChange={() => togglePackage(pkg.packageId)}
                >
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="cursor-pointer hover:bg-primary/20 rounded transition-colors py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {expandedPackages.has(pkg.packageId) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                          <div className="text-left">
                            <CardTitle className="text-lg">
                              {pkg.packageName}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {pkg.departureAirlines} • {pkg.arrivalAirlines}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {pkg?.bookings?.length} Bookings
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {pkg.availableSeats}/{pkg.bookedSeats} seats
                              available
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="flex justify-end mb-4">
                        <Button
                          onClick={() => handleSendNotification(pkg)}
                          variant="outline"
                          size="sm"
                          className="hover:bg-primary/30"
                        >
                          Send Notification
                        </Button>
                      </div>

                      {bookings.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No bookings yet for this package
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2 font-medium">
                                  Booking ID
                                </th>
                                <th className="text-left p-2 font-medium">
                                  Customer
                                </th>
                                <th className="text-left p-2 font-medium">
                                  Travelers
                                </th>
                                <th className="text-left p-2 font-medium">
                                  Amount
                                </th>
                                <th className="text-left p-2 font-medium">
                                  Booking Status
                                </th>
                                <th className="text-left p-2 font-medium">
                                  Payment Status
                                </th>
                                <th className="text-left p-2 font-medium">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {bookings?.map((booking, index) => (
                                <tr
                                  key={booking.bookingId}
                                  className="border-b hover:bg-primary/20"
                                >
                                  <td className="p-2">
                                    {booking?.bookingRef
                                      ? booking?.bookingRef
                                      : `BK-00${index}`}
                                  </td>
                                  <td className="p-2">
                                    {usersMap[booking.userId]
                                      ? `${
                                          usersMap[booking.userId].firstName
                                        } ${usersMap[booking.userId].lastName}`
                                      : "Loading..."}
                                  </td>
                                  <td className="p-2">
                                    {booking.travelerCount}
                                  </td>
                                  <td className="p-2">₹{booking.totalAmt}</td>
                                  <td className="p-2">
                                    {getStatusBadge(
                                      booking?.bookingStatus
                                        ? booking?.bookingStatus
                                        : "NA"
                                    )}
                                  </td>
                                  <td className="p-2">
                                    {getStatusBadge(
                                      booking?.paymentStatus
                                        ? booking?.paymentStatus
                                        : "NA"
                                    )}
                                  </td>
                                  <td className="p-2">
                                    <Button
                                      onClick={() => handleViewBooking(booking)}
                                      variant="ghost"
                                      size="sm"
                                      className="hover:bg-primary/30"
                                    >
                                      View Details
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      )}

      {/* {selectedBooking && (
        <BookingDetailsDialog
          booking={selectedBooking}
          open={showBookingDialog}
          onOpenChange={setShowBookingDialog}
          onBookingUpdated={() => {}}
        />
      )} */}

      {selectedPackage && (
        <NotificationDialog
          package={selectedPackage}
          open={showNotificationDialog}
          onOpenChange={setShowNotificationDialog}
        />
      )}
    </div>
  );
};
