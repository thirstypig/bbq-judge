"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { VALID_SCORES, SCORE_LABELS, DQ_SCORE } from "@/shared/constants/kcbs";

function getScoreClasses(score: number, isSelected: boolean): string {
  if (!isSelected) {
    return "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground";
  }

  if (score === DQ_SCORE)
    return "bg-red-600 text-white ring-2 ring-red-400 dark:bg-red-700";
  if (score === 2)
    return "bg-orange-500 text-white ring-2 ring-orange-300 dark:bg-orange-600";
  if (score <= 6)
    return "bg-yellow-500 text-white ring-2 ring-yellow-300 dark:bg-yellow-600";
  if (score <= 8)
    return "bg-green-500 text-white ring-2 ring-green-300 dark:bg-green-600";
  return "bg-emerald-500 text-white ring-2 ring-emerald-300 dark:bg-emerald-600";
}

interface ScorePickerProps {
  value: number | null;
  onChange: (score: number) => void;
  disabled?: boolean;
  size?: "default" | "lg";
}

export function ScorePicker({ value, onChange, disabled, size = "default" }: ScorePickerProps) {
  const scores = VALID_SCORES;
  const containerRef = React.useRef<HTMLDivElement>(null);

  function handleKeyDown(e: React.KeyboardEvent, currentIdx: number) {
    if (disabled) return;

    if (e.key === "ArrowRight" && currentIdx < scores.length - 1) {
      e.preventDefault();
      const nextScore = scores[currentIdx + 1];
      const next = containerRef.current?.querySelector(
        `[data-score="${nextScore}"]`
      ) as HTMLButtonElement | null;
      next?.focus();
    } else if (e.key === "ArrowLeft" && currentIdx > 0) {
      e.preventDefault();
      const prevScore = scores[currentIdx - 1];
      const prev = containerRef.current?.querySelector(
        `[data-score="${prevScore}"]`
      ) as HTMLButtonElement | null;
      prev?.focus();
    } else if (e.key >= "0" && e.key <= "9") {
      const num = parseInt(e.key);
      if ((scores as readonly number[]).includes(num)) {
        e.preventDefault();
        onChange(num);
      }
    }
  }

  return (
    <div ref={containerRef} className="flex gap-1" role="radiogroup">
      {scores.map((score, idx) => {
        const isSelected = value === score;

        return (
          <button
            key={score}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${score} - ${SCORE_LABELS[score]}`}
            data-score={score}
            tabIndex={isSelected || (value === null && idx === 0) ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange(score)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cn(
              "flex items-center justify-center rounded-md font-semibold tabular-nums transition-all active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              size === "lg" ? "h-12 w-12 text-lg" : "h-9 w-9 text-sm",
              getScoreClasses(score, isSelected),
              isSelected && "scale-110"
            )}
          >
            {score}
          </button>
        );
      })}
    </div>
  );
}
