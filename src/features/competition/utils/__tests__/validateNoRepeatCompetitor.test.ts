import { describe, it, expect } from "vitest";
import { validateNoRepeatCompetitor } from "../index";

describe("validateNoRepeatCompetitor", () => {
  const existingSubmissions = [
    { tableId: "table-1", competitorId: "comp-101" },
    { tableId: "table-1", competitorId: "comp-102" },
    { tableId: "table-2", competitorId: "comp-103" },
  ];

  it("returns true when competitor has not been at this table", () => {
    expect(
      validateNoRepeatCompetitor(existingSubmissions, "table-1", "comp-103")
    ).toBe(true);
  });

  it("returns true for a new competitor at any table", () => {
    expect(
      validateNoRepeatCompetitor(existingSubmissions, "table-1", "comp-999")
    ).toBe(true);
  });

  it("returns false when competitor already seen at this table", () => {
    expect(
      validateNoRepeatCompetitor(existingSubmissions, "table-1", "comp-101")
    ).toBe(false);
  });

  it("allows same competitor at a different table", () => {
    expect(
      validateNoRepeatCompetitor(existingSubmissions, "table-2", "comp-101")
    ).toBe(true);
  });

  it("returns true when no submissions exist", () => {
    expect(validateNoRepeatCompetitor([], "table-1", "comp-101")).toBe(true);
  });
});
