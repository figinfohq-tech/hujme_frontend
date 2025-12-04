import { baseURL } from "@/utils/constant/url";
import axios from "axios";
import { CircleDot, Hash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, ListChecks, CalendarClock } from "lucide-react";
import Loader from "@/components/Loader";

const FacilitiesViewDetails = ({ packageId }) => {
  const [basicFacilitiesDetails, setBasicFacilitiesDetails] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [finalFacilities, setFinalFacilities] = useState([]);

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

  const fetchAllFacilitiesByIDs = async (facilitiesList) => {
    try {
      const token = localStorage.getItem("token");

      // Promise.all → to call all hotel APIs in parallel
      const facilitiesRequests = facilitiesList.map((item) =>
        axios.get(`${baseURL}facilities/${item.facilityId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const responses = await Promise.all(facilitiesRequests);

      // Extract data from responses
      const facilitiesData = responses.map((res) => res.data);

      setFinalFacilities(facilitiesData);
      setIsLoading(false);
    } catch (error) {
      console.error("HotelId API Error:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (packageId) getPackagesByID();
  }, [packageId]);

  useEffect(() => {
    if (basicFacilitiesDetails.length > 0) {
      fetchAllFacilitiesByIDs(basicFacilitiesDetails);
    }
  }, [basicFacilitiesDetails]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="w-full">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <ListChecks className="text-primary w-5 h-5" />
        Facilities
      </h1>

      {/* No data */}
      {finalFacilities?.length === 0 ? (
        <p className="text-gray-500 text-center py-6 text-sm">
          No Facilities Added
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {finalFacilities.map((item: any) => (
            <Card
              key={item.facilityId}
              className="shadow-sm rounded-xl border hover:shadow-md transition-all p-3"
            >
              <CardHeader className="p-0">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="text-primary w-4 h-4" />
                  {item.facilityName}
                </CardTitle>

                <p className="text-xs text-gray-500">{item.category}</p>
              </CardHeader>

              <CardContent className="p-0 space-y-3 text-xs text-gray-700">
                {/* Description */}
                <div className="bg-gray-50 p-2 rounded-md text-[11px] leading-relaxed">
                  {item.description}
                </div>

                {/* 3 Column Info */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Facility ID */}
                  <div className="flex items-center gap-2">
                    <Hash className="w-3 h-3 text-primary" />
                    <span>
                      <span className="font-medium">ID:</span> {item.facilityId}
                    </span>
                  </div>

                  {/* Active / Inactive Status */}
                  <div className="flex items-center gap-2">
                    <CircleDot
                      className={`w-3 h-3 ${
                        item.isActive ? "text-green-600" : "text-red-500"
                      }`}
                    />
                    <span className="font-medium">
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Created & Updated Dates */}
                <div className="grid grid-cols-2 gap-3 border-t pt-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-3 h-3 text-primary" />
                    <span className="text-[11px]">
                      <span className="font-medium">Created:</span>{" "}
                      {item.createdAt?.split("T")[0]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-3 h-3 text-primary" />
                    <span className="text-[11px]">
                      <span className="font-medium">Updated:</span>{" "}
                      {item.updatedAt?.split("T")[0]}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacilitiesViewDetails;
