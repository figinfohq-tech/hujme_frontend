import { PlayCircle, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MediaItem } from "@/types";

interface MediaCardProps {
  media: MediaItem;
  onClick: () => void;
}

export const MediaCard = ({ media, onClick }: MediaCardProps) => {
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

  return (
    <Card
      className="h-full cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 p-0"
      onClick={onClick}
    >
      <div className="relative">
        {media?.mediaType === "VIDEO" ? (
          <div className="relative">
            <iframe
              width="100%"
              height="100%"
              className="w-full h-48 object-cover rounded-t-lg pointer-events-none"
              src={getEmbedUrl(media?.mediaUrl)}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />

            {/* Overlay for Click */}
            <div className="absolute inset-0 z-10" onClick={onClick}></div>
          </div>
        ) : (
          <img
            src={media?.thumbnailUrl}
            alt={media?.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        )}
        <div className="absolute top-2 right-2 bg-black/60 rounded-full p-2">
          {media?.mediaType === "VIDEO" ? (
            <PlayCircle className="h-5 w-5 text-white" />
          ) : (
            <ImageIcon className="h-5 w-5 text-white" />
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{media.title}</h3>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {media.description}
        </p>

        {/* <div className="flex gap-2 flex-wrap">
          <Badge variant="default">{media.category}</Badge>
          {media.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div> */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="default">{media.category}</Badge>

          {(media.tags ? media.tags.split(",") : [])
            .slice(0, 2)
            .map((tag: string, index: number) => (
              <Badge key={index} variant="outline">
                {tag.trim()}
              </Badge>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
