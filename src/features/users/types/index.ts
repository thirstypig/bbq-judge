export type ImportJudgeInput = {
  cbjNumber: string;
  name: string;
};

export type ImportResult = {
  created: number;
  existing: number;
  userIds: string[];
  errors: Array<{ cbjNumber: string; error: string }>;
};
