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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const RANGES = [7, 30, 90];
const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

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

const DRIVE_CONFIG = {
  booked: { label: "Booked", color: "var(--chart-2)" },
  completed: { label: "Completed", color: "var(--chart-3)" },
};

function pct(part, total) {
  if (!total) return "0.0";
  return ((part / total) * 100).toFixed(1);
}

function sumWindow(series, key, start, length) {
  return series.slice(start, start + length).reduce((total, row) => total + (row[key] || 0), 0);
}

function displayedConversion(testDrives) {
  if (!testDrives || testDrives.completed === 0) return null;
  const raw = Number(testDrives.conversionRate);
  if (!Number.isFinite(raw)) return null;
  return Math.min(100, Math.max(0, raw));
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
    <ChartContainer config={config} className="aspect-auto h-[60px] w-[108px]">
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

function SparkSlot({ data, dataKey, color, label }) {
  return (
    <div className="flex flex-col items-end">
      {data?.length ? (
        <div className="h-[60px] w-[108px]" aria-hidden>
          <Sparkline data={data} dataKey={dataKey} color={color} />
        </div>
      ) : (
        <div className="flex h-[60px] w-[108px] items-center justify-end text-lg text-white/70" aria-hidden>
          —
        </div>
      )}
      {label ? (
        <span className="text-[10px] uppercase tracking-[0.14em] text-white/70">{label}</span>
      ) : null}
    </div>
  );
}

function Delta({ current, previous }) {
  if (previous == null || current == null) {
    return (
      <Badge variant="outline" className="border-white/20 text-white/70">
        —
      </Badge>
    );
  }
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

function EmptyChart({ title }) {
  const showSeed = process.env.NODE_ENV !== "production";
  return (
    <div className="flex h-[260px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-6 text-center">
      <p className="font-display text-sm uppercase tracking-[0.18em] text-white">{title}</p>
      {showSeed ? (
        <p className="max-w-sm text-sm text-white/70">
          In development, run <span className="text-[#ff4d1a]">npm run seed:demo</span> to load sample bookings.
        </p>
      ) : (
        <p className="max-w-sm text-sm text-white/70">Nothing to chart in this range.</p>
      )}
    </div>
  );
}

export function Dashboard({ initialData, analytics, drives }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [range, setRange] = useState(30);

  const failed = !initialData?.success;
  const cars = initialData?.data?.cars;
  const testDrives = initialData?.data?.testDrives;
  const series = useMemo(
    () => (analytics?.success ? analytics.data.series : []),
    [analytics]
  );
  const driveSeries = useMemo(
    () => (drives?.success ? drives.data.series : []),
    [drives]
  );

  const windowed = useMemo(() => driveSeries.slice(-range), [driveSeries, range]);
  const carSpark = series.slice(-7);
  const driveSpark = driveSeries.slice(-7);
  const bookingsNow = sumWindow(driveSeries, "booked", Math.max(driveSeries.length - 7, 0), 7);
  const bookingsPrev = sumWindow(driveSeries, "booked", Math.max(driveSeries.length - 14, 0), 7);
  const carsNow = sumWindow(series, "cars", Math.max(series.length - 7, 0), 7);
  const carsPrev = sumWindow(series, "cars", Math.max(series.length - 14, 0), 7);
  const conversion = displayedConversion(testDrives);

  const barData = (analytics?.success ? analytics.data.byMake : []).slice(0, 8).map((row, index) => ({
    ...row,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));
  const statusData = (analytics?.data?.byStatus || []).map((row) => ({
    name: row.name,
    value: row.count,
    fill: STATUS_COLOR[row.name] || "var(--chart-3)",
  }));
  const utilization = cars?.total
    ? Math.round((((cars.sold || 0) + (cars.unavailable || 0)) / cars.total) * 100)
    : 0;
  const drivesEmpty = windowed.length === 0 || windowed.every((row) => row.booked === 0 && row.completed === 0);

  if (failed) {
    return (
      <Card className="border-white/10 bg-[#0b0b0c] text-white">
        <CardHeader>
          <CardTitle>Dashboard unavailable</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-white/70">
          {initialData?.error || "Failed to load dashboard data"}
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="bg-[#111113]">
        <TabsTrigger value="overview" className="cursor-pointer data-[state=active]:bg-[#0b0b0c] data-[state=active]:text-white">
          Overview
        </TabsTrigger>
        <TabsTrigger value="test-drives" className="cursor-pointer data-[state=active]:bg-[#0b0b0c] data-[state=active]:text-white">
          Test Drives
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <KpiCard
            className="lg:col-span-3"
            title="Total Cars"
            icon={Car}
            value={<CountUp value={cars.total} />}
            note={`${cars.available} available, ${cars.sold} sold`}
            delta={<Delta current={analytics?.success ? carsNow : null} previous={analytics?.success ? carsPrev : null} />}
            spark={<SparkSlot data={carSpark} dataKey="cars" color="var(--chart-1)" label="Added" />}
          />
          <KpiCard
            className="lg:col-span-3"
            title="Test Drives"
            icon={Calendar}
            value={<CountUp value={testDrives.total} />}
            note={`${testDrives.pending} pending, ${testDrives.confirmed} confirmed`}
            delta={<Delta current={drives?.success ? bookingsNow : null} previous={drives?.success ? bookingsPrev : null} />}
            spark={<SparkSlot data={driveSpark} dataKey="booked" color="var(--chart-2)" label="Booked" />}
          />
          <KpiCard
            className="lg:col-span-3"
            title="Conversion Rate"
            icon={TrendingUp}
            value={
              conversion == null ? (
                "—"
              ) : (
                <CountUp value={conversion} decimals={1} suffix="%" />
              )
            }
            note="Sold cars with a completed drive, divided by completed drives"
            delta={<Delta current={null} previous={null} />}
            spark={<SparkSlot data={driveSpark} dataKey="completed" color="var(--chart-3)" label="Completed" />}
          />
          <KpiCard
            className="lg:col-span-3"
            title="Cars Sold"
            icon={DollarSign}
            value={<CountUp value={cars.sold} />}
            note={`${pct(cars.sold, cars.total)}% of inventory`}
            delta={<Delta current={null} previous={null} />}
            spark={<SparkSlot label="No history" />}
          />

          <Card className="border-white/10 bg-[#0b0b0c] text-white lg:col-span-8">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="font-display uppercase tracking-tight">Test drives over time</CardTitle>
                <CardDescription className="text-white/70">
                  Booked by created day. Completed by booking date — there is no completion timestamp.
                </CardDescription>
              </div>
              <ToggleGroup
                type="single"
                value={String(range)}
                onValueChange={(value) => {
                  if (value) setRange(Number(value));
                }}
                variant="outline"
                size="sm"
                aria-label="Chart range"
              >
                {RANGES.map((days) => (
                  <ToggleGroupItem
                    key={days}
                    value={String(days)}
                    aria-label={`${days} days`}
                    className="cursor-pointer text-white data-[state=on]:bg-[#ff4d1a] data-[state=on]:text-white"
                  >
                    {days}d
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </CardHeader>
            <CardContent>
              {drivesEmpty ? (
                <EmptyChart title="No bookings in this range" />
              ) : (
                <ChartContainer config={DRIVE_CONFIG} className="aspect-auto h-[280px] w-full">
                  <AreaChart data={windowed}>
                    <defs>
                      <linearGradient id="bookedFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.55} />
                        <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="completedFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={28} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      dataKey="booked"
                      stroke="var(--chart-2)"
                      fill="url(#bookedFill)"
                      strokeWidth={2}
                      style={{ filter: "drop-shadow(0 0 8px rgba(59,130,246,0.65))" }}
                    />
                    <Area
                      dataKey="completed"
                      stroke="var(--chart-3)"
                      fill="url(#completedFill)"
                      strokeWidth={2}
                      style={{ filter: "drop-shadow(0 0 8px rgba(139,92,246,0.65))" }}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#0b0b0c] text-white lg:col-span-4">
            <CardHeader>
              <CardTitle className="font-display uppercase tracking-tight">Inventory status</CardTitle>
            </CardHeader>
            <CardContent>
              {statusData.length === 0 || statusData.every((row) => row.value === 0) ? (
                <EmptyChart title="No cars to chart" />
              ) : (
                <div className="relative">
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
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={68}
                        outerRadius={96}
                        paddingAngle={3}
                        stroke="transparent"
                      >
                        {statusData.map((row) => (
                          <Cell key={row.name} fill={row.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-4xl font-semibold text-white">{cars.total}</span>
                    <span className="text-xs text-white/70">cars</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#0b0b0c] text-white lg:col-span-5">
            <CardHeader>
              <CardTitle className="font-display uppercase tracking-tight">Inventory by make</CardTitle>
              <CardDescription className="text-white/70">Top 8 makes</CardDescription>
            </CardHeader>
            <CardContent>
              {barData.length === 0 ? (
                <EmptyChart title="No cars in inventory" />
              ) : (
                <ChartContainer
                  config={{ count: { label: "Cars", color: "var(--chart-1)" } }}
                  className="aspect-auto h-[260px] w-full"
                >
                  <BarChart data={barData}>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} angle={-25} height={64} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {barData.map((row) => (
                        <Cell key={row.name} fill={row.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#0b0b0c] text-white lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-display uppercase tracking-tight">Utilization</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              {cars.total === 0 ? (
                <EmptyChart title="No inventory yet" />
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
                    <span className="font-display text-4xl font-semibold text-white">{utilization}%</span>
                    <span className="text-xs text-white/70">Sold or unavailable</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#0b0b0c] text-white lg:col-span-4">
            <CardHeader>
              <CardTitle className="font-display uppercase tracking-tight">Recent test drives</CardTitle>
            </CardHeader>
            <CardContent>
              {(analytics?.data?.recent || []).length === 0 ? (
                <EmptyChart title="No test drives yet" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-white/70">Car</TableHead>
                      <TableHead className="text-white/70">Customer</TableHead>
                      <TableHead className="text-white/70">Booked</TableHead>
                      <TableHead className="text-white/70">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.data.recent.map((row) => (
                      <TableRow key={row.id} className="border-white/10">
                        <TableCell className="max-w-[8rem] truncate font-medium text-white">{row.car}</TableCell>
                        <TableCell className="max-w-[7rem] truncate text-white/80">{row.customer}</TableCell>
                        <TableCell className="text-white/80">{row.date.slice(0, 10)}</TableCell>
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
        </div>
      </TabsContent>

      <TabsContent value="test-drives" className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["Total", testDrives.total, null],
            ["Pending", testDrives.pending, "PENDING"],
            ["Confirmed", testDrives.confirmed, "CONFIRMED"],
            ["Completed", testDrives.completed, "COMPLETED"],
            ["Cancelled", testDrives.cancelled, "CANCELLED"],
          ].map(([label, value, status]) => (
            <Card key={label} className="border-white/10 bg-[#0b0b0c] text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/70">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-[#1a5cff]">{value}</div>
                {status ? (
                  <p className="text-xs text-white/70">{pct(value, testDrives.total)}% of bookings</p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-white/10 bg-[#0b0b0c] text-white">
          <CardHeader>
            <CardTitle className="font-display uppercase tracking-tight">Booking status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-white/70">
              Completion rate {pct(testDrives.completed, testDrives.total)}%. Conversion rate{" "}
              {conversion == null ? "—" : `${conversion.toFixed(2)}%`} counts sold cars that have a completed
              drive, divided by completed drives. It stays at or under 100% because each completed drive can
              contribute at most one sold car.
            </p>
            {[
              ["Pending", testDrives.pending, "PENDING"],
              ["Confirmed", testDrives.confirmed, "CONFIRMED"],
              ["Completed", testDrives.completed, "COMPLETED"],
              ["Cancelled", testDrives.cancelled, "CANCELLED"],
              ["No show", testDrives.noShow, "NO_SHOW"],
            ].map(([label, value, status]) => (
              <div key={status} className="space-y-2">
                <div className="flex justify-between text-sm text-white">
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

function KpiCard({ className, title, icon: Icon, value, note, delta, spark }) {
  return (
    <Card className={`border-white/10 bg-[#0b0b0c] text-white ${className || ""}`}>
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
          <p className="text-xs text-white/70">{note}</p>
        </div>
      </CardContent>
    </Card>
  );
}
