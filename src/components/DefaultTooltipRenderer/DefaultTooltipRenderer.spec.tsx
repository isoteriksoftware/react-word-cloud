import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DefaultTooltipRenderer, DefaultTooltipRendererProps } from "./index";
import { FinalWordData, TooltipRendererData } from "../../core";
import { generateTestId } from "../../core/utils/test";
import "@testing-library/jest-dom";

describe("DefaultTooltipRenderer", () => {
  const containerTestId = generateTestId("DefaultTooltipRenderer", "container");
  const textTestId = generateTestId("DefaultTooltipRenderer", "text");
  const valueTestId = generateTestId("DefaultTooltipRenderer", "value");

  const mockWord: FinalWordData = {
    text: "Test Word",
    value: 10,
    x: 100,
    y: 100,
    size: 16,
    rotate: 0,
    font: "Arial",
    weight: "normal",
    style: "normal",
    padding: 1,
    transition: "all 0.3s ease",
    fill: "#000000",
  };

  const mockData: TooltipRendererData = {
    word: mockWord,
    layoutWidth: 1000,
    layoutHeight: 500,
  };

  it("renders tooltip with correct text and value", () => {
    render(<DefaultTooltipRenderer data={mockData} />);

    expect(screen.getByTestId(textTestId)).toHaveTextContent("Test Word");
    expect(screen.getByTestId(valueTestId)).toHaveTextContent("10");
  });

  it("applies custom styles when provided", () => {
    const customStyles: Pick<
      DefaultTooltipRendererProps,
      "containerStyle" | "textStyle" | "valueStyle"
    > = {
      containerStyle: { background: "rgb(255, 0, 0)" },
      textStyle: { color: "rgb(0, 0, 255)" },
      valueStyle: { fontSize: "16px" },
    };

    render(<DefaultTooltipRenderer data={mockData} {...customStyles} />);

    const tooltipContainer = screen.getByTestId(containerTestId);
    expect(tooltipContainer).toHaveStyle({ background: "rgb(255, 0, 0)" });
    expect(screen.getByTestId(textTestId)).toHaveStyle({ color: "rgb(0, 0, 255)" });
    expect(screen.getByTestId(valueTestId)).toHaveStyle({ fontSize: "16px" });
  });

  it("hides tooltip when no word data is provided", () => {
    const emptyData: TooltipRendererData = {
      layoutWidth: 1000,
      layoutHeight: 500,
    };

    render(<DefaultTooltipRenderer data={emptyData} />);
    const tooltipContainer = screen.getByTestId(containerTestId);

    expect(tooltipContainer).toHaveStyle({ opacity: "0" });
  });

  it("applies correct transition duration", () => {
    const customDuration = 500;
    render(<DefaultTooltipRenderer data={mockData} transitionDuration={customDuration} />);

    const tooltipContainer = screen.getByTestId(containerTestId);
    expect(tooltipContainer).toHaveStyle({
      transition: `all ${customDuration}ms ease`,
    });
  });
});
