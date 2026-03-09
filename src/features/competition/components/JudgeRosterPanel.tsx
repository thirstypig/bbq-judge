"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  KeyRound,
  RefreshCw,
  CheckCircle,
  XCircle,
  Hash,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { SectionCard } from "@/shared/components/common/SectionCard";
import { DataTable } from "@/shared/components/common/DataTable";
import { JudgeImportForm } from "@features/users";
import {
  generateJudgePin,
  registerJudgesBulkForCompetition,
  checkInJudge,
  uncheckInJudge,
  assignJudgeToTableOnly,
} from "../actions";
import type { CompetitionJudgeWithUser } from "../types";

interface JudgeRosterPanelProps {
  competitionId: string;
  judgePin: string | null;
  roster: CompetitionJudgeWithUser[];
}

export function JudgeRosterPanel({
  competitionId,
  judgePin: initialPin,
  roster: initialRoster,
}: JudgeRosterPanelProps) {
  const router = useRouter();
  const [pin, setPin] = useState(initialPin);
  const [isPending, startTransition] = useTransition();
  const [tableInputs, setTableInputs] = useState<Record<string, string>>({});

  async function handleGeneratePin() {
    const newPin = await generateJudgePin(competitionId);
    setPin(newPin);
  }

  async function handleImported(userIds: string[]) {
    await registerJudgesBulkForCompetition(competitionId, userIds);
    startTransition(() => router.refresh());
  }

  async function handleCheckIn(registrationId: string) {
    await checkInJudge(registrationId);
    startTransition(() => router.refresh());
  }

  async function handleUncheckIn(registrationId: string) {
    await uncheckInJudge(registrationId);
    startTransition(() => router.refresh());
  }

  async function handleAssignTable(userId: string) {
    const tableNum = parseInt(tableInputs[userId] || "");
    if (!tableNum || tableNum < 1) return;
    await assignJudgeToTableOnly(competitionId, userId, tableNum);
    setTableInputs((prev) => ({ ...prev, [userId]: "" }));
    startTransition(() => router.refresh());
  }

  const columns = [
    {
      key: "cbjNumber" as const,
      header: "CBJ #",
      render: (row: CompetitionJudgeWithUser) => (
        <span className="font-mono font-medium">{row.user.cbjNumber}</span>
      ),
    },
    {
      key: "name" as const,
      header: "Name",
      render: (row: CompetitionJudgeWithUser) => row.user.name,
    },
    {
      key: "status" as const,
      header: "Status",
      render: (row: CompetitionJudgeWithUser) => (
        <Badge variant={row.checkedIn ? "default" : "secondary"}>
          {row.checkedIn ? "Checked In" : "Not Checked In"}
        </Badge>
      ),
    },
    {
      key: "table" as const,
      header: "Table",
      render: (row: CompetitionJudgeWithUser) =>
        row.tableAssignment ? (
          <Badge variant="outline">
            Table {row.tableAssignment.tableNumber}
            {row.tableAssignment.seatNumber
              ? ` / Seat ${row.tableAssignment.seatNumber}`
              : ""}
          </Badge>
        ) : (
          <div className="flex items-center gap-1">
            <Input
              type="number"
              min={1}
              placeholder="#"
              className="h-7 w-16 font-mono text-xs"
              value={tableInputs[row.userId] || ""}
              onChange={(e) =>
                setTableInputs((prev) => ({
                  ...prev,
                  [row.userId]: e.target.value,
                }))
              }
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={() => handleAssignTable(row.userId)}
              disabled={!tableInputs[row.userId]}
            >
              <Hash className="h-3 w-3" />
            </Button>
          </div>
        ),
    },
    {
      key: "actions" as const,
      header: "",
      render: (row: CompetitionJudgeWithUser) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            row.checkedIn
              ? handleUncheckIn(row.id)
              : handleCheckIn(row.id)
          }
        >
          {row.checkedIn ? (
            <XCircle className="mr-1 h-4 w-4 text-muted-foreground" />
          ) : (
            <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
          )}
          {row.checkedIn ? "Undo" : "Check In"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* PIN Section */}
      <SectionCard.Root>
        <SectionCard.Header title="Judge PIN" />
        <SectionCard.Body>
          <div className="flex items-center gap-4">
            {pin ? (
              <div className="flex items-center gap-3">
                <KeyRound className="h-5 w-5 text-primary" />
                <span className="text-4xl font-bold tracking-widest font-mono">
                  {pin}
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No PIN generated yet. Generate one for judges to use when logging in.
              </p>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleGeneratePin}
              className="ml-auto"
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              {pin ? "Regenerate" : "Generate PIN"}
            </Button>
          </div>
        </SectionCard.Body>
      </SectionCard.Root>

      {/* Import Section */}
      <SectionCard.Root>
        <SectionCard.Header title="Import Judges" />
        <SectionCard.Body>
          <JudgeImportForm onImported={handleImported} />
        </SectionCard.Body>
      </SectionCard.Root>

      {/* Table Counts */}
      {(() => {
        const tableCounts: Record<number, number> = {};
        for (const r of initialRoster) {
          if (r.tableAssignment) {
            const tn = r.tableAssignment.tableNumber;
            tableCounts[tn] = (tableCounts[tn] || 0) + 1;
          }
        }
        const tables = Object.entries(tableCounts).sort(([a], [b]) => Number(a) - Number(b));
        if (tables.length === 0) return null;
        return (
          <div className="flex flex-wrap gap-3">
            {tables.map(([tableNum, count]) => (
              <div key={tableNum} className="rounded-lg border px-3 py-2 text-center">
                <p className="text-xs text-muted-foreground">Table {tableNum}</p>
                <p className={`text-lg font-bold ${count >= 6 ? "text-green-600" : "text-foreground"}`}>
                  {count}/6
                </p>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Roster Table */}
      <SectionCard.Root>
        <SectionCard.Header
          title="Judge Roster"
          actions={
            <span className="text-sm text-muted-foreground">
              {initialRoster.filter((r) => r.checkedIn).length} /{" "}
              {initialRoster.length} checked in
            </span>
          }
        />
        <SectionCard.Body>
          <DataTable
            columns={columns}
            data={initialRoster}
            loading={isPending}
            emptyState={
              <p className="py-8 text-center text-sm text-muted-foreground">
                No judges registered. Import judges above to get started.
              </p>
            }
          />
        </SectionCard.Body>
      </SectionCard.Root>
    </div>
  );
}
