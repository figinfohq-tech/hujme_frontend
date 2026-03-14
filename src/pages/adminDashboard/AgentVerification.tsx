import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Upload,
  FileText,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import { formatDate } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: "uploaded" | "verified" | "rejected";
  url?: string;
  size: string;
}

interface Agent {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  registrationDate: string;
  status: "pending" | "approved" | "rejected" | "reupload_requested";
  documents: Document[];
  address: string;
  panNumber: string;
  gstNumber: string;
  adminComments?: string;
  lastActionDate?: string;
  lastActionBy?: string;
}

const requiredDocuments = [
  {
    key: "company_registration",
    name: "Company Registration Certificate / Trade License",
    required: true,
  },
  {
    key: "hajj_authorization",
    name: "Ministry of Hajj & Umrah Authorization Letter",
    required: true,
  },
  { key: "pan_gst", name: "PAN / GST Certificate", required: true },
  { key: "owner_passport", name: "Owner's Passport Copy", required: true },
  { key: "owner_aadhar", name: "Owner's Aadhar Card", required: true },
  {
    key: "bank_details",
    name: "Company Bank Account Details (Cancelled Cheque)",
    required: true,
  },
  {
    key: "address_proof",
    name: "Office Address Proof (Electricity Bill / Rental Agreement)",
    required: true,
  },
  {
    key: "company_logo",
    name: "Company Logo & Profile Photo",
    required: false,
  },
];

