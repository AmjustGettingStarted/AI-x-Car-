"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";
import { Calendar, Car, DollarSign, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RANGES = [7, 30, 90];

const STATUS_COLOR = {
  AVAILABLE: "var(--chart-4)",
  UNAVAILABLE: "var(--chart-5)",
  SOLD: "var(--chart-2)",
  PENDING: "var(--chart-5)",
  CONFIRMED: "var(--chart-4)",
  COMPLETED: "var(--chart-2)",
  CANCELLED: "var(--chart-1)",
  NO_SHOW: "var(--chart-6)",
};

function pct(part, total) {
  if (!total) return "0.0";
  return ((part / total) * 100).toFixed(1);
}

function sumWindow(series, key, start, length) {
  return series.slice(start, start + length).reduce((total, row) => total + row[key], 0);
}

function CountUp({ value, decimals = 0, suffix = "" }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let frame = 0;
    const tick = (now) => {
      if (reduce) {
        setShown(value);
        return;
      }
      const progress = Math.min(1, (now - start) / 900);
      const eased = 1 - (1 - progress) ** 3;
      setShown(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <>
      {shown.toFixed(decimals)}
      {suffix}
    </>
  );
}

function Sparkline({ data, dataKey, color }) {
  const config = { [dataKey]: { label: dataKey, color } };
  return (
    <ChartContainer config={config} className="h-10 w-24 aspect-auto">
      <AreaChart data={data}>
        <Area
          dataKey={dataKey}
          stroke={color}
          fill={color}
          fillOpacity={0.25}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}

function Delta({ current, previous }) {
  if (previous === null) return null;
  const change = previous === 0 ? (current > 0 ? 100 : 0) : Math.round(((current - previous) / previous) * 100);
  const up = change >= 0;
  return (
    <Badge
      variant="outline"
      className={
        up
          ? "border-emerald-400/40 text-emerald-300"
          : "border-rose-400/40 text-rose-300"
      }
    >
      {up ? "+" : ""}
      {change}% vs prior 7d
    </Badge>
  );
}

function EmptyChart({ label }) {
  return (
    <div className="flex h-[260px] items-center justify-center text-sm text-white/50">
      {label}
    </div>
  );
}

export function Dashboard({ initialData, analytics }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [range, setRange] = useState(30);
  const [barMode, setBarMode] = useState("make");

  const failed = !initialData?.success;
  const cars = initialData?.data?.cars;
  const testDrives = initialData?.data?.testDrives;
  const series = useMemo(
    () => (analytics?.success ? analytics.data.series : []),
    [analytics]
  );

  const windowed = useMemo(() => series.slice(-range), [range, series]);
  const spark = series.slice(-7);
  const bookingsNow = sumWindow(series, "bookings", Math.max(series.length - 7, 0), 7);
  const bookingsPrev = sumWindow(series, "bookings", Math.max(series.length - 14, 0), 7);
  const carsNow = sumWindow(series, "cars", Math.max(series.length - 7, 0), 7);
  const carsPrev = sumWindow(series, "cars", Math.max(series.length - 14, 0), 7);

  const barSource = analytics?.success
    ? barMode === "make"
      ? analytics.data.byMake
      : analytics.data.byBody
    : [];
  const barData = barSource.slice(0, 8);
  const statusData = (analytics?.data?.byStatus || []).map((row) => ({
    name: row.name,
    value: row.count,
    fill: STATUS_COLOR[row.name] || "var(--chart-3)",
  }));
  const utilization = cars?.total
    ? Math.round((((cars.sold || 0) + (cars.unavailable || 0)) / cars.total) * 100)
    : 0;

  if (failed) {
    return (
      <Card className="border-white/10 bg-[#0b0b0c]">
        <CardHeader>
          <CardTitle>Dashboard unavailable</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-white/60">
          {initialData?.error || "Failed to load dashboard data"}
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="bg-[#111113]">
        <TabsTrigger value="overview" className="cursor-pointer">
          Overview
        </TabsTrigger>
        <TabsTrigger value="test-drives" className="cursor-pointer">
          Test Drives
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="Total Cars"
            icon={Car}
            value={<CountUp value={cars.total} />}
            note={`${cars.available} available, ${cars.sold} sold`}
            delta={<Delta current={carsNow} previous={carsPrev} />}
            spark={<Sparkline data={spark} dataKey="cars" color="var(--chart-1)" />}
          />
          <KpiCard
            title="Test Drives"
            icon={Calendar}
            value={<CountUp value={testDrives.total} />}
            note={`${testDrives.pending} pending, ${testDrives.confirmed} confirmed`}
            delta={<Delta current={bookingsNow} previous={bookingsPrev} />}
            spark={<Sparkline data={spark} dataKey="bookings" color="var(--chart-2)" />}
          />
          <KpiCard
            title="Conversion Rate"
            icon={TrendingUp}
            value={<CountUp value={testDrives.conversionRate} decimals={1} suffix="%" />}
            note="Sold cars with a completed drive, divided by completed drives"
            delta={null}
            spark={null}
          />
          <KpiCard
            title="Cars Sold"
            icon={DollarSign}
            value={<CountUp value={cars.sold} />}
            note={`${pct(cars.sold, cars.total)}% of inventory`}
            delta={null}
            spark={null}
          />
        </div>

        <Card className="border-white/10 bg-[#0b0b0c] transition-shadow hover:shadow-[0_0_40px_-18px_rgba(255,77,26,0.8)]">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="font-[family-name:var(--font-clash)] uppercase tracking-tight">
              Test drive bookings
            </CardTitle>
            <div className="flex gap-2">
              {RANGES.map((days) => (
                <Button
                  key={days}
                  type="button"
                  size="sm"
                  variant={range === days ? "default" : "outline"}
                  className="cursor-pointer"
                  aria-pressed={range === days}
                  onClick={() => setRange(days)}
                >
                  {days}d
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {windowed.every((row) => row.bookings === 0) ? (
              <EmptyChart label="No bookings in this range." />
            ) : (
              <ChartContainer
                config={{ bookings: { label: "Bookings", color: "var(--chart-1)" } }}
                className="aspect-auto h-[280px] w-full"
              >
                <AreaChart data={windowed}>
                  <defs>
                    <linearGradient id="bookingsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={24} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    dataKey="bookings"
                    stroke="var(--chart-1)"
                    fill="url(#bookingsFill)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="border-white/10 bg-[#0b0b0c] xl:col-span-1 transition-shadow hover:shadow-[0_0_40px_-18px_rgba(26,92,255,0.7)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-[family-name:var(--font-clash)] uppercase tracking-tight">
                Inventory
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={barMode === "make" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setBarMode("make")}
                >
                  Make
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={barMode === "body" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setBarMode("body")}
                >
                  Body
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {barData.length === 0 ? (
                <EmptyChart label="No cars in inventory." />
              ) : (
                <ChartContainer
                  config={{ count: { label: "Cars", color: "var(--chart-2)" } }}
                  className="aspect-auto h-[260px] w-full"
                >
                  <BarChart data={barData}>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} angle={-25} height={60} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--chart-2)" radius={6} />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#0b0b0c] transition-shadow hover:shadow-[0_0_40px_-18px_rgba(139,92,246,0.7)]">
            <CardHeader>
              <CardTitle className="font-[family-name:var(--font-clash)] uppercase tracking-tight">
                Car status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statusData.every((row) => row.value === 0) || statusData.length === 0 ? (
                <EmptyChart label="No cars to chart." />
              ) : (
                <ChartContainer
                  config={{
                    AVAILABLE: { label: "Available", color: "var(--chart-4)" },
                    UNAVAILABLE: { label: "Unavailable", color: "var(--chart-5)" },
                    SOLD: { label: "Sold", color: "var(--chart-2)" },
                  }}
                  className="mx-auto aspect-square h-[260px]"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={3} stroke="transparent">
                      {statusData.map((row) => (
                        <Cell key={row.name} fill={row.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#0b0b0c] transition-shadow hover:shadow-[0_0_40px_-18px_rgba(16,185,129,0.7)]">
            <CardHeader>
              <CardTitle className="font-[family-name:var(--font-clash)] uppercase tracking-tight">
                Inventory utilization
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              {cars.total === 0 ? (
                <EmptyChart label="No inventory yet." />
              ) : (
                <>
                  <ChartContainer
                    config={{ utilization: { label: "In use", color: "var(--chart-4)" } }}
                    className="mx-auto aspect-square h-[260px]"
                  >
                    <RadialBarChart
                      innerRadius="72%"
                      outerRadius="100%"
                      data={[{ utilization, fill: "var(--chart-4)" }]}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                      <RadialBar dataKey="utilization" background cornerRadius={10} />
                    </RadialBarChart>
                  </ChartContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-[family-name:var(--font-clash)] text-4xl font-semibold">
                      {utilization}%
                    </span>
                    <span className="text-xs text-white/50">Sold or unavailable</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/10 bg-[#0b0b0c]">
          <CardHeader>
            <CardTitle className="font-[family-name:var(--font-clash)] uppercase tracking-tight">
              Recent test drives
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(analytics?.data?.recent || []).length === 0 ? (
              <p className="text-sm text-white/50">No test drives yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Booked</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.data.recent.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.car}</TableCell>
                      <TableCell>{row.customer}</TableCell>
                      <TableCell>{row.date.slice(0, 10)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          style={{ borderColor: STATUS_COLOR[row.status], color: STATUS_COLOR[row.status] }}
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="test-drives" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            ["Total", testDrives.total, null],
            ["Pending", testDrives.pending, "PENDING"],
            ["Confirmed", testDrives.confirmed, "CONFIRMED"],
            ["Completed", testDrives.completed, "COMPLETED"],
            ["Cancelled", testDrives.cancelled, "CANCELLED"],
          ].map(([label, value, status]) => (
            <Card key={label} className="border-white/10 bg-[#0b0b0c]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/70">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-[#1a5cff]">{value}</div>
                {status ? (
                  <p className="text-xs text-white/50">{pct(value, testDrives.total)}% of bookings</p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-white/10 bg-[#0b0b0c]">
          <CardHeader>
            <CardTitle className="font-[family-name:var(--font-clash)] uppercase tracking-tight">
              Booking status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-white/60">
              Completion rate {pct(testDrives.completed, testDrives.total)}%. Conversion rate{" "}
              {testDrives.conversionRate}% counts sold cars that have a completed drive, divided by
              completed drives, not by every booking.
            </p>
            {[
              ["Pending", testDrives.pending, "PENDING"],
              ["Confirmed", testDrives.confirmed, "CONFIRMED"],
              ["Completed", testDrives.completed, "COMPLETED"],
              ["Cancelled", testDrives.cancelled, "CANCELLED"],
              ["No show", testDrives.noShow, "NO_SHOW"],
            ].map(([label, value, status]) => (
              <div key={status} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{label}</span>
                  <span>
                    {value} ({pct(value, testDrives.total)}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${testDrives.total ? (value / testDrives.total) * 100 : 0}%`,
                      background: STATUS_COLOR[status],
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function KpiCard({ title, icon: Icon, value, note, delta, spark }) {
  return (
    <Card className="border-white/10 bg-[#0b0b0c] transition-shadow hover:shadow-[0_0_36px_-16px_rgba(255,77,26,0.75)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white/70">{title}</CardTitle>
        <Icon className="h-4 w-4 text-[#ff4d1a]" />
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-3">
          <div className="text-3xl font-semibold tracking-tight text-white">{value}</div>
          {spark}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {delta}
          <p className="text-xs text-white/50">{note}</p>
        </div>
      </CardContent>
    </Card>
  );
}
