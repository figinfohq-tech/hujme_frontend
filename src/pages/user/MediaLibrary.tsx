import { useEffect, useState } from "react";
import { ArrowLeft, ImageOff } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MediaCard } from "@/components/features/MediaCard";
import { MediaCardSkeleton } from "@/components/features/MediaCardSkeleton";
import { MediaViewer } from "@/components/features/MediaViewer";
import { MediaFilters } from "@/components/features/MediaFilters";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMediaData } from "@/hooks/useMediaData";
import type { MediaItem, MediaType } from "@/types";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export const MediaLibrary = () => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  // Filters state
  const [type, setType] = useState<MediaType | "all">("all");
  const [category, setCategory] = useState("all");
  const [tags, setTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isMedia, setIsMedia] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(false);

  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const result = location.state?.result;

  const { media, loading, error } = useMediaData({
    type: type === "all" ? undefined : type,
    category: category === "all" ? undefined : category,
    tags: tags.length > 0 ? tags : undefined,
    search: search || undefined,
  });

  const handleCardClick = (item: MediaItem) => {
    setSelectedMedia(item);
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
    setTimeout(() => setSelectedMedia(null), 200);
  };

  const fetchMediaByAgent = async () => {
    try {
      setIsLoading(true);

      const params: any = {
        agentId: result?.agentId,
      };

      if (type !== "all") {
        params.mediaType = type.toUpperCase();
      }

      if (category !== "all") {
        params.category = category;
      }

      if (tags.length > 0) {
        params.tags = tags.join(","); // array → string
      }

      if (search) {
        params.search = search;
      }

      const response = await axios.get(
        `${baseURL}media-library/agent/${result?.agentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setIsMedia(response.data);
    } catch (error) {
      console.error("Error fetching Agent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (result?.agentId) {
      fetchMediaByAgent();
    }
  }, [result?.agentId, type, category, tags, search]); // 🔥 IMPORTANT

  const filteredMedia = isMedia.filter((item: any) => {
    const itemTags = item.tags
      ? item.tags.split(",").map((t: string) => t.trim().toLowerCase())
      : [];

    const matchType = type === "all" || item.mediaType?.toLowerCase() === type;

    const matchCategory = category === "all" || item.category === category;

    const matchTags =
      tags.length === 0 || tags.some((tag) => item.tags?.includes(tag));

    const matchSearch =
      !search || item.title?.toLowerCase().includes(search.toLowerCase());

    return matchType && matchCategory && matchTags && matchSearch && itemTags;
  });

  return (
    <>
      {/* <Header /> */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-full container mx-auto">
          <div className="flex gap-1 my-3">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-primary/90 hover:text-foreground my-3"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
            <div className="my-2">
              <h1 className="text-2xl font-bold text-primary">Media Library</h1>

              <p className="text-primary/90 text-sm mt-1">
                Browse our collection of videos and images
              </p>
            </div>
          </div>
        </div>

        <MediaFilters
          type={type}
          category={category}
          tags={tags}
          search={search}
          onTypeChange={setType}
          onCategoryChange={setCategory}
          onTagsChange={setTags}
          onSearchChange={setSearch}
        />

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <MediaCardSkeleton key={n} />
            ))}
          </div>
        ) : isMedia.length === 0 ? (
          <div className="text-center py-16">
            <ImageOff className="h-20 w-20 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No media found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          //   {filteredMedia.map((item: any) => (
          //     <MediaCard
          //       key={item.mediaId}
          //       media={item}
          //       onClick={() => handleCardClick(item)}
          //     />
          //   ))}
          // </div>
          <>
            {filteredMedia.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                {/* Image */}
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
                  alt="No Results"
                  className="w-40 h-40 mb-6 opacity-80"
                />

                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  No Media Found
                </h2>

                {/* Description */}
                <p className="text-gray-500 max-w-md">
                  We couldn't find any media matching your filters. Try changing
                  category, tags, or search keyword.
                </p>

                {/* Optional Button */}
                <button
                  onClick={() => {
                    setType("all");
                    setCategory("all");
                    setTags([]);
                    setSearch("");
                  }}
                  className="mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMedia.map((item: any) => (
                  <MediaCard
                    key={item.mediaId}
                    media={item}
                    onClick={() => handleCardClick(item)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <MediaViewer
        media={selectedMedia}
        open={viewerOpen}
        onClose={handleCloseViewer}
      />
    </>
  );
};
