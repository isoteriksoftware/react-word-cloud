import {
  ComputedWord,
  computeWords,
  FillValue,
  FontSizeValue,
  Gradient,
  RotateValue,
  TransitionValue,
  WordCloudConfig,
  WordRenderer,
  WordRendererData,
} from "../../common";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { memo, useEffect, useRef, useState } from "react";
import { GradientDefs } from "../GradientDefs";
import { DefaultWordRenderer } from "../DefaultWordRenderer";

const defaultScaleOrdinal = scaleOrdinal(schemeCategory10);
const defaultFill: FillValue = (_, index) => defaultScaleOrdinal(String(index));
const defaultRotate: RotateValue = () => (~~(Math.random() * 6) - 3) * 30;
const defaultFontSize: FontSizeValue = (word) => Math.sqrt(word.value);
const defaultWordRenderer: WordRenderer = (data) => <DefaultWordRenderer data={data} />;

export type WordCloudProps = WordCloudConfig &
  Pick<WordRendererData, "onWordClick" | "onWordMouseOver" | "onWordMouseOut"> & {
    fill?: FillValue;
    transition?: TransitionValue;
    gradients?: Gradient[];
    renderWord?: WordRenderer;
    onStartCompute?: () => void;
    onComputeWord?: (word: ComputedWord, index: number) => void;
    onCompleteCompute?: (words: ComputedWord[]) => void;
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
  renderWord = defaultWordRenderer,
  width,
  height,
  timeInterval,
  words,
  gradients,
  onStartCompute,
  onComputeWord,
  onCompleteCompute,
  onWordClick,
  onWordMouseOver,
  onWordMouseOut,
}: WordCloudProps) => {
  const [computedWords, setComputedWords] = useState<ComputedWord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingComputation, setPendingComputation] = useState(false);

  const computationId = useRef(0);

  const handleStartCompute = () => {
    setIsLoading(true);
    setComputedWords([]);
    onStartCompute?.();
  };

  const handleCompleteCompute = (words: ComputedWord[]) => {
    setIsLoading(false);
    onCompleteCompute?.(words);
  };

  const handleComputeWord = (word: ComputedWord, index: number) => {
    onComputeWord?.(word, index);
  };

  useEffect(() => {
    if (isLoading) return;

    setPendingComputation(true);
    computationId.current += 1;

    handleStartCompute();
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
          handleComputeWord(computedWord, computedWords.length);
          setComputedWords((prevWords) => {
            return [...prevWords, computedWord];
          });
        }
      }).then((words) => {
        if (currentComputation === computationId.current) {
          setPendingComputation(false);
          handleCompleteCompute(words);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingComputation]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <GradientDefs gradients={gradients} />

      <g transform={`translate(${width / 2},${height / 2})`}>
        {computedWords.map((word, index) => {
          const data: WordRendererData = {
            index,
            onWordClick,
            onWordMouseOver,
            onWordMouseOut,
            fill: typeof fill === "function" ? fill(word, index) : fill,
            transition: typeof transition === "function" ? transition(word, index) : transition,
            ...word,
          };

          return renderWord(data);
        })}
      </g>
    </svg>
  );
};

export const WordCloud = memo(Cloud);
