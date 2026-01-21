import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  ArrowUp,
  ArrowDown,
  Clock,
  Package,
  Users,
  Calendar,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { useNavigate } from "react-router";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import { toast } from "react-toastify";

const SubscriptionPage = () => {
  const [selectedTier, setSelectedTier] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [plans, setPlans] = useState<any>([]);
  const [agent, setAgent] = useState<any>(null);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // SAME DATA (example – tum apna existing data yahin use karo)
  const currentSubscription = {
    tier: "Basic",
    autoRenewal: true,
  };

  const availableTiers = [
    {
      id: 1,
      name: "Basic",
      price: 999,
      validity: 1,
      maxPackages: 10,
      seatLimit: 5,
      popular: true,
      features: ["Limited Packages", "Basic Support"],
    },
    {
      id: 2,
      name: "Standard",
      price: 1999,
      validity: 3,
      maxPackages: 50,
      seatLimit: 15,
      popular: false,
      features: ["More Packages", "Priority Support", "Analytics"],
    },
    {
      id: 3,
      name: "Premium",
      price: 3999,
      validity: 6,
      maxPackages: 200,
      seatLimit: 50,
      popular: false,
      features: ["Unlimited Packages", "Dedicated Support"],
    },
    {
      id: 4,
      name: "Premium",
      price: 3999,
      validity: 6,
      maxPackages: 200,
      seatLimit: 50,
      popular: false,
      features: ["Unlimited Packages", "Dedicated Support"],
    },
  ];

  const fetchAgent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}agents/byUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAgent(response.data);
    } catch (error) {
      console.error("Error fetching Cities:", error);
    }
  };

  const handleTierChange = async (tier: any) => {
    if (!agent?.agentId) {
      toast.error("Agent not loaded yet");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + tier.validityMonths);

      const payload = {
        agentId: agent?.agentId,
        subscriptionId: tier.subscriptionId, // verify this key
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        isActive: true,
        packagesUsed: 0,
        seatsUsed: 0,
        createdBy: agent.agentId,
        updatedBy: agent.agentId,
      };

      await axios.post(`${baseURL}agent-subscriptions`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Subscription requested successfully");
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      toast.error("Subscription request failed");
    }
  };

  const toggleAutoRenewal = () => {
    console.log("Toggle auto renewal");
  };

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}subscriptions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlans(response.data);
    } catch (error) {
      console.error("Error fetching Cities:", error);
    }
  };

  useEffect(() => {
    fetchAgent();
    fetchSubscriptions();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">
            Subscription Plans
          </h1>
          <p className="text-muted-foreground">
            Select the subscription tier that best fits your needs
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button className="bg-primary hover:bg-primary/90">
            <ArrowUp className="w-4 h-4 mr-2" />
            Upgrade Plan
          </Button>

          <Button variant="outline">
            <ArrowDown className="w-4 h-4 mr-2" />
            Downgrade
          </Button>

          <Button variant="outline" onClick={toggleAutoRenewal}>
            <Clock className="w-4 h-4 mr-2" />
            {currentSubscription.autoRenewal ? "Disable" : "Enable"}{" "}
            Auto-Renewal
          </Button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans?.map((tier: any) => (
            <Card
              key={tier.subscriptionId}
              className={`relative cursor-pointer transition-all ${
                selectedTier?.subscriptionId === tier?.subscriptionId
                  ? "ring-2 ring-secondary"
                  : ""
              } ${tier.isActive ? "ring-2 ring-secondary" : ""}`}
              onClick={() => setSelectedTier(tier)}
            >
              {tier?.isActive && (
                <div className="absolute top-0 right-0 bg-secondary text-white px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                  POPULAR
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-xl">
                  {tier?.subscriptionName}
                </CardTitle>
                <div className="text-3xl font-bold text-primary">
                  ₹{tier?.price}
                </div>
                <CardDescription className="text-primary/90">
                  per {tier?.validityMonths} month
                  {tier?.validityMonths > 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-primary/90" />
                    <span>{tier?.maxPackages} packages</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary/90" />
                    <span>{tier?.seatLimit} seats limit</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary/90" />
                    <span>{tier?.validityMonths} month validity</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Features:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {availableTiers.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        {feature.features}
                      </li>
                    ))}
                  </ul>
                </div>

                {tier.isActive && (
                  <Badge
                    className="w-full justify-center bg-green-100 text-green-800"
                    onClick={() =>
                      navigate("/subscription-details", {
                        state: { tier },
                      })
                    }
                  >
                    Current Plan
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Footer */}
        {selectedTier &&
          !selectedTier.isActive && ( // 👈 ONLY THIS LINE ADDED
            <div className="flex justify-end gap-3 pt-6 max-w-md mx-auto">
              <Button
                onClick={() => setIsConfirmOpen(true)}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Request {selectedTier.subscriptionName} Plan
              </Button>

              <Button variant="outline" onClick={() => setSelectedTier(null)}>
                Cancel
              </Button>
            </div>
          )}
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Plan Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to request the{" "}
              <strong>{selectedTier?.subscriptionName}</strong> plan?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              No
            </Button>

            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                handleTierChange(selectedTier);
                setIsConfirmOpen(false);
              }}
            >
              Yes, Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPage;
