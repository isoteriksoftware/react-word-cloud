import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { WordCloud, WordCloudProps } from "./index";
import { generateTestId } from "../../core/utils/test";

describe("WordCloud", () => {
  const svgTestId = generateTestId("WordCloud", "svg");
  const textTestId = generateTestId("DefaultWordRenderer", "text");

  const defaultProps: WordCloudProps = {
    words: [
      { text: "test", value: 10 },
      { text: "cloud", value: 20 },
    ],
    width: 600,
    height: 400,
  };

  it("renders without crashing", () => {
    render(<WordCloud {...defaultProps} />);

    expect(screen.getByTestId(svgTestId)).toBeInTheDocument();
  });

  it("calls onWordClick when a word is clicked", async () => {
    const onWordClick = vi.fn();
    render(<WordCloud {...defaultProps} onWordClick={onWordClick} />);

    const firstWord = screen.getByTestId(textTestId);
    await act(async () => {
      fireEvent.click(firstWord);
    });

    expect(onWordClick).toHaveBeenCalled();
  });

  it("handles mouse over and out events", async () => {
    const onWordMouseOver = vi.fn();
    const onWordMouseOut = vi.fn();

    render(
      <WordCloud
        {...defaultProps}
        onWordMouseOver={onWordMouseOver}
        onWordMouseOut={onWordMouseOut}
      />,
    );

    const firstWord = screen.getByTestId(textTestId);
    await act(async () => {
      fireEvent.mouseOver(firstWord);
    });
    expect(onWordMouseOver).toHaveBeenCalled();

    await act(async () => {
      fireEvent.mouseOut(firstWord);
    });
    expect(onWordMouseOut).toHaveBeenCalled();
  });

  it("renders tooltip when enableTooltip is true", async () => {
    const customTooltipRenderer: WordCloudProps["renderTooltip"] = ({ word }) => {
      return word ? <div data-testid="custom-tooltip">{word.text}</div> : null;
    };

    render(
      <WordCloud {...defaultProps} enableTooltip={true} renderTooltip={customTooltipRenderer} />,
    );

    const firstWord = screen.getByTestId(textTestId);
    await act(async () => {
      fireEvent.mouseOver(firstWord);
    });

    expect(screen.getByTestId("custom-tooltip")).toBeInTheDocument();
  });

  it("applies custom fill function", async () => {
    const customFill: WordCloudProps["fill"] = (_, index) => (index === 0 ? "#ff0000" : "#0000ff");

    render(<WordCloud {...defaultProps} fill={customFill} />);

    await waitFor(() => {
      const firstWord = screen.getByTestId(textTestId);
      expect(firstWord).toHaveStyle({ fill: "#ff0000" });
    });
  });

  it("applies custom transition", async () => {
    const customTransition = "all 1s ease-in-out";

    render(<WordCloud {...defaultProps} transition={customTransition} />);

    await waitFor(() => {
      const firstWord = screen.getByTestId(textTestId);
      expect(firstWord).toHaveStyle({ transition: "all 1s ease-in-out" });
    });
  });
});