function AgentVerification() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      companyName: "Al-Barakah Travel & Tours",
      ownerName: "Ahmed Al-Rashid",
      email: "ahmed@albarakah.com",
      phone: "+91 98765 43210",
      registrationDate: "2024-03-10T10:30:00Z",
      status: "pending",
      address: "123 MG Road, Mumbai, Maharashtra 400001",
      panNumber: "ABCDE1234F",
      gstNumber: "27ABCDE1234F1Z5",
      documents: [
        {
          id: "1",
          name: "Company Registration Certificate",
          type: "company_registration",
          uploadDate: "2024-03-10",
          status: "uploaded",
          size: "2.1 MB",
        },
        {
          id: "2",
          name: "Hajj Authorization Letter",
          type: "hajj_authorization",
          uploadDate: "2024-03-10",
          status: "uploaded",
          size: "1.8 MB",
        },
        {
          id: "3",
          name: "PAN Certificate",
          type: "pan_gst",
          uploadDate: "2024-03-10",
          status: "uploaded",
          size: "1.2 MB",
        },
        {
          id: "4",
          name: "Owner Passport",
          type: "owner_passport",
          uploadDate: "2024-03-10",
          status: "uploaded",
          size: "3.4 MB",
        },
        {
          id: "5",
          name: "Aadhar Card",
          type: "owner_aadhar",
          uploadDate: "2024-03-10",
          status: "uploaded",
          size: "1.9 MB",
        },
        {
          id: "6",
          name: "Bank Details",
          type: "bank_details",
          uploadDate: "2024-03-10",
          status: "uploaded",
          size: "0.8 MB",
        },
        {
          id: "7",
          name: "Office Address Proof",
          type: "address_proof",
          uploadDate: "2024-03-10",
          status: "uploaded",
          size: "2.3 MB",
        },
      ],
    },
    {
      id: "2",
      companyName: "Green Crescent Tours Pvt Ltd",
      ownerName: "Fatima Hassan",
      email: "fatima@greencrescent.com",
      phone: "+91 87654 32109",
      registrationDate: "2024-03-12T14:20:00Z",
      status: "approved",
      address: "456 Park Street, Kolkata, West Bengal 700016",
      panNumber: "FGHIJ5678K",
      gstNumber: "19FGHIJ5678K1A2",
      lastActionDate: "2024-03-14T09:15:00Z",
      lastActionBy: "Admin User",
      documents: [
        {
          id: "8",
          name: "Company Registration",
          type: "company_registration",
          uploadDate: "2024-03-12",
          status: "verified",
          size: "1.9 MB",
        },
        {
          id: "9",
          name: "Hajj Authorization",
          type: "hajj_authorization",
          uploadDate: "2024-03-12",
          status: "verified",
          size: "2.1 MB",
        },
      ],
    },
    {
      id: "3",
      companyName: "Holy Journey Travel Services",
      ownerName: "Omar Abdullah",
      email: "omar@holyjourney.com",
      phone: "+91 76543 21098",
      registrationDate: "2024-03-08T16:45:00Z",
      status: "rejected",
      address: "789 Commercial Street, Hyderabad, Telangana 500001",
      panNumber: "KLMNO9012P",
      gstNumber: "36KLMNO9012P1B3",
      adminComments:
        "Hajj authorization letter is expired. Please upload a valid authorization letter from Ministry of Hajj & Umrah.",
      lastActionDate: "2024-03-11T11:30:00Z",
      lastActionBy: "Admin User",
      documents: [
        {
          id: "10",
          name: "Company Registration",
          type: "company_registration",
          uploadDate: "2024-03-08",
          status: "verified",
          size: "2.2 MB",
        },
        {
          id: "11",
          name: "Expired Authorization",
          type: "hajj_authorization",
          uploadDate: "2024-03-08",
          status: "rejected",
          size: "1.7 MB",
        },
      ],
    },
  ]);
  const [agentsData, setAgentsData] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedAgentDocuments, setSelectedAgentDocuments] = useState([]);
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] =
    useState(false);
  const [adminComment, setAdminComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewDocument, setViewDocument] = useState<Document | null>(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [imgId, setImgId] = useState();

  const handleViewDocument = (doc: Document) => {
    setViewDocument(doc);
    setImgId(doc.documentId);
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
        doc.file?.name ||
        doc.name ||
        `document.${contentType.split("/")[1] || "bin"}`;

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

  const handleApproveAgent = async (agentId: string) => {
    try {
      const agent = agentsData.find((a) => a.agentId === agentId);
      if (!agent) return;

      const payload = {
        ...agent,
        agencyStatus: "APPROVED",
        adminComments: adminComment ? adminComment : "Approved by admin",
        rejectionRemarks: "",
      };

      // console.log("APPROVE PAYLOAD =>", payload);

      await axios.put(`${baseURL}agents/${agentId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(`${agent?.agencyName} approved successfully`);

      fetchAgents();
      setIsVerificationDialogOpen(false);
      setSelectedAgent(null);
      setAdminComment("");
    } catch (error) {
      console.error("Approve API Error:", error);
      toast.error("Failed to approve agent");
    }
  };

  const handleRejectAgent = async (agentId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      const agent = agentsData.find((a) => a.agentId === agentId);
      if (!agent) return;

      const payload = {
        ...agent,
        agencyStatus: "REJECTED",
        rejectionRemarks: rejectionReason
          ? rejectionReason
          : "Rejected by admin",
        adminComments: "",
      };

      // console.log("REJECT PAYLOAD =>", payload);

      await axios.put(`${baseURL}agents/${agentId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(`${agent?.agencyName} rejected successfully`);

      fetchAgents();
      setIsVerificationDialogOpen(false);
      setSelectedAgent(null);
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
    setIsVerificationDialogOpen(false);
    setSelectedAgent(null);
    setAdminComment("");
  };

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
      case "verified":
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

  const filteredAgents = agentsData.filter((agent: any) => {
    const matchesSearch =
      agent?.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent?.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent?.agencyEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || agent.agencyStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: agentsData.length,
    pending: agentsData.filter((a: any) => a.agencyStatus === "NEW").length,
    approved: agentsData.filter((a: any) => a.agencyStatus === "APPROVED")
      .length,
    rejected: agentsData.filter((a: any) => a.agencyStatus === "REJECTED")
      .length,
    reuploadRequested: agentsData.filter(
      (a: any) => a.agencyStatus === "reupload_requested",
    ).length,
  };

  const token = sessionStorage.getItem("token");
  const fetchAgentDocuments = async (agentId: any) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${baseURL}agent-documents/byAgent/${agentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("agent document --->", response.data);

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
      const response = await axios.get(`${baseURL}agents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgentsData(response.data);
      // console.log("agents---->", response.data);
    } catch (error) {
      console.error("GET API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchViewImage = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.get(
        `${baseURL}agent-documents/view/${imgId}?mode=inline`,
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
  useEffect(() => {
    if (imgId) {
      fetchViewImage();
    }
  }, [viewDocument]);

  useEffect(() => {
    fetchAgents();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="space-y-6 pb-10 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-primary">
              Hajj Agent Verification
            </h2>
            <p className="text-muted-foreground">
              Review and verify agent registrations and documents
            </p>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-0">
            <CardContent className="flex items-center gap-4 p-4">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Agents</p>
                <p className="text-2xl font-bold">{agentsData?.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardContent className="flex items-center gap-4 p-4">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardContent className="flex items-center gap-4 p-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardContent className="flex items-center gap-4 p-4">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardContent className="flex items-center gap-4 p-4">
              <RotateCcw className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Re-upload Req.</p>
                <p className="text-2xl font-bold">{stats.reuploadRequested}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-0">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search agents by company, name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="reupload_requested">
                    Re-upload Requested
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Agents List */}
        <div className="space-y-4">
          {filteredAgents.map((agent: any) => {
            const StatusIcon = getStatusIcon(agent.agencyStatus);

            return (
              <Card
                key={agent.agentId}
                className="hover:shadow-md transition-shadow p-0"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${agent?.agencyName}`}
                        />
                        <AvatarFallback>
                          {agent?.agencyName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {agent?.agencyName}
                        </h3>
                        <p className="text-muted-foreground">
                          {agent?.contactPerson}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{agent?.agencyEmail}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{agent?.agencyPhone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(agent?.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Documents: {"2"}/
                            {requiredDocuments.filter((d) => d.required).length}{" "}
                            required uploaded
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {agent?.address}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Last updated:{" "}
                            {new Date(agent.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge
                        className={`${getStatusColor(agent?.agencyStatus)} flex items-center gap-1`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {agent?.agencyStatus.replace("_", " ").toUpperCase()}
                      </Badge>

                      <Dialog
                        open={
                          isVerificationDialogOpen &&
                          selectedAgent?.agentId === agent?.agentId
                        }
                        onOpenChange={(open) => {
                          setIsVerificationDialogOpen(open);
                          if (!open) {
                            setSelectedAgent(null);
                            setAdminComment("");
                            setRejectionReason("");
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAgent(agent);
                              fetchAgentDocuments(agent.agentId);
                            }}
                            className="hover:bg-secondary"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="!max-w-[60vw] w-[100vw] h-[95vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Building2 className="w-5 h-5" />
                              {agent?.agencyName} - Verification Details
                            </DialogTitle>
                            <DialogDescription>
                              Review agent details and documents for
                              verification
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-6">
                            {/* Agent Details */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                              <div>
                                <p className="text-sm font-medium">
                                  Company Name
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {agent?.agencyName}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  Owner Name
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {agent?.contactPerson}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Email</p>
                                <p className="text-sm text-muted-foreground">
                                  {agent?.agencyEmail}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Phone</p>
                                <p className="text-sm text-muted-foreground">
                                  {agent?.agencyPhone}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  PAN Number
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {agent.panNumber}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  GST Number
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {agent?.gstnumber}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-sm font-medium">
                                  Office Address
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {agent?.address}
                                </p>
                              </div>
                            </div>

                            {/* Documents */}
                            <div>
                              <h3 className="text-lg font-medium mb-4">
                                Uploaded Documents
                              </h3>
                              <div className="space-y-3">
                                {selectedAgentDocuments &&
                                selectedAgentDocuments.length > 0 ? (
                                  selectedAgentDocuments.map((reqDoc) => {
                                    const uploadedDoc =
                                      selectedAgentDocuments.find(
                                        (doc) =>
                                          doc?.documentType ===
                                          reqDoc?.documentType,
                                      );

                                    console.log("uploadedDoc==>", uploadedDoc);

                                    return (
                                      <div
                                        key={reqDoc?.agentId}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                      >
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
                                          {uploadedDoc ? (
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
                                                onClick={() =>
                                                  handleViewDocument(
                                                    uploadedDoc,
                                                  )
                                                }
                                              >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                              </Button>

                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                  handleDownloadDocument(
                                                    uploadedDoc,
                                                  )
                                                }
                                              >
                                                <Download className="w-4 h-4 mr-1" />
                                                Download
                                              </Button>
                                            </>
                                          ) : (
                                            <Badge
                                              variant="secondary"
                                              className="bg-red-100 text-red-800"
                                            >
                                              <XCircle className="w-3 h-3 mr-1" />
                                              Not Uploaded
                                            </Badge>
                                          )}
                                        </div>
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
                                      This agent has not uploaded any documents
                                      yet.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Previous Admin Comments */}
                            {agent.adminComments && (
                              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <AlertTriangle className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium text-blue-800">
                                    Previous Admin Feedback
                                  </span>
                                </div>
                                <p className="text-sm text-blue-700">
                                  {agent.adminComments}
                                </p>
                                {agent.lastActionDate && (
                                  <p className="text-xs text-blue-600 mt-1">
                                    {new Date(
                                      agent.lastActionDate,
                                    ).toLocaleString()}{" "}
                                    by {agent.lastActionBy}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Admin Action Section */}
                            {agent.agencyStatus === "PENDING" ||
                            agent.agencyStatus === "reupload_requested" ? (
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="admin-comment">
                                    Admin Comments / Feedback
                                  </Label>
                                  <Textarea
                                    id="admin-comment"
                                    placeholder="Add your comments or feedback for the agent..."
                                    value={adminComment}
                                    onChange={(e) =>
                                      setAdminComment(e.target.value)
                                    }
                                    rows={3}
                                  />
                                </div>

                                <div className="flex gap-3">
                                  <Button
                                    onClick={() =>
                                      handleApproveAgent(agent.agentId)
                                    }
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve Agent
                                  </Button>

                                  <Button
                                    onClick={() =>
                                      handleRequestReupload(agent.agentId)
                                    }
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
                                          Please provide a clear reason for
                                          rejecting this agent's registration.
                                          This feedback will be sent to the
                                          agent.
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
                                          onChange={(e) =>
                                            setRejectionReason(e.target.value)
                                          }
                                          rows={4}
                                        />
                                      </div>

                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleRejectAgent(agent.agentId)
                                          }
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
                                  className={`${getStatusColor(agent.agencyStatus)} text-lg px-4 py-2`}
                                >
                                  <StatusIcon className="w-4 h-4 mr-2" />
                                  Agent{" "}
                                  {agent.agencyStatus
                                    .replace("_", " ")
                                    .toUpperCase()}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Document Summary */}
                  {/* <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Documents: {"2"}/
                          {requiredDocuments.filter((d) => d.required).length}{" "}
                          required uploaded
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {"456 Park Street, Kolkata, West Bengal 700016"}
                        </span>
                      </div>
                    </div>

                    {agent.lastActionDate && (
                      <span className="text-xs text-muted-foreground">
                        Last updated:{" "}
                        {new Date(agent.lastActionDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div> */}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredAgents.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No agents found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
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
            setIsLoading(false);
          }
        }}
      >
        <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {viewDocument?.name}
            </DialogTitle>
            <DialogDescription>Document preview and details</DialogDescription>
          </DialogHeader>

          {viewDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge
                    className={`${getStatusColor(viewDocument?.status)} mt-1`}
                  >
                    {viewDocument?.status}
                    {/* <span className="ml-1 capitalize">
                      {viewDocument?.status}
                    </span> */}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Upload Date</Label>
                  <p className="font-medium">
                    {viewDocument.updatedBy &&
                      formatDate(viewDocument?.updatedBy)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">File Type</Label>
                  <p className="font-medium">{viewDocument?.documentType}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">File Name</Label>
                  {/* <p className="font-medium text-sm">
                    {viewDocument.file?.name}
                  </p> */}
                </div>
              </div>

              <Separator />

              <div className="border-2 border-dashed rounded-lg p-4 sm:p-5 bg-muted flex flex-col items-center justify-center overflow-hidden">
                <div className=" rounded-lg bg-muted">
                  {isLoading && (
                    <p className="text-sm text-muted-foreground text-center">
                      Loading preview...
                    </p>
                  )}

                  {!isLoading && previewType === "image" && previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Document Preview"
                      className="w-full max-w-[100%] max-h-[320px] object-contain rounded-md"
                    />
                  )}

                  {!isLoading1 &&
                    viewDocument?.documentType === "pdf" &&
                    viewDocument?.filePath && (
                      <iframe
                        src={`${viewDocument?.filePath}#zoom=40`}
                        title="PDF Preview"
                        className="w-full h-[320px] sm:h-[320px] rounded-md border"
                      />
                    )}

                  {!viewDocument?.filePath && !isLoading1 && (
                    <FileText className="h-24 w-24 text-muted-foreground mx-auto" />
                  )}
                </div>
                <div className="flex justify-center pt-3">
                  <Button onClick={() => handleDownloadDocument(viewDocument)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Document
                  </Button>
                </div>
              </div>

              {viewDocument.comments && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Label className="text-sm font-medium">Comments</Label>
                  <p className="text-sm mt-1">{viewDocument.comments}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AgentVerification;
