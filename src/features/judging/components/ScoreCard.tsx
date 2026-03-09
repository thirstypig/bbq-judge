"use client";

import * as React from "react";
import { AlertTriangle, Lock, Send, FileEdit } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ScoreDisplay } from "@/shared/components/common/ScoreDisplay";
import { cn } from "@/shared/lib/utils";
import type { ScoreDimension } from "@/shared/constants/kcbs";
import { hasDQScore, type ScorecardSchemaType } from "../schemas";
import { ScorePicker } from "./ScorePicker";
import type { SubmissionWithDetails } from "../types";
import type { ScoreCard as ScoreCardModel } from "@prisma/client";

// --- Context ---

interface ScoreCardContextValue {
  submission: SubmissionWithDetails;
  scoreCard: ScoreCardModel | null;
  scores: Partial<ScorecardSchemaType>;
  setScore: (dimension: ScoreDimension, value: number) => void;
  isLocked: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  onRequestCorrection: () => void;
}

const ScoreCardContext = React.createContext<ScoreCardContextValue | null>(null);

function useScoreCardContext() {
  const ctx = React.useContext(ScoreCardContext);
  if (!ctx) throw new Error("ScoreCard compound components require ScoreCard.Root");
  return ctx;
}

// --- Root ---

interface RootProps {
  submission: SubmissionWithDetails;
  scoreCard: ScoreCardModel | null;
  onSubmit: (scores: ScorecardSchemaType) => Promise<void>;
  onRequestCorrection: () => void;
  children: React.ReactNode;
}

function Root({
  submission,
  scoreCard,
  onSubmit,
  onRequestCorrection,
  children,
}: RootProps) {
  const [scores, setScores] = React.useState<Partial<ScorecardSchemaType>>(
    scoreCard
      ? {
          appearance: scoreCard.appearance,
          taste: scoreCard.taste,
          texture: scoreCard.texture,
        }
      : {}
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isLocked = scoreCard?.locked ?? false;

  function setScore(dimension: ScoreDimension, value: number) {
    if (isLocked) return;
    setScores((prev) => ({ ...prev, [dimension]: value }));
  }

  async function handleSubmit() {
    const { appearance, taste, texture } = scores;
    if (appearance == null || taste == null || texture == null) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ appearance, taste, texture });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScoreCardContext.Provider
      value={{
        submission,
        scoreCard,
        scores,
        setScore,
        isLocked,
        isSubmitting,
        onSubmit: handleSubmit,
        onRequestCorrection,
      }}
    >
      <div className="space-y-4">{children}</div>
    </ScoreCardContext.Provider>
  );
}

// --- Competitor Badge (BR-4: anonymous number only) ---

function CompetitorBadge() {
  const { submission } = useScoreCardContext();

  return (
    <div className="flex items-center justify-center">
      <span className="rounded-lg bg-primary/10 px-6 py-3 text-3xl font-bold tabular-nums text-primary">
        #{submission.competitor?.anonymousNumber ?? submission.boxCode ?? submission.boxNumber}
      </span>
    </div>
  );
}

// --- Category Label ---

function CategoryLabel() {
  const { submission } = useScoreCardContext();

  return (
    <p className="text-center text-sm text-muted-foreground">
      {submission.categoryRound.categoryName.toUpperCase()} — Table{" "}
      {submission.table.tableNumber}, Box {submission.boxNumber}
    </p>
  );
}

// --- Dimension Row ---

function DimensionRow({
  dimension,
  label,
}: {
  dimension: ScoreDimension;
  label: string;
}) {
  const { scores, setScore, isLocked } = useScoreCardContext();
  const value = scores[dimension] ?? null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium capitalize">{label}</span>
        {isLocked && value != null && (
          <ScoreDisplay score={value} dimension={dimension} size="sm" />
        )}
      </div>
      {isLocked ? (
        <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          Score locked
        </div>
      ) : (
        <ScorePicker
          value={value}
          onChange={(v) => setScore(dimension, v)}
          disabled={isLocked}
        />
      )}
    </div>
  );
}

// --- DQ Warning ---

function DQWarning() {
  const { scores, isLocked } = useScoreCardContext();
  if (!hasDQScore(scores)) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
        "border-yellow-500 bg-yellow-50 text-yellow-800",
        "dark:bg-yellow-950/30 dark:text-yellow-300"
      )}
    >
      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      <span>
        {isLocked
          ? "This score card contains a DQ (1) score."
          : "A score of 1 results in a disqualification for this dimension. Confirm before submitting."}
      </span>
    </div>
  );
}

// --- Actions ---

function Actions() {
  const { scores, isLocked, isSubmitting, onSubmit, onRequestCorrection } =
    useScoreCardContext();

  const allScored =
    scores.appearance != null &&
    scores.taste != null &&
    scores.texture != null;

  if (isLocked) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          Score card submitted and locked
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRequestCorrection}
        >
          <FileEdit className="mr-1 h-4 w-4" />
          Request Correction
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={onSubmit}
      disabled={!allScored || isSubmitting}
      className="w-full"
    >
      <Send className="mr-1 h-4 w-4" />
      {isSubmitting ? "Submitting..." : "Submit Scores"}
    </Button>
  );
}

// --- Compound Export ---

export const ScoreCard = {
  Root,
  CompetitorBadge,
  CategoryLabel,
  DimensionRow,
  DQWarning,
  Actions,
};
