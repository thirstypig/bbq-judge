"use client";

import { useState } from "react";
import { SectionCard } from "@/shared/components/common/SectionCard";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { cn } from "@/shared/lib/utils";
import { ChevronDown, ChevronRight, Trophy } from "lucide-react";
import { ScoreBreakdownTable } from "./ScoreBreakdownTable";
import type { AllCategoryResults } from "../types";

const RANK_COLORS: Record<number, string> = {
  1: "text-yellow-600 dark:text-yellow-400",
  2: "text-slate-500 dark:text-slate-400",
  3: "text-amber-700 dark:text-amber-500",
};

const RANK_LABELS: Record<number, string> = {
  1: "1st",
  2: "2nd",
  3: "3rd",
};

interface ResultsLeaderboardProps {
  results: AllCategoryResults;
}

export function ResultsLeaderboard({ results }: ResultsLeaderboardProps) {
  const categories = Object.keys(results);

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="No Results"
        description="No category results available yet."
      />
    );
  }

  return (
    <div className="space-y-6">
      {categories.map((categoryName) => (
        <CategorySection
          key={categoryName}
          categoryName={categoryName}
          results={results[categoryName]}
        />
      ))}
    </div>
  );
}

function CategorySection({
  categoryName,
  results,
}: {
  categoryName: string;
  results: AllCategoryResults[string];
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <SectionCard.Root>
      <SectionCard.Header
        title={categoryName}
        actions={
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded p-1 hover:bg-muted"
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        }
      />
      {expanded && (
        <SectionCard.Body className="p-0">
          {results.length === 0 ? (
            <p className="px-6 py-4 text-sm text-muted-foreground">
              No scores submitted yet.
            </p>
          ) : (
            <div className="divide-y">
              {results.map((result) => (
                <ResultRow key={result.competitorId} result={result} />
              ))}
            </div>
          )}
        </SectionCard.Body>
      )}
    </SectionCard.Root>
  );
}

function ResultRow({
  result,
}: {
  result: AllCategoryResults[string][number];
}) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="flex w-full items-center gap-4 px-6 py-3 text-left hover:bg-muted/50"
      >
        <span
          className={cn(
            "min-w-[3ch] text-lg font-bold tabular-nums",
            RANK_COLORS[result.rank] ?? "text-muted-foreground"
          )}
        >
          {RANK_LABELS[result.rank] ?? `${result.rank}th`}
        </span>

        <div className="flex-1">
          <span className="font-medium">#{result.anonymousNumber}</span>
          {result.winnerDeclared && (
            <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
              Winner
            </span>
          )}
          {result.isDQ && (
            <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/50 dark:text-red-300">
              DQ
            </span>
          )}
        </div>

        <div className="text-right">
          <span className="font-semibold tabular-nums">
            {Math.round(result.totalPoints * 100) / 100} pts
          </span>
          <span className="ml-2 text-sm text-muted-foreground">
            (avg {result.averageScore}/36)
          </span>
        </div>

        {showBreakdown ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {showBreakdown && (
        <div className="border-t bg-muted/20 px-6 py-4">
          <ScoreBreakdownTable breakdown={result.breakdown} />
        </div>
      )}
    </div>
  );
}
