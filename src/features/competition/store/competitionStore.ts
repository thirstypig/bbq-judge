import { create } from "zustand";
import type { Competition } from "@prisma/client";

interface CompetitionState {
  selectedCompetitionId: string | null;
  competitions: Competition[];
  setSelectedCompetition: (id: string | null) => void;
  setCompetitions: (competitions: Competition[]) => void;
}

export const useCompetitionStore = create<CompetitionState>((set) => ({
  selectedCompetitionId: null,
  competitions: [],
  setSelectedCompetition: (id) => set({ selectedCompetitionId: id }),
  setCompetitions: (competitions) => set({ competitions }),
}));
