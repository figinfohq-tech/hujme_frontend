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
import { Switch } from "../../components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
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
} from "../../components/ui/alert-dialog";
import {
  Crown,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Package,
  Users,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  validity: number; // in months
  maxPackages: number;
  seatLimit: number;
  isActive: boolean;
  features: string[];
  agentCount: number;
}

function SubscriptionTiers() {
  console.log("👑 SubscriptionTiers page rendered");

  const [tiers, setTiers] = useState<SubscriptionTier[]>([
    {
      id: "1",
      name: "Basic",
      price: 990,
      validity: 1,
      maxPackages: 5,
      seatLimit: 50,
      isActive: true,
      features: ["Basic Support", "Standard Facilities", "Email Notifications"],
      agentCount: 45,
    },
    {
      id: "2",
      name: "Premium",
      price: 2990,
      validity: 3,
      maxPackages: 20,
      seatLimit: 200,
      isActive: true,
      features: [
        "Priority Support",
        "All Facilities",
        "SMS & Email Notifications",
        "Analytics Dashboard",
      ],
      agentCount: 89,
    },
    {
      id: "3",
      name: "Enterprise",
      price: 5990,
      validity: 6,
      maxPackages: 100,
      seatLimit: 1000,
      isActive: true,
      features: [
        "24/7 Support",
        "Custom Facilities",
        "All Notifications",
        "Advanced Analytics",
        "API Access",
      ],
      agentCount: 23,
    },
    {
      id: "4",
      name: "Starter",
      price: 490,
      validity: 1,
      maxPackages: 2,
      seatLimit: 20,
      isActive: false,
      features: ["Email Support", "Basic Facilities"],
      agentCount: 0,
    },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<SubscriptionTier | null>(null);
  const [newTier, setNewTier] = useState({
    name: "",
    price: 0,
    validity: 1,
    maxPackages: 1,
    seatLimit: 10,
    isActive: true,
  });

  const handleCreateTier = () => {
    if (!newTier.name || newTier.price <= 0) {
      toast.error("Please fill in all required fields with valid values");
      return;
    }

    // Check for duplicate tier names
    if (
      tiers.some(
        (tier) => tier.name.toLowerCase() === newTier.name.toLowerCase(),
      )
    ) {
      toast.error("A tier with this name already exists");
      return;
    }

    const tier: SubscriptionTier = {
      id: Date.now().toString(),
      ...newTier,
      features: ["Basic Support", "Standard Facilities"],
      agentCount: 0,
    };

    console.log("✅ Creating new tier:", tier);
    setTiers((prev) => [...prev, tier]);
    setIsCreateDialogOpen(false);
    setNewTier({
      name: "",
      price: 0,
      validity: 1,
      maxPackages: 1,
      seatLimit: 10,
      isActive: true,
    });
    toast.success(`${tier.name} tier created successfully`);
  };

  const handleEditTier = () => {
    if (!editingTier || !editingTier.name || editingTier.price <= 0) {
      toast.error("Please fill in all required fields with valid values");
      return;
    }

    // Check for duplicate tier names (excluding current tier)
    if (
      tiers.some(
        (tier) =>
          tier.id !== editingTier.id &&
          tier.name.toLowerCase() === editingTier.name.toLowerCase(),
      )
    ) {
      toast.error("A tier with this name already exists");
      return;
    }

    console.log("✏️ Updating tier:", editingTier);
    setTiers((prev) =>
      prev.map((tier) => (tier.id === editingTier.id ? editingTier : tier)),
    );
    setIsEditDialogOpen(false);
    setEditingTier(null);
    toast.success(`${editingTier.name} tier updated successfully`);
  };

  const deactivateTier = (tierId: string) => {
    const tier = tiers.find((t) => t.id === tierId);
    if (!tier) return;

    if (tier.agentCount > 0) {
      toast.error(
        `Cannot deactivate ${tier.name} tier - ${tier.agentCount} agents are currently using this plan. Please migrate them to another tier first.`,
      );
      return;
    }

    console.log("🔒 Deactivating tier:", tier.name);
    setTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, isActive: false } : t)),
    );
    toast.success(
      `${tier.name} tier has been deactivated. New subscriptions are no longer available.`,
    );
  };

  const activateTier = (tierId: string) => {
    const tier = tiers.find((t) => t.id === tierId);
    if (!tier) return;

    console.log("🔓 Activating tier:", tier.name);
    setTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, isActive: true } : t)),
    );
    toast.success(
      `${tier.name} tier has been activated and is now available for new subscriptions.`,
    );
  };

  const deleteTier = (tierId: string) => {
    const tier = tiers.find((t) => t.id === tierId);
    if (!tier) return;

    if (tier.agentCount > 0) {
      toast.error(
        `Cannot delete ${tier.name} tier - ${tier.agentCount} agents are currently subscribed. Please migrate all agents to other tiers before deletion.`,
      );
      return;
    }

    console.log("🗑️ Deleting tier:", tier.name);
    setTiers((prev) => prev.filter((t) => t.id !== tierId));
    toast.success(`${tier.name} tier has been permanently deleted.`);
  };

  const openEditDialog = (tier: SubscriptionTier) => {
    setEditingTier({ ...tier });
    setIsEditDialogOpen(true);
  };

  const activeTierCount = tiers.filter((t) => t.isActive).length;
  const totalRevenue = tiers.reduce(
    (sum, tier) => sum + tier.price * tier.agentCount,
    0,
  );
  const totalAgents = tiers.reduce((sum, tier) => sum + tier.agentCount, 0);
  const mostPopularTier = tiers.reduce((prev, current) =>
    prev.agentCount > current.agentCount ? prev : current,
  );

  return (
    <div className="space-y-6 animate-fade-in pb-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">
            Subscription Tiers
          </h2>
          <p className="text-muted-foreground">
            Manage subscription plans and pricing
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create New Tier
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
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-0">
          <CardContent className="flex items-center gap-4 p-4">
            <Crown className="w-8 h-8 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">Active Tiers</p>
              <p className="text-2xl text-primary font-bold">
                {activeTierCount}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="flex items-center gap-4 p-4">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Subscribers</p>
              <p className="text-2xl text-primary font-bold">{totalAgents}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="flex items-center gap-4 p-4">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl text-primary font-bold">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="flex items-center gap-4 p-4">
            <Star className="w-8 h-8 text-primary/90" />
            <div>
              <p className="text-sm text-muted-foreground">Most Popular</p>
              <p className="text-lg text-primary font-bold">
                {mostPopularTier.name}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={`relative overflow-hidden ${tier.name === "Premium" ? "ring-2 ring-secondary" : ""}`}
          >
            {tier.name === "Premium" && (
              <div className="absolute top-0 right-0 bg-hajj-accent text-white px-3 py-1 text-xs font-medium">
                POPULAR
              </div>
            )}

            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={tier.isActive ? "default" : "secondary"}
                    className={
                      tier.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {tier.isActive ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                {tier.agentCount} active subscribers
                {tier.agentCount > 0 && !tier.isActive && (
                  <span className="text-yellow-600 ml-2">
                    ⚠️ Has active users
                  </span>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  ₹{tier.price}
                </div>
                <p className="text-sm text-muted-foreground">
                  per {tier.validity} month{tier.validity > 1 ? "s" : ""}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-primary/90" />
                  <span>{tier.maxPackages} packages</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary/90" />
                  <span>{tier.seatLimit} seats limit</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary/90" />
                  <span>{tier.validity} month validity</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Features:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-secondary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(tier)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>

                {tier.isActive ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deactivateTier(tier.id)}
                    className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                    disabled={tier.agentCount > 0}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Deactivate
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => activateTier(tier.id)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Activate
                  </Button>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={tier.agentCount > 0}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        Delete Subscription Tier
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to permanently delete the{" "}
                        <strong>{tier.name}</strong> tier? This action cannot be
                        undone and will remove all tier configurations.
                        {tier.agentCount > 0 && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-800">
                            <strong>Warning:</strong> This tier has{" "}
                            {tier.agentCount} active subscribers. You must
                            migrate all agents to other tiers before deletion.
                          </div>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteTier(tier.id)}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={tier.agentCount > 0}
                      >
                        Delete Permanently
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {tier.agentCount > 0 && (
                <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                  💡 Tip: To deactivate or delete this tier, first migrate all{" "}
                  {tier.agentCount} subscribers to other active tiers.
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Subscription Tier</DialogTitle>
            <DialogDescription>
              Modify the subscription plan details
            </DialogDescription>
          </DialogHeader>

          {editingTier && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tier-name">Tier Name *</Label>
                <Input
                  id="edit-tier-name"
                  placeholder="e.g., Professional"
                  value={editingTier.name}
                  onChange={(e) =>
                    setEditingTier((prev) =>
                      prev ? { ...prev, name: e.target.value } : null,
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-tier-price">Price (₹) *</Label>
                  <Input
                    id="edit-tier-price"
                    type="number"
                    min="1"
                    value={editingTier.price || ""}
                    onChange={(e) =>
                      setEditingTier((prev) =>
                        prev
                          ? { ...prev, price: parseInt(e.target.value) || 0 }
                          : null,
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-tier-validity">
                    Validity (months) *
                  </Label>
                  <Input
                    id="edit-tier-validity"
                    type="number"
                    min="1"
                    value={editingTier.validity}
                    onChange={(e) =>
                      setEditingTier((prev) =>
                        prev
                          ? { ...prev, validity: parseInt(e.target.value) || 1 }
                          : null,
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-max-packages">Max Packages *</Label>
                  <Input
                    id="edit-max-packages"
                    type="number"
                    min="1"
                    value={editingTier.maxPackages}
                    onChange={(e) =>
                      setEditingTier((prev) =>
                        prev
                          ? {
                              ...prev,
                              maxPackages: parseInt(e.target.value) || 1,
                            }
                          : null,
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-seat-limit">Seat Limit *</Label>
                  <Input
                    id="edit-seat-limit"
                    type="number"
                    min="1"
                    value={editingTier.seatLimit}
                    onChange={(e) =>
                      setEditingTier((prev) =>
                        prev
                          ? {
                              ...prev,
                              seatLimit: parseInt(e.target.value) || 10,
                            }
                          : null,
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-tier-active"
                  checked={editingTier.isActive}
                  onCheckedChange={(checked) =>
                    setEditingTier((prev) =>
                      prev ? { ...prev, isActive: checked } : null,
                    )
                  }
                  disabled={editingTier.agentCount > 0 && editingTier.isActive}
                />
                <Label htmlFor="edit-tier-active">
                  Active (available for new subscriptions)
                  {editingTier.agentCount > 0 && editingTier.isActive && (
                    <span className="text-xs text-muted-foreground block">
                      Cannot deactivate - has active subscribers
                    </span>
                  )}
                </Label>
              </div>

              {editingTier.agentCount > 0 && (
                <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded">
                  <strong>Note:</strong> This tier has {editingTier.agentCount}{" "}
                  active subscribers. Changes to limits will affect existing
                  users.
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleEditTier}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Update Tier
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingTier(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SubscriptionTiers;
