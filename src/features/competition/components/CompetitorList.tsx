"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  DataTable,
  type ColumnDef,
} from "@/shared/components/common/DataTable";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { SectionCard } from "@/shared/components/common/SectionCard";
import {
  competitorSchema,
  type CompetitorSchemaType,
} from "../schemas";
import { addCompetitor } from "../actions";
import type { Competitor } from "@prisma/client";

// --- Context ---

const CompetitorListContext = React.createContext<{
  competitionId: string;
  competitors: Competitor[];
  showForm: boolean;
  setShowForm: (v: boolean) => void;
}>({
  competitionId: "",
  competitors: [],
  showForm: false,
  setShowForm: () => {},
});

// --- Root ---

function Root({
  competitionId,
  competitors,
  children,
}: {
  competitionId: string;
  competitors: Competitor[];
  children: React.ReactNode;
}) {
  const [showForm, setShowForm] = React.useState(false);

  return (
    <CompetitorListContext.Provider
      value={{ competitionId, competitors, showForm, setShowForm }}
    >
      <SectionCard.Root>{children}</SectionCard.Root>
    </CompetitorListContext.Provider>
  );
}

// --- Header ---

function Header() {
  const { setShowForm, showForm } = React.useContext(CompetitorListContext);

  return (
    <SectionCard.Header
      title="Competitors"
      actions={
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Competitor"}
        </Button>
      }
    />
  );
}

// --- Table ---

const columns: ColumnDef<Competitor>[] = [
  { header: "#", accessorKey: "anonymousNumber", className: "w-20 font-mono" },
  { header: "Team Name", accessorKey: "teamName" },
  { header: "Head Cook", accessorKey: "headCookName" },
  { header: "KCBS #", accessorKey: "headCookKcbsNumber", className: "font-mono" },
];

function CompetitorTable() {
  const { competitors } = React.useContext(CompetitorListContext);

  return (
    <SectionCard.Body>
      <DataTable
        columns={columns}
        data={competitors}
        striped
        emptyState={
          <EmptyState
            icon={Users}
            title="No competitors yet"
            description="Add competitors to get started."
          />
        }
      />
    </SectionCard.Body>
  );
}

// --- Add Form ---

function AddForm() {
  const { competitionId, showForm, setShowForm } =
    React.useContext(CompetitorListContext);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompetitorSchemaType>({
    resolver: zodResolver(competitorSchema),
  });

  if (!showForm) return null;

  async function onSubmit(data: CompetitorSchemaType) {
    try {
      setServerError(null);
      await addCompetitor(competitionId, data);
      reset();
      setShowForm(false);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Failed to add competitor"
      );
    }
  }

  return (
    <SectionCard.Footer>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex items-end gap-3">
          <div className="space-y-1">
            <Label htmlFor="anonymousNumber"># Number</Label>
            <Input
              id="anonymousNumber"
              placeholder="101"
              className="w-24 font-mono"
              {...register("anonymousNumber")}
            />
            {errors.anonymousNumber && (
              <p className="text-xs text-destructive">
                {errors.anonymousNumber.message}
              </p>
            )}
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              placeholder="Smokin' Aces"
              {...register("teamName")}
            />
            {errors.teamName && (
              <p className="text-xs text-destructive">
                {errors.teamName.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-end gap-3">
          <div className="flex-1 space-y-1">
            <Label htmlFor="headCookName">Head Cook (optional)</Label>
            <Input
              id="headCookName"
              placeholder="Name"
              {...register("headCookName")}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="headCookKcbsNumber">KCBS # (optional)</Label>
            <Input
              id="headCookKcbsNumber"
              placeholder="KCBS #"
              className="w-28 font-mono"
              {...register("headCookKcbsNumber")}
            />
          </div>
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
        </div>
      </form>
      {serverError && (
        <p className="mt-2 text-sm text-destructive">{serverError}</p>
      )}
    </SectionCard.Footer>
  );
}

// --- Named Exports (RSC-safe) ---

export const CompetitorListRoot = Root;
export const CompetitorListHeader = Header;
export const CompetitorListTable = CompetitorTable;
export const CompetitorListAddForm = AddForm;

// --- Compound Export (client-only usage) ---

export const CompetitorList = {
  Root,
  Header,
  Table: CompetitorTable,
  AddForm,
};
