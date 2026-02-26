import axios from "axios";
import { Package } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [facilitiesDetails, setFacilitiesDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [featuredFacilities, setFeaturedFacilities] = useState([]);

  const navigate = useNavigate();
  const id = pkg?.packageId;

  // ---------------- FETCH ALL FACILITIES ----------------
  const fetchFacilities = async () => {
    try {
      setIsLoader(true);
      const token = sessionStorage.getItem("token");

      const response = await axios.get(`${baseURL}facilities`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFacilities(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoader(false);
    }
  };

  // ---------------- FETCH PACKAGE FACILITIES ----------------
  const getFacilitiesPackageByID = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.get(
        `${baseURL}package-facilities/byPackage/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setFacilitiesDetails(response.data || []);
    } catch (error) {
      console.error(error);
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
        (item) => item.facilityDetails?.facilityId,
      );

      const preFeatured = facilitiesDetails
        .filter((item) => item.featured)
        .map((item) => item.facilityDetails?.facilityId);

      setSelectedFacilities(preselected);
      setFeaturedFacilities(preFeatured);
    }
  }, [facilitiesDetails]);

  // ---------------- TOGGLE FACILITY ----------------
  const toggleFacility = (facilityId) => {
    setSelectedFacilities((prev) => {
      const isSelected = prev.includes(facilityId);

      if (isSelected) {
        setFeaturedFacilities((prevFeatured) =>
          prevFeatured.filter((id) => id !== facilityId),
        );
        return prev.filter((id) => id !== facilityId);
      }

      return [...prev, facilityId];
    });
  };

  // ---------------- FILTER + SORT ----------------
  const sortedFacilities = useMemo(() => {
    const filtered = facilities.filter((f) =>
      f.facilityName.toLowerCase().includes(search.toLowerCase()),
    );

    const selected = filtered.filter((f) =>
      selectedFacilities.includes(f.facilityId),
    );

    const unselected = filtered.filter(
      (f) => !selectedFacilities.includes(f.facilityId),
    );

    return {
      selected: selected.sort((a, b) =>
        a.facilityName.localeCompare(b.facilityName),
      ),
      unselected: unselected.sort((a, b) =>
        a.facilityName.localeCompare(b.facilityName),
      ),
    };
  }, [facilities, search, selectedFacilities]);

  // ---------------- SAVE ----------------
  const handleCreatePackage = async () => {
    try {
      setIsLoading(true);

      const token = sessionStorage.getItem("token");
      if (!token) return toast.error("Token missing");

      const finalPackageId = pkg ? id : packageId;
      if (!finalPackageId) return toast.error("Package missing — create first");

      if (selectedFacilities.length === 0)
        return toast.error("Select at least one facility");

      await axios.post(`${baseURL}package-facilities/bulk-create`, null, {
        params: {
          packageId: finalPackageId,
          facilityIds: selectedFacilities.join(","),
          featuredFacilities: featuredFacilities.join(","),
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(
        pkg ? "Facilities updated successfully!" : "Facilities created!",
      );

      getFacilitiesPackageByID();
    } catch (error) {
      toast.error("Failed to process facilities");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- RENDER ROW ----------------
  const renderRow = (fItem, isSelected) => (
    <TableRow
      key={fItem.facilityId}
      className={`transition ${
        isSelected ? "bg-primary/5" : "hover:bg-muted/40"
      }`}
    >
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => toggleFacility(fItem.facilityId)}
        />
      </TableCell>

      <TableCell className="font-medium">{fItem.facilityName}</TableCell>

      <TableCell className="text-sm text-muted-foreground">
        {fItem.description}
      </TableCell>

      <TableCell className="text-center">
        <Checkbox
          disabled={!isSelected}
          checked={isSelected && featuredFacilities.includes(fItem.facilityId)}
          onCheckedChange={(checked) => {
            if (checked) {
              if (featuredFacilities.length >= 4) {
                toast.error("Only 4 key facilities allowed");
                return;
              }
              setFeaturedFacilities((prev) => [...prev, fItem.facilityId]);
            } else {
              setFeaturedFacilities((prev) =>
                prev.filter((id) => id !== fItem.facilityId),
              );
            }
          }}
        />
      </TableCell>
    </TableRow>
  );

  if (isLoader) return <Loader />;

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Package className="h-5 w-5 text-primary" />
        <h4 className="text-sm font-semibold flex items-center gap-3">
          Select Package Facilities
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
            {selectedFacilities.length} Selected
          </span>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
            {featuredFacilities.length}/4 Featured
          </span>
        </h4>
      </div>

      {/* SEARCH */}
      <Input
        placeholder="Search facilities..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-auto max-h-[500px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-10">Select</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Featured</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* SELECTED */}
              {sortedFacilities.selected.length > 0 && (
                <>
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="bg-muted/40 text-xs font-semibold uppercase"
                    >
                      Selected Facilities
                    </TableCell>
                  </TableRow>

                  {sortedFacilities.selected.map((f) => renderRow(f, true))}
                </>
              )}

              {/* AVAILABLE */}
              {sortedFacilities.unselected.length > 0 && (
                <>
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="bg-muted/20 text-xs font-semibold uppercase"
                    >
                      Available Facilities
                    </TableCell>
                  </TableRow>

                  {sortedFacilities.unselected.map((f) => renderRow(f, false))}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ACTION BUTTONS */}
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
          onClick={() => {
            setSelectedFacilities([]);
            setFeaturedFacilities([]);
          }}
        >
          Clear All
        </Button>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>

        <Button onClick={handleCreatePackage} disabled={isLoading}>
          {isLoading
            ? pkg
              ? "Updating..."
              : "Creating..."
            : pkg
              ? "Save Package"
              : "Create Package"}
        </Button>
      </div>
    </div>
  );
};

export default Facilities;
