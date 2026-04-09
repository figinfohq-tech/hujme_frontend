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

function LookupsMaster() {
 
  const [facilities1, setFacilities1] = useState<any>([]);
  const [lookups, setLookups] = useState<any>([]);
  const [lookupsTypes, setLookupsTypes] = useState<any>([]);
  const [deleteFacilityId, setDeleteFacilityId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(
    null,
  );

  const navigate = useNavigate();

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

  const toggleLookupStatus = async (type: any) => {
    try {
      const updatedStatus = !type.isActive;

      const payload = {
        lookupType: type.lookupType,
        lookupCode: type.lookupCode,
        lookupName: type.lookupName,
        description: type.description,
        isActive: updatedStatus,
      };

      await axios.put(`${baseURL}lookups/${type.lookupId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(
        `Lookups type ${updatedStatus ? "activated" : "deactivated"} successfully`,
      );

      fetchLookupsType(); // list refresh
    } catch (error) {
      console.error("❌ Update Lookups Type Status Error:", error);
      toast.error("Failed to update Lookups Type status");
    }
  };

  const deleteFacility = async () => {
    try {
      setIsDeleting(true);

      await axios.delete(`${baseURL}lookups/${deleteFacilityId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("lookups deleted successfully");

      setIsDeleteDialogOpen(false);
      setDeleteFacilityId(null);

      fetchLookupsType();
    } catch (error) {
      console.error("❌ Delete lookups API Error:", error);
      toast.error("Failed to delete lookups");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredLookupsType = lookupsTypes.filter((types: any) => {
    const matchesSearch =
      types.lookupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      types.lookupType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      types.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || types.lookupType === filterCategory;
    const matchesType = filterType === "all" || types.lookupType === filterType;

    return matchesSearch && matchesCategory && matchesType;
  });


  const fetchLookups = async () => {
    try {
      const token = sessionStorage.getItem("token");
      setIsLoading(true);
      const response = await axios.get(`${baseURL}lookups/types/distinct`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("lookups ====>", response.data);
      setLookups(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("lookups API Error", error);
      setIsLoading(false);
    }
  };
  const fetchLookupsType = async () => {
    try {
      const token = sessionStorage.getItem("token");
      setIsLoading(true);
      const response = await axios.get(`${baseURL}lookups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("lookups Type ====>", response.data);
      setLookupsTypes(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("lookups Type API Error", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLookups();
    fetchLookupsType();
  }, []);

  console.log("token--->", sessionStorage.getItem("token"));

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in pb-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-primary">Lookups</h2>
            <p className="text-muted-foreground">
              Manage lookups available for package creation
            </p>
          </div>
          <Button
            onClick={() => navigate("/Lookups-add")}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lookups
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-0">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-70">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Lookups types</SelectItem>
                  {lookups.map((lookups: any, index) => {
                    return (
                      <SelectItem key={index} value={lookups}>
                        {lookups}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search Loopkps types..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
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

        {/* Facilities Grid */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            {/* HEADER */}
            <thead className="bg-primary/10 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Lookups Type</th>
                <th className="px-4 py-3 text-left">Lookup Name</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Lookup Code</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {filteredLookupsType.map((type: any) => {
                // const TypeIcon = getTypeIcon(facility.category);

                return (
                  <tr
                    key={type.lookupId}
                    // className={
                    //   index % 2 === 0
                    //     ? "bg-white hover:bg-primary/10"
                    //     : "bg-primary/10 hover:bg-primary/5"
                    // }
                    className="hover:bg-primary/10"
                  >
                    {/* FACILITY NAME */}
                    <td className="px-4 py-3 flex items-center gap-2">
                      {/* <div
                        className={`flex items-center justify-center w-8 h-8 rounded-md ${getCategoryColor(
                          lookupsTypes?.lookupType,
                        )}`}
                      >
                        <TypeIcon className="w-4 h-4" />
                      </div> */}
                      <span className="font-medium">{type?.lookupType}</span>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-4 py-3">
                      <Badge className={getCategoryColor(type?.lookupName)}>
                        {type?.lookupName}
                      </Badge>
                    </td>

                    {/* DESCRIPTION */}
                    <td className="px-4 py-3 text-muted-foreground max-w-[300px] truncate">
                      {type?.description}
                    </td>

                    {/* USAGE */}
                    {/* <td className="px-4 py-3 text-center font-medium">
                      {facility.usageCount}
                    </td> */}

                    {/* STATUS */}
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant={type?.isActive ? "default" : "secondary"}
                        className={
                          type?.isActive ? "bg-green-100 text-green-800" : ""
                        }
                      >
                        {type?.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>

                    <td className="px-4 py-3 text-center">
                      {type?.lookupCode}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleLookupStatus(type)}
                          className={
                            type?.isActive ? "text-red-600" : "text-green-600"
                          }
                        >
                          {type?.isActive ? <>Deactivate</> : <>Activate</>}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigate("/lookups-add", {
                              state: {
                                lookups: type,
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
                            setDeleteFacilityId(type?.lookupId);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-red-600"
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

        {filteredLookupsType.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No Loopkps types found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or Loopkps types
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete lookups</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lookups? This action cannot
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

export default LookupsMaster;
