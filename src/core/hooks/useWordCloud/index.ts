import { ComputedWordData, WordCloudConfig } from "../../types";
import { useEffect, useRef, useState } from "react";
import { computeWords, defaultFontSize, defaultRotate } from "../../utils";

export type UseWordCloudArgs = WordCloudConfig & {
  onStartComputation?: () => void;
  onWordComputed?: (word: ComputedWordData, index: number) => void;
  onCompleteComputation?: (words: ComputedWordData[]) => void;
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
  onStartComputation,
  onWordComputed,
  onCompleteComputation,
}: UseWordCloudArgs) => {
  const [computedWords, setComputedWords] = useState<ComputedWordData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingComputation, setPendingComputation] = useState(false);

  const computationId = useRef(0);
  const lastProcessedWordIndex = useRef(0);

  const handleStartComputation = () => {
    lastProcessedWordIndex.current = 0;
    setIsLoading(true);
    setComputedWords([]);
    onStartComputation?.();
  };

  const handleCompleteComputation = (words: ComputedWordData[]) => {
    setIsLoading(false);
    onCompleteComputation?.(words);
  };

  const handleWorWordComputed = (word: ComputedWordData, index: number) => {
    onWordComputed?.(word, index);
  };

  useEffect(() => {
    if (isLoading) return;

    setPendingComputation(true);
    computationId.current += 1;

    handleStartComputation();
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

      const currentComputationId = computationId.current;

      computeWords(finalConfig, (computedWord) => {
        if (currentComputationId === computationId.current) {
          handleWorWordComputed(computedWord, lastProcessedWordIndex.current);
          lastProcessedWordIndex.current += 1;

          setComputedWords((prevWords) => {
            return [...prevWords, computedWord];
          });
        }
      }).then((words) => {
        if (currentComputationId === computationId.current) {
          setPendingComputation(false);
          handleCompleteComputation(words);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingComputation]);

  return { computedWords, isLoading };
};
