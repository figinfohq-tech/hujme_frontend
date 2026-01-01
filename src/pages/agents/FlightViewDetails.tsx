import Loader from "@/components/Loader";
import { baseURL } from "@/utils/constant/url";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  PlaneTakeoff,
  PlaneLanding,
  Calendar,
  Clock,
  StickyNote,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FlightViewDetails = ({ packageId }) => {
  const [basicFlightsDetails, setBasicFlightsDetails] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPackagesByID = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${baseURL}package-airlines/byPackage/${packageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBasicFlightsDetails(response.data);

      setIsLoading(false);
    } catch (error) {
      console.error("GET API Error:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (packageId) getPackagesByID();
  }, [packageId]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="w-full px-4">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        <PlaneTakeoff className="text-primary" /> Flight Details
      </h1>

      {/* No Data */}
      {basicFlightsDetails?.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No Flight Details Found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {basicFlightsDetails?.map((item: any, index: number) => (
            <Card key={index} className="shadow-md border rounded-xl">
              <CardHeader>
                <CardTitle className="flex flex-col gap-2 text-lg">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <PlaneTakeoff className="text-primary" />
                      Flight Number: {item.airlineDetails.flightCode}
                    </div>
                    <div className="ml-7">
                      {item.airlineDetails.isActive ? (
                        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 font-medium">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Flight Name */}
                  <div className="text-sm text-gray-600 ml-7">
                    <span className="font-medium">Flight Name:</span>{" "}
                    {item.airlineDetails.flightName}
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                {/* Description Section */}
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="text-primary font-medium mb-1">
                    Description:
                  </h3>
                  <p className="text-gray-700">
                    {item.airlineDetails.description}
                  </p>
                </div>

                {/* Departure */}
                <div className="border rounded-lg p-4 bg-gray-50 space-y-2">
                  <h3 className="font-medium flex items-center gap-2 text-primary">
                    <PlaneTakeoff size={18} />
                    Departure Details
                  </h3>

                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {item.departureDate?.split("T")[0]}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-500" />
                    <p>
                      <span className="font-medium">Time:</span>{" "}
                      {new Date(item.departureTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* Arrival */}
                <div className="border rounded-lg p-4 bg-gray-50 space-y-2">
                  <h3 className="font-medium flex items-center gap-2 text-primary">
                    <PlaneLanding size={18} />
                    Arrival Details
                  </h3>

                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {item.arrivalDate?.split("T")[0]}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-500" />
                    <p>
                      <span className="font-medium">Time:</span>{" "}
                      {new Date(item.arrivalTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
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
