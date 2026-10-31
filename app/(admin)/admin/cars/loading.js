import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCarsLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-32 bg-white/10" />
      <div className="flex gap-3">
        <Skeleton className="h-9 flex-1 bg-white/10" />
        <Skeleton className="h-9 w-28 bg-white/10" />
      </div>
      <div className="space-y-2 rounded-xl border border-white/10 bg-[#0b0b0c] p-4">
        {["a", "b", "c", "d", "e", "f"].map((key) => (
          <Skeleton key={key} className="h-16 w-full bg-white/10" />
        ))}
      </div>
    </div>
  );
}
