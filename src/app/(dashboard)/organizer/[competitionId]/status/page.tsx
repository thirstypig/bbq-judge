"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Play } from "lucide-react";
import { PageHeader } from "@/shared/components/common/PageHeader";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { SectionCard } from "@/shared/components/common/SectionCard";
import { StatusBadge } from "@/shared/components/common/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import {
  CompetitionStatusStepper,
  getCompetitionById,
  advanceCategoryRound,
} from "@features/competition";
import type { CompetitionWithRelations } from "@features/competition";

export default function CompetitionStatusPage() {
  const params = useParams<{ competitionId: string }>();
  const [competition, setCompetition] =
    useState<CompetitionWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const data = await getCompetitionById(params.competitionId);
    setCompetition(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // Poll every 10s for live updates
    const interval = setInterval(load, 10_000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.competitionId]);

  async function handleAdvance() {
    try {
      setAdvancing(true);
      setError(null);
      await advanceCategoryRound(params.competitionId);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to advance round");
    } finally {
      setAdvancing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" label="Loading competition..." />
      </div>
    );
  }

  if (!competition) {
    return <p className="text-destructive">Competition not found.</p>;
  }

  const canAdvance =
    competition.status !== "CLOSED" &&
    !competition.categoryRounds.some((r) => r.status === "ACTIVE");

  return (
    <div className="space-y-6">
      <PageHeader
        title={competition.name}
        subtitle="Live Status"
        actions={
          canAdvance && (
            <Button onClick={handleAdvance} disabled={advancing}>
              <Play className="mr-1 h-4 w-4" />
              {advancing ? "Advancing..." : "Start Next Round"}
            </Button>
          )
        }
      />

      <CompetitionStatusStepper
        status={competition.status}
        categoryRounds={competition.categoryRounds}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Category rounds detail */}
      <div className="grid gap-4 md:grid-cols-2">
        {competition.categoryRounds.map((round) => (
          <SectionCard.Root key={round.id}>
            <SectionCard.Header
              title={round.categoryName}
              actions={
                <StatusBadge
                  status={
                    round.status.toLowerCase() as
                      | "pending"
                      | "active"
                      | "submitted"
                  }
                />
              }
            />
            <SectionCard.Body>
              <p className="text-sm text-muted-foreground">
                Order: {round.order} &middot;{" "}
                {round.categoryType === "MANDATORY" ? "Mandatory" : "Optional"}
              </p>
            </SectionCard.Body>
          </SectionCard.Root>
        ))}
      </div>

      {/* Tables overview */}
      <SectionCard.Root>
        <SectionCard.Header title="Tables" />
        <SectionCard.Body>
          {competition.tables.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tables configured yet.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {competition.tables.map((table) => (
                <div key={table.id} className="rounded-md border p-3">
                  <p className="font-medium">Table {table.tableNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    Captain: {table.captain?.name ?? "Unassigned"} &middot;{" "}
                    {table.assignments.length}/6 seats filled
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionCard.Body>
      </SectionCard.Root>
    </div>
  );
}
