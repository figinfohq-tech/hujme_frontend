import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  DollarSign,
  Package,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Percent,
  Target,
  Award,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  RadialBarChart,
  RadialBar,
} from "recharts";
import axios from "axios";
import { baseURL } from "@/utils/constant/url";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

// ── Mock Data ──────────────────────────────────────────────

const monthlyRevenueData = [
  { month: "Jan", revenue: 1250000, bookings: 32, lastYear: 980000 },
  { month: "Feb", revenue: 1450000, bookings: 36, lastYear: 1100000 },
  { month: "Mar", revenue: 1680000, bookings: 39, lastYear: 1250000 },
  { month: "Apr", revenue: 1520000, bookings: 35, lastYear: 1320000 },
  { month: "May", revenue: 1850000, bookings: 42, lastYear: 1400000 },
  { month: "Jun", revenue: 2100000, bookings: 48, lastYear: 1550000 },
  { month: "Jul", revenue: 1950000, bookings: 45, lastYear: 1680000 },
  { month: "Aug", revenue: 2300000, bookings: 52, lastYear: 1750000 },
  { month: "Sep", revenue: 2100000, bookings: 48, lastYear: 1900000 },
  { month: "Oct", revenue: 2450000, bookings: 56, lastYear: 2050000 },
  { month: "Nov", revenue: 2650000, bookings: 61, lastYear: 2200000 },
  { month: "Dec", revenue: 2800000, bookings: 58, lastYear: 2350000 },
];

const packagePerformanceData = [
  {
    name: "Premium Hajj",
    bookings: 89,
    revenue: 28925000,
    conversionRate: 72,
    avgRating: 4.9,
  },
  {
    name: "Economy Hajj",
    bookings: 156,
    revenue: 33540000,
    conversionRate: 85,
    avgRating: 4.6,
  },
  {
    name: "Umrah Special",
    bookings: 234,
    revenue: 19890000,
    conversionRate: 91,
    avgRating: 4.8,
  },
  {
    name: "Ramadan Umrah",
    bookings: 178,
    revenue: 16020000,
    conversionRate: 78,
    avgRating: 4.5,
  },
  {
    name: "VIP Hajj",
    bookings: 45,
    revenue: 22500000,
    conversionRate: 65,
    avgRating: 4.9,
  },
];

const weeklyBookingsData = [
  { day: "Mon", bookings: 12, inquiries: 28 },
  { day: "Tue", bookings: 18, inquiries: 35 },
  { day: "Wed", bookings: 15, inquiries: 30 },
  { day: "Thu", bookings: 22, inquiries: 40 },
  { day: "Fri", bookings: 28, inquiries: 52 },
  { day: "Sat", bookings: 25, inquiries: 45 },
  { day: "Sun", bookings: 20, inquiries: 38 },
];

const customerSourceData = [
  { source: "Website", customers: 45, color: "hsl(var(--chart-1))" },
  { source: "Referral", customers: 28, color: "hsl(var(--chart-2))" },
  { source: "Social Media", customers: 18, color: "hsl(var(--chart-3))" },
  { source: "Direct", customers: 9, color: "hsl(var(--chart-4))" },
];

const recentTransactions = [
  {
    id: 1,
    customer: "Ahmed Khan",
    package: "Premium Hajj",
    amount: 325000,
    date: "2026-04-09",
    status: "completed",
    travelers: 4,
  },
  {
    id: 2,
    customer: "Fatima Ali",
    package: "Umrah Special",
    amount: 85000,
    date: "2026-04-08",
    status: "pending",
    travelers: 2,
  },
  {
    id: 3,
    customer: "Mohammad Sheikh",
    package: "Economy Hajj",
    amount: 215000,
    date: "2026-04-08",
    status: "completed",
    travelers: 3,
  },
  {
    id: 4,
    customer: "Aisha Begum",
    package: "Ramadan Umrah",
    amount: 90000,
    date: "2026-04-07",
    status: "completed",
    travelers: 2,
  },
  {
    id: 5,
    customer: "Yusuf Patel",
    package: "VIP Hajj",
    amount: 500000,
    date: "2026-04-07",
    status: "pending",
    travelers: 5,
  },
  {
    id: 6,
    customer: "Zainab Hussain",
    package: "Economy Hajj",
    amount: 180000,
    date: "2026-04-06",
    status: "completed",
    travelers: 2,
  },
];

