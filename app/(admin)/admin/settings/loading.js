import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSettingsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32 bg-white/10" />
      <Skeleton className="h-10 w-64 bg-white/10" />
      <div className="space-y-3 rounded-xl border border-white/10 bg-[#0b0b0c] p-6">
        {["a", "b", "c", "d", "e", "f", "g"].map((key) => (
          <Skeleton key={key} className="h-12 w-full bg-white/10" />
        ))}
      </div>
    </div>
  );
}
