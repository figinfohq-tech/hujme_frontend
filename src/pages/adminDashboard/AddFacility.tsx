import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { baseURL } from "@/utils/constant/url";
import axios from "axios";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

const AddFacility = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [newFacility, setNewFacility] = useState({
    name: "",
    category: "",
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
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(
    null,
  );
  const [categories, setCategories] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  const location = useLocation();

  const facility = location.state?.facility;
  // const isEditMode = location.state?.isEditMode || false;

  useEffect(() => {
    if (facility) {
      setNewFacility({
        name: facility.facilityName,
        category: facility.category,
        type: facility.category,
        description: facility.description,
        isActive: facility.isActive,
        isMandatory: facility.isMandatory ?? false,
      });

      setEditingFacilityId(facility.facilityId);
      setIsEditMode(true);
    }
  }, [facility]);

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
      if (isEditMode) {
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
      await navigate("/facility-master");
    } catch (error) {
      console.error("❌ Facility API Error:", error);
      toast.error("Operation failed");
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
    fetchCategories();
  }, []);

  const resetFacilityForm = () => {
    setIsEditMode(false);
    setEditingFacilityId(null);
    navigate(-1);
    setNewFacility({
      name: "",
      category: "Basic",
      type: "Hotel",
      description: "",
      isActive: true,
      isMandatory: false,
    });
  };

  return (
    <>
      <div className="my-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft /> Back
        </Button>
      </div>
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditMode ? "Edit Facility" : "Add New Facility"}
            </CardTitle>

            <CardDescription>
              {isEditMode
                ? "Update the facility details for agents packages"
                : "Create a new facility for agents to include in their packages"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* FACILITY NAME */}
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

            {/* CATEGORY + TYPE */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* <div className="space-y-2">
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
              </div> */}

              <div className="space-y-2">
                <Label>Category</Label>

                <Select
                  value={newFacility.category || ""}
                  onValueChange={(value) =>
                    setNewFacility((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((item: any, index: any) => (
                      <SelectItem key={index} value={item}>
                        {item}
                      </SelectItem>
                    ))}
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

            {/* DESCRIPTION */}
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

            {/* SWITCHES */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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

            {/* BUTTONS */}
            <div className="flex flex-col md:flex-row gap-3 pt-4">
              <Button
                onClick={handleCreateFacility}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isEditMode ? "Update Facility" : "Add Facility"}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  resetFacilityForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AddFacility;
