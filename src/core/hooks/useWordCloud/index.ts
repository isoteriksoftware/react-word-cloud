import { ComputedWordData, WordCloudConfig } from "../../types";
import { useEffect, useRef, useState } from "react";
import { computeWords, defaultFontSize, defaultRotate } from "../../utils";

export type UseWordCloudArgs = WordCloudConfig & {
  onStartCompute?: () => void;
  onComputeWord?: (word: ComputedWordData, index: number) => void;
  onCompleteCompute?: (words: ComputedWordData[]) => void;
};

export const useWordCloud = ({
  font = "Impact",
  fontStyle = "normal",
  fontWeight = "normal",
  fontSize = defaultFontSize,
  rotate = defaultRotate,
  spiral = "archimedean",
  padding = 1,
  width,
  height,
  timeInterval = 1,
  words,
  onStartCompute,
  onComputeWord,
  onCompleteCompute,
}: UseWordCloudArgs) => {
  const [computedWords, setComputedWords] = useState<ComputedWordData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingComputation, setPendingComputation] = useState(false);

  const computationId = useRef(0);

  const handleStartCompute = () => {
    setIsLoading(true);
    setComputedWords([]);
    onStartCompute?.();
  };

  const handleCompleteCompute = (words: ComputedWordData[]) => {
    setIsLoading(false);
    onCompleteCompute?.(words);
  };

  const handleComputeWord = (word: ComputedWordData, index: number) => {
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

  return { computedWords, isLoading };
};
