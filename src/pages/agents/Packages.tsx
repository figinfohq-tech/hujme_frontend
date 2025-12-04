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
} from "lucide-react";
import { PackageFormDialog } from "@/components/PackageFormDialog";
import axios from "axios";
import { PackageViewDialog } from "@/components/PackageViewDialog";
import Loader from "@/components/Loader";
import DeleteModal from "@/components/DeleteModal";
import { toast } from "react-toastify";
import { baseURL } from "@/utils/constant/url";
import { useNavigate } from "react-router";

const Packages = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<any>(false);
  const [agentId, setAgentId] = useState<any>("");
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  const navigate = useNavigate();

  const handleAddPackage = () => {
    setSelectedPackage(null);
    setIsFormOpen(true);
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

      const response = await axios.get(
        `${baseURL}packages/byAgent/2`,
        // byAgent
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPackages(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Package Fetch Error:", error);
      setIsLoading(false);
    }
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
          {/* <h2 className="text-2xl font-semibold">My Packages</h2> */}
          {/* <Button
            onClick={handleAddPackage}
            className="bg-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Package
          </Button> */}
          <Button
            onClick={() => navigate("/dashboard/add-package")}
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
            <Button onClick={handleAddPackage}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Package
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">
                      {pkg.name}
                    </CardTitle>
                    <Badge variant={pkg.is_active ? "default" : "secondary"}>
                      {pkg.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        ₹{pkg.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {pkg.duration}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {pkg.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        // onClick={() => handleEditPackage(pkg)}
                        onClick={() =>
                          navigate("/dashboard/add-package", { state: { pkg } })
                        }
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        // onClick={() => handleViewPackage(pkg)}
                        onClick={() => navigate("/dashboard/view-package", { state: { pkg } })}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
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
                  </div>
                </CardContent>
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
      </main>
    </div>
  );
};

export default Packages;
