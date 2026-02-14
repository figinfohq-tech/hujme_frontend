import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Clock, AlertCircle, Eye, X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FileText, Download } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";

interface TravelerDocument {
  id: string;
  type: string;
  status: "verified" | "pending" | "rejected" | "needs_reupload";
  uploaded_at: string;
  rejection_reason?: string;
}

interface TravelerDocumentCardProps {
  document: TravelerDocument;
  onStatusUpdate: (docId: string, newStatus: string, reason?: string) => void;
}

export const UserTravelersDocumentCard = ({
  document,
  onStatusUpdate,
}: TravelerDocumentCardProps) => {
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "pdf" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewDocument, setViewDocument] = useState<TravelerDocument | null>(
    null,
  );

  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      {
        icon: any;
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
        color: string;
      }
    > = {
      verified: {
        icon: CheckCircle,
        variant: "default",
        label: "Verified",
        color: "text-green-600 dark:text-green-400",
      },
      pending: {
        icon: Clock,
        variant: "secondary",
        label: "Awaiting",
        color: "text-orange-600 dark:text-orange-400",
      },
      rejected: {
        icon: XCircle,
        variant: "destructive",
        label: "Rejected",
        color: "text-red-600 dark:text-red-400",
      },
      needs_reupload: {
        icon: AlertCircle,
        variant: "outline",
        label: "Needs Attention",
        color: "text-amber-600 dark:text-amber-400",
      },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(document.status);
  const StatusIcon = statusConfig.icon;
  const isLocked = document.status === "verified";

  const handleVerify = () => {
    onStatusUpdate(document.id, "verified");
    setShowVerifyDialog(false);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      return;
    }
    onStatusUpdate(document.id, "needs_reupload", rejectionReason);
    setShowRejectDialog(false);
    setRejectionReason("");
  };

  // View image
  const fetchViewImage = async (doc: TravelerDocument) => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.get(
        `${baseURL}documents/view/${doc.id}?mode=inline`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        },
      );

      const blob = response.data;
      const url = URL.createObjectURL(blob);

      if (blob.type.includes("pdf")) {
        setPreviewType("pdf");
      } else if (blob.type.includes("image")) {
        setPreviewType("image");
      }

      setPreviewUrl(url);
    } catch (error) {
      console.error("Document Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // View image
  const handleDownloadDocument = async (doc: any) => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.get(
        `${baseURL}documents/view/${doc.id}?mode=download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        },
      );

      const blob = response.data;

      const mimeType = blob.type;
      let extension = "";

      if (mimeType.includes("pdf")) extension = "pdf";
      else if (mimeType.includes("jpeg")) extension = "jpg";
      else if (mimeType.includes("png")) extension = "png";
      else if (mimeType.includes("webp")) extension = "webp";
      else if (mimeType.includes("image")) extension = "jpg";

      const fileName = `${doc.type || "document"}.${extension}`;

      const url = window.URL.createObjectURL(blob);

      const link = window.document.createElement("a");
      link.href = url;
      link.download = fileName;

      window.document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Document downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    }
  };

  return (
    <>
      <div
        className={`p-3 ${
          isLocked ? "bg-green-50/50 dark:bg-green-950/20" : ""
        }`}
      >
        <div className="border rounded-xl p-4 bg-white dark:bg-muted/30 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4 h-full">
          {/* Top Section */}
          <div className="space-y-2">
            {/* Title Row */}
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-sm truncate">
                {document?.type?.charAt(0).toUpperCase() +
                  document?.type?.slice(1).toLowerCase()}
              </p>

              {isLocked && (
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
              )}
            </div>

            {/* Status Badge */}
            <Badge
              variant={statusConfig.variant}
              className="w-fit gap-1 text-xs capitalize"
            >
              <StatusIcon className="h-3 w-3" />
              {document.status.replace("_", " ")}
            </Badge>

            {/* Upload Date */}
            <p className="text-xs text-muted-foreground">
              Uploaded on{" "}
              <span className="font-medium">
                {new Date(document.uploaded_at).toLocaleDateString()}
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          {/* Action Section */}
          {!isLocked && (
            <div className=" flex items-center justify-end">
              <Button
                size="sm"
                variant="outline"
                className=" px-3 text-xs gap-1"
                onClick={() => {
                  setViewDocument(document);
                  fetchViewImage(document);
                }}
              >
                <Eye className="h-4 w-4" />
                View
              </Button>

              {/* <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowVerifyDialog(true)}
                className="h-8 w-8 p-0 text-green-600 hover:bg-green-100"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowRejectDialog(true)}
                className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
              >
                <XCircle className="h-4 w-4" />
              </Button> */}
            </div>
          )}
        </div>

        {/* <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium text-sm truncate">{document.type}</p>
              {isLocked && (
                <X className="h-3 w-3 rotate-45 text-muted-foreground" />
              )}
            </div>
            <Badge variant={statusConfig.variant} className="gap-1 text-xs">
              <StatusIcon className="h-3 w-3" />
              {statusConfig.label}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Uploaded: {new Date(document.uploaded_at).toLocaleDateString()}
            </p>
          </div>

          {!isLocked && (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-primary/30"
                onClick={() => {
                  setViewDocument(document); // dialog open
                  fetchViewImage(document); // preview load
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowVerifyDialog(true)}
                className="h-8 px-2 text-xs hover:bg-primary/30"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Verify
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setShowRejectDialog(true)}
                className="h-8 px-2 text-xs"
              >
                <XCircle className="h-3 w-3 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div> */}

        {document.rejection_reason && (
          <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs">
            <p className="font-medium text-destructive flex items-center gap-1 mb-1">
              <AlertCircle className="h-3 w-3" />
              Rejection Reason:
            </p>
            <p className="text-muted-foreground">{document.rejection_reason}</p>
            <p className="text-muted-foreground mt-1 italic">
              → Customer notified to re-upload this document
            </p>
          </div>
        )}

        {isLocked && (
          <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
            This document has been verified and locked from further edits
          </div>
        )}
      </div>

      {/* Document Preview Dialog */}
      <Dialog
        open={!!viewDocument}
        onOpenChange={(open) => {
          if (!open) {
            setViewDocument(null);
            setPreviewUrl(null);
            setPreviewType(null);
          }
        }}
      >
        <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-hidden p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {viewDocument?.type}
            </DialogTitle>
            <DialogDescription>Document preview and details</DialogDescription>
          </DialogHeader>

          {viewDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className="mt-1 capitalize">
                    {viewDocument.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Upload Date</Label>
                  <p className="font-medium">
                    {new Date(viewDocument.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">File Type</Label>
                  <p className="font-medium">{viewDocument.type}</p>
                </div>
              </div>

              <Separator />

              <div className="border-2 border-dashed rounded-lg p-4 sm:p-5 bg-muted flex flex-col items-center justify-center overflow-hidden">
                {isLoading && (
                  <p className="text-sm text-muted-foreground">
                    Loading preview...
                  </p>
                )}

                {!isLoading && previewType === "image" && previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Document Preview"
                    className="w-full max-h-[200px] object-contain rounded-md"
                  />
                )}

                {!isLoading && previewType === "pdf" && previewUrl && (
                  <iframe
                    src={`${previewUrl}#zoom=40`}
                    title="PDF Preview"
                    className="w-full h-[320px] rounded-md border"
                  />
                )}

                {!previewUrl && !isLoading && (
                  <FileText className="h-24 w-24 text-muted-foreground" />
                )}
              </div>

              <div className="flex justify-center">
                <Button onClick={() => handleDownloadDocument(viewDocument)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Document
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Verify Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to verify this {document.type}? Once
              verified, this document will be locked and cannot be modified.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowVerifyDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleVerify}>Verify Document</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this {document.type}. The
              customer will be notified and asked to re-upload.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="E.g., Document is not clear, wrong document type, expired document..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setRejectionReason("");
                setShowRejectDialog(false);
              }}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              disabled={!rejectionReason.trim()}
              onClick={handleReject}
            >
              Reject & Request Re-upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
