import axios from "axios";
import { Package, ChevronDown } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
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

const Facilities = () => {
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoader, setIsLoader] = useState(false);

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

  useEffect(() => {
    fetchFacilities();
  }, []);

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
    setSelectedFacilities((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
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
            <AccordionItem key={category} value={category} className="border rounded-lg">
              <AccordionTrigger className="px-4 py-2 font-semibold flex justify-between">
                <div className="flex items-center gap-2">
                  <span>{category}</span>
                  <span className="text-xs text-muted-foreground">
                    {
                      items.filter((f) => selectedFacilities.includes(f.facilityId))
                        .length
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
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredItems.map((fItem) => (
                        <TableRow key={fItem.facilityId}>
                          <TableCell>
                            <Checkbox
                              checked={selectedFacilities.includes(fItem.facilityId)}
                              onCheckedChange={() => toggleFacility(fItem.facilityId)}
                            />
                          </TableCell>

                          <TableCell className="font-medium">
                            {fItem.facilityName}
                          </TableCell>

                          <TableCell className="text-sm text-muted-foreground">
                            {fItem.description}
                          </TableCell>
                        </TableRow>
                      ))}

                      {filteredItems.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-sm">
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

        <Button variant="outline" size="sm" onClick={() => setSelectedFacilities([])}>
          Clear All
        </Button>
      </div>
    </div>
  );
};

export default Facilities;
