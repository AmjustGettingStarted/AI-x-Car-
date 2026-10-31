import { Skeleton } from "@/components/ui/skeleton";

export default function AdminTestDrivesLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-40 bg-white/10" />
      <div className="flex gap-3">
        <Skeleton className="h-9 w-48 bg-white/10" />
        <Skeleton className="h-9 flex-1 bg-white/10" />
      </div>
      {["a", "b", "c", "d"].map((key) => (
        <Skeleton key={key} className="h-28 w-full rounded-xl bg-white/10" />
      ))}
    </div>
  );
}
