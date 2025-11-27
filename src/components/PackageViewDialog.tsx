import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PackageViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package: any;
}

export function PackageViewDialog({ open, onOpenChange, package: pkg }: PackageViewDialogProps) {
  if (!pkg) return null;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {pkg.packageName}
              </DialogTitle>
              <DialogDescription className="mt-1 text-md">
                {pkg.packageType} • {pkg.travelType}
              </DialogDescription>
            </div>

            {pkg.featured && (
              <Badge className="bg-yellow-500 mt-3 mr-3 text-black">Featured</Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">

          {/* Description */}
          <section>
            <h3 className="font-semibold text-lg">Description</h3>
            <p className="text-muted-foreground">{pkg.description}</p>
          </section>

          <Separator />

          {/* Main Details */}
          <section className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-1">Price</h4>
              <p className="text-2xl font-bold text-primary">₹{pkg.price.toLocaleString()}</p>
              <p className="text-sm line-through text-muted-foreground">
                ₹{pkg.originalPrice.toLocaleString()}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Duration</h4>
              <p className="text-muted-foreground">{pkg.duration}</p>
            </div>
          </section>

          <Separator />

          {/* Travel Information */}
          <section className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-1">Departure Date</h4>
              <p className="text-muted-foreground">{formatDate(pkg.departureDate)}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Arrival Date</h4>
              <p className="text-muted-foreground">{formatDate(pkg.arrivalDate)}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Departure Time</h4>
              <p className="text-muted-foreground">{formatDateTime(pkg.departureTime)}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Arrival Time</h4>
              <p className="text-muted-foreground">{formatDateTime(pkg.arrivalTime)}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Departure Airlines</h4>
              <p className="text-muted-foreground">{pkg.departureAirlines}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Arrival Airlines</h4>
              <p className="text-muted-foreground">{pkg.arrivalAirlines}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Flight Stops</h4>
              <p className="text-muted-foreground">{pkg.flightStops}</p>
            </div>
          </section>

          <Separator />

          {/* Seats */}
          <section className="grid grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-1">Total Seats</h4>
              <p>{pkg.totalSeats}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Booked Seats</h4>
              <p>{pkg.bookedSeats}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Available Seats</h4>
              <p>{pkg.availableSeats}</p>
            </div>
          </section>

          <Separator />

          {/* Location */}
          <section className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-1">State</h4>
              <p>{pkg.stateName}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">City</h4>
              <p>{pkg.cityName}</p>
            </div>
          </section>

          <Separator />

          {/* Agent Details */}
          <section className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-1">Agent Name</h4>
              <p>{pkg.agentName}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Agent ID</h4>
              <p>{pkg.agentId}</p>
            </div>
          </section>

          <Separator />

          {/* Notes */}
          <section>
            <h3 className="font-semibold text-lg">Notes</h3>
            <p className="text-muted-foreground">{pkg.notes}</p>
          </section>

          <Separator />

          {/* Timestamp */}
          <section className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-1">Created At</h4>
              <p className="text-muted-foreground">{formatDateTime(pkg.createdAt)}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Last Updated</h4>
              <p className="text-muted-foreground">{formatDateTime(pkg.updatedAt)}</p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
