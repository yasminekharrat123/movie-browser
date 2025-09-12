import { FloatingCard } from '@/components/ui/FloatingCard';
import Skeleton from '@mui/material/Skeleton';

export function MovieDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 items-start gap-8 p-6 font-sans lg:grid-cols-2">
      {/* Left Side */}
      <div className="flex h-full flex-col">
        <div className="mb-6">
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="40%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
        </div>

        {/* skeleton for small screens */}
        <div className="mb-6 flex justify-center lg:hidden">
          <FloatingCard>
            <Skeleton variant="rectangular" width={300} height={400} className="rounded-2xl" />
          </FloatingCard>
        </div>

        {/* Overview + details skeleton */}
        <div className="mt-auto space-y-3">
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="70%" height={20} />
          <Skeleton variant="text" width="50%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
        </div>
      </div>

      {/* Right skeleton for large screens */}
      <div className="hidden justify-end lg:flex">
        <FloatingCard>
          <Skeleton variant="rectangular" width={350} height={500} className="rounded-2xl" />
        </FloatingCard>
      </div>
    </div>
  );
}
