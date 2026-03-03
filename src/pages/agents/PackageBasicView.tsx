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
      setBasicDetails(response.data.data);
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
  <div className="p-3 sm:p-4 lg:p-6">
    <div className="space-y-4">

      {/* ---------------- Seat Information ---------------- */}
      <div className="shadow-md rounded-2xl border bg-white p-4 sm:p-5">
        <div className="flex items-center gap-2 text-base sm:text-lg lg:text-xl font-semibold text-primary mb-4">
          <Info className="w-5 h-5" />
          Seat Information
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 flex text-center gap-3 rounded-xl border bg-muted/20 text-sm sm:text-base">
            <span className="font-semibold text-primary">
              Total Seats:
            </span>
            <div className="text-foreground">
              {basicDetails.totalSeats}
            </div>
          </div>

          <div className="p-4 flex text-center gap-3 rounded-xl border bg-muted/20 text-sm sm:text-base">
            <span className="font-semibold text-primary">
              Booked Seats:
            </span>
            <div className="text-foreground">
              {basicDetails.bookedSeats}
            </div>
          </div>

          <div className="p-4 flex text-center gap-3  rounded-xl border bg-muted/20 text-sm sm:text-base">
            <span className="font-semibold text-primary">
              Available Seats:
            </span>
            <div className="text-foreground">
              {basicDetails.availableSeats}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Basic Info + Pricing ---------------- */}
      <div className="shadow-md rounded-2xl border bg-white p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* -------- Basic Information -------- */}
          <div>
            <div className="flex items-center text-base sm:text-lg font-semibold text-primary mb-4">
              <User className="w-5 h-5 mr-2" />
              Basic Information
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-y-3 text-sm sm:text-base">
              <span className="font-semibold text-primary">Package Name:</span>
              <span className="break-words">{basicDetails.packageName}</span>

              <span className="font-semibold text-primary">Type:</span>
              <span>{basicDetails.packageType}</span>

              <span className="font-semibold text-primary">Travel Type:</span>
              <span>{basicDetails.travelType}</span>

              <span className="font-semibold text-primary">Duration:</span>
              <span>{basicDetails.duration} Days</span>
            </div>
          </div>

          {/* -------- Pricing -------- */}
          <div>
            <div className="flex items-center text-base sm:text-lg font-semibold text-primary mb-4">
              <span className="text-lg">₹</span>
              <span className="ml-2">Pricing</span>
            </div>

            <div className="space-y-4 text-sm sm:text-base">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="font-semibold text-primary">
                  Current Price:
                </span>
                <span className="text-lg font-bold text-primary">
                  ₹{basicDetails?.price?.toLocaleString()}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="font-semibold text-primary">
                  Original Price:
                </span>
                <span className="text-lg font-bold text-primary">
                  ₹{basicDetails?.originalPrice?.toLocaleString()}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="font-semibold text-primary">
                  Minimum Booking Amount:
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
  </div>
);
};

export default PackageBasicView;
