import { Skeleton } from "@/components/ui/skeleton";

const CarListingsLoading = () => {
  return (
    <>
      <Skeleton className="mb-6 h-5 w-40 bg-white/10" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton
            key={index}
            className="h-[32rem] rounded-[2rem] bg-white/5"
          />
        ))}
      </div>
    </>
  );
};

export default CarListingsLoading;
