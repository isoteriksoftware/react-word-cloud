import { ComputedWord, computeWords, FillValue, WordCloudConfig } from "../../core";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { memo, useEffect, useState } from "react";
import { useLoading } from "../../core/hooks";

const defaultScaleOrdinal = scaleOrdinal(schemeCategory10);

export type WordCloudProps = WordCloudConfig & {
  fill?: FillValue;
};

const Cloud = ({
  fill = (_, index) => defaultScaleOrdinal(String(index)),
  font = "Impact",
  fontStyle = "normal",
  fontWeight = "normal",
  fontSize = (datum) => Math.sqrt(datum.value),
  rotate = () => (~~(Math.random() * 6) - 3) * 30,
  spiral = "archimedean",
  padding = 1,
  random = () => 1,
  width,
  height,
  timeInterval,
  words,
}: WordCloudProps) => {
  const [computedWords, setComputedWords] = useState<ComputedWord[]>([]);
  const { loadingStateCache, setIsLoading } = useLoading();

  useEffect(() => {
    if (loadingStateCache.current) return;

    setIsLoading(true);

    const finalConfig: WordCloudConfig = {
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
      timeInterval,
      words,
    };

    computeWords(finalConfig)
      .then((computedWords) => setComputedWords(computedWords))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    height,
    padding,
    width,
    words,
    timeInterval,
    spiral,
    font,
    fontStyle,
    fontWeight,
    fontSize,
    //rotate,
    //random,
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

export const WordCloud = memo(Cloud);
