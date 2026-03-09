import { describe, it, expect } from "vitest";
import { scorecardSchema, hasDQScore } from "../index";

describe("scorecardSchema", () => {
  it("accepts valid KCBS scores (9, 8, 7, 6, 5, 2, 1)", () => {
    const result = scorecardSchema.safeParse({
      appearance: 7,
      taste: 8,
      texture: 6,
    });
    expect(result.success).toBe(true);
  });

  it("accepts DQ score (1)", () => {
    const result = scorecardSchema.safeParse({
      appearance: 1,
      taste: 1,
      texture: 1,
    });
    expect(result.success).toBe(true);
  });

  it("accepts inedible score (2)", () => {
    const result = scorecardSchema.safeParse({
      appearance: 2,
      taste: 2,
      texture: 2,
    });
    expect(result.success).toBe(true);
  });

  it("accepts maximum valid scores (all nines)", () => {
    const result = scorecardSchema.safeParse({
      appearance: 9,
      taste: 9,
      texture: 9,
    });
    expect(result.success).toBe(true);
  });

  it("rejects score of 0 (not valid in KCBS)", () => {
    const result = scorecardSchema.safeParse({
      appearance: 0,
      taste: 8,
      texture: 7,
    });
    expect(result.success).toBe(false);
  });

  it("rejects score of 3 (not used in KCBS)", () => {
    const result = scorecardSchema.safeParse({
      appearance: 3,
      taste: 8,
      texture: 7,
    });
    expect(result.success).toBe(false);
  });

  it("rejects score of 4 (not used in KCBS)", () => {
    const result = scorecardSchema.safeParse({
      appearance: 7,
      taste: 4,
      texture: 7,
    });
    expect(result.success).toBe(false);
  });

  it("rejects scores above 9", () => {
    const result = scorecardSchema.safeParse({
      appearance: 10,
      taste: 8,
      texture: 7,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative scores", () => {
    const result = scorecardSchema.safeParse({
      appearance: -1,
      taste: 8,
      texture: 7,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer scores", () => {
    const result = scorecardSchema.safeParse({
      appearance: 7.5,
      taste: 8,
      texture: 7,
    });
    expect(result.success).toBe(false);
  });

  it("coerces string numbers to integers", () => {
    const result = scorecardSchema.safeParse({
      appearance: "7",
      taste: "8",
      texture: "6",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.appearance).toBe(7);
    }
  });

  it("rejects missing fields", () => {
    const result = scorecardSchema.safeParse({
      appearance: 7,
      taste: 8,
    });
    expect(result.success).toBe(false);
  });
});

describe("hasDQScore", () => {
  it("returns true when appearance is 1 (DQ)", () => {
    expect(hasDQScore({ appearance: 1, taste: 7, texture: 7 })).toBe(true);
  });

  it("returns true when taste is 1 (DQ)", () => {
    expect(hasDQScore({ appearance: 7, taste: 1, texture: 7 })).toBe(true);
  });

  it("returns true when texture is 1 (DQ)", () => {
    expect(hasDQScore({ appearance: 7, taste: 7, texture: 1 })).toBe(true);
  });

  it("returns false when no dimension is 1", () => {
    expect(hasDQScore({ appearance: 7, taste: 8, texture: 6 })).toBe(false);
  });

  it("returns false for partial scores with no DQ", () => {
    expect(hasDQScore({ appearance: 5 })).toBe(false);
  });
});
