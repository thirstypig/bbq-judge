"use client";

import * as React from "react";
import { Check, Clock, Send, ShieldAlert } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { SectionCard } from "@/shared/components/common/SectionCard";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { UserAvatar } from "@/shared/components/common/UserAvatar";
import { cn } from "@/shared/lib/utils";
import type { TableScoringStatus, JudgeScoringStatus } from "../types";

// --- Context ---

const TableStatusContext = React.createContext<{
  status: TableScoringStatus | null;
  onSubmit: () => void;
  isSubmitting: boolean;
}>({ status: null, onSubmit: () => {}, isSubmitting: false });

// --- Root ---

function Root({
  status,
  onSubmit,
  isSubmitting,
  children,
}: {
  status: TableScoringStatus;
  onSubmit: () => void;
  isSubmitting: boolean;
  children: React.ReactNode;
}) {
  return (
    <TableStatusContext.Provider value={{ status, onSubmit, isSubmitting }}>
      <SectionCard.Root>{children}</SectionCard.Root>
    </TableStatusContext.Provider>
  );
}

// --- Header ---

function Header() {
  const { status } = React.useContext(TableStatusContext);
  if (!status) return null;

  return (
    <SectionCard.Header
      title={`Table ${status.tableNumber}`}
      actions={
        <Badge variant="outline" className="font-mono">
          {status.categoryName}
        </Badge>
      }
    />
  );
}

// --- Judge Grid ---

function JudgeGrid({ children }: { children: React.ReactNode }) {
  return (
    <SectionCard.Body className="space-y-2">
      {children}
    </SectionCard.Body>
  );
}

// --- Judge Row ---

function JudgeRow({ judge }: { judge: JudgeScoringStatus }) {
  const pct =
    judge.totalCount > 0
      ? (judge.submittedCount / judge.totalCount) * 100
      : 0;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md border p-3 transition-colors",
        judge.allSubmitted && "border-green-500/50 bg-green-50 dark:bg-green-950/20"
      )}
    >
      <UserAvatar
        cbjNumber={judge.judge.cbjNumber}
        role="JUDGE"
        className="h-8 w-8 text-xs"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{judge.judge.name}</p>
        <p className="text-xs text-muted-foreground">
          {judge.judge.cbjNumber}{judge.seatNumber != null ? ` · Seat ${judge.seatNumber}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-16">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                judge.allSubmitted ? "bg-green-500" : "bg-primary"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-0.5 text-center text-xs tabular-nums text-muted-foreground">
            {judge.submittedCount}/{judge.totalCount}
          </p>
        </div>
        {judge.allSubmitted ? (
          <StatusBadge status="submitted" />
        ) : (
          <StatusBadge status="active" />
        )}
      </div>
    </div>
  );
}

// --- Submit Gate ---

function SubmitGate() {
  const { status, onSubmit, isSubmitting } =
    React.useContext(TableStatusContext);
  if (!status) return null;

  const blocking = status.judges.filter((j) => !j.allSubmitted);

  return (
    <SectionCard.Footer>
      {blocking.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Waiting on {blocking.length} judge{blocking.length > 1 ? "s" : ""}
          </div>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {blocking.map((j) => (
              <li key={j.judge.id} className="flex items-center gap-1">
                <ShieldAlert className="h-3 w-3 text-amber-500" />
                {j.judge.name} — {j.submittedCount}/{j.totalCount} submitted
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Check className="h-5 w-5 text-green-500" />
          <span className="flex-1 text-sm font-medium text-green-700 dark:text-green-400">
            All judges have submitted
          </span>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            <Send className="mr-1 h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Submit to Organizer"}
          </Button>
        </div>
      )}
    </SectionCard.Footer>
  );
}

// --- Compound Export ---

export const TableStatusBoard = {
  Root,
  Header,
  JudgeGrid,
  JudgeRow,
  SubmitGate,
};
