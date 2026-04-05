import {
  ArrowLeft,
  ArrowUp,
  Package,
  Users,
  Calendar,
  CheckCircle,
  Video,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

const UpgradeSubscriptionPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [agentSubscription, setAgentSubscription] = useState<any[]>([]);
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [subscriptionHeader, setSubscriptionHeader] = useState<any>([]);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");

  const activeSubscription = agentSubscription.find(
    (sub) => sub.isActive === true,
  );

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

  const getSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseURL}subscriptions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSubscriptions(res.data);
      setLoading(false);
    } catch (error) {
      console.error("API Error:", error);
      setLoading(false);
    }
  };

   const fetchSubscriptionsHeader = async () => {
     try {
       setLoading(true);
       const response = await axios.get(`${baseURL}subscriptions/stats`, {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       });
       setSubscriptionHeader(response.data);
       console.log("jhdjhdjhew==>",response.data);
       
       setLoading(false);
     } catch (error) {
       console.error("Stats API Error", error);
       setLoading(false);
     }
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
    } catch (error) {
      console.error("Error fetching Agent Subscription:", error);
      setAgentSubscription([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTierChange = (tier: any) => {
    setSelectedTier(tier);
    setIsConfirmOpen(true);
  };

  const handleConfirmSubscription = async () => {
    if (!selectedTier || !selectedTier.subscriptionId || !agent?.agentId) {
      toast.error("Invalid subscription data");
      return;
    }

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
      };

      await axios.post(`${baseURL}agent-subscriptions`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Subscription request submitted successfully ✅");

      setIsConfirmOpen(false);
      setSelectedTier(null);

      fetchAgentSubscription();
      await navigate("/subscription-details");
    } catch (error: any) {
      console.error("Subscription error", error.response?.data);
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubscriptions();
    fetchAgent();
    fetchSubscriptionsHeader();
  }, []);

  useEffect(() => {
    if (agent?.agentId) {
      fetchAgentSubscription();
    }
  }, [agent?.agentId]);

  console.log("activeSubscriptions==>", subscriptions);
  

  const activeSubscriptions = subscriptions?.filter((item) => item.isActive);  

  const popularSubscription = activeSubscriptions?.find(
    (item) => item.subscriptionId === subscriptionHeader?.mostPopularTier,
  );
  console.log("popularSubscription===>", popularSubscription);

  if (loading) {
    return <Loader />;
  }

  return (
    // 👇 SAME DialogContent styling, bas page container ban gaya
    <div className="pb-4">
      {/* 🔙 Back button (Dialog close ka replacement) */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className=" flex text-primary items-center gap-2 hover:bg-green-100"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      {/* SAME DialogHeader */}
      <div className="mb-6">
        <h2 className="text-2xl text-primary font-bold">Choose Your Plan</h2>
        <p className="text-primary/90">
          Select the subscription tier that best fits your needs
        </p>
      </div>

      {/* SAME cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {activeSubscriptions?.map((tier: any) => (
          <Card
            key={tier?.subscriptionId}
            className={`relative cursor-pointer transition-all ${
              selectedTier?.subscriptionId === tier?.subscriptionId
                ? "ring-2 ring-secondary"
                : ""
            } ${
              tier?.subscriptionId === activeSubscription?.subscriptionId
                ? "ring-2 ring-secondary bg-green-50"
                : ""
            } p-0 py-4`}
            onClick={() => setSelectedTier(tier)}
          >
            {/* POPULAR badge */}
            {tier?.subscriptionId === popularSubscription?.subscriptionId && (
              <div className="absolute top-0 right-0 bg-secondary text-white px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-xl">
                {tier?.subscriptionName}
              </CardTitle>

              <div className="text-center mt-4">
                <div className="text-3xl font-bold text-primary">
                  ₹{tier?.price}
                </div>
                <CardDescription className="text-primary/90">
                  per {tier?.validityMonths} month
                  {tier?.validityMonths > 1 ? "s" : ""}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-primary/90" />
                  <span>{tier.maxPackages} packages</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-primary/90" />
                  <span>{tier.seatLimit} seats limit</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Image className="w-4 h-4 text-primary/90" />
                  <span>{tier.maxPhotos} images limit</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Video className="w-4 h-4 text-primary/90" />
                  <span>{tier.maxVideos} videos limit</span>
                </div>

                <div className="flex items-center gap-2 text-sm col-span-2">
                  <Calendar className="w-4 h-4 text-primary/90" />
                  <span>{tier.validityMonths} month validity</span>
                </div>
              </div>

              {tier.subscriptionId === activeSubscription?.subscriptionId && (
                <Badge className="w-full justify-center bg-green-200 text-green-800">
                  Current Plan
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SAME footer buttons */}
      {selectedTier &&
        selectedTier.subscriptionId !== activeSubscription?.subscriptionId && (
          <div className="flex justify-center gap-3 pt-4">
            <Button
              onClick={() => handleTierChange(selectedTier)}
              className="px-10 bg-primary hover:bg-primary/90"
            >
              Request {selectedTier?.subscriptionName} Plan
            </Button>

            <Button variant="outline" onClick={() => setSelectedTier(null)}>
              Cancel
            </Button>
          </div>
        )}

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

export default UpgradeSubscriptionPage;
