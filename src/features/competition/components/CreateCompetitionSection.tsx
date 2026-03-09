"use client";

import { SectionCard } from "@/shared/components/common/SectionCard";
import { CompetitionForm } from "./CompetitionForm";

export function CreateCompetitionSection() {
  return (
    <SectionCard.Root>
      <SectionCard.Header title="Create New Competition" />
      <SectionCard.Body>
        <CompetitionForm />
      </SectionCard.Body>
    </SectionCard.Root>
  );
}
