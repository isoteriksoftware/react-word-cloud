import { ComputedWord, computeWords, FillValue, WordCloudConfig } from "../../core";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { useEffect, useState } from "react";

const defaultScaleOrdinal = scaleOrdinal(schemeCategory10);

export type WordCloudProps = WordCloudConfig & {
  fill?: FillValue;
};

export const WordCloud = ({
  fill = (_, index) => defaultScaleOrdinal(String(index)),
  font = "Impact",
  fontStyle = "normal",
  fontWeight = "normal",
  fontSize = (datum) => Math.sqrt(datum.value),
  rotate = () => (~~(Math.random() * 6) - 3) * 30,
  spiral = "archimedean",
  padding = 1,
  random = Math.random,
  width,
  height,
  ...otherProps
}: WordCloudProps) => {
  const [computedWords, setComputedWords] = useState<ComputedWord[]>([]);

  useEffect(() => {
    const finalConfig = {
      font,
      fontStyle,
      fontWeight,
      fontSize,
      rotate,
      spiral,
      padding,
      random,
      width,
      height,
      ...otherProps,
    };

    computeWords(finalConfig).then((computedWords) => setComputedWords(computedWords));
  }, [
    font,
    fontSize,
    fontStyle,
    fontWeight,
    height,
    otherProps,
    padding,
    random,
    rotate,
    spiral,
    width,
  ]);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2},${height / 2})`}>
        {computedWords.map((word, index) => (
          <text
            key={index}
            textAnchor="middle"
            transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
            style={{
              fontFamily: word.font,
              fontStyle: word.style,
              fontWeight: word.weight,
              fontSize: word.size,
              fill: typeof fill === "function" ? fill(word, index) : fill,
            }}
          >
            {word.text}
          </text>
        ))}
      </g>
    </svg>
  );
};