const topPerformingPackages = [
  {
    name: "Economy Hajj Package",
    bookings: 156,
    growth: 12.5,
    rating: 4.6,
    revenue: "₹33.5L",
  },
  {
    name: "Umrah Special",
    bookings: 234,
    growth: 8.3,
    rating: 4.8,
    revenue: "₹19.9L",
  },
  {
    name: "Premium Hajj Package",
    bookings: 89,
    growth: 15.2,
    rating: 4.9,
    revenue: "₹28.9L",
  },
  {
    name: "Ramadan Umrah",
    bookings: 178,
    growth: -2.1,
    rating: 4.5,
    revenue: "₹16.0L",
  },
];

const monthlyGoals = [
  { label: "Revenue Target", current: 2800000, target: 3000000, unit: "₹" },
  { label: "Booking Target", current: 58, target: 65, unit: "" },
  { label: "Customer Satisfaction", current: 4.8, target: 5.0, unit: "★" },
  { label: "Repeat Customers", current: 32, target: 40, unit: "%" },
];

const destinationData = [
  { destination: "Makkah", bookings: 320, percentage: 45 },
  { destination: "Madinah", bookings: 185, percentage: 26 },
  { destination: "Makkah + Madinah", bookings: 150, percentage: 21 },
  { destination: "Custom Itinerary", bookings: 47, percentage: 7 },
];

const conversionFunnelData = [
  { stage: "Page Views", value: 4500, fill: "hsl(var(--chart-1))" },
  { stage: "Inquiries", value: 1200, fill: "hsl(var(--chart-2))" },
  { stage: "Bookings Started", value: 850, fill: "hsl(var(--chart-3))" },
  { stage: "Payments Done", value: 702, fill: "hsl(158, 64%, 24%)" },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
  lastYear: { label: "Last Year", color: "hsl(var(--muted-foreground))" },
  bookings: { label: "Bookings", color: "hsl(var(--chart-2))" },
  inquiries: { label: "Inquiries", color: "hsl(var(--chart-3))" },
  customers: { label: "Customers", color: "hsl(var(--chart-3))" },
};

