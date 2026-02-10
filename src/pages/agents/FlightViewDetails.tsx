import Loader from "@/components/Loader";
import { baseURL } from "@/utils/constant/url";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  PlaneTakeoff,
  PlaneLanding,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const FlightViewDetails = ({ packageId }) => {
  const [basicFlightsDetails, setBasicFlightsDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPackagesByID = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");

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
      <h1 className="text-xl sm:text-1xl font-semibold my-2 text-gray-800 flex items-center gap-2">
        <PlaneTakeoff className="text-primary" />
        Flight Details
      </h1>

      {/* No Data */}
      {basicFlightsDetails.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No Flight Details Found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5">
          {basicFlightsDetails.map((item, index) => (
            // <div
            //   key={index}
            //   className="border rounded-xl shadow-md flex flex-col h-full bg-white"
            // >
            //   {/* Header */}
            //   <div className="p-4 border-b">
            //     <div className="space-y-1 text-base sm:text-lg">
            //       <div className="flex justify-between items-center">
            //         <div className="flex items-center gap-2">
            //           <PlaneTakeoff className="text-primary" />
            //           <span>Flight No: {item?.airlineDetails?.flightCode}</span>

            //           {item.flightClass && (
            //             <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
            //               {item.flightClass} Class
            //             </span>
            //           )}
            //         </div>
            //       </div>

            //       <p className="text-sm text-gray-600">
            //         <span className="font-medium">Flight Name:</span>{" "}
            //         {item.airlineDetails.flightName}
            //       </p>
            //     </div>
            //   </div>

            //   {/* Content */}
            //   <div className="flex-1 p-4 space-y-4 text-sm">
            //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            //       {/* Journey Start */}
            //       <div className="border rounded-lg p-4 bg-gray-50 space-y-2">
            //         <h3 className="font-medium text-primary flex items-center gap-2">
            //           <PlaneTakeoff size={18} />
            //           Journey Start
            //         </h3>

            //         {/* Location */}
            //         <h4 className="font-medium text-primary flex items-center gap-2">
            //           <MapPin size={16} />
            //           Country: <span className="text-gray-700">India</span>
            //         </h4>

            //         <h4 className="font-medium text-primary flex items-center gap-2">
            //           <MapPin size={16} />
            //           State: <span className="text-gray-700">Maharashtra</span>
            //         </h4>

            //         <h4 className="font-medium text-primary flex items-center gap-2">
            //           <MapPin size={16} />
            //           City: <span className="text-gray-700">Mumbai</span>
            //         </h4>

            //         <h4 className="font-medium text-primary flex items-center gap-2">
            //           <Calendar size={16} className="text-gray-500" />
            //           Date:{" "}
            //           <span className="text-gray-700">
            //             {item.departureDate?.split("T")[0]}
            //           </span>
            //         </h4>

            //         <h4 className="font-medium text-primary flex items-center gap-2">
            //           <Clock size={16} className="text-gray-500" />
            //           Time:{" "}
            //           <span className="text-gray-700">
            //             {new Date(item.departureTime).toLocaleTimeString([], {
            //               hour: "2-digit",
            //               minute: "2-digit",
            //             })}
            //           </span>
            //         </h4>
            //       </div>

            //       {/* Journey End */}
            //       <div className="border rounded-lg p-4 bg-gray-50 space-y-2">
            //         <h3 className="font-medium text-primary flex items-center gap-2">
            //           <PlaneLanding size={18} />
            //           Journey End
            //         </h3>

            //         {/* Location */}
            //         <h4 className="font-medium text-primary flex items-center gap-2">
            //           <MapPin size={16} className="text-gray-500" />
            //           Country: <span className="text-gray-700">India</span>
            //         </h4>

            //         <h4 className="font-medium text-primary flex items-center gap-2">
            //           <MapPin size={16} className="text-gray-500" />
            //           State: <span className="text-gray-700">Karnataka</span>
            //         </h4>

            //         <h4 className="font-medium text-primary flex items-center gap-2">
            //           <MapPin size={16} className="text-gray-500" />
            //           City: <span className="text-gray-700">Bengaluru</span>
            //         </h4>

            //         <h4 className="font-medium text-primary flex items-center gap-2">
            //           <Calendar size={16} className="text-gray-500" />
            //           Date:{" "}
            //           <span className="text-gray-700">
            //             {item.arrivalDate?.split("T")[0]}{" "}
            //           </span>
            //         </h4>

            //         <h4 className="font-medium text-primary flex items-center gap-2">
            //           <Clock size={16} className="text-gray-500" />
            //           Time:
            //           <span className="text-gray-700">
            //             {new Date(item.arrivalTime).toLocaleTimeString([], {
            //               hour: "2-digit",
            //               minute: "2-digit",
            //             })}
            //           </span>
            //         </h4>
            //       </div>
            //     </div>
            //   </div>
            // </div>
            <div key={index} className="w-full rounded-lg bg-card">
              <div className="flex gap-3">
                {/* MAIN CARD */}
                <div className="w-full border rounded-lg shadow-sm bg-white">
                  {/* Header */}
                  <div className="px-3 py-2 border-b flex items-center justify-between">
                    <div className="space-y-0.5 text-sm">
                      <div className="flex items-center gap-2">
                        <PlaneTakeoff className="text-primary h-4 w-4" />
                        <span className="font-medium">
                          Flight No: {item?.airlineDetails?.flightCode}
                        </span>

                        {item.flightClass && (
                          <span className="px-2 py-0.5 text-[11px] rounded-full bg-blue-100 text-blue-700 font-medium">
                            {item.flightClass} Class
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Flight Name:</span>{" "}
                        {item.airlineDetails.flightName}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-3 py-2 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Journey Start */}
                      <div className="border rounded-md p-2 bg-gray-50 space-y-1">
                        <h3 className="font-medium text-primary flex items-center gap-1">
                          <PlaneTakeoff size={14} />
                          Journey Start
                        </h3>

                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span className="text-gray-700">
                            {item.departureCityName}, {item.departureStateName},{" "}
                            {item.departureCountryName}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            Date:{" "}
                            <span className="text-gray-700">
                              {item.departureDate?.split("T")[0]}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span className="text-gray-700">
                              {/* {new Date(item.arrivalTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })} */}
                              {item.departureTime}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Journey End */}
                      <div className="border rounded-md p-2 bg-gray-50 space-y-1">
                        <h3 className="font-medium text-primary flex items-center gap-1">
                          <PlaneLanding size={14} />
                          Journey End
                        </h3>

                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span className="text-gray-700">
                            {item.arrivalCityName}, {item.arrivalStateName},{" "}
                            {item.arrivalCountryName}
                          </span>
                        </div>

                        <div className="flex gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span className="text-gray-700">
                              {format(new Date(item.arrivalDate), "yyyy-MM-dd")}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span className="text-gray-700">
                              {/* {new Date(item.arrivalTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })} */}
                              {item.arrivalTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightViewDetails;
