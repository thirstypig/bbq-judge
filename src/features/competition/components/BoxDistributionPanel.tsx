"use client";

import { useState } from "react";
import { Package, RefreshCw, Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { SectionCard } from "@/shared/components/common/SectionCard";
import { generateDistribution, approveDistribution } from "../actions";
import type { BoxDistribution } from "../utils/generateBoxDistribution";

interface BoxDistributionPanelProps {
  competitionId: string;
  distributionStatus: string | null;
  tableCount: number;
  competitorCount: number;
}

export function BoxDistributionPanel({
  competitionId,
  distributionStatus: initialStatus,
  tableCount,
  competitorCount,
}: BoxDistributionPanelProps) {
  const [distribution, setDistribution] = useState<BoxDistribution | null>(null);
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = tableCount >= 1 && competitorCount >= 6;

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const result = await generateDistribution(competitionId);
      setDistribution(result);
      setStatus("DRAFT");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    if (!distribution) return;
    setApproving(true);
    setError(null);
    try {
      await approveDistribution(competitionId);
      setStatus("APPROVED");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve");
    } finally {
      setApproving(false);
    }
  }

  function statusBadge() {
    if (status === "APPROVED") return <Badge className="bg-green-600">Approved</Badge>;
    if (status === "DRAFT") return <Badge variant="secondary">Draft</Badge>;
    return <Badge variant="outline">Not Generated</Badge>;
  }

  return (
    <SectionCard.Root>
      <SectionCard.Header
        title="Box Distribution"
        actions={statusBadge()}
      />
      <SectionCard.Body>
        {!canGenerate && (
          <p className="text-sm text-muted-foreground">
            Need at least 1 table and 6 competitors to generate distribution.
          </p>
        )}

        {canGenerate && !distribution && status !== "APPROVED" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Auto-assign competitor boxes to tables across all categories.
              Ensures no competitor appears at the same table twice (BR-2).
            </p>
            <Button onClick={handleGenerate} disabled={loading}>
              <Package className="mr-2 h-4 w-4" />
              {loading ? "Generating..." : "Generate Distribution"}
            </Button>
          </div>
        )}

        {status === "APPROVED" && !distribution && (
          <p className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Check className="h-4 w-4" />
            Distribution approved. Submissions have been pre-created for all tables and categories.
          </p>
        )}

        {distribution && (
          <div className="space-y-4">
            {/* Matrix view */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 pr-3 text-left font-medium">Table</th>
                    {distribution.map((cat) => (
                      <th key={cat.categoryRoundId} className="px-2 py-2 text-left font-medium">
                        {cat.categoryName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {distribution[0]?.tables.map((_, tableIdx) => (
                    <tr key={tableIdx} className="border-b last:border-0">
                      <td className="py-2 pr-3 font-medium">
                        Table {distribution[0].tables[tableIdx].tableNumber}
                      </td>
                      {distribution.map((cat) => (
                        <td key={cat.categoryRoundId} className="px-2 py-2">
                          <div className="flex flex-wrap gap-1">
                            {cat.tables[tableIdx]?.competitors.map((comp) => (
                              <span
                                key={comp.competitorId}
                                className="inline-block rounded bg-muted px-1.5 py-0.5 text-xs font-mono"
                              >
                                {comp.anonymousNumber}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {status !== "APPROVED" && (
              <div className="flex gap-2">
                <Button onClick={handleGenerate} variant="outline" disabled={loading}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
                <Button onClick={handleApprove} disabled={approving}>
                  <Check className="mr-2 h-4 w-4" />
                  {approving ? "Approving..." : "Approve & Create Submissions"}
                </Button>
              </div>
            )}
          </div>
        )}

        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </SectionCard.Body>
    </SectionCard.Root>
  );
}
