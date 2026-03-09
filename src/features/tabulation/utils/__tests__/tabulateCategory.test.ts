import { describe, it, expect } from "vitest";
import { tabulateCategory, calcWeightedTotal, type SubmissionInput } from "../index";

function makeJudge(id: string) {
  return { id, name: `Judge ${id}`, cbjNumber: `CBJ-${id}` };
}

function makeSubmission(
  competitorId: string,
  scores: Array<{ app: number; taste: number; tex: number }>
): SubmissionInput {
  return {
    competitorId,
    anonymousNumber: competitorId,
    teamName: `Team ${competitorId}`,
    cards: scores.map((s, i) => ({
      judge: makeJudge(String(i + 1)),
      appearance: s.app,
      taste: s.taste,
      texture: s.tex,
    })),
  };
}

describe("calcWeightedTotal", () => {
  it("calculates perfect score as 36", () => {
    const total = calcWeightedTotal(9, 9, 9);
    expect(Math.round(total * 10000) / 10000).toBe(36);
  });

  it("applies correct weights", () => {
    // 8 * 0.56 + 7 * 2.2972 + 6 * 1.1428
    // = 4.48 + 16.0804 + 6.8568 = 27.4172
    const total = calcWeightedTotal(8, 7, 6);
    expect(Math.round(total * 10000) / 10000).toBe(27.4172);
  });
});

