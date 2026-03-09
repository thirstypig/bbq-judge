import { cn } from "@/shared/lib/utils";
import { Check, Circle, Loader2, Lock } from "lucide-react";
import type { CategoryRound } from "@prisma/client";
import { COMPETITION_STATUS } from "@/shared/constants/kcbs";

interface CompetitionStatusStepperProps {
  status: string;
  categoryRounds: CategoryRound[];
  className?: string;
}

const stepStyles = {
  pending: {
    icon: Circle,
    ring: "border-muted-foreground/30",
    bg: "bg-muted",
    text: "text-muted-foreground",
  },
  active: {
    icon: Loader2,
    ring: "border-amber-500",
    bg: "bg-amber-100 dark:bg-amber-900/40",
    text: "text-amber-700 dark:text-amber-300",
  },
  submitted: {
    icon: Check,
    ring: "border-green-500",
    bg: "bg-green-100 dark:bg-green-900/40",
    text: "text-green-700 dark:text-green-300",
  },
  closed: {
    icon: Lock,
    ring: "border-slate-500",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-600 dark:text-slate-400",
  },
} as const;

type StepStatus = keyof typeof stepStyles;

function getStepStatus(round: CategoryRound): StepStatus {
  return round.status.toLowerCase() as StepStatus;
}

export function CompetitionStatusStepper({
  status,
  categoryRounds,
  className,
}: CompetitionStatusStepperProps) {
  const isSetup = status === COMPETITION_STATUS.SETUP;
  const isClosed = status === COMPETITION_STATUS.CLOSED;

  const steps: { label: string; status: StepStatus }[] = [
    { label: "Setup", status: isSetup ? "active" : "submitted" },
    ...categoryRounds.map((r) => ({
      label: r.categoryName,
      status: getStepStatus(r),
    })),
    { label: "Closed", status: isClosed ? "closed" : "pending" },
  ];

  return (
    <div className={cn("flex items-center gap-1 overflow-x-auto", className)}>
      {steps.map((step, i) => {
        const style = stepStyles[step.status];
        const Icon = style.icon;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2",
                  style.ring,
                  style.bg
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    style.text,
                    step.status === "active" && "animate-spin"
                  )}
                />
              </div>
              <span
                className={cn(
                  "whitespace-nowrap text-xs font-medium",
                  style.text
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "mx-1 mt-[-1rem] h-0.5 w-6",
                  i < steps.findIndex((s) => s.status === "pending")
                    ? "bg-green-500"
                    : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
