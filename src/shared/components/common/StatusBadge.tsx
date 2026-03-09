import { cn } from "@/shared/lib/utils";

type StatusVariant = "pending" | "active" | "submitted" | "closed" | "locked";

interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

const config: Record<StatusVariant, { label: string; classes: string }> = {
  pending: {
    label: "Pending",
    classes:
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  active: {
    label: "Active",
    classes:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  },
  submitted: {
    label: "Submitted",
    classes:
      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  },
  closed: {
    label: "Closed",
    classes:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  locked: {
    label: "Locked",
    classes:
      "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, classes } = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        classes,
        className
      )}
    >
      {label}
    </span>
  );
}
