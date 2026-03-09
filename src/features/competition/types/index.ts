import type {
  Competition,
  Competitor,
  Table,
  TableAssignment,
  CategoryRound,
  CompetitionJudge,
  User,
} from "@prisma/client";

export type CompetitionWithRelations = Competition & {
  competitors: Competitor[];
  tables: (Table & {
    captain: Pick<User, "id" | "name" | "cbjNumber"> | null;
    assignments: (TableAssignment & {
      user: Pick<User, "id" | "name" | "cbjNumber" | "role">;
    })[];
  })[];
  categoryRounds: CategoryRound[];
  _count?: {
    competitors: number;
    tables: number;
  };
};

export type CompetitionJudgeWithUser = CompetitionJudge & {
  user: Pick<User, "id" | "name" | "cbjNumber" | "email" | "role">;
  tableAssignment?: {
    tableNumber: number;
    seatNumber: number | null;
  } | null;
};

export type CompetitionFormValues = {
  name: string;
  date: string;
  location: string;
};

export type CompetitorFormValues = {
  teamName: string;
  anonymousNumber: string;
};

export type TableSetupValues = {
  tableNumber: number;
  captainCbjNumber: string;
};

export type JudgeAssignmentValues = {
  cbjNumber: string;
  seatNumber: number;
  isCaptain: boolean;
};
