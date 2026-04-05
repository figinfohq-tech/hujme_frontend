import { ArrowLeft } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PackageBasicView from "./PackageBasicView";
import HotelViewDetails from "./HotelViewDetails";
import FlightViewDetails from "./FlightViewDetails";
import FacilitiesViewDetails from "./FacilitiesViewDetails";
import GalleryView from "./GalleryView";

const PackageView = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const pkg = state?.pkg;
  console.log("bsdfmndsbf==>", pkg);
  

  const token = sessionStorage.getItem("token");

  return (
    <div className="min-h-full rounded-lg border py-4 bg-background">
      <main className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 " />
          Back to Packages
        </Button>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic View Details</TabsTrigger>
            <TabsTrigger value="hotel">Hotel View Details </TabsTrigger>
            <TabsTrigger value="flights">Flight View Details</TabsTrigger>
            <TabsTrigger value="facilities">Facilities View</TabsTrigger>
            <TabsTrigger value="gallery">Gallery View</TabsTrigger>
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
          <TabsContent value="gallery">
            <GalleryView package={pkg} />
          </TabsContent>
          {/* Facilities View Details */}
        </Tabs>
      </main>
    </div>
  );
};

export default PackageView;
