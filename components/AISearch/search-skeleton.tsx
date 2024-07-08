import { Skeleton } from "@nextui-org/react";

const SearchSkeleton = () => {
  return (
    <div className="flex w-full max-w-[600px] flex-col items-center gap-5">
      <div>
        <Skeleton className="flex h-12 w-12 rounded-full" />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-3 w-full rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
        <Skeleton className="h-3 w-full rounded-lg" />
      </div>
    </div>
  );
};

export default SearchSkeleton;
