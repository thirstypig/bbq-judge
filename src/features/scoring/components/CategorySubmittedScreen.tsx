"use client";

import { CheckCircle2, Clock } from "lucide-react";

interface CategorySubmittedScreenProps {
  categoryName: string;
  totalCards: number;
  totalJudges: number;
}

export function CategorySubmittedScreen({
  categoryName,
  totalCards,
  totalJudges,
}: CategorySubmittedScreenProps) {
  return (
    <div className="mx-auto max-w-sm space-y-6 px-4 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{categoryName}</h2>
        <p className="text-lg font-medium text-green-600 dark:text-green-400">
          Submitted to Organizer
        </p>
      </div>

      <div className="rounded-lg border bg-muted/50 p-4 space-y-1">
        <p className="text-sm text-muted-foreground">
          {totalCards} score cards from {totalJudges} judges
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4 animate-pulse" />
        <p>Waiting for organizer to advance to next category...</p>
      </div>
    </div>
  );
}
