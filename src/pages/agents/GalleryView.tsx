import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Eye, ZoomOut, ZoomIn } from "lucide-react";
import { baseURL } from "@/utils/constant/url";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Loader from "@/components/Loader";

const GalleryView = (pkg) => {
  const [fileResponses, setFileResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageZoomed, setImageZoomed] = useState(false);

  const token = sessionStorage.getItem("token");

  const packageId = pkg.package.packageId;
  const agentId = pkg.package.agentId;

  const handleView = (index) => {
    setSelectedIndex(index);
    setOpen(true);
  };

  // ✅ FETCH IMAGES
  const fetchImagesTemp = async () => {
    try {
      // 👉 First API
      setLoading(true);
      const res = await axios.get(
        `${baseURL}package-gallery/byPackageId/${packageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = res.data || [];

      // 👉 Loop with GET API
      const promises = data.map((item) => {
        const fileName = item.filePath.split("/").pop();

        return axios.get(`${baseURL}package-gallery/files`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            fileName: fileName, // ✅ only filename
            agentId: agentId,
            packageId: packageId,
          },
          responseType: "blob",
        });
      });

      // 👉 Wait all
      const results = await Promise.all(promises);

      // 👉 Extract data
      const finalData = results.map((res, index) => {
        return {
          ...data[index], // ✅ first API ka pura object (id, etc.)
          url: URL.createObjectURL(res.data), // ✅ image from second API
        };
      });

      setFileResponses(finalData);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImagesTemp();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4">
      {/*  SINGLE BUTTON (PRO CLEAN WAY) */}
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold mb-1 text-gray-800">
            Gallery Details ({fileResponses.length})
          </h2>
        </div>
      </div>

      {/*  IMAGES */}
      <div className="mt-4">
        {fileResponses.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="text-lg font-medium">No images found</p>
            <p className="text-sm">Upload images to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
            {fileResponses.map((img, index) => (
              <div
                key={img.id}
                className="group relative rounded-2xl overflow-hidden shadow-md bg-white dark:bg-gray-900"
              >
                {/* Image */}
                <img
                  src={img.url}
                  alt="gallery"
                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition" />

                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-2">
                  {/* View */}
                  <Button
                    size="icon"
                    className="rounded-full shadow"
                    onClick={() => handleView(index)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Carousel dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl w-full p-4 flex items-center reletive justify-center">
          <div className="w-full">
            <Carousel opts={{ startIndex: selectedIndex }} className="w-full">
              <CarouselContent>
                {fileResponses.map((img, index) => (
                  <CarouselItem key={index}>
                    {/* Center Container */}
                    <div className="flex items-center justify-center h-[75vh]">
                      {/* Image */}
                      <img
                        src={img.url}
                        alt="preview"
                        className={`max-h-full max-w-full object-contain rounded-xl transition-transform duration-300 ${
                          imageZoomed
                            ? "scale-150 cursor-zoom-out"
                            : "scale-100 cursor-zoom-in"
                        }`}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation Buttons */}
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
          {/* Zoom Button */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-14 right-6 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full"
            onClick={() => setImageZoomed(!imageZoomed)}
          >
            {imageZoomed ? (
              <ZoomOut className="h-4 w-4 text-white" />
            ) : (
              <ZoomIn className="h-4 w-4 text-white" />
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryView;
