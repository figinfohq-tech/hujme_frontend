import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Crown,
  Calendar,
  Package,
  Users,
  Building,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Clock,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import SubscriptionPage from "./SubscriptionPage";
import Loader from "@/components/Loader";
import AgentRegistration from "./AgentRegistration";

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  validity: number;
  maxPackages: number;
  seatLimit: number;
  features: string[];
  popular?: boolean;
}

function SubscriptionDetails() {
  console.log("👑 SubscriptionDetails page rendered");

  const currentSubscription = {
    tier: "Premium",
    price: 2990,
    startDate: "2024-02-01",
    endDate: "2024-08-01",
    daysLeft: 25,
    packagesUsed: 15,
    packagesLimit: 20,
    seatsUsed: 450,
    seatsLimit: 500,
    autoRenewal: true,
  };

  const [availableTiers] = useState<SubscriptionTier[]>([
    {
      id: "1",
      name: "Basic",
      price: 990,
      validity: 1,
      maxPackages: 5,
      seatLimit: 50,
      features: [
        "Basic Support",
        "Standard Facilities",
        "Email Notifications",
        "Basic Analytics",
      ],
    },
    {
      id: "2",
      name: "Premium",
      price: 2990,
      validity: 3,
      maxPackages: 20,
      seatLimit: 200,
      features: [
        "Priority Support",
        "All Facilities",
        "SMS & Email Notifications",
        "Advanced Analytics",
        "Custom Branding",
      ],
      popular: true,
    },
    {
      id: "3",
      name: "Enterprise",
      price: 5990,
      validity: 6,
      maxPackages: 100,
      seatLimit: 1000,
      features: [
        "24/7 Support",
        "Custom Facilities",
        "All Notifications",
        "Premium Analytics",
        "API Access",
        "Dedicated Manager",
      ],
    },
  ]);

  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(
    null,
  );
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [agent, setAgent] = useState<any>(null);
  const [planeById, setPlanById] = useState<any>(null);
  const [agentSubscription, setAgentSubscription] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const usageHistory = [
    { month: "February", packages: 12, seats: 320 },
    { month: "March", packages: 15, seats: 420 },
    { month: "April", packages: 18, seats: 480 },
    { month: "May", packages: 15, seats: 450 },
  ];

  const handleTierChange = (tier: SubscriptionTier) => {
    console.log("🔄 Requesting tier change to:", tier.name);
    toast.success(
      `Upgrade request to ${tier.name} submitted. Admin will review shortly.`,
    );
    setIsUpgradeDialogOpen(false);
    setSelectedTier(null);
  };

  const toggleAutoRenewal = () => {
    console.log("🔄 Toggling auto renewal");
    toast.success(
      `Auto renewal ${currentSubscription.autoRenewal ? "disabled" : "enabled"}`,
    );
  };

  const packagesProgress =
    (currentSubscription.packagesUsed / currentSubscription.packagesLimit) *
    100;
  const seatsProgress =
    (currentSubscription.seatsUsed / currentSubscription.seatsLimit) * 100;

  const fetchAgent = async () => {
    try {
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

  const mapSubscriptionFromApi = (apiData) => {
    const startDate = new Date(); // ya api se aaye toh woh use karo
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + apiData.validityMonths);

    const today = new Date();

    const diffTime = endDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      tier: apiData.subscriptionName,
      price: apiData.price,
      startDate,
      endDate,
      daysLeft,
      packagesUsed: 0, // agar api se nahi aa raha
      packagesLimit: apiData.maxPackages,
      seatsUsed: 0,
      seatsLimit: apiData.seatLimit,
      autoRenewal: apiData.isActive,
    };
  };

  const calculateDaysLeft = (endDate: any) => {
    if (!endDate) return 0;

    const today = new Date();
    const end = new Date(endDate);

    // difference in milliseconds
    const diffTime = end.getTime() - today.getTime();

    // convert ms → days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const fetchAgentSubscription = async () => {
    try {
      const response = await axios.get(
        `${baseURL}agent-subscriptions/byAgent/${agent?.agentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAgentSubscription(response.data);
      console.log("fetchAgentSubscription--->", response.data);
      
    } catch (error) {
      console.error("Error fetching Agent Subscription:", error);
      setAgentSubscription([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionbyId = async () => {
    try {
      const response = await axios.get(
        `${baseURL}subscriptions/${agentSubscription[0]?.subscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setPlanById(response.data);
    } catch (error) {
      console.error("Error fetching Cities:", error);
    }
  };

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

  useEffect(() => {
    fetchAgent();
    getSubscriptions();
  }, []);

  useEffect(() => {
    if (agent?.agentId) {
      fetchAgentSubscription();
    }
  }, [agent?.agentId]);

  useEffect(() => {
    if (agentSubscription[0]?.subscriptionId) {
      fetchSubscriptionbyId();
    }
  }, [agentSubscription[0]?.subscriptionId]);

  if (loading) {
    return <Loader />;
  }

  if (agentSubscription.length === 0) {
    return <SubscriptionPage />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Alert for expiry */}
      {calculateDaysLeft(agentSubscription[0]?.endDate) <= 30 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Your subscription expires in{" "}
            {calculateDaysLeft(agentSubscription[0]?.endDate)} days.
            <Button
              variant="link"
              className="p-0 ml-2 text-yellow-800 underline"
            >
              Renew now to avoid service interruption
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Current Subscription Overview */}
      <Card className="border-l-4 border-l-secondary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-secondary" />
                Current Subscription
              </CardTitle>
              <CardDescription>
                Your active subscription details and usage
              </CardDescription>
            </div>
            <Badge className="bg-secondary text-white">
              {planeById?.subscriptionName} Plan
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-hajj-primary">
                ₹{planeById?.price}
              </div>
              <p className="text-sm text-muted-foreground">Monthly Cost</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-lg font-bold">
                  {calculateDaysLeft(agentSubscription[0]?.endDate)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Days Remaining</p>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-hajj-secondary">
                {new Date(agentSubscription[0]?.startDate).toLocaleDateString()}
              </div>
              <p className="text-sm text-muted-foreground">Start Date</p>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-hajj-secondary">
                {new Date(agentSubscription[0]?.endDate).toLocaleDateString()}
              </div>
              <p className="text-sm text-muted-foreground">End Date</p>
            </div>
          </div>

          {/* Usage Progress */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Package Usage</span>
                <span className="text-sm text-muted-foreground">
                  {agentSubscription[0]?.packagesUsed}/{planeById?.maxPackages}
                </span>
              </div>
              <Progress value={packagesProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {planeById?.maxPackages - agentSubscription[0]?.packagesUsed}{" "}
                packages remaining
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Seat Usage</span>
                <span className="text-sm text-muted-foreground">
                  {agentSubscription[0]?.seatsUsed}/{planeById?.seatLimit}
                </span>
              </div>
              <Progress value={seatsProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {planeById?.seatLimit - agentSubscription[0]?.seatsUsed} seats
                remaining
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <Dialog
              open={isUpgradeDialogOpen}
              onOpenChange={setIsUpgradeDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              </DialogTrigger>
              <DialogContent
                className="
    w-screen h-screen max-w-none
    sm:w-full sm:h-auto sm:max-w-6xl
    max-h-screen sm:max-h-[90vh]
    overflow-y-auto
    rounded-none sm:rounded-lg
  "
              >
                <DialogHeader>
                  <DialogTitle>Choose Your Plan</DialogTitle>
                  <DialogDescription className="text-primary/90">
                    Select the subscription tier that best fits your needs
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  {subscriptions.map((tier) => (
                    <Card
                      key={tier?.subscriptionId}
                      className={`relative cursor-pointer transition-all ${
                        selectedTier?.subscriptionId === tier?.subscriptionId
                          ? "ring-2 ring-secondary"
                          : ""
                      } ${tier.popular ? "ring-2 ring-secondary" : ""}`}
                      onClick={() => setSelectedTier(tier)}
                    >
                      {/* {tier.popular && ( */}
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
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                {feature.features}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {tier.subscriptionId ===
                          agentSubscription[0]?.subscriptionId && (
                          <Badge className="w-full justify-center bg-green-100 text-green-800">
                            Current Plan
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedTier &&
                  selectedTier.subscriptionId !==
                    agentSubscription[0]?.subscriptionId && (
                    <div className="flex justify-center gap-3 pt-4">
                      <Button
                        onClick={() => handleTierChange(selectedTier)}
                        className=" px-10 bg-primary hover:bg-primary/90"
                      >
                        Request {selectedTier?.subscriptionName} Plan
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedTier(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
              </DialogContent>
            </Dialog>

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
        </CardContent>
      </Card>

      {/* Usage History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-secondary" />
            Usage History
          </CardTitle>
          <CardDescription>
            Your monthly package and seat usage trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usageHistory.map((month, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 text-center">
                    <p className="text-sm font-medium">{month.month}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-hajj-secondary" />
                      <span className="text-sm">{month.packages} packages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-hajj-primary" />
                      <span className="text-sm">{month.seats} seats</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {Math.round(
                        (month.packages / currentSubscription.packagesLimit) *
                          100,
                      )}
                      %
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Package usage
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {Math.round(
                        (month.seats / currentSubscription.seatsLimit) * 100,
                      )}
                      %
                    </p>
                    <p className="text-xs text-muted-foreground">Seat usage</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-secondary" />
            Plan Features
          </CardTitle>
          <CardDescription>
            Compare features across all subscription tiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Feature</th>
                  {availableTiers.map((tier) => (
                    <th key={tier.id} className="text-center py-3 px-4">
                      {tier.name}
                      {tier.name === currentSubscription.tier && (
                        <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                          Current
                        </Badge>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Max Packages</td>
                  {availableTiers.map((tier) => (
                    <td key={tier.id} className="text-center py-3 px-4">
                      {tier.maxPackages}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Seat Limit</td>
                  {availableTiers.map((tier) => (
                    <td key={tier.id} className="text-center py-3 px-4">
                      {tier.seatLimit}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Support Level</td>
                  <td className="text-center py-3 px-4">Email</td>
                  <td className="text-center py-3 px-4">Priority</td>
                  <td className="text-center py-3 px-4">24/7</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Analytics</td>
                  <td className="text-center py-3 px-4">Basic</td>
                  <td className="text-center py-3 px-4">Advanced</td>
                  <td className="text-center py-3 px-4">Premium</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">API Access</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SubscriptionDetails;
