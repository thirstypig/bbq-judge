import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner size="lg" label="Loading..." />
    </div>
  );
}
