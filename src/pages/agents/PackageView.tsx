import { ArrowLeft } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PackageBasicView from "./PackageBasicView";
import HotelViewDetails from "./HotelViewDetails";
import FlightViewDetails from "./FlightViewDetails";
import FacilitiesViewDetails from "./FacilitiesViewDetails";

const PackageView = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const pkg = state?.pkg;

  const token = localStorage.getItem("token");

  return (
    <div className="min-h-full rounded-lg border py-4 bg-background">
      <main className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/packages")}
          className="mb-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 " />
          Back to Packages
        </Button>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic View Details</TabsTrigger>
            <TabsTrigger value="hotel">Hotel View Details </TabsTrigger>
            <TabsTrigger value="flights">Flight View Details</TabsTrigger>
            <TabsTrigger value="facilities">Facilities View</TabsTrigger>
          </TabsList>
          {/* Basic View details */}
          <TabsContent value="basic">
            <PackageBasicView packageId={pkg.packageId} />
          </TabsContent>
          {/* Basic View details */}
          {/* Hotel View Details */}
          <TabsContent value="hotel">
            <HotelViewDetails packageId={pkg.packageId} />
          </TabsContent>
          {/* Hotel View Details */}
          {/* Flight View Details */}
          <TabsContent value="flights">
            <FlightViewDetails packageId={pkg.packageId} />
          </TabsContent>
          {/* Flight View Details */}
          {/* Facilities View Details */}

          <TabsContent value="facilities">
            <FacilitiesViewDetails packageId={pkg.packageId} />
          </TabsContent>
          {/* Facilities View Details */}
        </Tabs>
      </main>
    </div>
  );
};

export default PackageView;
