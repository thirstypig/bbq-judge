// Public API — only these are available to other features
export { TableStatusBoard } from "./components/TableStatusBoard";
export { ScoreReviewTable } from "./components/ScoreReviewTable";
export { CorrectionRequestPanel } from "./components/CorrectionRequestPanel";
export { SubmitCategoryDialog } from "./components/SubmitCategoryDialog";
export { CategorySubmittedScreen } from "./components/CategorySubmittedScreen";
export {
  getTableScoringStatus,
  getTableScoreCards,
  getPendingCorrectionRequests,
  isCategorySubmittedByTable,
  submitCategoryToOrganizer,
} from "./actions";
export type {
  TableScoringStatus,
  JudgeScoringStatus,
  ScoreCardWithJudge,
  CorrectionRequestWithDetails,
} from "./types";
