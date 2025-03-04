import { ComputedWord, computeWordPosition, Position, TooltipRendererData } from "../../core";
import { CSSProperties, memo, useEffect, useState } from "react";
import isDeepEqual from "react-fast-compare";

export type DefaultTooltipRendererProps = {
  data: TooltipRendererData;
  transitionDuration?: number;
  containerStyle?: CSSProperties;
  textStyle?: CSSProperties;
  valueStyle?: CSSProperties;
};

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
  const [currentWord, setCurrentWord] = useState<ComputedWord>();

  useEffect(() => {
    if (data.word) {
      setCurrentWord(data.word);
      setPosition(computeWordPosition(data));
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
    ...containerStyle,
  };

  const mergedTextStyle: CSSProperties = {
    fontWeight: "bold",
    marginRight: "6px",
    fontSize: "14px",
    ...textStyle,
  };

  const mergedValueStyle: CSSProperties = {
    fontStyle: "italic",
    fontSize: "12px",
    ...valueStyle,
  };

  return (
    <div style={mergedContainerStyle}>
      <span style={mergedTextStyle}>{currentWord?.text}</span>
      <span style={mergedValueStyle}>{currentWord?.value}</span>
    </div>
  );
};

export const DefaultTooltipRenderer = memo(TooltipRenderer, isDeepEqual);
