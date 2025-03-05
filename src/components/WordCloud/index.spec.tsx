import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { WordCloud, WordCloudProps } from "./index";
import { generateTestId } from "../../core/utils/test";

describe("WordCloud", () => {
  const containerTestId = generateTestId("WordCloud", "container");
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

    expect(screen.getByTestId(containerTestId)).toBeInTheDocument();
    expect(screen.getByTestId(svgTestId)).toBeInTheDocument();
  });

  it("applies custom container styles", () => {
    const containerStyle: WordCloudProps["containerStyle"] = { background: "#ff0000" };
    render(<WordCloud {...defaultProps} containerStyle={containerStyle} />);

    const container = screen.getByTestId(containerTestId);
    expect(container).toHaveStyle({ background: "#ff0000" });
  });

  it("calls onWordClick when a word is clicked", () => {
    const onWordClick = vi.fn();
    render(<WordCloud {...defaultProps} onWordClick={onWordClick} />);

    const firstWord = screen.getByTestId(textTestId);
    fireEvent.click(firstWord);

    expect(onWordClick).toHaveBeenCalled();
  });

  it("handles mouse over and out events", () => {
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
    fireEvent.mouseOver(firstWord);
    expect(onWordMouseOver).toHaveBeenCalled();

    fireEvent.mouseOut(firstWord);
    expect(onWordMouseOut).toHaveBeenCalled();
  });

  it("renders tooltip when enableTooltip is true", () => {
    const customTooltipRenderer: WordCloudProps["tooltipRenderer"] = ({ word }) => {
      return word ? <div data-testid="custom-tooltip">{word.text}</div> : null;
    };

    render(
      <WordCloud {...defaultProps} enableTooltip={true} tooltipRenderer={customTooltipRenderer} />,
    );

    const firstWord = screen.getByTestId(textTestId);
    fireEvent.mouseOver(firstWord);

    expect(screen.getByTestId("custom-tooltip")).toBeInTheDocument();
  });

  it("applies custom fill function", () => {
    const customFill: WordCloudProps["fill"] = (_, index) => (index === 0 ? "#ff0000" : "#0000ff");

    render(<WordCloud {...defaultProps} fill={customFill} />);

    const firstWord = screen.getByTestId(textTestId);
    expect(firstWord).toHaveStyle({ fill: "#ff0000" });
  });

  it("applies custom transition", () => {
    const customTransition = "all 1s ease-in-out";

    render(<WordCloud {...defaultProps} transition={customTransition} />);

    const firstWord = screen.getByTestId(textTestId);
    expect(firstWord).toHaveStyle({ transition: "all 1s ease-in-out" });
  });
});
