import { ComputedWord } from "../../core";
import { CSSProperties, memo, useEffect, useState } from "react";
import isDeepEqual from "react-fast-compare";

type Position = {
  x: number;
  y: number;
};

export type DefaultTooltipRendererProps = {
  word?: ComputedWord;
  transitionDuration?: number;
  containerStyle?: CSSProperties;
  textStyle?: CSSProperties;
  valueStyle?: CSSProperties;
};

const TooltipRenderer = ({
  word,
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

  useEffect(() => {
    if (word) {
      setPosition({ x: word.x, y: word.y });
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [word]);

  const mergedContainerStyle: CSSProperties = {
    position: "absolute",
    left: `${position.x + 10}px`,
    top: `${position.y + 10}px`,
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
      <span style={mergedTextStyle}>{word?.text}</span>
      <span style={mergedValueStyle}>{word?.value}</span>
    </div>
  );
};

export const DefaultTooltipRenderer = memo(TooltipRenderer, isDeepEqual);
