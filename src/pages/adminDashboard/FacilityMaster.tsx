import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
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
} from "lucide-react";
import { baseURL } from "@/utils/constant/url";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

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
  const [facilities, setFacilities] = useState<Facility[]>([
    {
      id: "1",
      name: "Luxury Hotel Makkah",
      category: "Luxury",
      type: "Hotel",
      description: "5-star accommodation near Haram with premium amenities",
      isActive: true,
      isMandatory: false,
      usageCount: 87,
    },
    {
      id: "2",
      name: "VIP Transport Service",
      category: "Premium",
      type: "Transport",
      description: "Air-conditioned buses with professional drivers",
      isActive: true,
      isMandatory: true,
      usageCount: 156,
    },
    {
      id: "3",
      name: "Halal Buffet Package",
      category: "Basic",
      type: "Meals",
      description: "Three meals daily with international and local cuisine",
      isActive: true,
      isMandatory: false,
      usageCount: 203,
    },
    {
      id: "4",
      name: "Expert Islamic Guide",
      category: "Premium",
      type: "Guide",
      description: "Knowledgeable guide for religious sites and rituals",
      isActive: true,
      isMandatory: false,
      usageCount: 134,
    },
    {
      id: "5",
      name: "Travel Insurance",
      category: "Basic",
      type: "Insurance",
      description: "Comprehensive medical and travel coverage",
      isActive: true,
      isMandatory: true,
      usageCount: 245,
    },
  ]);
  const [facilities1, setFacilities1] = useState<any>([]);
  const [deleteFacilityId, setDeleteFacilityId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(
    null,
  );

  const [newFacility, setNewFacility] = useState({
    name: "",
    category: "Basic" as "Basic" | "Premium" | "Luxury",
    type: "Hotel" as
      | "Hotel"
      | "Transport"
      | "Meals"
      | "Guide"
      | "Insurance"
      | "Other",
    description: "",
    isActive: true,
    isMandatory: false,
  });

  const resetFacilityForm = () => {
    setIsEditMode(false);
    setEditingFacilityId(null);

    setNewFacility({
      name: "",
      category: "Basic",
      type: "Hotel",
      description: "",
      isActive: true,
      isMandatory: false,
    });
  };

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

  // const handleCreateFacility = () => {
  //   if (!newFacility.name || !newFacility.description) {
  //     toast.error("Please fill in all required fields");
  //     return;
  //   }

  //   const facility: Facility = {
  //     id: Date.now().toString(),
  //     ...newFacility,
  //     usageCount: 0,
  //   };

  //   console.log("✅ Creating new facility:", facility);
  //   setFacilities((prev) => [...prev, facility]);
  //   setIsCreateDialogOpen(false);
  //   setNewFacility({
  //     name: "",
  //     category: "Basic",
  //     type: "Hotel",
  //     description: "",
  //     isActive: true,
  //     isMandatory: false,
  //   });
  //   toast.success(`${facility.name} facility created successfully`);
  // };

  // const toggleFacilityStatus = (facilityId: string) => {
  //   setFacilities((prev) =>
  //     prev.map((facility) =>
  //       facility.id === facilityId
  //         ? { ...facility, isActive: !facility.isActive }
  //         : facility,
  //     ),
  //   );

  //   const facility = facilities.find((f) => f.id === facilityId);
  //   console.log(`🔄 Toggled facility status: ${facility?.name}`);
  //   toast.success(
  //     `Facility ${facility?.isActive ? "deactivated" : "activated"} successfully`,
  //   );
  // };

  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmYWl6YWhtZWQ3MTcwQGdtYWlsLmNvbSIsInVzZXJJZCI6NTMsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzczMzA5OTA0LCJleHAiOjE3NzMzOTYzMDR9.zPxgffrrtt9Os5fvACGk8SkPM0OEriOupGaaeYYgEoU";
  // const token = sessionStorage.getItem("token");

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

  const deleteFacility = async (facilityId: string) => {
    const facility = facilities1.find((f: any) => f.facilityId === facilityId);
    if (!deleteFacilityId) return;
    if (facility?.isMandatory) {
      toast.error("Cannot delete mandatory facility");
      return;
    }

    try {
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
      // const token = sessionStorage.getItem("token");
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

  const handleCreateFacility = async () => {
    if (!newFacility.name || !newFacility.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      facilityName: newFacility.name,
      description: newFacility.description,
      category: newFacility.category,
      isActive: newFacility.isActive,
    };

    try {
      if (isEditMode && editingFacilityId) {
        // UPDATE API
        await axios.put(`${baseURL}facilities/${editingFacilityId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Facility updated successfully");
      } else {
        // CREATE API
        const response = await axios.post(`${baseURL}facilities`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success(
          `${response.data.facilityName} facility created successfully`,
        );
      }

      setIsCreateDialogOpen(false);
      setIsEditMode(false);
      setEditingFacilityId(null);

      setNewFacility({
        name: "",
        category: "Basic",
        type: "Hotel",
        description: "",
        isActive: true,
        isMandatory: false,
      });

      fetchFacilities();
    } catch (error) {
      console.error("❌ Facility API Error:", error);
      toast.error("Operation failed");
    }
  };

  useEffect(() => {
    fetchFacilities();
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
            <h2 className="text-3xl font-bold text-primary">Facility Master</h2>
            <p className="text-muted-foreground">
              Manage facilities available for package creation
            </p>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={(open) => {
              setIsCreateDialogOpen(open);

              if (!open) {
                resetFacilityForm();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Facility
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Edit Facility" : "Add New Facility"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode
                    ? "Update the facility details for agents packages"
                    : "Create a new facility for agents to include in their packages"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facility-name">Facility Name</Label>
                  <Input
                    id="facility-name"
                    placeholder="e.g., Premium Hotel Medina"
                    value={newFacility.name}
                    onChange={(e) =>
                      setNewFacility((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={newFacility.category}
                      onValueChange={(value: "Basic" | "Premium" | "Luxury") =>
                        setNewFacility((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="Luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={newFacility.type}
                      onValueChange={(
                        value:
                          | "Hotel"
                          | "Transport"
                          | "Meals"
                          | "Guide"
                          | "Insurance"
                          | "Other",
                      ) => setNewFacility((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hotel">Hotel</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="Meals">Meals</SelectItem>
                        <SelectItem value="Guide">Guide</SelectItem>
                        <SelectItem value="Insurance">Insurance</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facility-description">Description</Label>
                  <Textarea
                    id="facility-description"
                    placeholder="Describe the facility and its features..."
                    value={newFacility.description}
                    onChange={(e) =>
                      setNewFacility((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="facility-active"
                      checked={newFacility.isActive}
                      onCheckedChange={(checked) =>
                        setNewFacility((prev) => ({
                          ...prev,
                          isActive: checked,
                        }))
                      }
                    />
                    <Label htmlFor="facility-active">Active</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="facility-mandatory"
                      checked={newFacility.isMandatory}
                      onCheckedChange={(checked) =>
                        setNewFacility((prev) => ({
                          ...prev,
                          isMandatory: checked,
                        }))
                      }
                    />
                    <Label htmlFor="facility-mandatory">Mandatory</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreateFacility}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {isEditMode ? "Update Facility" : "Add Facility"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetFacilityForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
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
              </Select>
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
                <p className="text-lg font-bold">
                  {
                    facilities.reduce((prev, current) =>
                      prev.usageCount > current.usageCount ? prev : current,
                    ).usageCount
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility: any) => {
            // const TypeIcon = getTypeIcon(facility.type)
            const TypeIcon = getTypeIcon(facility.category);

            return (
              <Card
                key={facility.facilityId}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${getCategoryColor(facility.category)}`}
                      >
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {facility.facilityName}
                        </CardTitle>
                        <CardDescription>{facility.category}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={facility.isActive ? "default" : "secondary"}
                        className={
                          facility.isActive ? "bg-green-100 text-green-800" : ""
                        }
                      >
                        {facility.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {facility.isMandatory && (
                        <Badge variant="destructive">Mandatory</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <Badge className={getCategoryColor(facility.category)}>
                      {facility.category}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {facility.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Usage Count:</span>
                    <span className="font-medium">
                      {facility.usageCount} packages
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setIsEditMode(true);
                        setEditingFacilityId(facility.facilityId);

                        setNewFacility({
                          name: facility.facilityName,
                          category: facility.category,
                          type: facility.category,
                          description: facility.description,
                          isActive: facility.isActive,
                          isMandatory: facility.isMandatory ?? false,
                        });

                        setIsCreateDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFacilityStatus(facility)}
                      className={
                        facility.isActive
                          ? "text-red-600 hover:text-red-700"
                          : "text-green-600 hover:text-green-700"
                      }
                    >
                      {facility.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeleteFacilityId(facility.facilityId);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-red-600 hover:text-red-700"
                      disabled={facility.isMandatory}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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

            <Button variant="destructive" onClick={() => deleteFacility()}>
              Yes, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default FacilityMaster;
