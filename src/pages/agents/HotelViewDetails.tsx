import { baseURL } from "@/utils/constant/url";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, Hotel, MapPin, Star } from "lucide-react";
import { format } from "date-fns";
import Loader from "@/components/Loader";

const HotelViewDetails = ({ packageId }) => {
  const [basicHotelDetails, setBasicHotelDetails] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPackagesByID = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");

      const response = await axios.get(
        `${baseURL}package-hotels/byPackage/${packageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBasicHotelDetails(response.data);

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
    <div className="w-full p-3">
      <h2 className="text-xl font-bold mb-1 text-gray-800">Hotel Details</h2>

      {basicHotelDetails?.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No Hotel Details Found.
        </p>
      ) : (
        <div>
          <h4 className="text-sm mb-2 font-semibold text-foreground">
            Hotels ({basicHotelDetails?.length})
          </h4>
          {basicHotelDetails?.map((hotel, index) => (
            <div
              key={hotel.id}
              className="rounded-lg border mb-2 bg-card p-4 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded">
                      {hotel?.hotelDetails?.hotelId}
                    </span>
                    <h5 className="font-semibold text-foreground">
                      {hotel?.hotelDetails?.hotelName}
                    </h5>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">
                        {`${hotel?.hotelDetails?.address}, ${hotel?.hotelDetails?.cityName}, ${hotel?.hotelDetails?.stateName}, ${hotel?.hotelDetails?.countryName}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium">
                          {hotel?.hotelDetails?.starRating} Star
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs font-medium text-primary">
                        {hotel?.hotelDetails?.distance} from Haram
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                    <div>
                      <span className="font-medium">Check-in:</span>{" "}
                      {hotel?.checkInDate
                        ? format(hotel?.checkinDate, "PPP")
                        : "-"}{" "}
                      at {hotel?.checkinTime}
                    </div>
                    <div>
                      <span className="font-medium">Check-out:</span>{" "}
                      {hotel?.checkoutDate
                        ? format(hotel?.checkoutDate, "PPP")
                        : "-"}{" "}
                      at {hotel?.checkoutTime}
                    </div>
                    <div>
                      <span className="font-medium">Days Stay:</span>{" "}
                      {hotel?.daysStay}
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

export default HotelViewDetails;
