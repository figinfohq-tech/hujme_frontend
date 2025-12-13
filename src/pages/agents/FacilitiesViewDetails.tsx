import { baseURL } from "@/utils/constant/url";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ListChecks } from "lucide-react";
import Loader from "@/components/Loader";
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

const FacilitiesViewDetails = ({ packageId }) => {
  const [basicFacilitiesDetails, setBasicFacilitiesDetails] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPackagesByID = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${baseURL}package-facilities/byPackage/${packageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBasicFacilitiesDetails(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("GET API Error:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (packageId) getPackagesByID();
  }, [packageId]);

  // Grouping by facilityDetails.category
  const groupedFacilities = basicFacilitiesDetails?.reduce(
    (acc: any, item: any) => {
      const category = item.facilityDetails?.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {}
  );

  if (isLoading) {
    return <Loader />;
  }

  const finalFacilities = basicFacilitiesDetails?.length > 0;

  return (
    <div className="w-full px-4">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <ListChecks className="text-primary w-5 h-5" />
        Facilities
      </h1>

      {/* No Data */}
      {!finalFacilities ? (
        <p className="text-gray-500 text-center py-6 text-sm">
          No Facilities Added
        </p>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-3">
          {Object.keys(groupedFacilities).map((category: string, i: number) => (
            <AccordionItem key={i} value={`category-${i}`}>
              {/* Category Heading */}
              <AccordionTrigger className="text-base font-medium bg-gray-100 px-4 py-2 rounded-sm">
                {category}
              </AccordionTrigger>

              {/* Table */}
              <AccordionContent className="mt-3 bg-white rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Updated</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {groupedFacilities[category].map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.facilityDetails?.facilityId}
                        </TableCell>

                        <TableCell>
                          {item.facilityDetails?.facilityName}
                        </TableCell>

                        <TableCell className="max-w-[250px] truncate">
                          {item.facilityDetails?.description}
                        </TableCell>

                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              item.facilityDetails?.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {item.facilityDetails?.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </TableCell>

                        <TableCell>
                          {item.facilityDetails?.createdAt?.split("T")[0]}
                        </TableCell>

                        <TableCell>
                          {item.facilityDetails?.updatedAt?.split("T")[0]}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default FacilitiesViewDetails;
