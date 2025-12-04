import { baseURL } from '@/utils/constant/url';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
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
import Loader from '@/components/Loader';

const PackageBasicView = ({packageId}) => {
    const [basicDetails, setBasicDetails] = useState<any>('');
    const [isLoading, setIsLoading] = useState(false);
    const getPackagesByID = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseURL}packages/${packageId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBasicDetails(response.data);
        setIsLoading(false)
      } catch (error) {
        console.error("GET API Error:", error);
        setIsLoading(false)
      }
    };
    useEffect(() => {
     if (packageId) {
        getPackagesByID();
     }
    }, [packageId])
    
    if (isLoading) {
        return <Loader />
    }
      if (!basicDetails) return <div className="text-center p-10 text-red-500">No Package Found</div>;
  return (
      <div className="p-5 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
         Basic Package Details
        </h1>
        <p className="text-gray-600">Overview of selected travel package</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Basic Details */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="w-5 h-5 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700">
            <div><strong>Package Name:</strong> {basicDetails.packageName}</div>
            <div><strong>Type:</strong> {basicDetails.packageType}</div>
            <div><strong>Travel Type:</strong> {basicDetails.travelType}</div>
            <div><strong>Duration:</strong> {basicDetails.duration} Days</div>
            <div className="flex items-center gap-2">
              <strong>Status:</strong>
              <Badge variant="default">{basicDetails.featured ? "Featured" : "Regular"}</Badge>
            </div>
            <div>
              <strong>Description:</strong>
              <p className="text-gray-600">{basicDetails.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Prices */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <DollarSign className="w-5 h-5 text-green-600" />
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700">
            <div><strong>Price:</strong> ₹{basicDetails.price.toLocaleString()}</div>
            <div><strong>Original Price:</strong> ₹{basicDetails.originalPrice.toLocaleString()}</div>
            <div>
              <strong>Notes:</strong>
              <p className="text-gray-600">{basicDetails.notes || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Travel Details */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Plane className="w-5 h-5 text-blue-500" />
              Travel Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700">
            <div>
              <strong>Departure Airline:</strong> {basicDetails.departureAirlines}
            </div>
            <div>
              <strong>Return Airline:</strong> {basicDetails.arrivalAirlines}
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <strong>Departure Date:</strong> {basicDetails.departureDate?.slice(0, 10)}
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <strong>Arrival Date:</strong> {basicDetails.arrivalDate?.slice(0, 10)}
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <strong>Departure Time:</strong> {basicDetails.departureTime?.slice(11, 16)}
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <strong>Arrival Time:</strong> {basicDetails.arrivalTime?.slice(11, 16)}
            </div>

          </CardContent>
        </Card>

        {/* Location */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MapPin className="w-5 h-5 text-red-500" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-700">
            <div><strong>Country:</strong> {basicDetails.countryId}</div>
            <div><strong>State:</strong> {basicDetails.stateName}</div>
            <div><strong>City:</strong> {basicDetails.cityName}</div>
          </CardContent>
        </Card>

        {/* Seat Information */}
        <Card className="shadow-lg rounded-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Info className="w-5 h-5 text-purple-600" />
              Seat Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-5 text-gray-700">
            <div className="p-4 bg-white rounded-xl shadow-sm border">
              <strong>Total Seats:</strong> <br /> {basicDetails.totalSeats}
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border">
              <strong>Booked Seats:</strong> <br /> {basicDetails.bookedSeats}
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border">
              <strong>Available Seats:</strong> <br /> {basicDetails.availableSeats}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PackageBasicView