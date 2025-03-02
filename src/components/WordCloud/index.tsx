import {
  ComputedWord,
  computeWords,
  CustomTextProps,
  FillValue,
  FontSizeValue,
  RandomNumberGenerator,
  RotateValue,
  TransitionValue,
  WordCloudConfig,
} from "../../common";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { memo, useEffect, useState } from "react";
import { useLoading } from "../../common/hooks";

const defaultScaleOrdinal = scaleOrdinal(schemeCategory10);
const defaultFill: FillValue = (_, index) => defaultScaleOrdinal(String(index));
const defaultRandom: RandomNumberGenerator = Math.random;
const defaultRotate: RotateValue = () => (~~(Math.random() * 6) - 3) * 30;
const defaultFontSize: FontSizeValue = (word) => Math.sqrt(word.value);

export type WordCloudProps = WordCloudConfig & {
  fill?: FillValue;
  transition?: TransitionValue;
  customTextProps?: CustomTextProps;
};

const Cloud = ({
  fill = defaultFill,
  font = "Impact",
  fontStyle = "normal",
  fontWeight = "normal",
  fontSize = defaultFontSize,
  transition = "all .5s ease",
  rotate = defaultRotate,
  spiral = "archimedean",
  padding = 1,
  random = defaultRandom,
  width,
  height,
  timeInterval,
  words,
  customTextProps,
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
    rotate,
    random,
  ]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(${width / 2},${height / 2})`}>
        {computedWords.map((word, index) => {
          const defaultStyle = {
            fontFamily: word.font,
            fontStyle: word.style,
            fontWeight: word.weight,
            fontSize: word.size,
            fill: typeof fill === "function" ? fill(word, index) : fill,
            transition: typeof transition === "function" ? transition(word, index) : transition,
          };
          const customProps = customTextProps ? customTextProps(word, index) : {};
          const mergedStyle = { ...defaultStyle, ...customProps.style };

          return (
            <text
              key={word.text}
              textAnchor="middle"
              transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
              {...customProps}
              style={mergedStyle}
            >
              {word.text}
            </text>
          );
        })}
      </g>
    </svg>
  );
};

export const WordCloud = memo(Cloud);
