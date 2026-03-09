import { z } from "zod";
import { VALID_SCORES, DQ_SCORE } from "@/shared/constants/kcbs";

const validScoreSet = new Set<number>(VALID_SCORES);

const scoreField = z.coerce
  .number()
  .int("Score must be a whole number")
  .refine((v) => validScoreSet.has(v), {
    message: `Score must be one of: ${VALID_SCORES.join(", ")}`,
  });

export const scorecardSchema = z.object({
  appearance: scoreField,
  taste: scoreField,
  texture: scoreField,
});

export type ScorecardSchemaType = z.infer<typeof scorecardSchema>;

/** Returns true if any dimension is 1 (DQ/penalty in KCBS). */
export function hasDQScore(scores: Partial<ScorecardSchemaType>): boolean {
  return (
    scores.appearance === DQ_SCORE ||
    scores.taste === DQ_SCORE ||
    scores.texture === DQ_SCORE
  );
}

export const correctionSchema = z.object({
  reason: z
    .string()
    .min(20, "Reason must be at least 20 characters")
    .max(500, "Reason must be at most 500 characters"),
});

export type CorrectionSchemaType = z.infer<typeof correctionSchema>;

export const tableSetupSchema = z.object({
  tableNumber: z.coerce.number().int().min(1, "Table number must be at least 1"),
  seatNumber: z.coerce.number().int().min(1, "Seat must be 1-6").max(6, "Seat must be 1-6"),
});

export type TableSetupSchemaType = z.infer<typeof tableSetupSchema>;

export const boxCodeSchema = z
  .string()
  .length(3, "Box code must be 3 digits")
  .regex(/^\d{3}$/, "Box code must be 3 digits");

export type BoxCodeSchemaType = z.infer<typeof boxCodeSchema>;
