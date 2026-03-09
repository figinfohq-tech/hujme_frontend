import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  BarChart3,
  Download,
  TrendingUp,
  Users,
  Crown,
  Package,
  DollarSign,
  Calendar,
} from "lucide-react";

function ReportsAnalytics() {
  console.log("📊 ReportsAnalytics page rendered");

  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const subscriptionData = [
    { name: "Jan", Basic: 12, Premium: 25, Enterprise: 8 },
    { name: "Feb", Basic: 15, Premium: 28, Enterprise: 12 },
    { name: "Mar", Basic: 18, Premium: 32, Enterprise: 15 },
    { name: "Apr", Basic: 22, Premium: 35, Enterprise: 18 },
    { name: "May", Basic: 25, Premium: 38, Enterprise: 22 },
    { name: "Jun", Basic: 28, Premium: 42, Enterprise: 25 },
  ];

  const revenueData = [
    { name: "Jan", revenue: 154200 },
    { name: "Feb", revenue: 187500 },
    { name: "Mar", revenue: 223400 },
    { name: "Apr", revenue: 268900 },
    { name: "May", revenue: 312500 },
    { name: "Jun", revenue: 356000 },
  ];

  const tierDistribution = [
    { name: "Basic", value: 45, color: "#3B82F6" },
    { name: "Premium", value: 89, color: "#8B5CF6" },
    { name: "Enterprise", value: 23, color: "#F59E0B" },
  ];

  const facilityUsage = [
    { name: "Premium Hotels", usage: 87 },
    { name: "Transport Services", usage: 73 },
    { name: "Guided Tours", usage: 64 },
    { name: "Meal Packages", usage: 58 },
    { name: "Insurance", usage: 92 },
    { name: "Airport Transfer", usage: 81 },
  ];

  const packageTrends = [
    { name: "Jan", packages: 45, seats: 1250 },
    { name: "Feb", packages: 52, seats: 1420 },
    { name: "Mar", packages: 48, seats: 1380 },
    { name: "Apr", packages: 61, seats: 1650 },
    { name: "May", packages: 67, seats: 1820 },
    { name: "Jun", packages: 73, seats: 1980 },
  ];

  const topPerformers = [
    { rank: 1, agent: "Makkah Tours Ltd", packages: 32, revenue: 89500 },
    { rank: 2, agent: "Al-Barakah Travel", packages: 28, revenue: 73400 },
    { rank: 3, agent: "Sacred Path Agency", packages: 24, revenue: 65800 },
    { rank: 4, agent: "Green Crescent Tours", packages: 21, revenue: 57900 },
    { rank: 5, agent: "Holy Journey Travel", packages: 18, revenue: 49200 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">
            Reports & Analytics
          </h2>
          <p className="text-muted-foreground">
            Comprehensive insights and performance metrics
          </p>
        </div>

        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-0">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">₹8,94,200</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-500 font-medium">
                  +18% vs last month
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary/90" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Agents</p>
              <p className="text-2xl font-bold">187</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-500 font-medium">
                  +12% vs last month
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Package className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Packages Created</p>
              <p className="text-2xl font-bold">1,432</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-500 font-medium">
                  +24% vs last month
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Avg. Package Value
              </p>
              <p className="text-2xl font-bold">₹24,500</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-500 font-medium">
                  +8% vs last month
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscriptions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="subscriptions">Subscription Reports</TabsTrigger>
          <TabsTrigger value="agents">Agent Performance</TabsTrigger>
          <TabsTrigger value="facilities">Facility Usage</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Growth Trends</CardTitle>
                <CardDescription>
                  Monthly subscription tier distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subscriptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Basic" fill="#3B82F6" />
                    <Bar dataKey="Premium" fill="#8B5CF6" />
                    <Bar dataKey="Enterprise" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Tier Distribution</CardTitle>
                <CardDescription>Active subscriptions by tier</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tierDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {tierDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Package Creation Trends</CardTitle>
                <CardDescription>Packages and seats over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={packageTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="packages"
                      stroke="#0F4C3A"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="seats"
                      stroke="#2C7A5F"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Agents</CardTitle>
                <CardDescription>
                  Ranking by packages and revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((performer) => (
                    <div
                      key={performer.rank}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center font-bold text-sm">
                          {performer.rank}
                        </div>
                        <div>
                          <p className="font-medium">{performer.agent}</p>
                          <p className="text-sm text-muted-foreground">
                            {performer.packages} packages
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          ₹{performer.revenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="facilities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Facility Usage Statistics</CardTitle>
              <CardDescription>
                Most and least used facilities across all packages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={facilityUsage} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="usage" fill="#2C7A5F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Growth</CardTitle>
              <CardDescription>
                Monthly revenue trends and projections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `₹${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0F4C3A"
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#0F4C3A" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#0F4C3A"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ReportsAnalytics;
