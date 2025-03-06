import { ValueOrAccessor, WordRendererData } from "../../core";
import { CSSProperties, forwardRef, memo, useEffect, useState } from "react";
import isDeepEqual from "react-fast-compare";
import { generateTestId } from "../../core/utils/test";

export type AnimatedWordRendererProps = {
  data: WordRendererData;
  animationDelay?: ValueOrAccessor<number>;
  textStyle?: CSSProperties;
};

const testId = generateTestId("AnimatedWordRenderer", "text");
const defaultAnimationDelay: AnimatedWordRendererProps["animationDelay"] = (_, index) => index * 10;

const WordRenderer = forwardRef<SVGTextElement, AnimatedWordRendererProps>(
  ({ data, animationDelay = defaultAnimationDelay, textStyle }, ref) => {
    const { index, onWordClick, onWordMouseOver, onWordMouseOut, ...word } = data;

    const [visible, setVisible] = useState(false);

    useEffect(() => {
      if (!ref) {
        console.warn(
          "AnimatedWordRenderer: ref is not provided! This may cause issues with tooltip rendering.",
        );
      }
    }, [ref]);

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
        ref={ref}
        key={index}
        data-testid={testId}
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
  },
);

export const AnimatedWordRenderer = memo(WordRenderer, isDeepEqual);
