"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Crown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { SectionCard } from "@/shared/components/common/SectionCard";
import { UserAvatar } from "@/shared/components/common/UserAvatar";
import { SEATS } from "@/shared/constants/kcbs";
import { tableAssignmentSchema } from "../schemas";
import { assignJudgeToTable } from "../actions";
import type { CompetitionWithRelations } from "../types";
import { cn } from "@/shared/lib/utils";

type TableData = CompetitionWithRelations["tables"][number];
type AssignmentData = TableData["assignments"][number];

// --- Context ---

const TableSetupContext = React.createContext<{
  competitionId: string;
  tables: TableData[];
}>({ competitionId: "", tables: [] });

// --- Root ---

function Root({
  competitionId,
  tables,
  children,
}: {
  competitionId: string;
  tables: TableData[];
  children: React.ReactNode;
}) {
  return (
    <TableSetupContext.Provider value={{ competitionId, tables }}>
      <div className="space-y-4">{children}</div>
    </TableSetupContext.Provider>
  );
}

// --- Table Card ---

function TableCard({
  tableNumber,
  children,
}: {
  tableNumber: number;
  children: React.ReactNode;
}) {
  const { tables } = React.useContext(TableSetupContext);
  const table = tables.find((t) => t.tableNumber === tableNumber);

  return (
    <SectionCard.Root>
      <SectionCard.Header
        title={`Table ${tableNumber}`}
        actions={
          table && (
            <span className="text-xs text-muted-foreground">
              Captain: {table.captain?.name ?? "Unassigned"}{" "}
              {table.captain ? `(${table.captain.cbjNumber})` : ""}
            </span>
          )
        }
      />
      <SectionCard.Body>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SEATS.map((seat) => {
            const assignment = table?.assignments.find(
              (a) => a.seatNumber === seat
            );
            return (
              <JudgeSlot
                key={seat}
                seatNumber={seat}
                assignment={assignment}
                isCaptain={
                  assignment
                    ? table?.captainId === assignment.userId
                    : false
                }
              />
            );
          })}
        </div>
      </SectionCard.Body>
      {children}
    </SectionCard.Root>
  );
}

// --- Judge Slot ---

function JudgeSlot({
  seatNumber,
  assignment,
  isCaptain,
}: {
  seatNumber: number;
  assignment?: AssignmentData;
  isCaptain: boolean;
}) {
  if (!assignment) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-dashed p-2 text-muted-foreground">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs">
          {seatNumber}
        </div>
        <span className="text-xs">Empty</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border p-2",
        isCaptain && "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
      )}
    >
      <UserAvatar
        cbjNumber={assignment.user.cbjNumber}
        role={assignment.user.role as "JUDGE" | "TABLE_CAPTAIN" | "ORGANIZER"}
        className="h-8 w-8 text-xs"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{assignment.user.name}</p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          {assignment.user.cbjNumber}
          {isCaptain && <Crown className="h-3 w-3 text-amber-500" />}
        </p>
      </div>
    </div>
  );
}

// --- Assign Form ---

function AssignForm({ tableNumber }: { tableNumber: number }) {
  const { competitionId } = React.useContext(TableSetupContext);
  const [serverError, setServerError] = React.useState<string | null>(null);

  type FormValues = { cbjNumber: string; seatNumber: number; isCaptain: boolean };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(tableAssignmentSchema) as any,
    defaultValues: { isCaptain: false },
  });

  async function onSubmit(data: FormValues) {
    try {
      setServerError(null);
      await assignJudgeToTable(
        competitionId,
        data.cbjNumber,
        tableNumber,
        data.seatNumber,
        data.isCaptain
      );
      reset();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Failed to assign judge"
      );
    }
  }

  return (
    <SectionCard.Footer>
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-3">
        <div className="space-y-1">
          <Label>CBJ #</Label>
          <Input
            placeholder="CBJ-001"
            className="w-28 font-mono"
            {...register("cbjNumber")}
          />
          {errors.cbjNumber && (
            <p className="text-xs text-destructive">
              {errors.cbjNumber.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label>Seat</Label>
          <Input
            type="number"
            min={1}
            max={6}
            className="w-20"
            {...register("seatNumber")}
          />
          {errors.seatNumber && (
            <p className="text-xs text-destructive">
              {errors.seatNumber.message}
            </p>
          )}
        </div>
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" {...register("isCaptain")} />
          <Crown className="h-3.5 w-3.5 text-amber-500" />
          Captain
        </label>
        <Button type="submit" size="sm" disabled={isSubmitting}>
          <UserPlus className="mr-1 h-4 w-4" />
          {isSubmitting ? "Assigning..." : "Assign"}
        </Button>
      </form>
      {serverError && (
        <p className="mt-2 text-sm text-destructive">{serverError}</p>
      )}
    </SectionCard.Footer>
  );
}

// --- Named Exports (RSC-safe) ---

export const TableSetupPanelRoot = Root;
export const TableSetupPanelTableCard = TableCard;
export const TableSetupPanelJudgeSlot = JudgeSlot;
export const TableSetupPanelAssignForm = AssignForm;

// --- Compound Export (client-only usage) ---

export const TableSetupPanel = {
  Root,
  TableCard,
  JudgeSlot,
  AssignForm,
};
