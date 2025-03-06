import { describe, expect, it } from "vitest";
import { computeLinearGradientCoords } from "./compute";

describe("computeLinearGradientCoords", () => {
  it("should compute correct coordinates for 0°", () => {
    const result = computeLinearGradientCoords(0);

    expect(result.x1).toBeCloseTo(0);
    expect(result.y1).toBeCloseTo(50);
    expect(result.x2).toBeCloseTo(100);
    expect(result.y2).toBeCloseTo(50);
  });

  it("should compute correct coordinates for 90°", () => {
    const result = computeLinearGradientCoords(90);

    expect(result.x1).toBeCloseTo(50);
    expect(result.y1).toBeCloseTo(0);
    expect(result.x2).toBeCloseTo(50);
    expect(result.y2).toBeCloseTo(100);
  });

  it("should compute correct coordinates for 180°", () => {
    const result = computeLinearGradientCoords(180);

    expect(result.x1).toBeCloseTo(100);
    expect(result.y1).toBeCloseTo(50);
    expect(result.x2).toBeCloseTo(0);
    expect(result.y2).toBeCloseTo(50);
  });

  it("should compute correct coordinates for 270°", () => {
    const result = computeLinearGradientCoords(270);

    expect(result.x1).toBeCloseTo(50);
    expect(result.y1).toBeCloseTo(100);
    expect(result.x2).toBeCloseTo(50);
    expect(result.y2).toBeCloseTo(0);
  });

  it("should compute correct coordinates for 45°", () => {
    const result = computeLinearGradientCoords(45);

    expect(result.x1).toBeCloseTo(14.65, 1);
    expect(result.y1).toBeCloseTo(14.65, 1);
    expect(result.x2).toBeCloseTo(85.35, 1);
    expect(result.y2).toBeCloseTo(85.35, 1);
  });
});
