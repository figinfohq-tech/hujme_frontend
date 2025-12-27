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
    <div className="p-5 min-h-screen">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Details */}
        <div className="shadow-md rounded-xl border border-gray-200 p-4">
          {/* Title */}
          <div className="flex items-center text-lg font-semibold text-primary pb-0">
            <User className="w-5 h-5 text-primary mr-1" />
            Basic Information
          </div>

          {/* Content */}
          <div className="text-gray-700 text-sm mt-2 space-y-2">
            <div className="flex">
              <span className="font-semibold text-primary w-50">
                Package Name:
              </span>
              <span>{basicDetails.packageName}</span>
            </div>

            <div className="flex">
              <span className="font-semibold text-primary w-50">Type:</span>
              <span>{basicDetails.packageType}</span>
            </div>

            <div className="flex">
              <span className="font-semibold text-primary w-50">
                Travel Type:
              </span>
              <span>{basicDetails.travelType}</span>
            </div>

            <div className="flex">
              <span className="font-semibold text-primary w-50">Duration:</span>
              <span>{basicDetails.duration} Days</span>
            </div>

            <div className="flex items-center">
              <span className="font-semibold text-primary w-50">Status:</span>
              <Badge>{basicDetails.featured ? "Featured" : "Regular"}</Badge>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-primary">Description:</span>
              <p className="text-gray-600 leading-tight mt-0.5 text-sm">
                {basicDetails.description}
              </p>
            </div>
          </div>
        </div>

        {/* Prices */}
        <div className="shadow-md rounded-xl border border-gray-200 p-4">
          {/* Title */}
          <div className="flex items-center text-lg font-semibold text-primary pb-0">
            <DollarSign className="w-5 h-5 text-primary mr-1" />
            Pricing
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
              <p className="text-gray-600 mt-0.5 leading-tight">
                {basicDetails.notes || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Travel Details */}
        <div className="shadow-md rounded-xl border border-gray-200 p-4">
          {/* Title */}
          <div className="flex items-center text-lg font-semibold text-primary pb-0">
            <Plane className="w-5 h-5 text-primary mr-1" />
            Travel Details
          </div>

          {/* Content */}
          <div className="text-gray-700 text-sm mt-2 space-y-2">
            <div className="flex">
              <span className="font-semibold text-primary w-50">
                Departure Airline:{" "}
              </span>
              {basicDetails.departureAirlines}
            </div>

            <div className="flex">
              <span className="font-semibold text-primary w-50">
                Return Airline:{" "}
              </span>
              {basicDetails.arrivalAirlines}
            </div>

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
        <div className="shadow-lg rounded-xl border border-gray-200 p-4">
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

        {/* Seat Information */}
        <Card className="shadow-lg rounded-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-primary gap-2 text-xl">
              <Info className="w-5 h-5 text-primary" />
              Seat Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-5 text-gray-700">
            <div className="p-4 bg-white rounded-xl shadow-sm border">
              <span className="font-semibold text-primary">Total Seats : </span>{" "}
              <br /> {basicDetails.totalSeats}
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border">
              <span className="font-semibold text-primary">
                Booked Seats :{" "}
              </span>{" "}
              <br /> {basicDetails.bookedSeats}
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border">
              <span className="font-semibold text-primary">
                Available Seats :{" "}
              </span>{" "}
              <br /> {basicDetails.availableSeats}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PackageBasicView;
