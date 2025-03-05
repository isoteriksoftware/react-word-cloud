import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DefaultWordRenderer } from "./index";
import "@testing-library/jest-dom";
import { generateTestId } from "../../core/utils/test";
import { ComputedWord, WordRendererData } from "../../core";

describe("DefaultWordRenderer", () => {
  const textTestId = generateTestId("DefaultWordRenderer", "text");

  const mockWord: ComputedWord = {
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

  const renderWord = (data: WordRendererData) =>
    render(
      <svg>
        <DefaultWordRenderer data={data} />
      </svg>,
    );

  it("renders word with correct text", () => {
    renderWord(mockData);

    expect(screen.getByTestId(textTestId)).toHaveTextContent("Test Word");
  });

  it("applies correct styles", () => {
    renderWord(mockData);

    const textElement = screen.getByTestId(textTestId);
    expect(textElement).toHaveStyle({
      fontFamily: "Arial",
      fontSize: "16px",
      fill: "#000000",
      transition: "all 0.3s ease",
    });
  });

  it("re-renders with updated data", () => {
    const { rerender } = render(<DefaultWordRenderer data={mockData} />);

    const updatedWord: ComputedWord = {
      ...mockWord,
      text: "Updated Word",
      value: 20,
      x: 150,
      y: 150,
      size: 20,
    };

    const updatedData: WordRendererData = {
      ...updatedWord,
      index: 1,
      fill: "#ff0000",
      transition: "all 0.5s ease",
      onWordClick: vi.fn(),
      onWordMouseOver: vi.fn(),
      onWordMouseOut: vi.fn(),
    };

    rerender(<DefaultWordRenderer data={updatedData} />);

    const textElement = screen.getByTestId(textTestId);
    expect(textElement).toHaveTextContent("Updated Word");
    expect(textElement).toHaveStyle({
      fontFamily: "Arial",
      fontSize: "20px",
      fill: "#ff0000",
      transition: "all 0.5s ease",
    });
  });

  it("handles click events", () => {
    renderWord(mockData);

    const textElement = screen.getByTestId(textTestId);
    fireEvent.click(textElement);

    expect(mockData.onWordClick).toHaveBeenCalledWith(mockWord, 0, expect.any(Object));
  });

  it("handles mouse over events", () => {
    renderWord(mockData);

    const textElement = screen.getByTestId(textTestId);
    fireEvent.mouseOver(textElement);

    expect(mockData.onWordMouseOver).toHaveBeenCalledWith(mockWord, 0, expect.any(Object));
  });

  it("handles mouse out events", () => {
    renderWord(mockData);

    const textElement = screen.getByTestId(textTestId);
    fireEvent.mouseOut(textElement);

    expect(mockData.onWordMouseOut).toHaveBeenCalledWith(mockWord, 0, expect.any(Object));
  });
});
