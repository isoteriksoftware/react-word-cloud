import { ValueOrAccessor, WordRendererData } from "../../common";
import { memo, useEffect, useState } from "react";

export type AnimatedWordRendererProps = {
  data: WordRendererData;
  animationDelay?: ValueOrAccessor<number>;
};

const defaultAnimationDelay: AnimatedWordRendererProps["animationDelay"] = (_, index) => index * 10;

const WordRenderer = ({
  data,
  animationDelay = defaultAnimationDelay,
}: AnimatedWordRendererProps) => {
  const { index, onWordClick, onWordMouseOver, onWordMouseOut, ...word } = data;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const delay =
      typeof animationDelay === "function" ? animationDelay(word, index) : animationDelay;

    const timeout = setTimeout(() => {
      setVisible(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [animationDelay, index, word]);

  return (
    <text
      key={index}
      textAnchor="middle"
      transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate}) scale(${visible ? 1 : 0})`}
      style={{
        fontFamily: word.font,
        fontStyle: word.style,
        fontWeight: word.weight,
        fontSize: `${word.size}px`,
        fill: word.fill,
        transition: word.transition,
        opacity: visible ? 1 : 0,
      }}
      onClick={() => onWordClick?.(word, index)}
      onMouseOver={() => onWordMouseOver?.(word, index)}
      onMouseOut={() => onWordMouseOut?.(word, index)}
    >
      {word.text}
    </text>
  );
};

export const AnimatedWordRenderer = memo(WordRenderer);
