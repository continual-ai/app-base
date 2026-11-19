import { describe, expect, it } from "vitest";
import { findIssues } from "../scripts/kit-rules";

const issues = (source: string) => findIssues("src/routes/index.tsx", source);

describe("kit:check", () => {
  it("passes screens built from tokens", () => {
    expect(
      issues(
        '<div className="rounded-xl bg-card text-small text-soft shadow-surface">Invoice #1042</div>',
      ),
    ).toEqual([]);
  });

  it("flags raw colors, sizes, shadows and bold type", () => {
    expect(issues('<p className="bg-[#fff] text-red-500" />')).toHaveLength(2);
    expect(issues('<p className="text-sm text-[15px]" />')).toHaveLength(2);
    expect(issues('<p className="shadow-lg" />')).toHaveLength(1);
    expect(issues('<p style={{ color: "#333" }} />')).toHaveLength(1);
    expect(issues('<h1 className="font-bold" />')).toHaveLength(1);
  });

  it("reports where each issue is", () => {
    expect(issues('const a = 1;\n<p className="text-lg" />')[0]).toMatchObject({
      line: 2,
      file: "src/routes/index.tsx",
    });
  });
});