// ── Helpers ────────────────────────────────────────────────

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString()}`;
};

// ── Sub-components ─────────────────────────────────────────

const MetricCard = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconBg,
  iconColor,
  subtitle,
}: {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  subtitle?: string;
}) => {
  const isPositive = change >= 0;
  return (
    <Card className="relative overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {/* <div className="flex items-center gap-1 pt-1">
              {isPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />
              )}
              <span
                className={`text-xs font-semibold ${isPositive ? "text-emerald-600" : "text-destructive"}`}
              >
                {isPositive ? "+" : ""}
                {change}%
              </span>
              <span className="text-xs text-muted-foreground">
                {changeLabel}
              </span>
            </div> */}
          </div>
          <div
            className={`h-11 w-11 rounded-xl ${iconBg} flex items-center justify-center`}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const GoalProgressCard = ({ goal }: { goal: (typeof monthlyGoals)[0] }) => {
  const percentage = Math.min((goal.current / goal.target) * 100, 100);
  const isOnTrack = percentage >= 80;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{goal.label}</span>
        <span className="text-xs text-muted-foreground">
          {goal.unit === "₹"
            ? formatCurrency(goal.current)
            : `${goal.current}${goal.unit}`}{" "}
          /{" "}
          {goal.unit === "₹"
            ? formatCurrency(goal.target)
            : `${goal.target}${goal.unit}`}
        </span>
      </div>
      <div className="relative">
        <Progress value={percentage} className="h-2.5" />
      </div>
      <div className="flex items-center justify-between">
        <Badge
          variant={isOnTrack ? "default" : "secondary"}
          className="text-[10px] px-2 py-0"
        >
          {isOnTrack ? "On Track" : "Needs Attention"}
        </Badge>
        <span className="text-xs font-medium">{percentage.toFixed(0)}%</span>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────

export const AgentAnalytics = () => {
  const [agentPackages, setAgentPackages] = useState<any[]>([]);
  const [packageBookings, setPackageBookings] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  // Apis calling

  // Fetch Booking By agent
  const fetchBookingByAgent = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const agentId = sessionStorage.getItem("agentID");
      const response = await axios.get(
        `${baseURL}packages/byAgent/${agentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.data || response.data.length === 0) {
        // ✅ No data case
        setAgentPackages([]);
        setPackageBookings([]);
        setIsLoading(false);
        return; // ❗ Stop here, next API will not run
      }
      setAgentPackages(response.data);
    } catch (error) {
      console.error("Package Fetch Error:", error);
    }
  };

  // Fetch Booking By agent
  // Fetch Booking By agent
  const fetchBookingByPackage = async (packageIds: number[]) => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("token");

      const requests = packageIds.map((id) =>
        axios.get(`${baseURL}bookings/byPackage/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      const responses = await Promise.all(requests);

      const allBookings = responses.flatMap((res) => res.data);
      setIsLoading(false);
      setPackageBookings(allBookings);
    } catch (error) {
      console.error("Booking Fetch Error:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingByAgent();
  }, []);

  useEffect(() => {
    if (agentPackages.length > 0) {
      const packageIds = agentPackages.map((pkg) => pkg.packageId);
      fetchBookingByPackage(packageIds);
    }
  }, [agentPackages]);

  // Fetch Booking By agent
  const matchedPackages = agentPackages.filter((pkg) =>
    packageBookings.some((booking) => booking.packageId === pkg.packageId),
  );
  const avgRating = matchedPackages.length
    ? (
        matchedPackages.reduce(
          (sum, pkg) => sum + (Number(pkg.ratingAverage) || 0),
          0,
        ) / matchedPackages.length
      ).toFixed(2)
    : 0;

  const totalReviewCount = matchedPackages.reduce(
    (sum, pkg) => sum + (Number(pkg.reviewCount) || 0),
    0,
  );

  const confirmedCount = packageBookings.filter(
    (b) => b.bookingStatus?.toUpperCase() === "CONFIRMED",
  ).length;

  const pendingCount = packageBookings.filter(
    (b) => b.bookingStatus?.toUpperCase() === "PENDING",
  ).length;

  const cancelledCount = packageBookings.filter(
    (b) => b.bookingStatus?.toUpperCase() === "CANCELLED",
  ).length;

  const completedCount = packageBookings.filter(
    (b) => b.bookingStatus?.toUpperCase() === "COMPLETED",
  ).length;

  const bookingStatusData = [
    { name: "Confirmed", value: confirmedCount, color: "hsl(158, 64%, 24%)" },
    { name: "Pending", value: pendingCount, color: "hsl(45, 93%, 47%)" },
    { name: "Cancelled", value: cancelledCount, color: "hsl(0, 72%, 51%)" },
    { name: "Completed", value: completedCount, color: "hsl(var(--chart-4))" },
  ];

  const activePackages = agentPackages.filter(
    (pkg) => pkg.packageStatus !== "CLOSED",
  ).length;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="border-none bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Analytics Dashboard</h2>
              <p className="text-primary-foreground/90 text-sm mt-1">
                Here's a summary of your business performance. Data updated as
                of April 12, 2026.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/50 text-primary-foreground border-none px-3 py-1">
                <Clock className="h-3 w-3 mr-1" /> Last 12 months
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* <MetricCard
          title="Total Revenue"
          value="₹2.41 Cr"
          change={18.2}
          changeLabel="vs last year"
          icon={DollarSign}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          subtitle="Across 702 bookings"
        /> */}
        <MetricCard
          title="Total Bookings"
          value={packageBookings?.length}
          change={24.5}
          changeLabel="vs last year"
          icon={Users}
          iconBg="bg-secondary/15"
          iconColor="text-secondary-foreground"
          // subtitle="58 this month"
        />
        <MetricCard
          title="Total Packages"
          value={activePackages || 0}
          change={3.8}
          changeLabel="vs last quarter"
          icon={Target}
          iconBg="bg-chart-3/10"
          iconColor="text-chart-3"
          // subtitle="Inquiry to booking"
        />
        <MetricCard
          title="Customer Rating"
          value={`${avgRating} ★`}
          change={4.3}
          changeLabel="vs last quarter"
          icon={Award}
          iconBg="bg-chart-4/10"
          iconColor="text-chart-4"
          subtitle={`Based on ${totalReviewCount} reviews`}
        />
      </div>

      {/* Monthly Goals */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Monthly Goals — April 2026
          </CardTitle>
          <CardDescription>
            Track your progress against this month's targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {monthlyGoals.map((goal, i) => (
              <GoalProgressCard key={i} goal={goal} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue & Bookings Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend — spans 2 columns */}
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>
                  This year vs last year comparison
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(158, 64%, 24%)"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(158, 64%, 24%)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                  className="text-xs"
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === "lastYear" ? "Last Year" : "This Year",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(158, 64%, 24%)"
                  strokeWidth={2.5}
                  fill="url(#gradRevenue)"
                  name="revenue"
                />
                <Line
                  type="monotone"
                  dataKey="lastYear"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                  name="lastYear"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Booking Status Donut */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-primary" />
              Booking Status
            </CardTitle>
            <CardDescription>Current distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={2}
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="hsl(var(--background))"
                    />
                  ))}
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {bookingStatusData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/40"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{item.name}</p>
                    <p className="text-sm font-bold">{item.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings & Inquiries + Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Bookings vs Inquiries */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Weekly Bookings vs Inquiries
            </CardTitle>
            <CardDescription>Current week activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <BarChart data={weeklyBookingsData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="inquiries"
                  fill="hsl(var(--muted-foreground))"
                  radius={[4, 4, 0, 0]}
                  opacity={0.4}
                  name="inquiries"
                />
                <Bar
                  dataKey="bookings"
                  fill="hsl(158, 64%, 24%)"
                  radius={[4, 4, 0, 0]}
                  name="bookings"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-primary" />
              Conversion Funnel
            </CardTitle>
            <CardDescription>
              From page views to confirmed payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-2">
              {conversionFunnelData.map((step, i) => {
                const maxValue = conversionFunnelData[0].value;
                const pct = (step.value / maxValue) * 100;
                const dropOff =
                  i > 0
                    ? (
                        ((conversionFunnelData[i - 1].value - step.value) /
                          conversionFunnelData[i - 1].value) *
                        100
                      ).toFixed(0)
                    : null;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{step.stage}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">
                          {step.value.toLocaleString()}
                        </span>
                        {dropOff && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 text-destructive border-destructive/30"
                          >
                            -{dropOff}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: step.fill }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Destination & Customer Source */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Destinations */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Popular Destinations
            </CardTitle>
            <CardDescription>Bookings by destination</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {destinationData.map((dest, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {dest.destination}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {dest.bookings} bookings
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${dest.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primary w-10 text-right">
                    {dest.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Acquisition Source */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Customer Acquisition
            </CardTitle>
            <CardDescription>Where your customers come from</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[180px] w-full">
              <PieChart>
                <Pie
                  data={customerSourceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  dataKey="customers"
                  nameKey="source"
                  strokeWidth={2}
                >
                  {customerSourceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="hsl(var(--background))"
                    />
                  ))}
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {customerSourceData.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/40"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-medium">{item.source}</span>
                  <span className="text-xs font-bold ml-auto">
                    {item.customers}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Packages & Transactions in tabs */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Detailed Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="packages" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="packages" className="gap-1.5">
                <Package className="h-3.5 w-3.5" /> Top Packages
              </TabsTrigger>
              <TabsTrigger value="transactions" className="gap-1.5">
                <DollarSign className="h-3.5 w-3.5" /> Recent Transactions
              </TabsTrigger>
              <TabsTrigger value="performance" className="gap-1.5">
                <BarChart3 className="h-3.5 w-3.5" /> Performance Table
              </TabsTrigger>
            </TabsList>

            {/* Top Packages Tab */}
            <TabsContent value="packages">
              <div className="space-y-3">
                {topPerformingPackages.map((pkg, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold text-sm">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{pkg.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {pkg.bookings} bookings
                          </span>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {pkg.revenue}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-secondary fill-secondary" />
                        <span className="text-sm font-medium">
                          {pkg.rating}
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${pkg.growth >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                      >
                        {pkg.growth >= 0 ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {Math.abs(pkg.growth)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Recent Transactions Tab */}
            <TabsContent value="transactions">
              <div className="space-y-3">
                {recentTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                        <span className="text-sm font-bold text-muted-foreground">
                          {t.customer
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.customer}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {t.package}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {t.travelers} travelers
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">
                        ₹{t.amount.toLocaleString()}
                      </p>
                      <Badge
                        variant={
                          t.status === "completed" ? "default" : "secondary"
                        }
                        className={`text-[10px] mt-1 ${t.status === "completed" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-secondary/20 text-secondary-foreground"}`}
                      >
                        {t.status === "completed" ? (
                          <CheckCircle className="h-2.5 w-2.5 mr-1" />
                        ) : (
                          <AlertCircle className="h-2.5 w-2.5 mr-1" />
                        )}
                        {t.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Performance Table Tab */}
            <TabsContent value="performance">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Package
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Bookings
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Revenue
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Avg. Value
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Conv. Rate
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {packagePerformanceData.map((pkg, index) => (
                      <tr
                        key={index}
                        className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-sm">
                          {pkg.name}
                        </td>
                        <td className="py-3 px-4 text-right text-sm">
                          {pkg.bookings}
                        </td>
                        <td className="py-3 px-4 text-right text-sm font-medium">
                          {formatCurrency(pkg.revenue)}
                        </td>
                        <td className="py-3 px-4 text-right text-sm">
                          {formatCurrency(
                            Math.round(pkg.revenue / pkg.bookings),
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Badge variant="outline" className="font-medium">
                            {pkg.conversionRate}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Star className="h-3 w-3 text-secondary fill-secondary" />
                            <span className="text-sm">{pkg.avgRating}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
