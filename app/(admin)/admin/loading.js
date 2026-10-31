import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6 bg-[#050505] p-4 md:p-6">
      <Skeleton className="h-3 w-24 bg-white/10" />
      <Skeleton className="h-10 w-56 bg-white/10" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {["cars", "drives", "conversion", "sold"].map((key) => (
          <Skeleton key={key} className="h-36 rounded-xl bg-white/10 lg:col-span-3" />
        ))}
        <Skeleton className="h-80 rounded-xl bg-white/10 lg:col-span-8" />
        <Skeleton className="h-80 rounded-xl bg-white/10 lg:col-span-4" />
        <Skeleton className="h-80 rounded-xl bg-white/10 lg:col-span-5" />
        <Skeleton className="h-80 rounded-xl bg-white/10 lg:col-span-3" />
        <Skeleton className="h-80 rounded-xl bg-white/10 lg:col-span-4" />
      </div>
    </div>
  );
}
