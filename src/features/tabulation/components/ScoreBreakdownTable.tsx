"use client";

import { ScoreDisplay } from "@/shared/components/common/ScoreDisplay";
import { cn } from "@/shared/lib/utils";
import type { JudgeScoreBreakdown } from "../types";

interface ScoreBreakdownTableProps {
  breakdown: JudgeScoreBreakdown[];
}

export function ScoreBreakdownTable({ breakdown }: ScoreBreakdownTableProps) {
  if (breakdown.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No scores available.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-2 pr-4 font-medium">Judge</th>
            <th className="pb-2 pr-4 font-medium">App</th>
            <th className="pb-2 pr-4 font-medium">Taste</th>
            <th className="pb-2 pr-4 font-medium">Texture</th>
            <th className="pb-2 font-medium">Weighted</th>
          </tr>
        </thead>
        <tbody>
          {breakdown.map((b) => (
            <tr
              key={b.judgeId}
              className={cn(
                "border-b last:border-0",
                b.isOutlier && "bg-amber-50 dark:bg-amber-900/20",
                b.isDropped && "opacity-50"
              )}
            >
              <td className="py-2 pr-4">
                <span className="font-medium">{b.cbjNumber}</span>
                {b.isOutlier && (
                  <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
                    Outlier
                  </span>
                )}
                {b.isDQ && (
                  <span className="ml-2 text-xs text-red-600 dark:text-red-400">
                    DQ
                  </span>
                )}
                {b.isDropped && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    Dropped
                  </span>
                )}
              </td>
              <td className="py-2 pr-4">
                <ScoreDisplay score={b.appearance} size="sm" dimension="appearance" />
              </td>
              <td className="py-2 pr-4">
                <ScoreDisplay score={b.taste} size="sm" dimension="taste" />
              </td>
              <td className="py-2 pr-4">
                <ScoreDisplay score={b.texture} size="sm" dimension="texture" />
              </td>
              <td className="py-2 font-semibold tabular-nums">
                {Math.round(b.weightedTotal * 100) / 100}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
