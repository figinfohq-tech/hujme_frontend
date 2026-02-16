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

  const updateViewCount = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const responce = await axios.patch(
        `${baseURL}packages/view-count/${packageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  };
  useEffect(() => {
    if (packageId) {
      updateViewCount();
    }
  }, [packageId]);

  const getPackagesByID = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
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
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-3">
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
        <div className="shadow-md flex gap-20 px-5 rounded-xl border border-gray-200 p-2">
          <div>
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
            </div>
          </div>
          <div>
            {/* Title */}
            <div className="flex items-center text-lg font-semibold text-primary pb-0">
              {/* <DollarSign className="w-5 h-5 text-primary mr-1" /> */}
              <span>₹</span>
              <span className="ml-1">Pricing</span>
            </div>

            {/* Content */}
            <div className="text-gray-700 text-sm mt-2 space-y-2">
              <div className="flex">
                <span className="font-semibold text-primary w-50">
                  Current Price :{" "}
                </span>
                <span className="text-lg font-bold text-primary">
                  ₹{basicDetails?.price?.toLocaleString()}{" "}
                </span>
              </div>

              <div className="flex">
                <span className="font-semibold text-primary w-50">
                  Original Price :{" "}
                </span>
                <span className="text-lg font-bold text-primary">
                  ₹{basicDetails?.originalPrice?.toLocaleString()}
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold text-primary w-50">
                  Minimum Booking Amount :{" "}
                </span>
                <span className="text-lg font-bold text-primary">
                  ₹{basicDetails?.minBookingAmt?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageBasicView;
