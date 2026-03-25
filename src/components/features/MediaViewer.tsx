import { useState } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import ReactPlayer from "react-player";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MediaItem } from "@/types";

interface MediaViewerProps {
  media: MediaItem | null;
  open: boolean;
  onClose: () => void;
}

export const MediaViewer = ({ media, open, onClose }: MediaViewerProps) => {
  const [imageZoomed, setImageZoomed] = useState(false);

  const getEmbedUrl = (url: string) => {
    if (!url) return "";

    // youtu.be format
    if (url.includes("youtu.be")) {
      const id = url.split("/").pop()?.split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    // youtube watch format
    if (url.includes("youtube.com/watch")) {
      const id = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${id}`;
    }

    return url;
  };

  if (!media) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-[60vw] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{media.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {media?.mediaType === "VIDEO" ? (
            <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
              <div className="absolute inset-0">
                {/* <ReactPlayer
                  url={media?.mediaUrl}
                  controls
                  width="100%"
                  height="100%"
                  config={{
                    file: {
                      attributes: {
                        controlsList: "nodownload",
                      },
                    },
                  }}
                /> */}
                <iframe
                  width="100%"
                  height="100%"
                  src={getEmbedUrl(media?.mediaUrl)}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <div className="relative text-center">
              <img
                src={media.mediaUrl}
                alt={media.title}
                className={`!max-w-[60vw] w-full h-auto max-h-[70vh] mx-auto cursor-zoom-in transition-transform duration-300 ${
                  imageZoomed ? "scale-150" : "scale-100"
                }`}
                onClick={() => setImageZoomed(!imageZoomed)}
                loading="lazy"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
                onClick={() => setImageZoomed(!imageZoomed)}
              >
                {imageZoomed ? (
                  <ZoomOut className="h-4 w-4 text-white" />
                ) : (
                  <ZoomIn className="h-4 w-4 text-white" />
                )}
              </Button>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg">Description</h3>
            <p className="text-muted-foreground">{media.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Category</h3>
            <Badge variant="default">{media.category}</Badge>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Tags</h3>
            <div className="flex gap-2 flex-wrap">
              {/* {media.tags.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))} */}
              {(media.tags ? media.tags.split(",") : []).map(
                (tag: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {tag.trim()}
                  </Badge>
                ),
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
