import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Building,
  Plus,
  Edit,
  Trash2,
  Hotel,
  Car,
  Utensils,
  MapPin,
  Shield,
  Star,
  Search,
  Loader2,
} from "lucide-react";
import { baseURL } from "@/utils/constant/url";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import { useNavigate } from "react-router";

interface Facility {
  id: string;
  name: string;
  category: "Basic" | "Premium" | "Luxury";
  type: "Hotel" | "Transport" | "Meals" | "Guide" | "Insurance" | "Other";
  description: string;
  isActive: boolean;
  isMandatory: boolean;
  usageCount: number;
}

function FacilityMaster() {
  const [facilities1, setFacilities1] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [deleteFacilityId, setDeleteFacilityId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Hotel":
        return Hotel;
      case "Transport":
        return Car;
      case "Travel":
        return Car;
      case "Meals":
        return Utensils;
      case "Guide":
        return MapPin;
      case "Guidance":
        return MapPin;
      case "Insurance":
        return Shield;
      default:
        return Building;
    }
  };

  // const getCategoryColor = (category: string) => {
  //   switch (category) {
  //     case 'Basic': return 'bg-blue-100 text-blue-800'
  //     case 'Premium': return 'bg-purple-100 text-purple-800'
  //     case 'Luxury': return 'bg-yellow-100 text-yellow-800'
  //     default: return 'bg-gray-100 text-gray-800'
  //   }
  // }

  const getCategoryColor = (category) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-purple-100 text-purple-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-orange-100 text-orange-800",
      "bg-teal-100 text-teal-800",
    ];

    let index = 0;

    for (let i = 0; i < category.length; i++) {
      index += category.charCodeAt(i);
    }

    return colors[index % colors.length];
  };

  const token = sessionStorage.getItem("token");

  const toggleFacilityStatus = async (facility: any) => {
    try {
      const updatedStatus = !facility.isActive;

      const payload = {
        facilityName: facility.facilityName,
        description: facility.description,
        category: facility.category,
        isActive: updatedStatus,
      };

      await axios.put(`${baseURL}facilities/${facility.facilityId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(
        `Facility ${updatedStatus ? "activated" : "deactivated"} successfully`,
      );

      fetchFacilities(); // list refresh
    } catch (error) {
      console.error("❌ Update Facility Status Error:", error);
      toast.error("Failed to update facility status");
    }
  };

  const deleteFacility = async () => {
    const facility = facilities1.find(
      (f: any) => f.facilityId === deleteFacilityId,
    );

    if (!deleteFacilityId) return;

    if (facility?.isMandatory) {
      toast.error("Cannot delete mandatory facility");
      return;
    }

    try {
      setIsDeleting(true);

      await axios.delete(`${baseURL}facilities/${deleteFacilityId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Facility deleted successfully");

      setIsDeleteDialogOpen(false);
      setDeleteFacilityId(null);

      fetchFacilities();
    } catch (error) {
      console.error("❌ Delete Facility API Error:", error);
      toast.error("Failed to delete facility");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredFacilities = facilities1.filter((facility) => {
    const matchesSearch =
      facility.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || facility.category === filterCategory;
    const matchesType =
      filterType === "all" || facility.category === filterType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const fetchFacilities = async () => {
    try {
      const token = sessionStorage.getItem("token");
      setIsLoading(true);
      const response = await axios.get(`${baseURL}facilities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFacilities1(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Documents API Error", error);
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = sessionStorage.getItem("token");
      setIsLoading(true);
      const response = await axios.get(
        `${baseURL}facilities/categories/distinct`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCategories(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Categories API Error", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
    fetchCategories();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in pb-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-primary">Facilities</h2>
            <p className="text-muted-foreground">
              Manage facilities available for package creation
            </p>
          </div>

          <Button
            onClick={() => navigate("/facility-add")}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Facility
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-0">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search facilities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-70">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((facilities: any, index: number) => {
                    return (
                      <>
                        <SelectItem key={index} value={facilities}>
                          {facilities}
                        </SelectItem>
                      </>
                    );
                  })}
                </SelectContent>
              </Select>

              {/* <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Meals">Meals</SelectItem>
                  <SelectItem value="Guide">Guide</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-0">
            <CardContent className="flex items-center gap-4 p-4">
              <Building className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Facilities
                </p>
                <p className="text-2xl font-bold">{facilities1?.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardContent className="flex items-center gap-4 p-4">
              <Star className="w-8 h-8 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">
                  {facilities1.filter((f) => f.isActive).length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardContent className="flex items-center gap-4 p-4">
              <Shield className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Mandatory</p>
                <p className="text-2xl font-bold">
                  {facilities1.filter((f) => f.isMandatory).length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardContent className="flex items-center gap-4 p-4">
              <Star className="w-8 h-8 text-primary/90" />
              <div>
                <p className="text-sm text-muted-foreground">Most Used</p>
                <p className="text-lg font-bold">245</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Facilities Grid */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            {/* HEADER */}
            <thead className="bg-primary/10 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Facility</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-center">Usage</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Mandatory</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {filteredFacilities.map((facility: any) => {
                const TypeIcon = getTypeIcon(facility.category);

                return (
                  <tr
                    key={facility.facilityId}
                    // className={
                    //   index % 2 === 0
                    //     ? "bg-white hover:bg-primary/10"
                    //     : "bg-primary/10 hover:bg-primary/5"
                    // }
                    className="hover:bg-primary/10"
                  >
                    {/* FACILITY NAME */}
                    <td className="px-4 py-3 flex items-center gap-2">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-md ${getCategoryColor(
                          facility.category,
                        )}`}
                      >
                        <TypeIcon className="w-4 h-4" />
                      </div>
                      <span className="font-medium">
                        {facility.facilityName}
                      </span>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-4 py-3">
                      <Badge className={getCategoryColor(facility.category)}>
                        {facility.category}
                      </Badge>
                    </td>

                    {/* DESCRIPTION */}
                    <td className="px-4 py-3 text-muted-foreground max-w-[300px] truncate">
                      {facility.description}
                    </td>

                    {/* USAGE */}
                    <td className="px-4 py-3 text-center font-medium">
                      {facility.usageCount}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant={facility.isActive ? "default" : "secondary"}
                        className={
                          facility.isActive ? "bg-green-100 text-green-800" : ""
                        }
                      >
                        {facility.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>

                    {/* MANDATORY */}
                    <td className="px-4 py-3 text-center">
                      {facility.isMandatory && (
                        <Badge variant="destructive">Mandatory</Badge>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFacilityStatus(facility)}
                          className={
                            facility.isActive
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          {facility.isActive ? <>Deactivate</> : <>Activate</>}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigate("/facility-add", {
                              state: {
                                facility: facility,
                                isEditMode: true,
                              },
                            });
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDeleteFacilityId(facility.facilityId);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-red-600"
                          disabled={facility.isMandatory}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredFacilities.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No facilities found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Facility</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this facility? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={deleteFacility}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default FacilityMaster;
