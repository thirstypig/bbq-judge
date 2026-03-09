import { cn } from "@/shared/lib/utils";
import type { UserRole } from "@/shared/constants/kcbs";

interface UserAvatarProps {
  cbjNumber: string;
  role: UserRole;
  className?: string;
}

const roleBg: Record<UserRole, string> = {
  JUDGE: "bg-blue-600 dark:bg-blue-700",
  TABLE_CAPTAIN: "bg-orange-600 dark:bg-orange-700",
  ORGANIZER: "bg-red-600 dark:bg-red-700",
};

function getInitials(cbjNumber: string): string {
  const digits = cbjNumber.replace(/\D/g, "");
  return digits.slice(-2) || cbjNumber.slice(0, 2).toUpperCase();
}

export function UserAvatar({ cbjNumber, role, className }: UserAvatarProps) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white",
        roleBg[role],
        className
      )}
      title={cbjNumber}
    >
      {getInitials(cbjNumber)}
    </div>
  );
}
