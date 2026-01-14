import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Package,
  Users,
  Star,
  TrendingUp,
  Calendar,
  DollarSign,
  Settings,
  Bell,
  Edit,
  Eye,
  UserCog,
  Delete,
  MapPin,
  CalendarDays,
} from "lucide-react";
import { PackageFormDialog } from "@/components/PackageFormDialog";
import axios from "axios";
import { PackageViewDialog } from "@/components/PackageViewDialog";
import Loader from "@/components/Loader";
import DeleteModal from "@/components/DeleteModal";
import { toast } from "react-toastify";
import { baseURL } from "@/utils/constant/url";
import { useNavigate } from "react-router";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { ReviewsDialog } from "@/components/ReviewsDialog";

const Packages = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<any>(false);
  const [agentId, setAgentId] = useState<any>("");
  const [agentLogos, setAgentLogos] = useState<{ [key: string]: string }>({});
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [packageFacilities, setPackageFacilities] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();

  const openReviewsDialog = (pkg: any) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  const handleDeleteViewPackage = (pkg: any) => {
    setSelectedPkg(pkg);
    setDeleteOpen(true); // OPEN MODAL
  };

  const handleViewPackage = (pkg: any) => {
    setSelectedPackage(pkg);
    setIsViewOpen(true);
  };

  const handleEditPackage = (pkg: any) => {
    setSelectedPackage(pkg);
    setIsFormOpen(true);
  };

  const handleDeletePackage = async () => {
    if (!selectedPkg) {
      toast.error("No package selected!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${baseURL}packages/${selectedPkg.packageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Package deleted successfully!");

      // close modal
      setDeleteOpen(false);

      // refresh package list
      fetchPackages();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete package!");
    }
  };

  useEffect(() => {
    fetchAgentID();
  }, []);

  // const agentId = localStorage.getItem("agentId");

  useEffect(() => {
    if (agentId) {
      fetchPackages();
    }
  }, [agentId]);

  const fetchAgentID = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const response = await axios.get(`${baseURL}agents/byUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("agentID", response.data.agentId);
      setAgentId(response.data.agentId);
    } catch (error) {
      console.error("GET API Error:", error);
    }
  };

  const fetchPackages = async () => {
    if (!agentId) return;

    try {
      const token = localStorage.getItem("token");
      const agentID = localStorage.getItem("agentID");
      const response = await axios.get(
        `${baseURL}packages/byAgent/${agentID}`,
        // byAgent
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      setPackages(response.data);
      fetchFacilitiesForPackages(response.data);
      fetchAgentLogos(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Package Fetch Error:", error);
      setIsLoading(false);
    }
  };

  const fetchFacilitiesForPackages = async (packagesData) => {
    const token = localStorage.getItem("token");
    try {
      const facilitiesMap = {};

      await Promise.all(
        packagesData.map(async (pkg) => {
          if (!pkg.packageId) return;

          const res = await axios.get(
            `${baseURL}package-facilities/byPackage/${pkg.packageId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // ONLY featured facilities
          const featuredFacilities = res.data
            .filter((item) => item.featured === true)
            .map((item) => item.facilityDetails?.facilityName)
            .filter(Boolean);

          facilitiesMap[pkg.packageId] = featuredFacilities;
        })
      );

      setPackageFacilities(facilitiesMap);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };

  // fetching logo
  const fetchAgentLogos = async (packagesData: any[]) => {
    const token = localStorage.getItem("token");
    try {
      const agentIds = [
        ...new Set(packagesData.map((pkg) => pkg.agentId).filter(Boolean)),
      ];

      const logoRequests = agentIds.map(async (agentId) => {
        try {
          const res = await axios.get(`${baseURL}agents/get-logo/${agentId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          });

          const imageUrl = URL.createObjectURL(res.data);

          return { agentId, logo: imageUrl };
        } catch (err) {
          return { agentId, logo: null };
        }
      });

      const logos = await Promise.all(logoRequests);

      const logoMap: any = {};
      logos.forEach(({ agentId, logo }) => {
        if (logo) {
          logoMap[agentId] = logo;
        }
      });

      setAgentLogos(logoMap);
    } catch (error) {
      console.error("Error fetching agent logos:", error);
    }
  };

  const togglePackageStatus = async (pkg: any) => {
    const token = localStorage.getItem("token");

    const updatedStatus =
      pkg.packageStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    // optimistic UI update
    setPackages((prev) =>
      prev.map((p) =>
        p.packageId === pkg.packageId
          ? { ...p, packageStatus: updatedStatus }
          : p
      )
    );

    setUpdatingId(pkg.packageId);

    try {
      const payload = {
        agentId: pkg.agentId,
        countryId: pkg.countryId,
        stateId: pkg.stateId,
        cityId: pkg.cityId,
        packageName: pkg.packageName,
        packageType: pkg.packageType,
        travelType: pkg.travelType,
        description: pkg.description,
        price: pkg.price,
        originalPrice: pkg.originalPrice,
        duration: pkg.duration,
        departureDate: pkg.departureDate,
        arrivalDate: pkg.arrivalDate,
        departureTime: pkg.departureTime,
        arrivalTime: pkg.arrivalTime,
        flightStops: pkg.flightStops,
        departureAirlines: pkg.departureAirlines,
        arrivalAirlines: pkg.arrivalAirlines,
        bookedSeats: pkg.bookedSeats,
        totalSeats: pkg.totalSeats,
        availableSeats: pkg.availableSeats,
        featured: pkg.featured,
        notes: pkg.notes,
        packageStatus: updatedStatus, // ONLY CHANGE
      };

      const response = await axios.put(
        `${baseURL}packages/${pkg.packageId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        `Package ${updatedStatus === "ACTIVE" ? "Activated" : "Deactivated"}`
      );
    } catch (error) {
      // rollback
      setPackages((prev) =>
        prev.map((p) =>
          p.packageId === pkg.packageId
            ? { ...p, packageStatus: pkg.packageStatus }
            : p
        )
      );

      toast.error("Failed to update package status");
      fetchPackages();
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeProps = (status: string) => {
    switch (status) {
      case "NEW":
        return {
          label: "New",
          className: "bg-blue-500 text-white hover:bg-blue-500",
        };

      case "ACTIVE":
        return {
          label: "Active",
          variant: "default",
        };

      case "INACTIVE":
        return {
          label: "Inactive",
          variant: "secondary",
        };

      case "SUSPENDED":
        return {
          label: "Suspended",
          className: "bg-red-500 text-white hover:bg-red-500",
        };

      case "COMPLETED":
        return {
          label: "Completed",
          className: "bg-gray-500 text-white hover:bg-gray-500",
        };

      default:
        return {
          label: status,
          variant: "outline",
        };
    }
  };

  const canToggleStatus = (status: string) => {
    return status === "ACTIVE" || status === "INACTIVE" || status === "NEW";
  };

  return (
    <div className="min-h-full rounded-lg bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-3xl font-semibold text-primary">My Packages</h1>
            <p className="text-muted-foreground">
              Manage your packages and bookings
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <hr className="border border-gray-300 mb-2" />

        <div className="flex justify-end mb-3 items-center">
          <Button
            onClick={() => navigate("/add-package")}
            className="bg-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Package
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center mt-25">
            <Loader />
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No packages yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first package to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
            {packages.map((pkg, index) => (
              <Card className="overflow-hidden hover:shadow-elegant py-0 transition-smooth">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  {/* LEFT : IMAGE / LOGO */}
                  <div className="md:col-span-1 h-48 md:h-full flex items-center justify-center bg-white border-r border-border">
                    {/* agency logo */}
                    <a
                      href={pkg.website || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full h-full flex items-center justify-center transition ${
                        pkg.website ? "hover:opacity-90" : "pointer-events-none"
                      }`}
                    >
                      <img
                        src={
                          agentLogos[pkg.agentId]
                            ? agentLogos[pkg.agentId]
                            : "/placeholder.svg"
                        }
                        alt="Agent Logo"
                        className="max-w-[90%] max-h-[90%] object-contain transition-transform duration-300 ease-in-out hover:scale-105 drop-shadow-sm"
                      />
                    </a>
                  </div>

                  {/* RIGHT : DETAILS */}
                  <div className="md:col-span-2 p-3">
                    <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
                      {/* LEFT CONTENT */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg md:text-xl font-semibold text-foreground  mb-1">
                          {/* STATIC FALLBACK */}
                          {pkg.packageName}
                          <Badge variant="secondary" className="text-xs ms-3">
                            {pkg?.packageType}
                          </Badge>
                        </h3>

                        <p className="text-muted-foreground text-sm mb-2 truncate">
                          <a
                            href={pkg.website || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={
                              pkg.website
                                ? "cursor-pointer hover:underline"
                                : "pointer-events-none"
                            }
                          >
                            By {pkg.agentName}
                          </a>
                        </p>

                        {/* LOCATION & DURATION */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {`${pkg?.cityName}, ${pkg?.stateName}`}
                          </span>

                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {`${pkg.duration}`} Days
                          </span>
                        </div>
                        {/* DATES */}
                        {pkg.departureDate && pkg.arrivalDate && (
                          <div className="flex items-center text-sm text-muted-foreground mb-3 flex-wrap">
                            <CalendarDays className="w-4 h-4 mr-1 shrink-0" />
                            <span className="break-words">
                              {format(
                                new Date(pkg.departureDate),
                                "dd MMM yyyy"
                              )}
                              {" – "}
                              {format(new Date(pkg.arrivalDate), "dd MMM yyyy")}
                            </span>
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                          {pkg?.description}
                        </div>

                        {/* FACILITIES (STATIC) */}
                        <div className="flex flex-wrap gap-2">
                          {/* FACILITIES */}
                          {packageFacilities[pkg.packageId]?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {packageFacilities[pkg.packageId].map(
                                (facility, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs whitespace-nowrap"
                                  >
                                    {facility}
                                  </Badge>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* RIGHT CONTENT */}
                      <div className="flex md:flex-col items-start md:items-end gap-2 shrink-0">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const badgeProps = getStatusBadgeProps(
                              pkg.packageStatus
                            );

                            return (
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={badgeProps.variant}
                                  className={badgeProps.className}
                                >
                                  {badgeProps.label}
                                </Badge>

                                {canToggleStatus(pkg.packageStatus) && (
                                  <Switch
                                    checked={pkg.packageStatus === "ACTIVE"}
                                    disabled={updatingId === pkg.packageId}
                                    onCheckedChange={() =>
                                      togglePackageStatus(pkg)
                                    }
                                  />
                                )}
                              </div>
                            );
                          })()}
                        </div>

                        {/* <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">4.8</span>
                          <span className="text-sm text-muted-foreground">
                            (120 reviews)
                          </span>
                        </div> */}
                        <div
                          className="flex items-center gap-1 cursor-pointer"
                          onClick={() => openReviewsDialog(pkg)}
                        >
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{pkg.rating}</span>
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            ({pkg.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PRICE + ACTIONS */}
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">
                            ₹{pkg.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{pkg.originalPrice.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Per person (all inclusive)
                        </p>
                      </div>

                      {/* 🔥 EXISTING BUTTONS & LOGIC UNCHANGED */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          // onClick={() => handleViewPackage(pkg)}
                          onClick={() =>
                            navigate("/view-package", { state: { pkg } })
                          }
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>

                        {/* EDIT & DELETE → ONLY IF NOT COMPLETED */}
                        {pkg.packageStatus !== "COMPLETED" && (
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate("/add-package", { state: { pkg } })
                              }
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteViewPackage(pkg)}
                            >
                              <Delete className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        {/* Dialog Component */}
        <PackageFormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          package={selectedPackage}
        />

        <PackageViewDialog
          open={isViewOpen}
          onOpenChange={setIsViewOpen}
          package={selectedPackage}
        />

        <DeleteModal
          open={deleteOpen}
          setOpen={setDeleteOpen}
          onDelete={handleDeletePackage}
        />

        {selectedPackage && (
          <ReviewsDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            packageId={selectedPackage.packageId}
            packageName={selectedPackage.packageName}
            agentName={selectedPackage.agentName}
            agentId={selectedPackage.agentId}
          />
        )}
      </main>
    </div>
  );
};

export default Packages;
