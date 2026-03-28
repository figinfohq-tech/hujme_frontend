import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  PlayCircle,
  Image as ImageIcon,
  Eye,
} from "lucide-react";
import { MediaForm } from "@/components/forms/MediaForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMediaData } from "@/hooks/useMediaData";
import type { MediaItem } from "@/types";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import { MediaViewer } from "@/components/features/MediaViewer";

export const MediaGallery = () => {
  const navigate = useNavigate();
  const { error, refetch } = useMediaData();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);
  const [agent, setAgent] = useState<any>({});
  const [isMedia, setIsMedia] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(false);

  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");

  const fetchAgent = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseURL}agents/byUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgent(response.data);
    } catch (error) {
      console.error("Error fetching Agent:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseURL}media-library/agent/${agent.agentId}`,
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
    fetchAgent();
    fetchMedia();
  }, []);

  useEffect(() => {
    if (agent.agentId) {
      fetchMedia();
    }
  }, [agent.agentId]);

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedMedia(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (item: MediaItem) => {
    setFormMode("edit");
    setSelectedMedia(item);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedMedia(null);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
    setTimeout(() => setSelectedMedia(null), 200);
  };

  const handleCardClick = (item: MediaItem) => {
    setSelectedMedia(item);
    setViewerOpen(true);
  };

  // const handleSubmit = async (data: any) => {
  //   console.log("Media Form data==>", data);

  //   if (formMode === 'create') {
  //     await .create(data);
  //   } else if (selectedMedia) {
  //     await mediaApi.update(selectedMedia.id, data);
  //   }
  //   await refetch();
  // };

  const getFileFormat = (url: string) => {
    if (!url) return "";

    try {
      const cleanUrl = url.split("?")[0]; // remove query params
      const extension = cleanUrl.split(".").pop();

      return extension ? extension.toLowerCase() : "";
    } catch {
      return "";
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        agentId: agent?.agentId,
        mediaType: data.type?.toUpperCase(),
        title: data.title,
        description: data.description,
        mediaUrl: data.mediaUrl,
        thumbnailUrl: data.thumbnailUrl,
        fileFormat: getFileFormat(data.mediaUrl),
        fileSizeMb: 0,
        durationSec: 0,
        category: data.category,
        // tags: data.tags?.join(",") || "",
        tags: Array.isArray(data.tags) ? data.tags.join(",") : data.tags || "",
        isActive: true,
      };

      let response;

      if (data.mediaId) {
        // 🔄 UPDATE API
        response = await axios.put(
          `${baseURL}media-library/${data.mediaId}`, // 👈 id pass karo
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        toast.success("Media updated successfully");
      } else {
        // ➕ CREATE API
        response = await axios.post(`${baseURL}media-library`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        toast.success("Media added successfully");
      }

      fetchMedia();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteClick = (item: MediaItem) => {
    setMediaToDelete(item);
    setDeleteDialogOpen(true);
  };

  // const handleDeleteConfirm = async () => {
  //   if (mediaToDelete) {
  //     await mediaApi.delete(mediaToDelete.id);
  //     await refetch();
  //     setDeleteDialogOpen(false);
  //     setMediaToDelete(null);
  //   }
  // };

  const handleDeleteConfirm = async () => {
    try {
      if (!mediaToDelete?.mediaId) {
        toast.error("Media ID not found");
        return;
      }

      await axios.delete(`${baseURL}media-library/${mediaToDelete?.mediaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Media deleted successfully");
      fetchMedia();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setMediaToDelete(null);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Media Gallery</h1>
            <p className="text-muted-foreground mt-2">
              Manage your media library
            </p>
          </div>
          <Button size="lg" onClick={handleOpenCreate}>
            <Plus className="mr-2 h-5 w-5" />
            Add Media
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : isMedia.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">
                      No media items yet. Click "Add Media" to get started.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                isMedia.map((item: any) => (
                  <TableRow key={item.mediaId}>
                    <TableCell>
                      {item?.mediaType === "VIDEO" ? (
                        <PlayCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-secondary" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{item?.title}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {item?.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{item?.category}</Badge>
                    </TableCell>
                    {/* <TableCell>
                      <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {item.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                        {item.tags.length > 2 && (
                          <Badge variant="outline">+{item.tags.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell> */}
                    <TableCell>
                      <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {(item.tags ? item.tags.split(",") : [])
                          .slice(0, 2)
                          .map((tag: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}

                        {(item.tags?.split(",").length || 0) > 2 && (
                          <Badge variant="outline">
                            +{item.tags.split(",").length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleOpenEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleCardClick(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <MediaForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={selectedMedia}
        mode={formMode}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{mediaToDelete?.title}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* media Viewer */}
      <MediaViewer
        media={selectedMedia}
        open={viewerOpen}
        onClose={handleCloseViewer}
      />
    </>
  );
};
