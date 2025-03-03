import { WordRendererData } from "../../core";
import { memo } from "react";

export type DefaultWordRendererProps = {
  data: WordRendererData;
};

const WordRenderer = ({ data }: DefaultWordRendererProps) => {
  const { index, onWordClick, onWordMouseOver, onWordMouseOut, ...word } = data;

  return (
    <text
      key={index}
      textAnchor="middle"
      transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
      style={{
        fontFamily: word.font,
        fontStyle: word.style,
        fontWeight: word.weight,
        fontSize: `${word.size}px`,
        fill: word.fill,
        transition: word.transition,
      }}
      onClick={() => onWordClick?.(word, index)}
      onMouseOver={() => onWordMouseOver?.(word, index)}
      onMouseOut={() => onWordMouseOut?.(word, index)}
    >
      {word.text}
    </text>
  );
};

export const DefaultWordRenderer = memo(WordRenderer);
