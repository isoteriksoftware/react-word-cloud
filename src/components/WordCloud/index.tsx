import {
  ComputedWord,
  computeWords,
  CustomTextProps,
  FillValue,
  FontSizeValue,
  Gradient,
  mapAccessorResults,
  RotateValue,
  TransitionValue,
  WordCloudConfig,
  WordCloudWorker,
  WorkerMessage,
  WorkerResponse,
} from "../../common";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { CSSProperties, memo, ReactNode, useEffect, useRef, useState } from "react";
import { DefaultLoader } from "../DefaultLoader";
import { GradientDefs } from "../GradientDefs";

const defaultScaleOrdinal = scaleOrdinal(schemeCategory10);
const defaultFill: FillValue = (_, index) => defaultScaleOrdinal(String(index));
const defaultRotate: RotateValue = () => (~~(Math.random() * 6) - 3) * 30;
const defaultFontSize: FontSizeValue = (word) => Math.sqrt(word.value);
const defaultLoader = <DefaultLoader />;

export type WordCloudProps = WordCloudConfig & {
  fill?: FillValue;
  transition?: TransitionValue;
  useWorker?: boolean;
  customTextProps?: CustomTextProps;
  loader?: ReactNode;
  containerStyle?: CSSProperties;
  loaderContainerStyle?: CSSProperties;
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
  loader = defaultLoader,
  useWorker,
  width,
  height,
  timeInterval,
  words,
  customTextProps,
  containerStyle,
  loaderContainerStyle,
  gradients,
  onLoadStart,
  onLoadComplete,
  onWordClick,
  onWordMouseOver,
  onWordMouseOut,
}: WordCloudProps) => {
  const [computedWords, setComputedWords] = useState<ComputedWord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const workerRef = useRef<WordCloudWorker | null>(null);
  const latestWorkerRequestId = useRef<number>(0);

  const handleLoadStart = () => {
    setIsLoading(true);
    onLoadStart?.();
  };

  const handleLoadComplete = () => {
    setIsLoading(false);
    onLoadComplete?.();
  };

  useEffect(() => {
    if (useWorker) {
      workerRef.current = new Worker(
        new URL("../../common/workers/word-cloud-worker.ts?worker", import.meta.url),
        { type: "module" },
      ) as WordCloudWorker;

      workerRef.current!.onmessage = (evt: MessageEvent<WorkerResponse>) => {
        if (evt.data.requestId === latestWorkerRequestId.current) {
          setComputedWords(evt.data.computedWords);
          handleLoadComplete();
        }
      };
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useWorker]);

  useEffect(() => {
    if (isLoading) return;

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

    if (useWorker && workerRef.current) {
      handleLoadStart();

      // Increment the request ID for each new calculation
      const requestId = latestWorkerRequestId.current + 1;
      latestWorkerRequestId.current = requestId;

      // Serialize the configuration
      const workerMessage: WorkerMessage = {
        requestId,
        width,
        height,
        timeInterval,
        words,
        spiral,
        padding: mapAccessorResults(words, padding),
        font: mapAccessorResults(words, font),
        fontStyle: mapAccessorResults(words, fontStyle),
        fontWeight: mapAccessorResults(words, fontWeight),
        fontSize: mapAccessorResults(words, fontSize),
        rotate: mapAccessorResults(words, rotate),
      };

      // Send a message to the worker
      workerRef.current.postMessage(workerMessage);
    } else if (!useWorker) {
      handleLoadStart();

      // Run on the main thread
      computeWords(finalConfig)
        .then((computedWords) => setComputedWords(computedWords))
        .finally(() => handleLoadComplete());
    }
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
    useWorker,
  ]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", ...containerStyle }}>
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
            const { transform, ...customProps } = customTextProps
              ? customTextProps(word, index)
              : {};
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

      {isLoading && useWorker && (
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
            backgroundColor: "rgba(0, 0, 0, 0.1)",
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
