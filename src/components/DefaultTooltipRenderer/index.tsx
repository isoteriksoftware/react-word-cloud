import {
  computeWordScreenPosition,
  FinalWordData,
  Position,
  TooltipRendererData,
} from "../../core";
import { CSSProperties, memo, useEffect, useState } from "react";
import isDeepEqual from "react-fast-compare";
import { generateTestId } from "../../core/utils/test";

export type DefaultTooltipRendererProps = {
  data: TooltipRendererData;
  transitionDuration?: number;
  containerStyle?: CSSProperties;
  textStyle?: CSSProperties;
  valueStyle?: CSSProperties;
};

const containerTestId = generateTestId("DefaultTooltipRenderer", "container");
const textTestId = generateTestId("DefaultTooltipRenderer", "text");
const valueTestId = generateTestId("DefaultTooltipRenderer", "value");

const TooltipRenderer = ({
  data,
  transitionDuration = 300,
  containerStyle,
  textStyle,
  valueStyle,
}: DefaultTooltipRendererProps) => {
  const [position, setPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [visible, setVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState<FinalWordData>();

  useEffect(() => {
    if (data.word) {
      setCurrentWord(data.word);
      setPosition(computeWordScreenPosition(data));
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [data, transitionDuration]);

  const mergedContainerStyle: CSSProperties = {
    position: "absolute",
    left: `${position.x}px`,
    top: `${position.y}px`,
    opacity: visible ? 1 : 0,
    transition: `all ${transitionDuration}ms ease`,
    pointerEvents: "none",
    background: "rgba(0, 0, 0, 0.75)",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "4px",
    transform: "translate(10px, 10px)",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    ...containerStyle,
  };

  const mergedTextStyle: CSSProperties = {
    fontWeight: "bold",
    fontSize: "14px",
    fontFamily: "Arial",
    ...textStyle,
  };

  const mergedValueStyle: CSSProperties = {
    fontSize: "12px",
    fontFamily: "monospace",
    ...valueStyle,
  };

  return (
    <div style={mergedContainerStyle} data-testid={containerTestId}>
      <span style={mergedTextStyle} data-testid={textTestId}>
        {currentWord?.text}
      </span>
      <span style={mergedValueStyle} data-testid={valueTestId}>
        {currentWord?.value}
      </span>
    </div>
  );
};

export const DefaultTooltipRenderer = memo(TooltipRenderer, isDeepEqual);
