import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle, Clock, AlertCircle, Eye, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

export const TravelerDocumentCard = ({
  document,
  onStatusUpdate,
}: TravelerDocumentCardProps) => {
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      { icon: any; variant: "default" | "secondary" | "destructive" | "outline"; label: string; color: string }
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
        label: "Awaiting Review",
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

  return (
    <>
      <Card className={`p-3 ${isLocked ? "bg-green-50/50 dark:bg-green-950/20" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium text-sm truncate">{document.type}</p>
              {isLocked && <X className="h-3 w-3 rotate-45 text-muted-foreground" />}
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
                className="h-8 w-8 p-0"
                onClick={() => {
                  // View document functionality
                  setIsExpanded(!isExpanded);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowVerifyDialog(true)}
                className="h-8 px-2 text-xs"
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
        </div>

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
      </Card>

      {/* Verify Dialog */}
      <AlertDialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verify Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to verify this {document.type}? Once verified, this document
              will be locked and cannot be modified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleVerify}>Verify Document</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Document</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this {document.type}. The customer will be
              notified and asked to re-upload.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="E.g., Document is not clear, wrong document type, expired document..."
              rows={4}
              className="resize-none"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectionReason("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reject & Request Re-upload
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
