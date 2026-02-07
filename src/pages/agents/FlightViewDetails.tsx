import Loader from "@/components/Loader";
import { baseURL } from "@/utils/constant/url";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { PlaneTakeoff, PlaneLanding, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FlightViewDetails = ({ packageId }) => {
  const [basicFlightsDetails, setBasicFlightsDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPackagesByID = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${baseURL}package-airlines/byPackage/${packageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setBasicFlightsDetails(response.data);
    } catch (error) {
      console.error("GET API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (packageId) getPackagesByID();
  }, [packageId]);

  if (isLoading) return <Loader />;

  return (
    <div className="w-full px-3 sm:px-4">
      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-semibold my-2 text-gray-800 flex items-center gap-2">
        <PlaneTakeoff className="text-primary" />
        Flight Details
      </h1>

      {/* No Data */}
      {basicFlightsDetails.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No Flight Details Found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-5">
          {basicFlightsDetails.map((item, index) => (
            <Card
              key={index}
              className="border rounded-xl shadow-md flex flex-col h-full"
            >
              {/* Header */}
              <CardHeader>
                <CardTitle className="space-y-2 text-base sm:text-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <PlaneTakeoff className="text-primary" />
                      <span>Flight No: {item?.airlineDetails?.flightCode}</span>
                      {/* Flight Class Badge */}
                      {item.flightClass && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                          {item.flightClass} Class
                        </span>
                      )}
                    </div>

                    {item.airlineDetails.isActive ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
                        Inactive
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Flight Name:</span>{" "}
                    {item.airlineDetails.flightName}
                  </p>
                </CardTitle>
              </CardHeader>

              {/* Content */}
              <CardContent className="flex-1 space-y-4 text-sm">
                {/* Description */}
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-medium text-primary mb-1">Description</h3>
                  <p className="text-gray-700">
                    {item.airlineDetails.description}
                  </p>
                </div>

                {/* Journey Sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Journey Start */}
                  <div className="border rounded-lg p-4 bg-gray-50 space-y-2">
                    <h3 className="font-medium text-primary flex items-center gap-2">
                      <PlaneTakeoff size={18} />
                      Journey Start
                    </h3>

                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      <span>
                        <strong>Date:</strong>{" "}
                        {item.departureDate?.split("T")[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span>
                        <strong>Time:</strong>{" "}
                        {new Date(item.departureTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Journey End */}
                  <div className="border rounded-lg p-4 bg-gray-50 space-y-2">
                    <h3 className="font-medium text-primary flex items-center gap-2">
                      <PlaneLanding size={18} />
                      Journey End
                    </h3>

                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      <span>
                        <strong>Date:</strong> {item.arrivalDate?.split("T")[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span>
                        <strong>Time:</strong>{" "}
                        {new Date(item.arrivalTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
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

export default FlightViewDetails;
