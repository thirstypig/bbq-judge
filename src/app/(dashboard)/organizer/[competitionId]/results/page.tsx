"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { BarChart3, Trophy, ScrollText } from "lucide-react";
import { PageHeader } from "@/shared/components/common/PageHeader";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { cn } from "@/shared/lib/utils";
import {
  CompetitionProgressDashboard,
  ResultsLeaderboard,
  WinnerDeclarationPanel,
  ExportResultsButton,
  AuditLogViewer,
  getCompetitionProgress,
  getAllCategoryResults,
  getAuditLog,
} from "@features/tabulation";
import { getCompetitionById } from "@features/competition";
import type { CompetitionProgress, AllCategoryResults, AuditLogEntry } from "@features/tabulation";
import type { CompetitionWithRelations } from "@features/competition";

type Tab = "progress" | "results" | "audit";

const TABS: { key: Tab; label: string; icon: typeof BarChart3 }[] = [
  { key: "progress", label: "Live Progress", icon: BarChart3 },
  { key: "results", label: "Results", icon: Trophy },
  { key: "audit", label: "Audit Log", icon: ScrollText },
];

export default function ResultsPage() {
  const params = useParams<{ competitionId: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("progress");
  const [loading, setLoading] = useState(true);

  const [competition, setCompetition] = useState<CompetitionWithRelations | null>(null);
  const [progress, setProgress] = useState<CompetitionProgress | null>(null);
  const [results, setResults] = useState<AllCategoryResults>({});
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const load = useCallback(async () => {
    try {
      const [comp, prog, res, logs] = await Promise.all([
        getCompetitionById(params.competitionId),
        getCompetitionProgress(params.competitionId),
        getAllCategoryResults(params.competitionId),
        getAuditLog(params.competitionId),
      ]);
      setCompetition(comp);
      setProgress(prog);
      setResults(res);
      setAuditLogs(logs);
    } finally {
      setLoading(false);
    }
  }, [params.competitionId]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15_000);
    return () => clearInterval(interval);
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" label="Loading results..." />
      </div>
    );
  }

  if (!competition) {
    return <p className="text-destructive">Competition not found.</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={competition.name}
        subtitle="Results & Tabulation"
        actions={
          activeTab === "results" && (
            <ExportResultsButton competitionId={params.competitionId} />
          )
        }
      />

      {/* Tab bar */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              activeTab === key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "progress" && (
        <CompetitionProgressDashboard progress={progress} />
      )}

      {activeTab === "results" && (
        <div className="space-y-6">
          <ResultsLeaderboard results={results} />
          {progress?.categories.map((cat) => {
            const catResults = results[cat.categoryName] ?? [];
            if (catResults.length === 0) return null;
            return (
              <WinnerDeclarationPanel
                key={cat.categoryRoundId}
                competitionId={params.competitionId}
                categoryRoundId={cat.categoryRoundId}
                categoryName={cat.categoryName}
                results={catResults}
                onDeclared={load}
              />
            );
          })}
        </div>
      )}

      {activeTab === "audit" && <AuditLogViewer logs={auditLogs} />}
    </div>
  );
}
