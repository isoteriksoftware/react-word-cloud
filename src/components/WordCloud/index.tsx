import {
  ComputedWord,
  computeWords,
  CustomTextProps,
  FillValue,
  FontSizeValue,
  Gradient,
  RotateValue,
  TransitionValue,
  WordCloudConfig,
} from "../../common";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { memo, useEffect, useRef, useState } from "react";
import { GradientDefs } from "../GradientDefs";

const defaultScaleOrdinal = scaleOrdinal(schemeCategory10);
const defaultFill: FillValue = (_, index) => defaultScaleOrdinal(String(index));
const defaultRotate: RotateValue = () => (~~(Math.random() * 6) - 3) * 30;
const defaultFontSize: FontSizeValue = (word) => Math.sqrt(word.value);

export type WordCloudProps = WordCloudConfig & {
  fill?: FillValue;
  transition?: TransitionValue;
  customTextProps?: CustomTextProps;
  gradients?: Gradient[];
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
  onWordClick?: (word: ComputedWord, index: number) => void;
  onWordMouseOver?: (word: ComputedWord, index: number) => void;
  onWordMouseOut?: (word: ComputedWord, index: number) => void;
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
  width,
  height,
  timeInterval,
  words,
  customTextProps,
  gradients,
  onLoadStart,
  onLoadComplete,
  onWordClick,
  onWordMouseOver,
  onWordMouseOut,
}: WordCloudProps) => {
  const [computedWords, setComputedWords] = useState<ComputedWord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingComputation, setPendingComputation] = useState(false);

  const computationId = useRef(0);

  const handleLoadStart = () => {
    setIsLoading(true);
    setComputedWords([]);
    onLoadStart?.();
  };

  const handleLoadComplete = () => {
    setIsLoading(false);
    onLoadComplete?.();
  };

  useEffect(() => {
    if (isLoading) return;

    setPendingComputation(true);
    computationId.current += 1;

    handleLoadStart();
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
  ]);

  useEffect(() => {
    if (pendingComputation && computedWords.length === 0) {
      const finalConfig: WordCloudConfig = {
        font,
        fontStyle,
        fontWeight,
        fontSize,
        rotate,
        spiral,
        padding,
        width,
        height,
        timeInterval,
        words,
      };

      const currentComputation = computationId.current;

      computeWords(finalConfig, (computedWord) => {
        if (currentComputation === computationId.current) {
          setComputedWords((prevWords) => {
            return [...prevWords, computedWord];
          });
        }
      }).then(() => {
        if (currentComputation === computationId.current) {
          setPendingComputation(false);
          handleLoadComplete();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingComputation]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <GradientDefs gradients={gradients} />

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
          const { transform, ...customProps } = customTextProps ? customTextProps(word, index) : {};
          const mergedStyle = { ...defaultStyle, ...customProps.style };

          return (
            <text
              key={index}
              textAnchor="middle"
              {...customProps}
              transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate}) ${transform || ""}`}
              style={mergedStyle}
              onClick={() => onWordClick?.(word, index)}
              onMouseOver={() => onWordMouseOver?.(word, index)}
              onMouseOut={() => onWordMouseOut?.(word, index)}
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
