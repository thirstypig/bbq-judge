import { create } from "zustand";
import type { JudgeSession, ScoreEntry } from "../types";

interface JudgingState {
  session: JudgeSession | null;
  currentSubmissionIndex: number;
  draftScores: Record<string, Partial<ScoreEntry[]>>;
  setSession: (session: JudgeSession | null) => void;
  nextSubmission: () => void;
  prevSubmission: () => void;
  setCurrentSubmissionIndex: (index: number) => void;
  setDraftScore: (
    submissionId: string,
    dimension: ScoreEntry["dimension"],
    value: number | null
  ) => void;
  clearDraft: (submissionId: string) => void;
}

export const useJudgingStore = create<JudgingState>((set, get) => ({
  session: null,
  currentSubmissionIndex: 0,
  draftScores: {},

  setSession: (session) => set({ session, currentSubmissionIndex: 0 }),

  nextSubmission: () => {
    const { session, currentSubmissionIndex } = get();
    if (!session) return;
    const max = session.assignedSubmissions.length - 1;
    if (currentSubmissionIndex < max) {
      set({ currentSubmissionIndex: currentSubmissionIndex + 1 });
    }
  },

  prevSubmission: () => {
    const { currentSubmissionIndex } = get();
    if (currentSubmissionIndex > 0) {
      set({ currentSubmissionIndex: currentSubmissionIndex - 1 });
    }
  },

  setCurrentSubmissionIndex: (index) =>
    set({ currentSubmissionIndex: index }),

  setDraftScore: (submissionId, dimension, value) => {
    const drafts = { ...get().draftScores };
    const current = drafts[submissionId] ?? [];
    const idx = current.findIndex((e) => e?.dimension === dimension);
    const entry: ScoreEntry = { dimension, value };

    if (idx >= 0) {
      const updated = [...current];
      updated[idx] = entry;
      drafts[submissionId] = updated;
    } else {
      drafts[submissionId] = [...current, entry];
    }

    set({ draftScores: drafts });
  },

  clearDraft: (submissionId) => {
    const drafts = { ...get().draftScores };
    delete drafts[submissionId];
    set({ draftScores: drafts });
  },
}));
