"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Competition } from "@prisma/client";

interface CompetitionContextValue {
  activeCompetition: Competition | null;
  competitions: Competition[];
  setActiveCompetitionId: (id: string | null) => void;
  setCompetitions: (competitions: Competition[]) => void;
  isLoading: boolean;
}

const CompetitionContext = createContext<CompetitionContextValue | null>(null);

const STORAGE_KEY = "bbq-judge-active-competition-id";

export function CompetitionProvider({ children }: { children: ReactNode }) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setActiveId(stored);
    setIsLoading(false);
  }, []);

  const setActiveCompetitionId = useCallback((id: string | null) => {
    setActiveId(id);
    if (id) {
      localStorage.setItem(STORAGE_KEY, id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const activeCompetition =
    competitions.find((c) => c.id === activeId) ?? null;

  return (
    <CompetitionContext.Provider
      value={{
        activeCompetition,
        competitions,
        setActiveCompetitionId,
        setCompetitions,
        isLoading,
      }}
    >
      {children}
    </CompetitionContext.Provider>
  );
}

export function useCompetition() {
  const ctx = useContext(CompetitionContext);
  if (!ctx) {
    throw new Error("useCompetition must be used within CompetitionProvider");
  }
  return ctx;
}
