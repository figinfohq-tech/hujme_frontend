import { useState, useEffect } from "react";
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
  Users,
  Package,
  FolderOpen,
  Shield,
  Calendar,
} from "lucide-react";
import { toast } from "react-toastify";
import { formatDate, validateFileSize, validateFileType } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";

interface Booking {
  id: string;
  packageTitle: string;
  departureDate: Date;
  pilgrims: Pilgrim[];
  status: string;
}

interface Pilgrim {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  relationship: string;
  passportNumber: string;
  status: "active" | "cancelled";
}

interface Document {
  id: string;
  name: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  file?: File;
  uploadDate?: Date;
  comments?: string;
  pilgrimId: string;
  bookingId: string;
}

const requiredDocuments = [
  {
    id: "passport",
    name: "Passport (Scanned Copy)",
    description: "Clear scan of all pages with personal information",
    required: true,
  },
  {
    id: "aadhaar",
    name: "Aadhaar Card",
    description: "Government issued identity card",
    required: true,
  },
  {
    id: "pan",
    name: "PAN Card",
    description: "Permanent Account Number card",
    required: true,
  },
  {
    id: "photo",
    name: "Passport Size Photo",
    description: "Recent photograph as per passport standards",
    required: true,
  },
  {
    id: "medical",
    name: "Medical Fitness Certificate",
    description: "Certificate from registered medical practitioner",
    required: true,
  },
  {
    id: "vaccination",
    name: "Vaccination Certificate",
    description: "COVID-19 and other required vaccinations",
    required: true,
  },
];

// Mock bookings data - in real app, this would come from API/database
const mockBookings: Booking[] = [
  {
    id: "BK001",
    packageTitle: "Premium Hajj Package 2024",
    departureDate: new Date("2024-06-15"),
    status: "confirmed",
    pilgrims: [
      {
        id: "P001",
        name: "Ahmed Ibrahim",
        age: 45,
        gender: "male",
        relationship: "self",
        passportNumber: "A1234567",
        status: "active",
      },
      {
        id: "P002",
        name: "Fatima Ibrahim",
        age: 42,
        gender: "female",
        relationship: "spouse",
        passportNumber: "B7654321",
        status: "active",
      },
    ],
  },
  {
    id: "BK002",
    packageTitle: "Umrah Express Package",
    departureDate: new Date("2024-04-10"),
    status: "pending",
    pilgrims: [
      {
        id: "P003",
        name: "Ahmed Ibrahim",
        age: 45,
        gender: "male",
        relationship: "self",
        passportNumber: "A1234567",
        status: "active",
      },
    ],
  },
];

