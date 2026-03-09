"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/common/ConfirmDialog";
import { SectionCard } from "@/shared/components/common/SectionCard";
import { declareWinner } from "../actions";
import type { CategoryResult } from "../types";

interface WinnerDeclarationPanelProps {
  competitionId: string;
  categoryRoundId: string;
  categoryName: string;
  results: CategoryResult[];
  onDeclared: () => void;
}

export function WinnerDeclarationPanel({
  competitionId,
  categoryRoundId,
  categoryName,
  results,
  onDeclared,
}: WinnerDeclarationPanelProps) {
  const [declaring, setDeclaring] = useState(false);
  const top3 = results.filter((r) => !r.isDQ).slice(0, 3);

  if (top3.length === 0) return null;

  const firstPlace = top3[0];
  const alreadyDeclared = firstPlace.winnerDeclared;

  async function handleDeclare() {
    try {
      setDeclaring(true);
      await declareWinner(competitionId, categoryRoundId, firstPlace.competitorId);
      onDeclared();
    } catch {
      // error handled by caller via reload
    } finally {
      setDeclaring(false);
    }
  }

  return (
    <SectionCard.Root>
      <SectionCard.Header
        title={`${categoryName} — Winner`}
        actions={
          alreadyDeclared ? (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-yellow-600 dark:text-yellow-400">
              <Trophy className="h-4 w-4" />
              Declared
            </span>
          ) : (
            <ConfirmDialog
              trigger={
                <Button size="sm" disabled={declaring}>
                  <Trophy className="mr-1 h-4 w-4" />
                  {declaring ? "Declaring..." : "Declare Winner"}
                </Button>
              }
              title="Declare Winner"
              description={`Are you sure you want to declare #${firstPlace.anonymousNumber} as the winner of ${categoryName}? This action will be logged.`}
              onConfirm={handleDeclare}
              confirmLabel="Declare Winner"
            />
          )
        }
      />
      <SectionCard.Body>
        <div className="grid gap-3 sm:grid-cols-3">
          {top3.map((r, i) => (
            <div
              key={r.competitorId}
              className="flex flex-col items-center rounded-lg border p-4 text-center"
            >
              <span className="text-2xl font-bold">
                {i === 0 ? "1st" : i === 1 ? "2nd" : "3rd"}
              </span>
              <span className="mt-1 text-lg font-semibold">
                #{r.anonymousNumber}
              </span>
              {r.winnerDeclared && r.teamName && (
                <span className="mt-1 text-sm text-muted-foreground">
                  {r.teamName}
                </span>
              )}
              <span className="mt-1 text-sm tabular-nums text-muted-foreground">
                {r.totalPoints} pts
              </span>
            </div>
          ))}
        </div>
      </SectionCard.Body>
    </SectionCard.Root>
  );
}
