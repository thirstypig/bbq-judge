"use client";

import * as React from "react";
import { Check, Circle, Loader2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { SubmissionWithDetails, SubmissionStatus } from "../types";

// --- Context ---

const SubmissionQueueContext = React.createContext<{
  submissions: SubmissionWithDetails[];
  judgeId: string;
}>({ submissions: [], judgeId: "" });

// --- Root ---

function Root({
  submissions,
  judgeId,
  children,
}: {
  submissions: SubmissionWithDetails[];
  judgeId: string;
  children: React.ReactNode;
}) {
  return (
    <SubmissionQueueContext.Provider value={{ submissions, judgeId }}>
      <div className="space-y-3">{children}</div>
    </SubmissionQueueContext.Provider>
  );
}

// --- Progress Bar ---

function ProgressBar() {
  const { submissions, judgeId } =
    React.useContext(SubmissionQueueContext);
  const total = submissions.length;
  const submitted = submissions.filter((s) =>
    s.scoreCards.some((sc) => sc.judgeId === judgeId && sc.locked)
  ).length;
  const pct = total > 0 ? (submitted / total) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">
          {submitted} of {total} submitted
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// --- Item ---

function getSubmissionStatus(
  submission: SubmissionWithDetails,
  judgeId: string
): SubmissionStatus {
  const card = submission.scoreCards.find((sc) => sc.judgeId === judgeId);
  if (!card) return "pending";
  if (card.locked) return "submitted";
  return "in_progress";
}

const statusConfig: Record<
  SubmissionStatus,
  { icon: typeof Check; className: string; label: string }
> = {
  pending: {
    icon: Circle,
    className: "text-muted-foreground",
    label: "Pending",
  },
  in_progress: {
    icon: Loader2,
    className: "text-amber-500",
    label: "In Progress",
  },
  submitted: {
    icon: Check,
    className: "text-green-500",
    label: "Submitted",
  },
};

interface ItemProps {
  submission: SubmissionWithDetails;
  judgeId: string;
  isActive?: boolean;
  onClick: () => void;
}

function Item({ submission, judgeId, isActive, onClick }: ItemProps) {
  const status = getSubmissionStatus(submission, judgeId);
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left transition-colors",
        "hover:bg-accent",
        isActive && "border-primary bg-primary/5",
        status === "submitted" && "opacity-75"
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 flex-shrink-0",
          config.className,
          status === "in_progress" && "animate-spin"
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="font-mono text-sm font-semibold">
          #{submission.competitor?.anonymousNumber ?? submission.boxCode ?? submission.boxNumber}
        </p>
        <p className="text-xs text-muted-foreground">
          Box {submission.boxNumber}
        </p>
      </div>
      <Badge
        variant={status === "submitted" ? "default" : "outline"}
        className="text-xs"
      >
        {config.label}
      </Badge>
    </button>
  );
}

// --- Compound Export ---

export const SubmissionQueue = {
  Root,
  ProgressBar,
  Item,
};
