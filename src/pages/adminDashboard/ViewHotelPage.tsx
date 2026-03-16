import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import GoogleMap from "@/components/ui/google-map";

export default function ViewHotelPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedHotel = location.state?.hotel;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">{rating}</span>
      </div>
    );
  };

  if (!selectedHotel) {
    return <div className="p-6">No hotel data found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft /> Back
        </Button>

        <div>
          <h2 className="text-xl font-semibold">Hotel Details</h2>
          <p className="text-sm text-muted-foreground">
            View complete hotel information
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Top Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-sm">
                  Hotel Name
                </Label>
                <p className="text-lg font-semibold">
                  {selectedHotel.hotelName}
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">Address</Label>
                <p className="text-sm">{selectedHotel.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-sm">City</Label>
                  <p className="text-sm">{selectedHotel.cityName}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground text-sm">State</Label>
                  <p className="text-sm">{selectedHotel.stateName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Country
                  </Label>
                  <p className="text-sm">{selectedHotel.countryName}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground text-sm">
                    Postal Code
                  </Label>
                  <p className="text-sm">{selectedHotel.postalCode}</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-sm">Phone</Label>
                <p className="text-sm">{selectedHotel.phone}</p>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">Email</Label>
                <p className="text-sm">{selectedHotel.email}</p>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">Website</Label>
                <p className="text-sm">{selectedHotel.website}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Star Rating
                  </Label>

                  <div className="flex items-center gap-2">
                    {renderStars(selectedHotel.starRating)}
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground text-sm">Rooms</Label>

                  <p className="text-sm">{selectedHotel.number_of_rooms}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Check-in
                  </Label>
                  <p className="text-sm">{selectedHotel.checkin_time}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground text-sm">
                    Check-out
                  </Label>
                  <p className="text-sm">{selectedHotel.checkout_time}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-sm">Amenities</Label>
              <p className="text-sm">{selectedHotel.amenities}</p>
            </div>

            <div>
              <Label className="text-muted-foreground text-sm">
                Description
              </Label>
              <p className="text-sm">{selectedHotel.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-sm">
                  Latitude
                </Label>
                <p className="text-sm">{selectedHotel.latitude}</p>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">
                  Longitude
                </Label>
                <p className="text-sm">{selectedHotel.longitude}</p>
              </div>
            </div>

            {/* Map */}
            {selectedHotel.latitude && selectedHotel.longitude && (
              <div>
                <Label className="text-muted-foreground text-sm">
                  Location Map
                </Label>

                <div className="mt-2">
                  <GoogleMap
                    latitude={selectedHotel.latitude}
                    longitude={selectedHotel.longitude}
                    hotelName={selectedHotel.hotelName}
                    height="300px"
                  />
                </div>
              </div>
            )}

            {/* Created / Updated */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label className="text-muted-foreground text-sm">Created</Label>

                <p className="text-sm">
                  {new Date(selectedHotel.created_at).toLocaleString()}
                </p>

                <p className="text-xs text-muted-foreground">
                  by {selectedHotel.created_by}
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground text-sm">
                  Last Updated
                </Label>

                <p className="text-sm">
                  {new Date(selectedHotel.updated_at).toLocaleString()}
                </p>

                <p className="text-xs text-muted-foreground">
                  by {selectedHotel.updated_by}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
