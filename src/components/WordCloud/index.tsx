import {
  ComputedWord,
  computeWords,
  FillValue,
  WordCloudConfig,
  WordCloudWorker,
  WorkerResponse,
} from "../../core";
//import WordCloudWorker from "../../core/workers/word-cloud-worker.ts?worker";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { useEffect, useRef, useState } from "react";

const defaultScaleOrdinal = scaleOrdinal(schemeCategory10);

export type WordCloudProps = WordCloudConfig & {
  fill?: FillValue;
  disableWorker?: boolean;
};

export const WordCloud = ({ disableWorker, ...config }: WordCloudProps) => {
  const {
    fill = (_, index) => defaultScaleOrdinal(String(index)),
    font = "Impact",
    fontStyle = "normal",
    fontWeight = "normal",
    fontSize = (datum) => Math.sqrt(datum.value),
    rotate = () => (~~(Math.random() * 6) - 3) * 30,
    spiral = "archimedean",
    padding = 1,
    random = Math.random,
  } = config;

  const [computedWords, setComputedWords] = useState<ComputedWord[]>([]);
  const workerRef = useRef<WordCloudWorker | null>(null);
  const latestWorkerRequestId = useRef<number>(0);

  useEffect(() => {
    if (!disableWorker) {
      // Instantiate the worker
      workerRef.current = new Worker(
        new URL("../../core/workers/word-cloud-worker.ts?worker", import.meta.url),
        { type: "module" },
      ) as WordCloudWorker;

      // Listen for results
      workerRef.current!.onmessage = (evt: MessageEvent<WorkerResponse>) => {
        // Only update state if this response matches the latest requestId
        if (evt.data.requestId === latestWorkerRequestId.current) {
          setComputedWords(evt.data.computedWords);
        }
      };
    }

    // Cleanup when unmounting
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [disableWorker]);

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
      ...config,
    };

    if (!disableWorker && workerRef.current) {
      // Increment the request ID for each new calculation
      const requestId = latestWorkerRequestId.current + 1;
      latestWorkerRequestId.current = requestId;

      // Send a message to the worker
      workerRef.current.postMessage({ requestId, ...finalConfig });
    } else {
      // Run on the main thread
      computeWords(finalConfig).then((computedWords) => setComputedWords(computedWords));
    }
  }, [
    config,
    disableWorker,
    font,
    fontSize,
    fontStyle,
    fontWeight,
    padding,
    random,
    rotate,
    spiral,
  ]);

  return (
    <svg width={config.width} height={config.height}>
      <g transform={`translate(${config.width / 2},${config.height / 2})`}>
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
