import { describe, expect, it } from "vitest";
import { LESSONS, LEVELS, GLOSSARY } from "@/data/lessons";
import { BADGES } from "@/lib/game";

describe("Educational content", () => {
  it("has no hyphens or dashes in educational text", () => {
    const text = [
      ...LEVELS.flatMap((l) => [l.name, l.subtitle]),
      ...LESSONS.flatMap((l) => [l.title, ...l.paragraphs, l.question, ...l.options, l.explanation]),
      ...Object.values(GLOSSARY),
      ...BADGES.flatMap((b) => [b.name, b.desc]),
    ].join(" ");
    expect(text).not.toMatch(/[-–—]/);
  });
});
