import axios from "axios";
import { Package, ChevronDown } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Loader from "./Loader";
import { baseURL } from "@/utils/constant/url";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const Facilities = ({ pkg, packageId }) => {
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [facilitiesDetails, setFacilitiesDetails] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [featuredFacilities, setFeaturedFacilities] = useState([]);

  const navigate = useNavigate();
  const id = pkg?.packageId;

  const fetchFacilities = async () => {
    try {
      setIsLoader(true);

      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}facilities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFacilities(response.data);
    } catch (error) {
      console.error("GET API Error:", error);
    } finally {
      setIsLoader(false);
    }
  };

  const getFacilitiesPackageByID = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${baseURL}package-facilities/byPackage/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFacilitiesDetails(response.data || []);
    } catch (error) {
      console.error("GET API Error:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  useEffect(() => {
    if (id) getFacilitiesPackageByID();
  }, [id]);

  useEffect(() => {
    if (facilitiesDetails?.length > 0) {
      const preselected = facilitiesDetails.map(
        (item) => item.facilityDetails?.facilityId
      );

      const preFeatured = facilitiesDetails
        .filter((item) => item.featured === true)
        .map((item) => item.facilityDetails?.facilityId);

      setSelectedFacilities(preselected);
      setFeaturedFacilities(preFeatured);
    }
  }, [facilitiesDetails]);

  // Group by category
  const groupedFacilities = useMemo(() => {
    const groups = {};
    facilities.forEach((f) => {
      if (!groups[f.category]) groups[f.category] = [];
      groups[f.category].push(f);
    });
    return groups;
  }, [facilities]);

  // Toggle checkbox
  const toggleFacility = (id) => {
    setSelectedFacilities((prev) => {
      const isSelected = prev.includes(id);

      // Agar unselect ho rahi hai → featured se bhi hatao
      if (isSelected) {
        setFeaturedFacilities((prevFeatured) =>
          prevFeatured.filter((fId) => fId !== id)
        );
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  };

  // -----------------------------
  const oldFacilityIds = useMemo(() => {
    return facilitiesDetails.map((item) => item.facilityDetails?.facilityId);
  }, [facilitiesDetails]);

  const newFacilityIds = selectedFacilities.filter(
    (id) => !oldFacilityIds.includes(id)
  );

  // -----------------------------

  const handleCreatePackage = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token missing — login again");
        return;
      }

      const finalPackageId = pkg ? id : packageId;

      if (!finalPackageId) {
        toast.error("Package missing — please create package first");
        return;
      }

      if (selectedFacilities.length === 0) {
        toast.error("Please select at least one facility");
        return;
      }

      // ✅ Convert arrays → comma separated strings
      const facilityIds = selectedFacilities.join(",");
      const featuredFacilitiesStr = featuredFacilities.join(",");

      await axios.post(`${baseURL}package-facilities/bulk-create`, null, {
        params: {
          packageId: finalPackageId,
          facilityIds,
          featuredFacilities: featuredFacilitiesStr,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(
        pkg
          ? "Facilities updated successfully!"
          : "Facilities created successfully!"
      );

      getFacilitiesPackageByID();
    } catch (error) {
      console.error(error);
      toast.error("Failed to process facilities");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoader) return <Loader />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2">
        <Package className="h-5 w-5 text-primary" />
        <h4 className="text-sm font-semibold">
          Select Package Facilities ({selectedFacilities.length} selected)
        </h4>
      </div>

      {/* Search */}
      <Input
        placeholder="Search facilities..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Category Accordion */}
      <Accordion type="multiple" className="space-y-2">
        {Object.entries(groupedFacilities).map(([category, items]) => {
          const filteredItems = items.filter((f) =>
            f.facilityName.toLowerCase().includes(search.toLowerCase())
          );

          return (
            <AccordionItem
              key={category}
              value={category}
              className="border rounded-lg"
            >
              <AccordionTrigger className="px-4 py-2 font-semibold flex justify-between">
                <div className="flex items-center gap-2">
                  <span>{category}</span>
                  <span className="text-xs text-muted-foreground">
                    {
                      items.filter((f) =>
                        selectedFacilities.includes(f.facilityId)
                      ).length
                    }
                    /{items.length}
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="overflow-x-auto p-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">Select</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Featured</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredItems.map((fItem) => (
                        <TableRow key={fItem.facilityId}>
                          <TableCell>
                            <Checkbox
                              checked={selectedFacilities.includes(
                                fItem.facilityId
                              )}
                              onCheckedChange={() =>
                                toggleFacility(fItem.facilityId)
                              }
                            />
                          </TableCell>

                          <TableCell className="font-medium">
                            {fItem.facilityName}
                          </TableCell>

                          <TableCell className="text-sm text-muted-foreground">
                            {fItem.description}
                          </TableCell>
                          <TableCell className="text-center">
                            <TableCell className="text-center">
                              <Checkbox
                                disabled={
                                  !selectedFacilities.includes(fItem.facilityId)
                                }
                                checked={
                                  selectedFacilities.includes(
                                    fItem.facilityId
                                  ) &&
                                  featuredFacilities.includes(fItem.facilityId)
                                }
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    if (featuredFacilities.length >= 4) {
                                      toast.error(
                                        "Only 4 key facilities are allowed"
                                      );
                                      return;
                                    }
                                    setFeaturedFacilities((prev) => [
                                      ...prev,
                                      fItem.facilityId,
                                    ]);
                                  } else {
                                    setFeaturedFacilities((prev) =>
                                      prev.filter(
                                        (id) => id !== fItem.facilityId
                                      )
                                    );
                                  }
                                }}
                              />
                            </TableCell>
                          </TableCell>
                        </TableRow>
                      ))}

                      {filteredItems.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center py-4 text-sm"
                          >
                            No facilities found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Buttons */}
      <div className="flex gap-2 pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setSelectedFacilities(facilities.map((f) => f.facilityId))
          }
        >
          Select All
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedFacilities([])}
        >
          Clear All
        </Button>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        {pkg ? (
          <Button onClick={handleCreatePackage}>
            {isLoading ? "Updating..." : "Save Package"}
          </Button>
        ) : (
          <Button onClick={handleCreatePackage}>
            {isLoading ? "Creating..." : "Create Package"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Facilities;