export const DocumentsPage = () => {
  const [bookings] = useState<Booking[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<string | undefined>(
    undefined
  );
  const [selectedPilgrim, setSelectedPilgrim] = useState<string | undefined>(
    undefined
  );
  const [selectedBookingId, setSelectedBookingId] = useState<any>();
  const [selectedTravelerId, setSelectedTravelerId] = useState<any>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [viewDocument, setViewDocument] = useState<Document | null>(null);
  const [bookingUser, setBookingUser] = useState<any>("");
  const [myPackage, setMyPackge] = useState<any>([]);
  const [travelers, setTravelers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"upload" | "view">("upload");

  console.log("DocumentsPage rendering, documents:", documents.length);
  const isSelectionDone = Boolean(selectedBookingId && selectedPilgrim);
console.log("token====>", localStorage.getItem("token"));

  // Auto-select first booking and pilgrim on mount
  useEffect(() => {
    if (bookings.length > 0 && !selectedBooking) {
      setSelectedBooking(bookings[0].id);
      if (bookings[0].pilgrims.length > 0) {
        setSelectedPilgrim(bookings[0].pilgrims[0].id);
      }
    }
  }, [bookings, selectedBooking]);

  // When booking changes, select first pilgrim
  useEffect(() => {
    if (selectedBooking) {
      const booking = bookings.find((b) => b.id === selectedBooking);
      if (booking && booking.pilgrims.length > 0) {
        setSelectedPilgrim(booking.pilgrims[0].id);
      }
    }
  }, [selectedBooking, bookings]);

  const currentPilgrim = travelers.find(
    (t) => String(t.travelerId) === String(selectedPilgrim)
  );

  // Filter documents for selected pilgrim
  const pilgrimDocuments = documents.filter(
    (d) => d.pilgrimId === selectedPilgrim && d.bookingId === selectedBooking
  );

  const handleFileUpload = async (docId: string, file: File) => {
    if (!selectedPilgrim || !selectedBooking) {
      toast.error("Please select a booking and pilgrim first");
      return;
    }

    console.log(
      "Uploading file:",
      file.name,
      "for document:",
      docId,
      "pilgrim:",
      selectedPilgrim
    );

    // Validate file type
    const allowedTypes = ["pdf", "jpg", "jpeg", "png"];
    if (!validateFileType(file, allowedTypes)) {
      toast.error(
        "Invalid file type. Please upload PDF, JPG, or PNG files only."
      );
      return;
    }

    // Validate file size (5MB max)
    if (!validateFileSize(file, 5)) {
      toast.error("File size too large. Please upload files smaller than 5MB.");
      return;
    }

    setUploadingId(docId);

    try {
      // Mock upload process
      // 🔥 ONLY CHANGE: POST API CALL (mock removed)
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const payload = {
        userId: Number(userId),
        bookingId: Number(selectedBookingId),
        travelerId: Number(selectedPilgrim),
        documentType: docId,
        fileName: file.name,
        filePath: `/documents/${userId}/${selectedBookingId}/${selectedPilgrim}/${docId}/${file.name}`,
        fileExtension: file.name.split(".").pop(),
        documentStatus: "pending",
        remarks: "",
      };

      const response = await axios.post(`${baseURL}documents`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Api response---->", response);

      const newDocument: Document = {
        id: `${docId}-${selectedPilgrim}-${Date.now()}`,
        name: requiredDocuments.find((d) => d.id === docId)?.name || "",
        type: file.type,
        status: "pending",
        file,
        uploadDate: new Date(),
        pilgrimId: selectedPilgrim,
        bookingId: selectedBooking,
      };

      setDocuments((prev) => {
        // Remove old document of same type for this pilgrim
        const filtered = prev.filter(
          (d) => !(d.id.startsWith(docId) && d.pilgrimId === selectedPilgrim)
        );
        return [...filtered, newDocument];
      });

      toast.success(
        `Document uploaded successfully for ${response.data.documentType}!`
      );

      // Check if all documents are uploaded for this pilgrim
      const pilgrimDocs = documents.filter(
        (d) =>
          d.pilgrimId === selectedPilgrim && d.bookingId === selectedBooking
      );
      const updatedPilgrimDocs = [
        ...pilgrimDocs.filter((d) => !d.id.startsWith(docId)),
        newDocument,
      ];

      if (updatedPilgrimDocs.length === requiredDocuments.length) {
        toast.success(
          `All documents uploaded for ${response.data.documentType}`
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload document. Please try again.");
    } finally {
      setUploadingId(null);
    }
  };

  const removeDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    toast.info("Document removed");
  };

  const getDocumentForType = (docTypeId: string) => {
    return pilgrimDocuments.find((d) => d.id.startsWith(docTypeId));
  };

  const handleViewDocument = (doc: Document) => {
    setViewDocument(doc);
  };

  const handleDownloadDocument = (doc: Document) => {
    // In real app, this would download from server
    toast.success(`Downloading ${doc.name}...`);
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

  const uploadedCount = pilgrimDocuments.length;
  const progressValue = (uploadedCount / requiredDocuments.length) * 100;

  // Get all pilgrims across all bookings
  const allPilgrims = bookings.flatMap((b) =>
    b.pilgrims.map((p) => ({
      ...p,
      bookingId: b.id,
      packageTitle: b.packageTitle,
    }))
  );

  // Count documents per pilgrim
  const getDocumentCountForPilgrim = (pilgrimId: string, bookingId: string) => {
    return documents.filter(
      (d) => d.pilgrimId === pilgrimId && d.bookingId === bookingId
    ).length;
  };

  // Fetch Booking By User
  const fetchBookingByUser = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await axios.get(`${baseURL}bookings/byUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookingUser(response.data);
      console.log("responce---->", response.data);

      setIsLoading(false);
    } catch (error) {
      console.error("Package Fetch Error:", error);
      setIsLoading(false);
    }
  };
  // Fetch Booking By User
  const ActiveUser = bookingUser.length;

  useEffect(() => {
    fetchBookingByUser();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      // bookingUser se sab packageIds nikaal lo
      const packageRequests = bookingUser.map((user) =>
        axios.get(`${baseURL}packages/${user.packageId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      // sab APIs ek sath call hongi
      const responses = await Promise.all(packageRequests);

      const packagesData = responses.map((res, index) => ({
        ...res.data,
        bookingId: bookingUser[index].bookingId,
      }));

      // state me array of objects save
      setMyPackge(packagesData);
    } catch (error) {
      console.error("Package Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("package responce---->", myPackage);
  // Fetch Booking By User
  // Fetch Booking Travelers
  const fetchTravelersByID = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${baseURL}travelers/byBooking/${selectedBookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTravelers(response.data);
      console.log("asdfghjkl====>", response.data);
    } catch (error) {
      console.error("Package Fetch Error:", error);
    }
  };

  // Fetch Booking Travelers

  useEffect(() => {
    if (bookingUser) {
      fetchPackages();
    }
  }, [bookingUser]);

  useEffect(() => {
    if (selectedBookingId) {
      fetchTravelersByID();
    }
  }, [selectedBookingId]);
  console.log("selectedBookingId=====>", selectedBookingId);

  return (
    <div className="space-y-8 p-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Document Management</h1>
        <p className="text-muted-foreground mt-2">
          Upload and manage travel documents for your pilgrims
        </p>
      </div>

      {/* Booking & Pilgrim Selection */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Select Booking & Pilgrim
          </CardTitle>
          <CardDescription>
            Choose the booking and pilgrim to manage documents for
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="booking-select">Booking</Label>
              <Select
                value={selectedBookingId}
                onValueChange={(value) => setSelectedBookingId(value)}
              >
                <SelectTrigger className="w-full text-gray-700 border-gray-300 focus:ring-green-700 focus:border-green-700">
                  <SelectValue placeholder="Select Booking" />
                </SelectTrigger>

                <SelectContent>
                  {myPackage.map((items: any) => (
                    <SelectItem
                      key={items.bookingId}
                      value={String(items.bookingId)} // ✅ bookingId
                    >
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        {items.packageName} ({items.bookingId})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pilgrim-select">Pilgrim</Label>
              <Select
                onValueChange={(value) => {
                  setSelectedPilgrim(value);
                }}
              >
                <SelectTrigger id="pilgrim-select" className="w-full">
                  <SelectValue placeholder="Select a pilgrim" />
                </SelectTrigger>
                <SelectContent>
                  {travelers?.map((pilgrim) => (
                    <SelectItem
                      key={pilgrim.travelerId}
                      value={pilgrim.travelerId}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {pilgrim.firstName + " " + pilgrim.lastName}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {/* {getDocumentCountForPilgrim(
                            pilgrim.travelerId,
                            selectedBookingId
                          )} */}
                          {uploadedCount}/{requiredDocuments.length}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {currentPilgrim && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">
                    {currentPilgrim.firstName} {currentPilgrim.lastName}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Relationship</Label>
                  <p className="font-medium capitalize">
                    {currentPilgrim.relationship}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Passport</Label>
                  <p className="font-medium">{currentPilgrim.passportNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Documents</Label>
                  <p className="font-medium">
                    {uploadedCount}/{requiredDocuments.length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {viewMode === "upload" && (
        <>
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>
                Upload Progress{" "}
                {currentPilgrim
                  ? `for ${currentPilgrim.firstName} ${currentPilgrim.lastName}`
                  : ""}
              </CardTitle>

              <CardDescription>
                Complete document uploads for this pilgrim
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {uploadedCount} of {requiredDocuments.length} documents
                  uploaded
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progressValue)}% complete
                </span>
              </div>
              <Progress value={progressValue} className="w-full" />
              {uploadedCount === requiredDocuments.length && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>All documents uploaded for {currentPilgrim.name}!</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Document Upload Cards */}
          <div className="grid lg:grid-cols-2 gap-6">
            {requiredDocuments.map((docType) => {
              const uploadedDoc = getDocumentForType(docType.id);
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDocument(uploadedDoc)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDownloadDocument(uploadedDoc)
                              }
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDocument(uploadedDoc.id)}
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
                            <h4 className="font-medium">
                              Upload {docType.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Drag & drop or click to browse files
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, JPG, PNG (max 5MB)
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`file-${docType.id}`}>
                            Select File
                          </Label>
                          <Input
                            id={`file-${docType.id}`}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(docType.id, file);
                            }}
                            disabled={!isSelectionDone || isUploading}
                          />
                        </div>

                        <Button
                          className="w-full"
                          disabled={!isSelectionDone || isUploading}
                          onClick={() => {
                            document
                              .getElementById(`file-${docType.id}`)
                              ?.click();
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
        </>
      )}

      {/* Document Preview Dialog */}
      <Dialog
        open={!!viewDocument}
        onOpenChange={(open) => !open && setViewDocument(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {viewDocument?.name}
            </DialogTitle>
            <DialogDescription>Document preview and details</DialogDescription>
          </DialogHeader>

          {viewDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge
                    className={`${getStatusColor(viewDocument.status)} mt-1`}
                  >
                    {getStatusIcon(viewDocument.status)}
                    <span className="ml-1 capitalize">
                      {viewDocument.status}
                    </span>
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Upload Date</Label>
                  <p className="font-medium">
                    {viewDocument.uploadDate &&
                      formatDate(viewDocument.uploadDate)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">File Type</Label>
                  <p className="font-medium">{viewDocument.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">File Name</Label>
                  <p className="font-medium text-sm">
                    {viewDocument.file?.name}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="border-2 border-dashed rounded-lg p-12 text-center bg-muted">
                <FileText className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Document preview would appear here in production
                </p>
                <Button onClick={() => handleDownloadDocument(viewDocument)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Document
                </Button>
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

      {/* Security Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="h-4 w-4 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-blue-900">
                Secure Document Storage
              </h4>
              <p className="text-sm text-blue-800">
                All uploaded documents are encrypted and stored securely. Your
                personal information is protected with bank-level security
                measures and will only be used for travel processing. Documents
                are linked to specific pilgrims and bookings for easy
                management.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
