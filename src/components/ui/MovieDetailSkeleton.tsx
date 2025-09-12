import { FloatingCard } from '@/components/ui/FloatingCard';
import Skeleton from '@mui/material/Skeleton';

export function MovieDetailSkeleton() {
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start font-sans">
      {/* Left Side */}
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="40%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
        </div>

        {/* skeleton for small screens */}
        <div className="flex justify-center mb-6 lg:hidden">
          <FloatingCard>
            <Skeleton variant="rectangular" width={300} height={400} className="rounded-2xl" />
          </FloatingCard>
        </div>

        {/* Overview + details skeleton */}
        <div className="space-y-3 mt-auto">
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="70%" height={20} />
          <Skeleton variant="text" width="50%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
        </div>
      </div>

      {/* Right skeleton for large screens */}
      <div className="hidden lg:flex justify-end">
        <FloatingCard>
          <Skeleton variant="rectangular" width={350} height={500} className="rounded-2xl" />
        </FloatingCard>
      </div>
    </div>
  );
}
