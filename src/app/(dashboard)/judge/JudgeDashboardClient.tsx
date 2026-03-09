"use client";

import { useEffect, useState, useCallback } from "react";
import { Clock, CheckCircle2, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { EmptyState } from "@/shared/components/common/EmptyState";
import {
  BoxEntryScreen,
  AppearanceScoringScreen,
  TasteTextureScoringScreen,
  FontSizeControl,
  useFontSize,
  getJudgeSession,
} from "@features/judging";
import type { JudgeSession, JudgePhase } from "@features/judging";

interface Props {
  cbjNumber: string;
  judgeName: string;
  competitionInfo?: {
    name: string;
    date: string;
    location: string;
  };
}

function detectPhase(session: JudgeSession): JudgePhase {
  const { activeCategory, assignedSubmissions } = session;

  if (!activeCategory) return "waiting";
  if (assignedSubmissions.length === 0) return "box-entry";

  const judgeId = session.judge.id;
  const scoreCards = assignedSubmissions.map((sub) =>
    sub.scoreCards.find((sc) => sc.judgeId === judgeId)
  );

  // All locked = done
  const allLocked = scoreCards.every((sc) => sc?.locked);
  if (allLocked) return "done";

  // Check if appearance is done for all
  const allAppearanceDone = scoreCards.every((sc) => sc?.appearanceSubmittedAt);
  if (!allAppearanceDone) return "appearance";

  // Appearance done, taste/texture not done
  return "taste-texture";
}

export function JudgeDashboardClient({ cbjNumber, judgeName, competitionInfo }: Props) {
  const [session, setSession] = useState<JudgeSession | null>(null);
  const [loading, setLoading] = useState(true);
  const { fontSize, increase, decrease } = useFontSize();

  const loadSession = useCallback(async () => {
    const result = await getJudgeSession(cbjNumber);
    setSession(result);
    setLoading(false);
  }, [cbjNumber]);

  useEffect(() => {
    loadSession();
    const interval = setInterval(loadSession, 15_000);
    return () => clearInterval(interval);
  }, [loadSession]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" label="Loading..." />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <EmptyState
          icon={Clock}
          title="No active assignment"
          description="Contact the organizer for table assignment."
        />
      </div>
    );
  }

  const phase = detectPhase(session);
  const { activeCategory, assignedSubmissions } = session;

  return (
    <div style={{ zoom: fontSize / 16 }}>
      {/* Minimal top info bar for judge */}
      <div className="mb-4 space-y-2 px-2">
        <div className="text-sm text-muted-foreground">
          {judgeName} — Table {session.table.tableNumber}, Seat {session.seatNumber}
        </div>
        <FontSizeControl
          fontSize={fontSize}
          onIncrease={increase}
          onDecrease={decrease}
        />
      </div>

      {phase === "waiting" && (
        <div className="mx-auto max-w-sm space-y-6 px-4 py-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Welcome, {judgeName}</h1>
            {competitionInfo && (
              <div className="space-y-1">
                <p className="text-lg font-medium text-primary">{competitionInfo.name}</p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(competitionInfo.date), "MMM d, yyyy")}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {competitionInfo.location}
                  </span>
                </div>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {cbjNumber} — Table {session.table.tableNumber}, Seat {session.seatNumber}
            </p>
          </div>
          <div className="rounded-lg border border-dashed p-6 text-center">
            <Clock className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-lg font-medium">Waiting for next round</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The organizer will start the next judging category soon.
            </p>
          </div>
        </div>
      )}

      {phase === "box-entry" && activeCategory && (
        <BoxEntryScreen
          tableId={session.table.id}
          categoryRoundId={activeCategory.id}
          categoryName={activeCategory.categoryName}
          judgeId={session.judge.id}
          initialBoxes={[]}
          onDone={loadSession}
        />
      )}

      {phase === "appearance" && activeCategory && (
        <AppearanceScoringScreen
          categoryName={activeCategory.categoryName}
          submissions={assignedSubmissions}
          judgeId={session.judge.id}
          onDone={loadSession}
        />
      )}

      {phase === "taste-texture" && activeCategory && (
        <TasteTextureScoringScreen
          categoryName={activeCategory.categoryName}
          submissions={assignedSubmissions}
          judgeId={session.judge.id}
          onDone={loadSession}
        />
      )}

      {phase === "done" && (
        <EmptyState
          icon={CheckCircle2}
          title="All scores submitted"
          description="Waiting for the Table Captain to submit the round."
        />
      )}
    </div>
  );
}
