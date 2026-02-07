import { baseURL } from "@/utils/constant/url";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Plane,
  Clock,
  MapPin,
  User,
  DollarSign,
  Info,
} from "lucide-react";
import Loader from "@/components/Loader";

const PackageBasicView = ({ packageId }) => {
  const [basicDetails, setBasicDetails] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const getPackagesByID = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}packages/${packageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBasicDetails(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("GET API Error:", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (packageId) {
      getPackagesByID();
    }
  }, [packageId]);

  if (isLoading) {
    return <Loader />;
  }
  if (!basicDetails)
    return (
      <div className="text-center p-10 text-red-500">No Package Found</div>
    );
  return (
    <div className="p-2">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Seat Information */}
        <div className="shadow-lg p-2 border rounded-xl lg:col-span-2">
          <div>
            <div className="flex items-center mb-2 font-semibold text-primary gap-2 text-xl">
              <Info className="w-5 h-5 text-primary" />
              Seat Information
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-gray-700">
            <div className="p-2 bg-white rounded-xl shadow-sm border">
              <span className="font-semibold text-primary">Total Seats : </span>{" "}
              {basicDetails.totalSeats}
            </div>
            <div className="p-2 bg-white rounded-xl shadow-sm border">
              <span className="font-semibold text-primary">
                Booked Seats :{" "}
              </span>{" "}
              {basicDetails.bookedSeats}
            </div>
            <div className="p-2 bg-white rounded-xl shadow-sm border">
              <span className="font-semibold text-primary">
                Available Seats :{" "}
              </span>{" "}
              {basicDetails.availableSeats}
            </div>
          </div>
        </div>
        {/* Basic Details */}
        <div className="shadow-md rounded-xl border border-gray-200 p-2">
          {/* Title */}
          <div className="flex items-center text-lg font-semibold text-primary pb-0 pt-0">
            <User className="w-5 h-5 text-primary mr-1" />
            Basic Information
          </div>

          {/* Content */}
          <div className="grid grid-cols-[150px_1fr] gap-y-2 text-sm mt-2">
            <span className="font-semibold text-primary">Package Name:</span>
            <span>{basicDetails.packageName}</span>

            <span className="font-semibold text-primary">Type:</span>
            <span>{basicDetails.packageType}</span>

            <span className="font-semibold text-primary">Travel Type:</span>
            <span>{basicDetails.travelType}</span>

            <span className="font-semibold text-primary">Duration:</span>
            <span>{basicDetails.duration} Days</span>

            <span className="font-semibold text-primary">Description:</span>
            <p className="text-gray-600">{basicDetails.description}</p>
          </div>
        </div>

        {/* Prices */}
        <div className="shadow-md rounded-xl border border-gray-200 p-2">
          {/* Title */}
          <div className="flex items-center text-lg font-semibold text-primary pb-0">
            {/* <DollarSign className="w-5 h-5 text-primary mr-1" /> */}
            <span>₹</span>
            <span className="ml-1">Pricing</span>
          </div>

          {/* Content */}
          <div className="text-gray-700 text-sm mt-2 space-y-2">
            <div className="flex">
              <span className="font-semibold text-primary w-50">Price : </span>₹
              {basicDetails.price.toLocaleString()}
            </div>

            <div className="flex">
              <span className="font-semibold text-primary w-50">
                Original Price :{" "}
              </span>
              ₹{basicDetails.originalPrice.toLocaleString()}
            </div>

            <div>
              <span className="font-semibold text-primary">Notes : </span>
              <span className="text-gray-600 leading-tight">
                {basicDetails.notes || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Travel Details */}
        <div className="shadow-md rounded-xl border border-gray-200 p-2">
          {/* Title */}
          <div className="flex items-center text-lg font-semibold text-primary pb-0">
            <Plane className="w-5 h-5 text-primary mr-1" />
            Travel Details
          </div>

          {/* Content */}
          <div className="text-gray-700 text-sm mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-semibold text-primary w-40">
                Departure Date:
              </span>
              {basicDetails.departureDate?.slice(0, 10)}
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-semibold text-primary w-40">
                Arrival Date:
              </span>
              {basicDetails.arrivalDate?.slice(0, 10)}
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-semibold text-primary w-40">
                Departure Time:
              </span>
              {basicDetails.departureTime?.slice(11, 16)}
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-semibold text-primary w-40">
                Arrival Time:
              </span>
              {basicDetails.arrivalTime?.slice(11, 16)}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="shadow-lg rounded-xl border border-gray-200 p-2">
          {/* Title */}
          <div className="flex items-center text-primary text-lg font-semibold pb-0 gap-1">
            <MapPin className="w-5 h-5 text-primary" />
            Location
          </div>

          {/* Content */}
          <div className="text-gray-700 text-sm mt-2 space-y-2">
            <div className="flex">
              <span className="font-semibold text-primary w-50">Country:</span>{" "}
              {basicDetails.countryId}
            </div>

            <div className="flex">
              <span className="font-semibold text-primary w-50">State:</span>{" "}
              {basicDetails.stateName}
            </div>

            <div className="flex">
              <span className="font-semibold text-primary w-50">City:</span>{" "}
              {basicDetails.cityName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageBasicView;
