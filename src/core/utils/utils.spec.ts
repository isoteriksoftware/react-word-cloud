import { describe, expect, it } from "vitest";
import { computeLinearGradientCoords, computeWordScreenPosition } from "./compute";
import { FinalWordData, Position } from "../types";

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

describe("computeWordScreenPosition", () => {
  const mockWord: FinalWordData = {
    text: "Test Word",
    value: 10,
    x: 10,
    y: 20,
    size: 16,
    rotate: 0,
    font: "Arial",
    weight: "normal",
    style: "normal",
    padding: 1,
    transition: "all 0.3s ease",
    fill: "#000000",
  };

  const createMockSvgElement = (renderedWidth: number, renderedHeight: number): SVGElement => {
    return {
      getBoundingClientRect: () => ({
        width: renderedWidth,
        height: renderedHeight,
      }),
    } as unknown as SVGElement;
  };

  it("returns fallback values when no word is provided", () => {
    const result: Position = computeWordScreenPosition({
      word: undefined,
      svgElement: createMockSvgElement(800, 800),
      layoutWidth: 400,
      layoutHeight: 400,
    });

    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it("returns fallback values when no svgElement is provided", () => {
    const result: Position = computeWordScreenPosition({
      word: mockWord,
      svgElement: undefined,
      layoutWidth: 400,
      layoutHeight: 400,
    });

    expect(result.x).toBe(10);
    expect(result.y).toBe(20);
  });

  it("computes correct position given word and svgElement with scale factor 2", () => {
    // Assume a layout of 400x400 and an SVG rendered at 800x800 (scale factor 2).
    // With a translation of (layoutWidth/2, layoutHeight/2) = (200,200),
    // and a word at relative position { x: 50, y: -50 }:
    // The absolute coordinates in the viewBox would be (200+50, 200-50) = (250,150),
    // then scaling by 2 gives (250*2, 150*2) = (500,300).
    const word = { ...mockWord, x: 50, y: -50 };
    const layoutWidth = 400;
    const layoutHeight = 400;
    const svgElement = createMockSvgElement(800, 800);

    const result: Position = computeWordScreenPosition({
      word,
      svgElement,
      layoutWidth,
      layoutHeight,
    });
    expect(result.x).toBe(500);
    expect(result.y).toBe(300);
  });

  it("computes correct position for different svgElement sizes (scale factor 1.5)", () => {
    // For a layout of 400x400 and an SVG rendered at 600x600 (scale factor = 600/400 = 1.5):
    // With a word at { x: -100, y: 100 }:
    // Absolute viewBox coordinates: (200 - 100, 200 + 100) = (100, 300).
    // After scaling: (100 * 1.5, 300 * 1.5) = (150, 450).

    const word = { ...mockWord, x: -100, y: 100 };
    const layoutWidth = 400;
    const layoutHeight = 400;
    const svgElement = createMockSvgElement(600, 600);
    const result: Position = computeWordScreenPosition({
      word,
      svgElement,
      layoutWidth,
      layoutHeight,
    });

    expect(result.x).toBe(150);
    expect(result.y).toBe(450);
  });
});
