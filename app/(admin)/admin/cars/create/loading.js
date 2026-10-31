import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCreateCarLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40 bg-white/10" />
      <Skeleton className="h-10 w-full bg-white/10" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {["a", "b", "c", "d", "e", "f"].map((key) => (
          <Skeleton key={key} className="h-16 bg-white/10" />
        ))}
      </div>
      <Skeleton className="h-40 w-full rounded-3xl bg-white/10" />
    </div>
  );
}
