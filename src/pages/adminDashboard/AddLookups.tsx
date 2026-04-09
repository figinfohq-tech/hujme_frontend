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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { baseURL } from "@/utils/constant/url";
import axios from "axios";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

const AddLookups = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [newFacility, setNewFacility] = useState({
    lookupName: "",
    lookupType: "",
    lookupCode: "",
    description: "",
    isActive: true,
  });
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(
    null,
  );

  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  const location = useLocation();

  const lookupsData = location.state?.lookups;
  // const isEditMode = location.state?.isEditMode || false;

  console.log("lookups console.--->", lookupsData);

  useEffect(() => {
    if (lookupsData) {
      setNewFacility({
        lookupName: lookupsData.lookupName,
        lookupType: lookupsData.lookupType,
        lookupCode: lookupsData.lookupCode,
        description: lookupsData.description,
        isActive: lookupsData.isActive,
      });

      setEditingFacilityId(lookupsData.lookupId);
      setIsEditMode(true);
    }
  }, [lookupsData]);

  const handleCreateFacility = async () => {
    if (!newFacility.lookupName || !newFacility.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      lookupName: newFacility.lookupName,
      lookupType: newFacility.lookupType,
      lookupCode: newFacility.lookupCode,
      description: newFacility.description,
      isActive: newFacility.isActive,
    };

    try {
      if (isEditMode) {
        // UPDATE API
        await axios.put(`${baseURL}lookups/${editingFacilityId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("lookup updated successfully");
      } else {
        // CREATE API
        const response = await axios.post(`${baseURL}lookups`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success(
          `${response.data.lookupName} lookup created successfully`,
        );
      }

      setIsEditMode(false);
      setEditingFacilityId(null);

      setNewFacility({
        lookupName: "",
        lookupType: "",
        lookupCode: "",
        description: "",
        isActive: true,
      });
      await navigate("/lookups-master");
    } catch (error) {
      console.error("❌ Facility API Error:", error);
      toast.error("Operation failed");
    }
  };

  const resetFacilityForm = () => {
    setIsEditMode(false);
    setEditingFacilityId(null);
    navigate(-1);
    setNewFacility({
      lookupName: "",
      lookupType: "",
      lookupCode: "",
      description: "",
      isActive: true,
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
              {isEditMode ? "Edit Lookups" : "Add New Lookups"}
            </CardTitle>

            <CardDescription>
              {isEditMode
                ? "Update the Lookups details for agents packages"
                : "Create a new Lookups for agents to include in their packages"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* FACILITY NAME */}
            <div className="space-y-2">
              <Label htmlFor="lookups-name">Lookups Name</Label>
              <Input
                id="lookupsData-name"
                placeholder="Enter lookup name..."
                value={newFacility.lookupName}
                onChange={(e) =>
                  setNewFacility((prev) => ({
                    ...prev,
                    lookupName: e.target.value,
                  }))
                }
              />
            </div>

            {/* CATEGORY + TYPE */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>lookup Type</Label>
                <Input
                  placeholder="Enter lookup type..."
                  value={newFacility.lookupType}
                  onChange={(e) =>
                    setNewFacility((prev) => ({
                      ...prev,
                      lookupType: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Lookup Code</Label>
                <Input
                  placeholder="Enter lookup code..."
                  value={newFacility.lookupCode}
                  onChange={(e) =>
                    setNewFacility((prev) => ({
                      ...prev,
                      lookupCode: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <Label htmlFor="lookupsData-description">Description</Label>

              <Textarea
                id="lookupsData-description"
                placeholder="Describe the lookupsData and its features..."
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
                  id="lookupsData-active"
                  checked={newFacility.isActive}
                  onCheckedChange={(checked) =>
                    setNewFacility((prev) => ({
                      ...prev,
                      isActive: checked,
                    }))
                  }
                />
                <Label htmlFor="lookupsData-active">Active</Label>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col md:flex-row gap-3 pt-4">
              <Button
                onClick={handleCreateFacility}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isEditMode ? "Update Lookups" : "Add Lookups"}
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

export default AddLookups;
