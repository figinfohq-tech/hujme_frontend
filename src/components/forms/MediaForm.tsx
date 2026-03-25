import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CATEGORIES, ALL_TAGS } from "@/constants/mockData";
import { validateMediaForm } from "@/lib/validations";
import type { MediaItem, MediaType } from "@/types";

interface MediaFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: MediaItem | null;
  mode: "create" | "edit";
}

export const MediaForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}: MediaFormProps) => {
  const [formData, setFormData] = useState({
    mediaId: null,
    type: "IMAGE" as MediaType,
    title: "",
    description: "",
    mediaUrl: "",
    thumbnailUrl: "",
    category: "",
    tags: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        mediaId: initialData.mediaId,
        type: initialData.mediaType,
        title: initialData.title,
        description: initialData.description,
        mediaUrl: initialData.mediaUrl,
        thumbnailUrl: initialData.thumbnailUrl,
        category: initialData.category,
        tags: initialData.tags,
      });
    } else {
      setFormData({
        type: "IMAGE",
        title: "",
        description: "",
        mediaUrl: "",
        thumbnailUrl: "",
        category: "",
        tags: [],
      });
    }
    setErrors({});
  }, [initialData, open]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleTag = (tag: string) => {
    const newTags = formData.tags.includes(tag)
      ? formData.tags.filter((t) => t !== tag)
      : [...formData.tags, tag];
    handleChange("tags", newTags);
  };

  const handleSubmit = async () => {
    const validation = validateMediaForm(formData);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "Failed to save media item. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-[60vw] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Media" : "Edit Media"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {errors.submit && (
            <Alert variant="destructive">
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="type">Media Type</Label>
            <Select
              value={formData.type}
              onValueChange={(val) => handleChange("type", val)}
            >
              <SelectTrigger id="type" className="mt-1 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIDEO">Video</SelectItem>
                <SelectItem value="IMAGE">Image</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive mt-1">{errors.type}</p>
            )}
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="mt-1"
              placeholder="Enter media title"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="mt-1"
              rows={3}
              placeholder="Enter media description"
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="mediaUrl">Media URL *</Label>
            <Input
              id="mediaUrl"
              value={formData.mediaUrl}
              onChange={(e) => handleChange("mediaUrl", e.target.value)}
              className="mt-1"
              placeholder="https://example.com/media.mp4"
            />
            {errors.mediaUrl && (
              <p className="text-sm text-destructive mt-1">{errors.mediaUrl}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Full URL to the video or image
            </p>
          </div>

          <div>
            <Label htmlFor="thumbnailUrl">Thumbnail URL *</Label>
            <Input
              id="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={(e) => handleChange("thumbnailUrl", e.target.value)}
              className="mt-1"
              placeholder="https://example.com/thumbnail.jpg"
            />
            {errors.thumbnailUrl && (
              <p className="text-sm text-destructive mt-1">
                {errors.thumbnailUrl}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Full URL to the thumbnail image
            </p>
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(val) => handleChange("category", val)}
            >
              <SelectTrigger id="category" className="mt-1 w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 flex-wrap mt-2">
              {ALL_TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={formData.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : mode === "create" ? "Create" : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
