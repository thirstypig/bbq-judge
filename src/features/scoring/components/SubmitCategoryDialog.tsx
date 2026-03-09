"use client";

import * as React from "react";
import { AlertTriangle, Send } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import type { TableScoringStatus } from "../types";

interface SubmitCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: TableScoringStatus;
  pendingCorrections: number;
  onConfirm: () => Promise<void>;
}

export function SubmitCategoryDialog({
  open,
  onOpenChange,
  status,
  pendingCorrections,
  onConfirm,
}: SubmitCategoryDialogProps) {
  const [confirmed, setConfirmed] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const hasPending = pendingCorrections > 0;

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      // Error handled by parent
    } finally {
      setSubmitting(false);
    }
  }

  // Reset checkbox when dialog opens
  React.useEffect(() => {
    if (open) setConfirmed(false);
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Submit Category to Organizer</AlertDialogTitle>
          <AlertDialogDescription>
            This will finalize all scores for {status.categoryName} at Table{" "}
            {status.tableNumber}. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3">
          {/* Summary */}
          <div className="rounded-md border px-4 py-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Score cards</span>
              <span className="font-medium">{status.submittedScoreCards}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground">Judges</span>
              <span className="font-medium">{status.judges.length}</span>
            </div>
          </div>

          {/* Warnings */}
          {hasPending && (
            <div
              className={cn(
                "flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
                "border-red-500 bg-red-50 text-red-800",
                "dark:bg-red-950/30 dark:text-red-300"
              )}
            >
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>
                {pendingCorrections} pending correction request
                {pendingCorrections > 1 ? "s" : ""} must be resolved first.
              </span>
            </div>
          )}

          {/* Confirmation checkbox */}
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              I confirm all scores have been reviewed and are ready for
              submission.
            </span>
          </label>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={handleSubmit}
            disabled={!confirmed || hasPending || submitting}
          >
            <Send className="mr-1 h-4 w-4" />
            {submitting ? "Submitting..." : "Submit Category"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
