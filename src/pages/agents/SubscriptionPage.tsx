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
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";

const SubscriptionPage = ({ onSubscriptionSuccess }) => {
  const [selectedTier, setSelectedTier] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [agent, setAgent] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("token");
  const userId = Number(sessionStorage.getItem("userId"));
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
      popular: false,
      features: ["Limited Packages", "Basic Support"],
    },
    {
      id: 2,
      name: "Standard",
      price: 1999,
      validity: 3,
      maxPackages: 50,
      seatLimit: 15,
      popular: true,
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
  ];

  useEffect(() => {
    fetchAgent();
    getSubscriptions();
  }, []);

  const getSubscriptions = async () => {
    try {
      const res = await axios.get(`${baseURL}subscriptions`, {
        headers: {
          Authorization: `Bearer ${token}`, // optional
        },
      });

      setSubscriptions(res.data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const fetchAgent = async () => {
    try {
      const token = sessionStorage.getItem("token");
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

  const handleTierChange = (tier) => {
    setSelectedTier(tier);
    setIsConfirmOpen(true);
  };

  const toggleAutoRenewal = () => {
    console.log("Toggle auto renewal");
  };

  const handleConfirmSubscription = async () => {
    try {
      setLoading(true);

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + selectedTier.validityMonths);

      const payload = {
        agentId: Number(agent?.agentId),
        subscriptionId: selectedTier.subscriptionId,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        isActive: true,
        // packagesUsed: selectedTier.maxPackages,
        // seatsUsed: selectedTier.seatLimit,
        // createdBy: userId,
        // updatedBy: userId,
      };

      await axios.post(`${baseURL}agent-subscriptions`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Subscription request submitted successfully ✅");
      setIsConfirmOpen(false);
      setSelectedTier(null);
      onSubscriptionSuccess?.();
    } catch (error) {
      console.error("Subscription error", error);
      toast.error("Failed to submit subscription ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">
            Subscription Plans
          </h1>
          <p className="text-primary/90">
            Select the subscription tier that best fits your needs
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptions.map((tier) => (
            <Card
              key={tier.subscriptionId}
              className={`relative cursor-pointer transition-all ${
                selectedTier?.subscriptionId === tier.subscriptionId
                  ? "ring-2 ring-secondary"
                  : ""
              } ${tier?.popular ? "ring-2 ring-secondary" : ""}`}
              onClick={() => setSelectedTier(tier)}
            >
              {/* {tier?.popular && ( */}
              <div className="absolute top-0 right-0 bg-secondary text-white px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              {/* )} */}

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
                    {availableTiers?.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        {feature.features}
                      </li>
                    ))}
                  </ul>
                </div>

                {tier.name === currentSubscription.tier && (
                  <Badge className="w-full justify-center bg-green-100 text-green-800">
                    Current Plan
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Footer */}
        {selectedTier && selectedTier.name !== currentSubscription.tier && (
          <div className="flex gap-3 pt-6 max-w-md mx-auto">
            <Button
              onClick={() => handleTierChange(selectedTier)}
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
            <DialogTitle>Confirm Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to request the{" "}
              <b>{selectedTier?.subscriptionName}</b> plan?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>

            <Button
              onClick={handleConfirmSubscription}
              disabled={loading}
              className=" bg-primary"
            >
              {loading ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPage;
