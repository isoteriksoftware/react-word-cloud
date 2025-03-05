import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AnimatedWordRenderer, AnimatedWordRendererProps } from "./index";
import { generateTestId } from "../../core/utils/test";
import { ComputedWordData, WordRendererData } from "../../core";

describe("AnimatedWordRenderer", () => {
  const testId = generateTestId("AnimatedWordRenderer", "text");

  const mockWord: ComputedWordData = {
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
  };

  const mockData: WordRendererData = {
    ...mockWord,
    index: 0,
    fill: "#000000",
    transition: "all 0.3s ease",
    onWordClick: vi.fn(),
    onWordMouseOver: vi.fn(),
    onWordMouseOut: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderWord = (props: {
    data: WordRendererData;
    animationDelay?: AnimatedWordRendererProps["animationDelay"];
  }) =>
    render(
      <svg>
        <AnimatedWordRenderer {...props} />
      </svg>,
    );

  it("renders word with initial scale of 0", () => {
    renderWord({ data: mockData });

    const textElement = screen.getByTestId(testId);
    expect(textElement).toHaveAttribute(
      "transform",
      `translate(${mockData.x}, ${mockData.y}) rotate(${mockData.rotate}) scale(0)`,
    );
  });

  it("animates word after default delay", async () => {
    renderWord({ data: mockData });

    const textElement = screen.getByTestId(testId);
    expect(textElement).toHaveAttribute(
      "transform",
      `translate(${mockData.x}, ${mockData.y}) rotate(${mockData.rotate}) scale(0)`,
    );

    await act(async () => {
      vi.advanceTimersByTime(10);
    });

    expect(textElement).toHaveAttribute(
      "transform",
      `translate(${mockData.x}, ${mockData.y}) rotate(${mockData.rotate}) scale(1)`,
    );
  });

  it("respects custom animation delay", async () => {
    renderWord({ data: mockData, animationDelay: 500 });

    const textElement = screen.getByTestId(testId);

    await act(async () => {
      vi.advanceTimersByTime(499);
    });

    expect(textElement).toHaveAttribute(
      "transform",
      `translate(${mockData.x}, ${mockData.y}) rotate(${mockData.rotate}) scale(0)`,
    );

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    expect(textElement).toHaveAttribute(
      "transform",
      `translate(${mockData.x}, ${mockData.y}) rotate(${mockData.rotate}) scale(1)`,
    );
  });

  it("respects custom animation delay function", async () => {
    const customDelay: AnimatedWordRendererProps["animationDelay"] = (_, index) => index * 100;
    renderWord({ data: { ...mockData, index: 2 }, animationDelay: customDelay });

    const textElement = screen.getByTestId(testId);

    expect(textElement).toHaveAttribute(
      "transform",
      `translate(${mockData.x}, ${mockData.y}) rotate(${mockData.rotate}) scale(0)`,
    );

    await act(async () => {
      vi.advanceTimersByTime(199);
    });

    expect(textElement).toHaveAttribute(
      "transform",
      `translate(${mockData.x}, ${mockData.y}) rotate(${mockData.rotate}) scale(0)`,
    );

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    expect(textElement).toHaveAttribute(
      "transform",
      `translate(${mockData.x}, ${mockData.y}) rotate(${mockData.rotate}) scale(1)`,
    );
  });

  it("applies correct styles", () => {
    renderWord({ data: mockData });

    const textElement = screen.getByTestId(testId);
    expect(textElement).toHaveStyle({
      fontFamily: mockData.font,
      fontStyle: mockData.style,
      fontWeight: mockData.weight,
      fontSize: `${mockData.size}px`,
      fill: mockData.fill,
      transition: mockData.transition,
    });
  });

  it("cleans up timeout on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
    const { unmount } = renderWord({ data: mockData });

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
