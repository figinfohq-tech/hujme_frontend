import { baseURL } from "@/utils/constant/url";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, Hotel, MapPin } from "lucide-react";
import { format } from "date-fns";
import Loader from "@/components/Loader";

const HotelViewDetails = ({ packageId }) => {
  const [basicHotelDetails, setBasicHotelDetails] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [finalHotels, setFinalHotels] = useState([]);

  const getPackagesByID = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${baseURL}package-hotels/byPackage/${packageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBasicHotelDetails(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("GET API Error:", error);
      setIsLoading(false);
    }
  };

  const fetchAllHotelsByIDs = async (hotelList) => {
    try {
      const token = localStorage.getItem("token");

      // Promise.all → to call all hotel APIs in parallel
      const hotelRequests = hotelList.map((item) =>
        axios.get(`${baseURL}hotels/${item.hotelId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const responses = await Promise.all(hotelRequests);

      // Extract data from responses
      const hotelsData = responses.map((res) => res.data);

      setFinalHotels(hotelsData);
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
    if (basicHotelDetails.length > 0) {
      fetchAllHotelsByIDs(basicHotelDetails);
    }
  }, [basicHotelDetails]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Hotel Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {finalHotels?.map((hotel, index) => (
          <div
            key={index}
            className="border rounded-xl shadow-sm hover:shadow-md p-4 transition-all bg-white"
          >
            {/* Title */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-primary">
                {hotel.hotelName}
              </h3>
              <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full h-5">
                <span className="text-[10px]">⭐</span>
                <span>{Number(hotel.starRating)}</span>
              </span>
            </div>

            {/* Details */}
            <div className="mt-3 text-sm space-y-2">
              {/* Address */}
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-500 mt-1" />
                <p className="text-gray-700">{hotel.address}</p>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2">
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium">{hotel.phone}</p>

                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium break-all">{hotel.email}</p>

                <p className="text-xs text-gray-500">Postal</p>
                <p className="font-medium">{hotel.postalCode}</p>
              </div>

              {/* Website */}
              <a
                href={hotel.website}
                target="_blank"
                className="text-primary text-xs underline"
              >
                View Website
              </a>
            </div>

            {/* Footer */}
            <div className="pt-3 mt-3 border-t text-xs text-gray-500 flex justify-between">
              <p>Created: {hotel.createdAt?.slice(0, 10)}</p>
              <p>Updated: {hotel.updatedAt?.slice(0, 10)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelViewDetails;