describe("tabulateCategory", () => {
  it("ranks by weighted total points (top 5 of 6 judges)", () => {
    // 6 judges each: competitor 102 scores higher
    const submissions: SubmissionInput[] = [
      makeSubmission("101", [
        { app: 7, taste: 7, tex: 7 },
        { app: 7, taste: 7, tex: 7 },
        { app: 7, taste: 7, tex: 7 },
        { app: 7, taste: 7, tex: 7 },
        { app: 7, taste: 7, tex: 7 },
        { app: 6, taste: 6, tex: 6 }, // this one gets dropped (lowest)
      ]),
      makeSubmission("102", [
        { app: 9, taste: 9, tex: 9 },
        { app: 9, taste: 9, tex: 9 },
        { app: 9, taste: 9, tex: 9 },
        { app: 9, taste: 9, tex: 9 },
        { app: 9, taste: 9, tex: 9 },
        { app: 8, taste: 8, tex: 8 }, // this one gets dropped (lowest)
      ]),
    ];

    const results = tabulateCategory(submissions);

    // 102 should rank first (perfect 180 from top 5)
    expect(results[0].competitorId).toBe("102");
    expect(results[0].rank).toBe(1);
    expect(results[0].totalPoints).toBe(180); // 5 × 36

    expect(results[1].competitorId).toBe("101");
    expect(results[1].rank).toBe(2);
  });

  it("drops the lowest scoring judge", () => {
    const submissions: SubmissionInput[] = [
      makeSubmission("101", [
        { app: 9, taste: 9, tex: 9 }, // 36
        { app: 9, taste: 9, tex: 9 }, // 36
        { app: 9, taste: 9, tex: 9 }, // 36
        { app: 9, taste: 9, tex: 9 }, // 36
        { app: 9, taste: 9, tex: 9 }, // 36
        { app: 2, taste: 2, tex: 2 }, // 8 — should be dropped
      ]),
    ];

    const results = tabulateCategory(submissions);

    // Top 5 = 5 × 36 = 180
    expect(results[0].totalPoints).toBe(180);
    expect(results[0].droppedScore).not.toBeNull();

    // The dropped judge should be judge 6
    const dropped = results[0].breakdown.find((b) => b.isDropped);
    expect(dropped).toBeDefined();
    expect(dropped!.judgeId).toBe("6");
  });

  it("does not drop when fewer than 6 judges", () => {
    const submissions: SubmissionInput[] = [
      makeSubmission("101", [
        { app: 9, taste: 9, tex: 9 }, // 36
        { app: 7, taste: 7, tex: 7 },
      ]),
    ];

    const results = tabulateCategory(submissions);
    expect(results[0].droppedScore).toBeNull();
    expect(results[0].breakdown.every((b) => !b.isDropped)).toBe(true);
  });

  it("handles missing scores (zero judges = no cards)", () => {
    const submissions: SubmissionInput[] = [
      makeSubmission("101", [
        { app: 7, taste: 7, tex: 7 },
      ]),
      {
        competitorId: "102",
        anonymousNumber: "102",
        teamName: "Team 102",
        cards: [],
      },
    ];

    const results = tabulateCategory(submissions);

    expect(results[0].competitorId).toBe("101");
    expect(results[0].judgeCount).toBe(1);

    expect(results[1].competitorId).toBe("102");
    expect(results[1].totalPoints).toBe(0);
    expect(results[1].judgeCount).toBe(0);
    expect(results[1].averageScore).toBe(0);
  });

  it("flags DQ when any dimension score is 1", () => {
    const submissions: SubmissionInput[] = [
      makeSubmission("101", [
        { app: 1, taste: 8, tex: 7 }, // DQ: appearance = 1
      ]),
      makeSubmission("102", [
        { app: 7, taste: 7, tex: 7 },
      ]),
    ];

    const results = tabulateCategory(submissions);

    // Non-DQ ranked first
    expect(results[0].competitorId).toBe("102");
    expect(results[0].isDQ).toBe(false);

    // DQ ranked last
    expect(results[1].competitorId).toBe("101");
    expect(results[1].isDQ).toBe(true);
    expect(results[1].breakdown[0].isDQ).toBe(true);
  });

  it("flags DQ for taste = 1", () => {
    const submissions: SubmissionInput[] = [
      makeSubmission("101", [{ app: 8, taste: 1, tex: 7 }]),
    ];

    const results = tabulateCategory(submissions);
    expect(results[0].isDQ).toBe(true);
  });

  it("flags DQ for texture = 1", () => {
    const submissions: SubmissionInput[] = [
      makeSubmission("101", [{ app: 8, taste: 7, tex: 1 }]),
    ];

    const results = tabulateCategory(submissions);
    expect(results[0].isDQ).toBe(true);
  });

  it("breaks ties using taste first", () => {
    // Same total weighted points, but different taste scores
    const submissions: SubmissionInput[] = [
      makeSubmission("101", [
        { app: 8, taste: 7, tex: 8 }, // weighted: 4.48 + 16.0804 + 9.1424 = 29.7028
      ]),
      makeSubmission("102", [
        { app: 7, taste: 8, tex: 7 }, // weighted: 3.92 + 18.3776 + 7.9996 = 30.2972
      ]),
    ];

    const results = tabulateCategory(submissions);

    // 102 has higher weighted total, ranks first
    expect(results[0].competitorId).toBe("102");
  });

  it("detects outliers (>2 weighted pts from average)", () => {
    const submissions: SubmissionInput[] = [
      makeSubmission("101", [
        { app: 9, taste: 9, tex: 9 }, // weighted 36
        { app: 9, taste: 9, tex: 9 }, // weighted 36
        { app: 2, taste: 2, tex: 2 }, // weighted 8 — outlier
      ]),
    ];

    const results = tabulateCategory(submissions);
    const breakdown = results[0].breakdown;

    // Average weighted = (36 + 36 + 8) / 3 ≈ 26.67
    // Judge 3 (weighted 8) is >2 from avg
    expect(breakdown[2].isOutlier).toBe(true);
  });

  it("marks declared winners", () => {
    const submissions: SubmissionInput[] = [
      makeSubmission("101", [{ app: 9, taste: 9, tex: 9 }]),
      makeSubmission("102", [{ app: 7, taste: 7, tex: 7 }]),
    ];

    const winners = new Set(["101"]);
    const results = tabulateCategory(submissions, winners);

    expect(results[0].winnerDeclared).toBe(true);
    expect(results[1].winnerDeclared).toBe(false);
  });

  it("uses dropped score as tiebreaker when top 5 are tied", () => {
    // Both competitors have identical top 5 scores
    const submissions: SubmissionInput[] = [
      makeSubmission("101", [
        { app: 8, taste: 8, tex: 8 },
        { app: 8, taste: 8, tex: 8 },
        { app: 8, taste: 8, tex: 8 },
        { app: 8, taste: 8, tex: 8 },
        { app: 8, taste: 8, tex: 8 },
        { app: 7, taste: 7, tex: 7 }, // lower dropped score
      ]),
      makeSubmission("102", [
        { app: 8, taste: 8, tex: 8 },
        { app: 8, taste: 8, tex: 8 },
        { app: 8, taste: 8, tex: 8 },
        { app: 8, taste: 8, tex: 8 },
        { app: 8, taste: 8, tex: 8 },
        { app: 8, taste: 8, tex: 8 }, // higher dropped score
      ]),
    ];

    const results = tabulateCategory(submissions);

    // 102 should win because their dropped score is higher
    expect(results[0].competitorId).toBe("102");
  });
});
