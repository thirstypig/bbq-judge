import { z } from "zod";

export const importJudgeSchema = z.object({
  cbjNumber: z
    .string()
    .min(1, "CBJ number is required")
    .regex(/^\d+$/, "CBJ number must be numeric"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export type ImportJudgeSchemaType = z.infer<typeof importJudgeSchema>;
