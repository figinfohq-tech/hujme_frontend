import { useEffect, useState } from "react";
// import { useAuth } from '../contexts/AuthContext'
import { toast } from "react-toastify";
import {
  Upload,
  FileText,
  CheckCircle,
  Clock,
  X,
  Eye,
  Download,
  AlertTriangle,
  User,
  BookUser,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateFileSize, validateFileType } from "@/lib/utils";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Document {
  id: string;
  name: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  file?: File;
  uploadDate?: Date;
  comments?: string;
}

const requiredDocuments = [
  {
    id: "Agent Aadhar Card",
    name: "Agent Aadhar Card",
    description: "Government issued identity card for agent verification",
    required: true,
  },
  {
    id: "Business PAN Card",
    name: "Business PAN Card",
    description: "Permanent Account Number issued for business identification",
    required: true,
  },
  {
    id: "Business License",
    name: "Business License",
    description: "Official license authorizing business operations",
    required: true,
  },
  {
    id: "IATA Certificate",
    name: "IATA Certificate",
    description: "International Air Transport Association certification",
    required: true,
  },
  {
    id: "HJTC Certificate",
    name: "HJTC Certificate",
    description: "Haj & Umrah Travel Committee approval certificate",
    required: true,
  },
];

export const DocumentsAgent = () => {
  // const { user, updateUser } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [bookingUser, setBookingUser] = useState<any[]>([]);
  const [travelers, setTravelers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const agentId = localStorage.getItem("agentID");

  const handleFileUpload = async (docId: string, file: File) => {
    // validations
    const allowedTypes = ["pdf", "jpg", "jpeg", "png"];
    if (!validateFileType(file, allowedTypes)) {
      toast.error("Invalid file type");
      return;
    }

    if (!validateFileSize(file, 5)) {
      toast.error("File size must be under 5MB");
      return;
    }

    setUploadingId(docId);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        agentId: Number(agentId),
        documentType: docId,
        fileName: file.name,
        filePath: `/agent-documents/${agentId}/${docId}/${file.name}`,
        fileExtension: file.name.split(".").pop(),
        documentStatus: "pending",
        remarks: "",
      };

      const response = await axios.post(`${baseURL}agent-documents`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const docType =
        response.data.documentType.charAt(0).toUpperCase() +
        response.data.documentType.slice(1);

      toast.success(`${docType} uploaded successfully.`);

      // UI update
      const newDocument: Document = {
        id: docId,
        name: requiredDocuments.find((d) => d.id === docId)?.name || "",
        type: file.type,
        status: "pending",
        file,
        uploadDate: new Date(),
      };

      setDocuments((prev) => {
        const filtered = prev.filter((d) => d.id !== docId);
        return [...filtered, newDocument];
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Document upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  const removeDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    toast.info("Document removed");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <X className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const uploadedCount = documents.length;
  const progressValue = (uploadedCount / requiredDocuments.length) * 100;

  return (
    <div className="space-y-8 p-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Document Management</h1>
        <p className="text-muted-foreground mt-2">
          Upload and manage your travel documents securely
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Progress</CardTitle>
          <CardDescription>
            Complete your document uploads to enable booking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {uploadedCount} of {requiredDocuments.length} documents uploaded
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progressValue)}% complete
            </span>
          </div>
          <Progress value={progressValue} className="w-full" />
          {uploadedCount === requiredDocuments.length && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>All documents uploaded! You can now book packages.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Upload Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {requiredDocuments.map((docType) => {
          const uploadedDoc = documents.find((d) => d.id === docType.id);
          const isUploading = uploadingId === docType.id;

          return (
            <Card key={docType.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {docType.name}
                      {docType.required && (
                        <Badge variant="outline" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {docType.description}
                    </CardDescription>
                  </div>
                  {uploadedDoc && (
                    <Badge className={getStatusColor(uploadedDoc.status)}>
                      {getStatusIcon(uploadedDoc.status)}
                      <span className="ml-1 capitalize">
                        {uploadedDoc.status}
                      </span>
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {uploadedDoc ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium">
                            {uploadedDoc.file?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded{" "}
                            {uploadedDoc.uploadDate?.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(docType.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {uploadedDoc.status === "rejected" &&
                      uploadedDoc.comments && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-800">
                              Document Rejected
                            </p>
                            <p className="text-sm text-red-700">
                              {uploadedDoc.comments}
                            </p>
                          </div>
                        </div>
                      )}

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = ".pdf,.jpg,.jpeg,.png";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          if (file) handleFileUpload(docType.id, file);
                        };
                        input.click();
                      }}
                    >
                      Replace Document
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <div className="space-y-2">
                        <h4 className="font-medium">Upload {docType.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Drag & drop or click to browse files
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, JPG, PNG (max 5MB)
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`file-${docType.id}`}>Select File</Label>
                      <Input
                        id={`file-${docType.id}`}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(docType.id, file);
                        }}
                        disabled={isUploading}
                      />
                    </div>

                    <Button
                      className="w-full"
                      disabled={isUploading}
                      onClick={() => {
                        document.getElementById(`file-${docType.id}`)?.click();
                      }}
                    >
                      {isUploading ? (
                        <>
                          <Upload className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-blue-900">
                Secure Document Storage
              </h4>
              <p className="text-sm text-blue-800">
                All uploaded documents are encrypted and stored securely. Your
                personal information is protected with bank-level security
                measures and will only be used for travel processing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
