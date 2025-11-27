import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Users, MapPin, Phone, Mail } from 'lucide-react';
// import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BookingConfirmationProps {
  bookingId: string;
  onClose: () => void;
}

interface BookingDetails {
  id: string;
  booking_reference: string;
  package_id: string;
  total_amount: number;
  booking_status: string;
  payment_status: string;
  departure_date: string;
  created_at: string;
  travelers: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    passport_number: string;
    nationality: string;
    is_primary: boolean;
  }>;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ bookingId, onClose }) => {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // useEffect(() => {
  //   fetchBookingDetails();
  // }, [bookingId]);

//   const fetchBookingDetails = async () => {
//     try {
//       setIsLoading(true);
      
//       // Fetch booking details
//       const { data: bookingData, error: bookingError } = await supabase
//         .from('bookings')
//         .select('*')
//         .eq('id', bookingId)
//         .single();

//       if (bookingError) throw bookingError;

//       // Fetch travelers
//       const { data: travelersData, error: travelersError } = await supabase
//         .from('travelers')
//         .select('*')
//         .eq('booking_id', bookingId)
//         .order('is_primary', { ascending: false });

//       if (travelersError) throw travelersError;

//       setBooking({
//         ...bookingData,
//         travelers: travelersData,
//       });

//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch booking details",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading booking details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center p-8">
            <h2 className="text-xl font-semibold text-destructive">Booking Not Found</h2>
            <p className="text-muted-foreground mt-2">Unable to retrieve booking details.</p>
            <Button onClick={onClose} className="mt-4">Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="text-center p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-800">Booking Confirmed!</h1>
              <p className="text-green-700 mt-2">
                Thank you for your booking. Your confirmation details are below.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Booking Summary</span>
            <Badge variant={booking.payment_status === 'paid' ? 'default' : 'secondary'}>
              {booking.payment_status.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Booking Reference
                </h3>
                <p className="text-xl font-bold text-primary">{booking.booking_reference}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Package
                </h3>
                <p className="text-lg">{booking.package_id}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm text-muted-foreground">Departure Date: </span>
                  <span className="font-semibold">
                    {new Date(booking.departure_date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Booking Status
                </h3>
                <Badge variant="outline" className="text-sm">
                  {booking.booking_status.toUpperCase()}
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Total Amount
                </h3>
                <p className="text-2xl font-bold">₹{booking.total_amount.toLocaleString()}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {booking.travelers.length} Traveler{booking.travelers.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Travelers Details */}
      <Card>
        <CardHeader>
          <CardTitle>Traveler Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {booking.travelers.map((traveler, index) => (
              <div key={traveler.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">
                    {traveler.is_primary ? 'Primary Traveler' : `Traveler ${index + 1}`}
                  </h4>
                  {traveler.is_primary && (
                    <Badge variant="secondary" className="text-xs">Primary</Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name: </span>
                    {traveler.first_name} {traveler.last_name}
                  </div>
                  <div>
                    <span className="font-medium">Date of Birth: </span>
                    {new Date(traveler.date_of_birth).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                    {traveler.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                    {traveler.phone}
                  </div>
                  {traveler.passport_number && (
                    <div>
                      <span className="font-medium">Passport: </span>
                      {traveler.passport_number}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Nationality: </span>
                    {traveler.nationality}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card>
        <CardHeader>
          <CardTitle>Important Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <p>
              Please save this confirmation for your records. You'll need your booking reference 
              ({booking.booking_reference}) for all future communications.
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <p>
              Our travel consultant will contact you within 24 hours to confirm the itinerary details 
              and provide further assistance.
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <p>
              Please ensure all travelers have valid passports and necessary visas if traveling internationally.
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <p>
              A detailed itinerary and travel documents will be sent to your email address 
              closer to your departure date.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onClose} variant="outline" className="flex-1">
          Continue Browsing
        </Button>
        <Button 
          onClick={() => window.print()} 
          variant="default" 
          className="flex-1"
        >
          Print Confirmation
        </Button>
      </div>
    </div>
  );
};