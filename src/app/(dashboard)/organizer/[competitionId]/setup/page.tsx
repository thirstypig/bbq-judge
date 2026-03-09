import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Competition Setup | BBQ Judge",
};
import { PageHeader } from "@/shared/components/common/PageHeader";
import { Button } from "@/shared/components/ui/button";
import {
  CompetitionStatusStepper,
  CompetitorListRoot,
  CompetitorListHeader,
  CompetitorListTable,
  CompetitorListAddForm,
  TableSetupPanelRoot,
  TableSetupPanelTableCard,
  TableSetupPanelAssignForm,
  getCompetitionById,
} from "@features/competition";
import Link from "next/link";

interface Props {
  params: { competitionId: string };
}

export default async function CompetitionSetupPage({ params }: Props) {
  const competition = await getCompetitionById(params.competitionId);
  if (!competition) notFound();

  // Determine which table numbers exist and allow adding one more
  const existingTableNumbers = competition.tables.map((t) => t.tableNumber);
  const nextTableNumber =
    existingTableNumbers.length > 0
      ? Math.max(...existingTableNumbers) + 1
      : 1;
  const tableNumbers =
    existingTableNumbers.length > 0 ? existingTableNumbers : [1];

  return (
    <div className="space-y-6">
      <PageHeader
        title={competition.name}
        subtitle="Competition Setup"
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href={`/organizer/${competition.id}/status`}>
              View Status
            </Link>
          </Button>
        }
      />

      <CompetitionStatusStepper
        status={competition.status}
        categoryRounds={competition.categoryRounds}
      />

      {/* Competitors Section */}
      <CompetitorListRoot
        competitionId={competition.id}
        competitors={competition.competitors}
      >
        <CompetitorListHeader />
        <CompetitorListTable />
        <CompetitorListAddForm />
      </CompetitorListRoot>

      {/* Table Setup Section */}
      <TableSetupPanelRoot
        competitionId={competition.id}
        tables={competition.tables}
      >
        {tableNumbers.map((num) => (
          <TableSetupPanelTableCard key={num} tableNumber={num}>
            <TableSetupPanelAssignForm tableNumber={num} />
          </TableSetupPanelTableCard>
        ))}

        {/* Add new table */}
        {!existingTableNumbers.includes(nextTableNumber) && (
          <TableSetupPanelTableCard tableNumber={nextTableNumber}>
            <TableSetupPanelAssignForm tableNumber={nextTableNumber} />
          </TableSetupPanelTableCard>
        )}
      </TableSetupPanelRoot>
    </div>
  );
}
