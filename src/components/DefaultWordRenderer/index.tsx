import { WordRendererData } from "../../core";
import { memo } from "react";
import isDeepEqual from "react-fast-compare";
import { generateTestId } from "../../core/utils/test";

export type DefaultWordRendererProps = {
  data: WordRendererData;
};

const testId = generateTestId("DefaultWordRenderer", "text");

const WordRenderer = ({ data }: DefaultWordRendererProps) => {
  const { index, fill, transition, onWordClick, onWordMouseOver, onWordMouseOut, ...word } = data;

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
        fill: fill,
        transition: transition,
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
