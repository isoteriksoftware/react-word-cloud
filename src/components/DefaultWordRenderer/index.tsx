import { WordRendererData } from "../../core";
import { CSSProperties, memo } from "react";
import isDeepEqual from "react-fast-compare";
import { generateTestId } from "../../core/utils/test";

export type DefaultWordRendererProps = {
  data: WordRendererData;
  textStyle?: CSSProperties;
};

const testId = generateTestId("DefaultWordRenderer", "text");

const WordRenderer = ({ data, textStyle }: DefaultWordRendererProps) => {
  const { index, onWordClick, onWordMouseOver, onWordMouseOut, ...word } = data;

  return (
    <text
      key={index}
      data-testid={testId}
      textAnchor="middle"
      transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
      style={{
        fontFamily: word.font,
        fontStyle: word.style,
        fontWeight: word.weight,
        fontSize: `${word.size}px`,
        fill: word.fill,
        transition: word.transition,
        cursor: onWordClick ? "pointer" : "text",
        ...textStyle,
      }}
      onClick={(event) => onWordClick?.(word, index, event)}
      onMouseOver={(event) => onWordMouseOver?.(word, index, event)}
      onMouseOut={(event) => onWordMouseOut?.(word, index, event)}
    >
      {word.text}
    </text>
  );
};

export const DefaultWordRenderer = memo(WordRenderer, isDeepEqual);
