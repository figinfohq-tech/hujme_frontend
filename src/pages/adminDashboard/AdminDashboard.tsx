import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Users,
  Crown,
  Package,
  Building,
  DollarSign,
  TrendingUp,
  Plus,
  Activity,
  CheckCircle,
  XCircle,
  Hotel,
  Car,
  Utensils,
  MapPin,
  Shield,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  // Dialog states
  const [isAddFacilityOpen, setIsAddFacilityOpen] = useState(false);
  const [isApproveAgentOpen, setIsApproveAgentOpen] = useState(false);
  const [isCreateTierOpen, setIsCreateTierOpen] = useState(false);

  // Form states
  const [newFacility, setNewFacility] = useState({
    name: "",
    category: "Basic" as "Basic" | "Premium" | "Luxury",
    type: "Hotel" as
      | "Hotel"
      | "Transport"
      | "Meals"
      | "Guide"
      | "Insurance"
      | "Other",
    description: "",
    isActive: true,
    isMandatory: false,
  });

  const [newTier, setNewTier] = useState({
    name: "",
    price: 0,
    validity: 1,
    maxPackages: 1,
    seatLimit: 10,
    isActive: true,
  });

  const [selectedAgent, setSelectedAgent] = useState<string>("");

  // Mock data for pending agents
  const pendingAgents = [
    {
      id: "1",
      company: "Al-Barakah Travel & Tours",
      license: "LIC-2024-001",
      contact: "Ahmed Al-Rashid",
      documentsCount: "7/8",
      registrationDate: "2024-03-10",
      status: "pending_verification",
    },
    {
      id: "2",
      company: "Green Crescent Tours Pvt Ltd",
      license: "LIC-2024-002",
      contact: "Fatima Hassan",
      documentsCount: "8/8",
      registrationDate: "2024-03-12",
      status: "ready_for_approval",
    },
    {
      id: "3",
      company: "Holy Journey Travel Services",
      license: "LIC-2024-003",
      contact: "Omar Abdullah",
      documentsCount: "6/8",
      registrationDate: "2024-03-08",
      status: "incomplete_documents",
    },
  ];

  const stats = [
    {
      title: "Total Agents",
      value: "245",
      subtitle: "187 Active • 58 Inactive",
      icon: Users,
      trend: "+12%",
      color: "text-primary",
    },
    {
      title: "Active Subscriptions",
      value: "187",
      subtitle: "89 Premium • 98 Standard",
      icon: Crown,
      trend: "+8%",
      color: "text-secondary",
    },
    {
      title: "Packages Created",
      value: "1,432",
      subtitle: "This month: 89",
      icon: Package,
      trend: "+24%",
      color: "text-primary/90",
    },
    {
      title: "Revenue",
      value: "₹8,94,200",
      subtitle: "This month",
      icon: DollarSign,
      trend: "+18%",
      color: "text-green-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New agent registration approved",
      agent: "Al-Barakah Travel",
      time: "2 hours ago",
      type: "approval",
    },
    {
      id: 2,
      action: "Subscription tier upgraded",
      agent: "Makkah Tours Ltd",
      time: "4 hours ago",
      type: "upgrade",
    },
    {
      id: 3,
      action: "New facility added",
      agent: "Admin",
      time: "6 hours ago",
      type: "facility",
    },
    {
      id: 4,
      action: "Package published",
      agent: "Medina Pilgrimage Co",
      time: "8 hours ago",
      type: "package",
    },
    {
      id: 5,
      action: "Agent deactivated",
      agent: "Sunset Travel",
      time: "1 day ago",
      type: "deactivation",
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      company: "Green Crescent Tours",
      license: "LIC-2024-001",
      documents: "Complete",
      priority: "high",
    },
    {
      id: 2,
      company: "Holy Journey Travel",
      license: "LIC-2024-002",
      documents: "Pending",
      priority: "medium",
    },
    {
      id: 3,
      company: "Sacred Path Agency",
      license: "LIC-2024-003",
      documents: "Complete",
      priority: "high",
    },
  ];

  // Handle form submissions
  const handleCreateFacility = () => {
    if (!newFacility.name || !newFacility.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsAddFacilityOpen(false);
    setNewFacility({
      name: "",
      category: "Basic",
      type: "Hotel",
      description: "",
      isActive: true,
      isMandatory: false,
    });
    toast.success(`${newFacility.name} facility created successfully`);
  };

  const handleQuickApprove = () => {
    if (!selectedAgent) {
      toast.error("Please select an agent to approve");
      return;
    }

    const agent = pendingAgents.find((a) => a.id === selectedAgent);
    setIsApproveAgentOpen(false);
    setSelectedAgent("");
    toast.success(
      `${agent?.company} has been approved. Opening detailed verification...`,
    );

    // Navigate to detailed verification page
    setTimeout(() => {
      navigate("/admin/agent-verification");
    }, 1000);
  };

  const handleCreateTier = () => {
    if (!newTier.name || newTier.price <= 0) {
      toast.error("Please fill in all required fields with valid values");
      return;
    }

    setIsCreateTierOpen(false);
    setNewTier({
      name: "",
      price: 0,
      validity: 1,
      maxPackages: 1,
      seatLimit: 10,
      isActive: true,
    });
    toast.success(`${newTier.name} subscription tier created successfully`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Hotel":
        return Hotel;
      case "Transport":
        return Car;
      case "Meals":
        return Utensils;
      case "Guide":
        return MapPin;
      case "Insurance":
        return Shield;
      default:
        return Building;
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case "ready_for_approval":
        return "bg-green-100 text-green-800";
      case "pending_verification":
        return "bg-yellow-100 text-yellow-800";
      case "incomplete_documents":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-5">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {/* Add Facility Dialog */}
        <Dialog open={isAddFacilityOpen} onOpenChange={setIsAddFacilityOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Facility
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Facility</DialogTitle>
              <DialogDescription>
                Create a new facility for agents to include in their packages
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facility-name">Facility Name *</Label>
                <Input
                  id="facility-name"
                  placeholder="e.g., Premium Hotel Medina"
                  value={newFacility.name}
                  onChange={(e) =>
                    setNewFacility((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={newFacility.category}
                    onValueChange={(value: "Basic" | "Premium" | "Luxury") =>
                      setNewFacility((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={newFacility.type}
                    onValueChange={(
                      value:
                        | "Hotel"
                        | "Transport"
                        | "Meals"
                        | "Guide"
                        | "Insurance"
                        | "Other",
                    ) => setNewFacility((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hotel">Hotel</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Meals">Meals</SelectItem>
                      <SelectItem value="Guide">Guide</SelectItem>
                      <SelectItem value="Insurance">Insurance</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facility-description">Description *</Label>
                <Textarea
                  id="facility-description"
                  placeholder="Describe the facility and its features..."
                  value={newFacility.description}
                  onChange={(e) =>
                    setNewFacility((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="facility-active"
                    checked={newFacility.isActive}
                    onCheckedChange={(checked) =>
                      setNewFacility((prev) => ({ ...prev, isActive: checked }))
                    }
                  />
                  <Label htmlFor="facility-active">Active</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="facility-mandatory"
                    checked={newFacility.isMandatory}
                    onCheckedChange={(checked) =>
                      setNewFacility((prev) => ({
                        ...prev,
                        isMandatory: checked,
                      }))
                    }
                  />
                  <Label htmlFor="facility-mandatory">Mandatory</Label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCreateFacility}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Add Facility
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAddFacilityOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Enhanced Approve Agent Dialog */}
        <Dialog open={isApproveAgentOpen} onOpenChange={setIsApproveAgentOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-primary/80 text-primary/80 hover:bg-primary/80 hover:text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Agent Verification
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-[50vw] w-[100vw] h-[95vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Hajj Agent Verification Queue
              </DialogTitle>
              <DialogDescription>
                Quick overview of pending agent verifications
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-lg font-bold text-yellow-600">
                    {
                      pendingAgents.filter(
                        (a) => a.status === "pending_verification",
                      ).length
                    }
                  </div>
                  <p className="text-xs text-yellow-700">Pending Review</p>
                </div>
                <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {
                      pendingAgents.filter(
                        (a) => a.status === "ready_for_approval",
                      ).length
                    }
                  </div>
                  <p className="text-xs text-green-700">Ready to Approve</p>
                </div>
                <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-lg font-bold text-red-600">
                    {
                      pendingAgents.filter(
                        (a) => a.status === "incomplete_documents",
                      ).length
                    }
                  </div>
                  <p className="text-xs text-red-700">Incomplete Docs</p>
                </div>
              </div>

              {/* Agents List */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {pendingAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{agent.company}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{agent.license}</span>
                            <span>•</span>
                            <span>{agent.contact}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              <span>Docs: {agent.documentsCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(
                                  agent.registrationDate,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getAgentStatusColor(agent.status)}>
                        {agent.status === "ready_for_approval" && (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {agent.status === "pending_verification" && (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {agent.status === "incomplete_documents" && (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
                        {agent.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-3">
                  For detailed document verification and approval, use the
                  dedicated verification module.
                </p>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      navigate("/admin/agent-verification");
                      setIsApproveAgentOpen(false);
                    }}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Open Verification Module
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsApproveAgentOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Subscription Tier Dialog */}
        <Dialog open={isCreateTierOpen} onOpenChange={setIsCreateTierOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary hover:text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Create Subscription Tier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Subscription Tier</DialogTitle>
              <DialogDescription>
                Define a new subscription plan for agents
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tier-name">Tier Name *</Label>
                <Input
                  id="tier-name"
                  placeholder="e.g., Professional"
                  value={newTier.name}
                  onChange={(e) =>
                    setNewTier((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tier-price">Price (₹) *</Label>
                  <Input
                    id="tier-price"
                    type="number"
                    min="1"
                    value={newTier.price || ""}
                    onChange={(e) =>
                      setNewTier((prev) => ({
                        ...prev,
                        price: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tier-validity">Validity (months) *</Label>
                  <Input
                    id="tier-validity"
                    type="number"
                    min="1"
                    value={newTier.validity}
                    onChange={(e) =>
                      setNewTier((prev) => ({
                        ...prev,
                        validity: parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-packages">Max Packages *</Label>
                  <Input
                    id="max-packages"
                    type="number"
                    min="1"
                    value={newTier.maxPackages}
                    onChange={(e) =>
                      setNewTier((prev) => ({
                        ...prev,
                        maxPackages: parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seat-limit">Seat Limit *</Label>
                  <Input
                    id="seat-limit"
                    type="number"
                    min="1"
                    value={newTier.seatLimit}
                    onChange={(e) =>
                      setNewTier((prev) => ({
                        ...prev,
                        seatLimit: parseInt(e.target.value) || 10,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="tier-active"
                  checked={newTier.isActive}
                  onCheckedChange={(checked) =>
                    setNewTier((prev) => ({ ...prev, isActive: checked }))
                  }
                />
                <Label htmlFor="tier-active">
                  Active (available for new subscriptions)
                </Label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCreateTier}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Create Tier
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCreateTierOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="hover:shadow-md transition-shadow p-3"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {stat.subtitle}
                  </p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500 font-medium">
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest system activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "approval"
                        ? "bg-green-500"
                        : activity.type === "upgrade"
                          ? "bg-blue-500"
                          : activity.type === "facility"
                            ? "bg-purple-500"
                            : activity.type === "package"
                              ? "bg-orange-500"
                              : "bg-red-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.agent}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary/80" />
                  Pending Agent Verifications
                </CardTitle>
                <CardDescription>
                  Agent registrations awaiting verification
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/agent-verification")}
              >
                <FileText className="w-4 h-4 mr-1" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex-1">
                    <p className="font-medium">{approval.company}</p>
                    <p className="text-sm text-muted-foreground">
                      {approval.license}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        approval.documents === "Complete"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {approval.documents}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => navigate("/admin/agent-verification")}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Facility Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-secondary" />
            Facility Usage Overview
          </CardTitle>
          <CardDescription>
            Most and least used facilities across all packages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">87%</div>
              <p className="text-sm text-green-700">Premium Hotels</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">73%</div>
              <p className="text-sm text-blue-700">Transport Services</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="text-2xl font-bold text-orange-600 mb-1">64%</div>
              <p className="text-sm text-orange-700">Guided Tours</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
