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
import { CSSProperties, memo, ReactNode, useEffect, useState } from "react";
import { useLoading } from "../../common/hooks";

const defaultScaleOrdinal = scaleOrdinal(schemeCategory10);
const defaultFill: FillValue = (_, index) => defaultScaleOrdinal(String(index));
const defaultRandom: RandomNumberGenerator = Math.random;
const defaultRotate: RotateValue = () => (~~(Math.random() * 6) - 3) * 30;
const defaultFontSize: FontSizeValue = (word) => Math.sqrt(word.value);

const defaultLoader = (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
    }}
  >
    <div
      style={{
        border: "4px solid rgba(200,200,200,0.8)",
        borderTop: "4px solid #3498db",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        animation: "spin .6s linear infinite",
      }}
    />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

export type WordCloudProps = WordCloudConfig & {
  fill?: FillValue;
  transition?: TransitionValue;
  customTextProps?: CustomTextProps;
  loader?: ReactNode;
  containerStyle?: CSSProperties;
  loaderContainerStyle?: CSSProperties;
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
  loader = defaultLoader,
  width,
  height,
  timeInterval,
  words,
  customTextProps,
  containerStyle,
  loaderContainerStyle,
}: WordCloudProps) => {
  const [computedWords, setComputedWords] = useState<ComputedWord[]>([]);
  const { isLoading, loadingStateCache, setIsLoading } = useLoading();

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
    <div style={{ position: "relative", width, height, ...containerStyle }}>
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
                key={index}
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

      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            ...loaderContainerStyle,
          }}
        >
          {loader}
        </div>
      )}
    </div>
  );
};

export const WordCloud = memo(Cloud);
