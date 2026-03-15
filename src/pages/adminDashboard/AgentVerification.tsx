import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
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
import { Button } from "@/components/ui/button";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

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
  const [agentsData, setAgentsData] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [viewDocument, setViewDocument] = useState<Document | null>(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [imgId, setImgId] = useState();

  const navigate = useNavigate();

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
    pending: agentsData.filter((a: any) => a.agencyStatus === "PENDING").length,
    approved: agentsData.filter((a: any) => a.agencyStatus === "APPROVED")
      .length,
    rejected: agentsData.filter((a: any) => a.agencyStatus === "REJECTED")
      .length,
    reuploadRequested: agentsData.filter(
      (a: any) => a.agencyStatus === "reupload_requested",
    ).length,
  };

  const token = sessionStorage.getItem("token");

  // GET agents
  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${baseURL}agents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgentsData(response.data);
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
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardContent className="flex items-center gap-4 p-4">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
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
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
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

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate("/agent-verification-details", {
                            state: { agent },
                          })
                        }
                        className="hover:bg-secondary"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Button>
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
    </>
  );
}

export default AgentVerification;
