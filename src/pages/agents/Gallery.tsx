import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Pencil, Eye, ZoomOut, ZoomIn } from "lucide-react";
import { baseURL } from "@/utils/constant/url";
// import JSZip from "jszip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import { data } from "react-router";
import PreviewCarousel from "@/components/PreviewCarousel";

const Gallery = ({ pkg, packageId }) => {
  const [fileResponses, setFileResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [imgLimit, setImgLimit] = useState();

  const token = sessionStorage.getItem("token");

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
        `${baseURL}package-gallery/byPackageId/${packageId.packageId ?? pkg.packageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = res.data?.data || [];

      // 👉 Loop with GET API
      const promises = data.map((item) => {
        const fileName = item.filePath.split("/").pop();

        return axios.get(`${baseURL}package-gallery/files`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            fileName: fileName, // ✅ only filename
            agentId: packageId.agentId ?? pkg.agentId,
            packageId: packageId.packageId ?? pkg.packageId,
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
    fetchPackageImgLimit();
    fetchImagesTemp();
  }, []);

  const fetchPackageImgLimit = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${baseURL}lookups/PACKAGE_IMG_LIMIT`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setImgLimit(response.data[0].lookupName);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // ✅ CORE UPLOAD FUNCTION (NO setTimeout)
  const uploadImage = async (selectedFile) => {
    if (!selectedFile) return;

    if (imgLimit == fileResponses.length) {
      return toast.error(
        `Upload limit reached (${imgLimit} images). Please delete an image to add a new one.`,
      );
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post(
        `${baseURL}package-gallery/upload?agentId=${packageId.agentId ?? pkg.agentId}&packageId=${packageId.packageId ?? pkg.packageId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchImagesTemp(); // 🔥 refresh after upload
      toast.success("Image uploaded successfully.");
    } catch (err) {
      console.error("Upload Error:", err.response?.data || err);
      toast.error("Image upload failed. Please try again.");
    } finally {
    }
  };

  // ✅ FILE SELECT → DIRECT UPLOAD
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    uploadImage(selectedFile); // 🔥 direct call
  };

  // ✅ DELETE

  const confirmDelete = async () => {
    if (!selectedDeleteId) return;

    try {
      setIsLoading(true);

      await axios.delete(`${baseURL}package-gallery/${selectedDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDeleteDialogOpen(false);
      setSelectedDeleteId(null);

      fetchImagesTemp(); // refresh
    } catch (err) {
      console.error("Delete Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: Number) => {
    try {
      setIsLoading(true);
      await axios.delete(`${baseURL}package-gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchImagesTemp();
    } catch (err) {
      console.error("Delete Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const imageUrls =
    fileResponses.length > 0
      ? fileResponses.map((item) => item.url)
      : ["/placeholder.svg"];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4">
      {/*  SINGLE BUTTON (PRO CLEAN WAY) */}
      <div className="flex justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            Added Images ({fileResponses.length})
          </h4>
          <p className="text-sm text-muted-foreground">
            {fileResponses.length} / {imgLimit} images uploaded. You can add
            more images until the limit is reached.
          </p>
        </div>
        <input
          type="file"
          id="fileUpload"
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          onClick={() => document.getElementById("fileUpload").click()}
          disabled={loading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isLoading ? "Uploading..." : "Upload Image"}
        </Button>
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

                  {/* Delete */}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="rounded-full shadow"
                    onClick={() => {
                      setSelectedDeleteId(img.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
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
          {/* <div className="w-full">
            <Carousel opts={{ startIndex: selectedIndex }} className="w-full">
              <CarouselContent>
                {fileResponses.map((img, index) => (
                  <CarouselItem key={index}>
                   
                    <div className="flex items-center justify-center h-[75vh]">
                      
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

              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div> */}
          <div className="w-full">
            <PreviewCarousel
              images={imageUrls}
              startIndex={selectedIndex}
              imageZoomed={imageZoomed}
              setImageZoomed={setImageZoomed}
            />
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

      {/* delete dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Delete Image?</h2>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this image? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
