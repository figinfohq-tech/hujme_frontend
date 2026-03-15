import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import Loader from "@/components/Loader";

function AgentVerificationDetails() {
  const [agentsData, setAgentsData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgentDocuments, setSelectedAgentDocuments] = useState([]);
  const [expandedDoc, setExpandedDoc] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewType, setPreviewType] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminComment, setAdminComment] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const token = sessionStorage.getItem("token");

  const agent = location.state?.agent;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "NEW":
        return "bg-yellow-100 text-yellow-800";
      case "reupload_requested":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return CheckCircle;
      case "REJECTED":
        return XCircle;
      case "PENDING":
        return Clock;
      case "reupload_requested":
        return RotateCcw;
      default:
        return Clock;
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "UPLOADED":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const StatusIcon = getStatusIcon(agent.agencyStatus);

  const fetchAgentDocuments = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${baseURL}agent-documents/byAgent/${agent?.agentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSelectedAgentDocuments(response.data);
    } catch (error) {
      console.error("Documents API Error", error);
    }
  };

  // GET agents
  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${baseURL}agents/${agent?.agentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgentsData(response.data);
    } catch (error) {
      console.error("GET API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (agent.agentId) {
      fetchAgentDocuments();
      fetchAgents();
    }
  }, [agent]);

  const handleApproveAgent = async () => {
    try {
      const payload = {
        ...agentsData,
        agencyStatus: "APPROVED",
        adminComments: adminComment ? adminComment : "Approved by admin",
        rejectionRemarks: "",
      };
      await axios.put(`${baseURL}agents/${agentsData?.agentId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(`${agent?.agencyName} approved successfully`);
      fetchAgents();
      setAdminComment("");
    } catch (error) {
      console.error("Approve API Error:", error);
      toast.error("Failed to approve agent");
    }
  };

  const handleRejectAgent = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      const payload = {
        ...agentsData,
        agencyStatus: "REJECTED",
        rejectionRemarks: rejectionReason
          ? rejectionReason
          : "Rejected by admin",
        adminComments: "",
      };

      await axios.put(`${baseURL}agents/${agentsData?.agentId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(`${agent?.agencyName} rejected successfully`);
      fetchAgents();
      setRejectionReason("");
    } catch (error) {
      console.error("Reject API Error:", error);
      toast.error("Failed to reject agent");
    }
  };
  const handleRequestReupload = (agentId: string) => {
    if (!adminComment.trim()) {
      toast.error("Please provide feedback for document re-upload request");
      return;
    }

    // setAgents((prev) =>
    //   prev.map((agent) =>
    //     agent.id === agentId
    //       ? {
    //           ...agent,
    //           status: "reupload_requested" as const,
    //           lastActionDate: new Date().toISOString(),
    //           lastActionBy: "Admin User",
    //           adminComments: adminComment,
    //         }
    //       : agent,
    //   ),
    // );

    const agent = agentsData.find((a) => a.id === agentId);
    console.log("🔁 Reupload requested for:", agent?.agencyName);
    toast.success(
      `Re-upload request sent to ${agent?.agencyName} with feedback.`,
    );
    setAdminComment("");
  };

  const handleDownloadDocument = async (doc: Document) => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.get(
        `${baseURL}agent-documents/view/${doc.documentId}?mode=download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        },
      );

      //  Get content type from backend
      const contentType =
        response.headers["content-type"] || "application/octet-stream";

      //  Create blob with correct type
      const blob = new Blob([response.data], { type: contentType });

      const url = window.URL.createObjectURL(blob);

      //  Ensure filename with extension
      const fileName =
        doc.documentType || `document.${contentType.split("/")[1] || "bin"}`;

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      // cleanup
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`${fileName} downloaded successfully`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    }
  };

  const fetchViewImage = async (documentId: any) => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.get(
        `${baseURL}agent-documents/view/${documentId}?mode=inline`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        },
      );

      const blob = response.data;
      const url = URL.createObjectURL(blob);

      // detect type
      if (blob.type.includes("pdf")) {
        setPreviewType("pdf");
      } else if (blob.type.includes("image")) {
        setPreviewType("image");
      }

      setPreviewUrl(url);
    } catch (error) {
      console.error("Document Fetch Error:", error);
    } finally {
    }
  };

  const handleVerifyDocument = async (doc: any) => {
    try {
      const payload = {
        ...doc,
        status: "VERIFIED",
      };

      await axios.put(`${baseURL}agent-documents/${doc.documentId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(`${doc.documentType} verified successfully`);

      fetchAgentDocuments(); // refresh list
    } catch (error) {
      console.error("Verify document error:", error);
      toast.error("Failed to verify document");
    }
  };

  const handleRejectDocument = async (doc) => {
    try {
      const payload = {
        ...doc,
        status: "REJECTED",
      };

      await axios.put(`${baseURL}agent-documents/${doc.documentId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(`${doc.documentType} rejected`);

      fetchAgentDocuments();
    } catch (error) {
      console.error("Reject document error:", error);
      toast.error("Failed to reject document");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!agentsData) {
    return (
      <div className="p-10 text-center">
        <p>No agent data found</p>
      </div>
    );
  }

  return (
    <div className="px-2 py-6 space-y-4 animate-fade-in">
      {/* BACK BUTTON */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <h2 className="text-2xl font-bold text-primary">
          Agent Verification Details
        </h2>
      </div>

      <div>
        <Card className="p-6">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Building2 className="w-5 h-5" />
              {agent?.agencyName} - Verification Details
            </h3>

            <p className="text-muted-foreground">
              Review agent details and documents for verification
            </p>
          </div>

          <div className="space-y-6">
            {/* Agent Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Company Name</p>
                <p className="text-sm text-muted-foreground">
                  {agentsData?.agencyName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Owner Name</p>
                <p className="text-sm text-muted-foreground">
                  {agentsData?.contactPerson}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  {agentsData?.agencyEmail}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">
                  {agentsData?.agencyPhone}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">PAN Number</p>
                <p className="text-sm text-muted-foreground">
                  {agentsData.panNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">GST Number</p>
                <p className="text-sm text-muted-foreground">
                  {agentsData?.gstnumber}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium">Office Address</p>
                <p className="text-sm text-muted-foreground">
                  {agentsData?.address}
                </p>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-lg font-medium mb-4">Uploaded Documents</h3>
              <div className="space-y-3">
                {selectedAgentDocuments && selectedAgentDocuments.length > 0 ? (
                  selectedAgentDocuments.map((reqDoc) => {
                    const uploadedDoc = selectedAgentDocuments.find(
                      (doc) => doc?.documentType === reqDoc?.documentType,
                    );
                    return (
                      <div key={reqDoc?.agentId} className="border rounded-lg">
                        {/* TOP ROW */}
                        <div className="flex items-center justify-between p-3">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-muted-foreground" />

                            <div>
                              <p className="font-medium">
                                {reqDoc?.documentType}
                              </p>
                              <span className="text-xs text-red-600">
                                * Required
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {uploadedDoc && (
                              <>
                                <Badge
                                  className={getDocumentStatusColor(
                                    uploadedDoc.status,
                                  )}
                                >
                                  {uploadedDoc.status}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  2.1 MB
                                </span>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setExpandedDoc(
                                      expandedDoc === reqDoc.documentType
                                        ? null
                                        : reqDoc.documentType,
                                    );

                                    //   setImgId(uploadedDoc.documentId);
                                    fetchViewImage(uploadedDoc.documentId);
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDownloadDocument(uploadedDoc)
                                  }
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* EXPANDABLE PANEL */}

                        {expandedDoc === reqDoc.documentType && (
                          <div className="border-t bg-muted/30 p-4 space-y-4 animate-in slide-in-from-top-2">
                            {/* DOCUMENT PREVIEW */}

                            <div className="flex justify-center">
                              {previewType === "image" && (
                                <img
                                  src={previewUrl}
                                  alt="document"
                                  className="max-h-[400px] rounded-lg shadow border"
                                />
                              )}

                              {previewType === "pdf" && (
                                <iframe
                                  src={previewUrl}
                                  className="w-full h-[450px] border rounded-lg"
                                />
                              )}
                            </div>

                            {/* ACTION BUTTONS */}

                            <div className="flex justify-center gap-4 pt-2">
                              <Button
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() =>
                                  handleVerifyDocument(uploadedDoc)
                                }
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Verify
                              </Button>

                              <Button
                                variant="outline"
                                className="border-orange-500 text-orange-600"
                                onClick={() =>
                                  handleRequestReupload(uploadedDoc.id)
                                }
                              >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Re-upload
                              </Button>

                              <Button
                                variant="outline"
                                className="border-red-500 text-red-600"
                                onClick={() =>
                                  handleRejectDocument(uploadedDoc)
                                }
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>

                              <Button
                                variant="outline"
                                className="border-blue-500 text-blue-600 hover:bg-blue-50"
                                onClick={() =>
                                  handleDownloadDocument(uploadedDoc)
                                }
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center border rounded-lg bg-muted/20">
                    <FileText className="w-10 h-10 text-muted-foreground mb-2" />

                    <p className="text-sm font-medium text-muted-foreground">
                      No Documents Found
                    </p>

                    <p className="text-xs text-muted-foreground">
                      This agent has not uploaded any documents yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Previous Admin Comments */}
            {agentsData.adminComments && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">
                    Previous Admin Feedback
                  </span>
                </div>
                <p className="text-sm text-blue-700">
                  {agentsData.adminComments}
                </p>
                {agentsData.lastActionDate && (
                  <p className="text-xs text-blue-600 mt-1">
                    {new Date(agentsData.lastActionDate).toLocaleString()} by{" "}
                    {agentsData.lastActionBy}
                  </p>
                )}
              </div>
            )}

            {/* Admin Action Section */}
            {agentsData.agencyStatus === "PENDING" ||
            agentsData.agencyStatus === "reupload_requested" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-comment">
                    Admin Comments / Feedback
                  </Label>
                  <Textarea
                    id="admin-comment"
                    placeholder="Add your comments or feedback for the agent..."
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleApproveAgent()}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Agent
                  </Button>

                  <Button
                    onClick={() => handleRequestReupload(agent.agentId)}
                    variant="outline"
                    className="flex-1 border-orange-500 text-orange-600 hover:bg-orange-50"
                    disabled={!adminComment.trim()}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Request Re-upload
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Agent
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Reject Agent Registration
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Please provide a clear reason for rejecting this
                          agent's registration. This feedback will be sent to
                          the agent.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="space-y-2">
                        <Label htmlFor="rejection-reason">
                          Rejection Reason *
                        </Label>
                        <Textarea
                          id="rejection-reason"
                          placeholder="Enter detailed reason for rejection..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={4}
                        />
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRejectAgent()}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={!rejectionReason.trim()}
                        >
                          Confirm Rejection
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Badge
                  className={`${getStatusColor(agentsData?.agencyStatus)} text-lg px-4 py-2`}
                >
                  <StatusIcon className="w-4 h-4 mr-2" />
                  Agent{" "}
                  {agentsData?.agencyStatus?.replace("_", " ")?.toUpperCase()}
                </Badge>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AgentVerificationDetails;
