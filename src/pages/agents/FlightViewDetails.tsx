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
    <div className="w-full">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {basicFlightsDetails.map((item: any, index: number) => (
            <Card key={index} className="shadow-md border rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PlaneTakeoff className="text-primary" />
                  Flight Code: {item.flightCode}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 text-sm">
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

                {/* Notes */}
                {item.notes && (
                  <div className="flex items-start gap-2 bg-gray-100 p-3 rounded-lg">
                    <StickyNote size={18} className="text-yellow-600" />
                    <p className="text-gray-700">{item.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightViewDetails;
