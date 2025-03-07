import {
  defaultFill,
  defaultTooltipRenderer,
  defaultWordRenderer,
  FillValue,
  FinalWordData,
  Gradient,
  TooltipRenderer,
  TransitionValue,
  useWordCloud,
  UseWordCloudArgs,
  WordMouseEvent,
  WordRenderer,
  WordRendererData,
} from "../../core";
import { Fragment, memo, SVGProps, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GradientDefs } from "../GradientDefs";
import isDeepEqual from "react-fast-compare";
import { generateTestId } from "../../core/utils/test";

export type WordCloudProps = UseWordCloudArgs &
  Partial<Pick<WordRendererData, "onWordClick" | "onWordMouseOver" | "onWordMouseOut">> & {
    fill?: FillValue;
    transition?: TransitionValue;
    gradients?: Gradient[];
    renderWord?: WordRenderer;
    enableTooltip?: boolean;
    renderTooltip?: TooltipRenderer;
    svgProps?: Omit<SVGProps<SVGSVGElement>, "ref" | "children">;
  };

type HoveredWordData = {
  word?: FinalWordData;
  wordElement?: SVGTextElement | null;
  event?: WordMouseEvent;
};

const svgTestId = generateTestId("WordCloud", "svg");

const Cloud = ({
  fill = defaultFill,
  transition = "all .5s ease",
  renderWord = defaultWordRenderer,
  renderTooltip = defaultTooltipRenderer,
  width,
  height,
  gradients,
  onWordClick,
  onWordMouseOver,
  onWordMouseOut,
  enableTooltip,
  svgProps,
  ...useWordCloudArgs
}: WordCloudProps) => {
  const { computedWords } = useWordCloud({ width, height, ...useWordCloudArgs });
  const [hoveredWord, setHoveredWord] = useState<HoveredWordData>({});
  const [fillCacheVersion, setFillCacheVersion] = useState(0);
  const [transitionCacheVersion, setTransitionCacheVersion] = useState(0);

  const svgRef = useRef<SVGSVGElement>(null);
  const wordRefs = useRef<Record<number, SVGTextElement | null>>({});
  const fillCacheRef = useRef<Record<number, string | undefined>>({});
  const transitionCacheRef = useRef<Record<number, string | undefined>>({});

  useEffect(() => {
    fillCacheRef.current = {};
    setFillCacheVersion((v) => v + 1);
  }, [fill]);

  useEffect(() => {
    transitionCacheRef.current = {};
    setTransitionCacheVersion((v) => v + 1);
  }, [transition]);

  const handleWordMouseOver = useCallback(
    (word: FinalWordData, index: number, event: WordMouseEvent) => {
      setHoveredWord({
        word,
        event,
        wordElement: wordRefs.current[index],
      });
      onWordMouseOver?.(word, index, event);
    },
    [onWordMouseOver],
  );

  const handleWordMouseOut = useCallback(
    (word: FinalWordData, index: number, event: WordMouseEvent) => {
      setHoveredWord((prev) => ({
        ...prev,
        event,
        word: undefined,
      }));
      onWordMouseOut?.(word, index, event);
    },
    [onWordMouseOut],
  );

  const tooltip = useMemo(
    () =>
      enableTooltip &&
      renderTooltip &&
      renderTooltip({
        ...hoveredWord,
        svgElement: svgRef.current || undefined,
        layoutWidth: width,
        layoutHeight: height,
      }),
    [enableTooltip, hoveredWord, renderTooltip, width, height],
  );

  const words = useMemo(() => {
    return computedWords.map((word, index) => {
      // Use cached fill value if available, otherwise compute and cache it.
      let computedFill = fillCacheRef.current[index];
      if (!computedFill) {
        computedFill = typeof fill === "function" ? fill(word, index) : (fill as string);
        fillCacheRef.current[index] = computedFill;
      }

      // Use cached transition value if available, otherwise compute and cache it.
      let computedTransition = transitionCacheRef.current[index];
      if (!computedTransition) {
        computedTransition =
          typeof transition === "function" ? transition(word, index) : (transition as string);
        transitionCacheRef.current[index] = computedTransition;
      }

      const data: WordRendererData = {
        index,
        onWordClick,
        onWordMouseOver: handleWordMouseOver,
        onWordMouseOut: handleWordMouseOut,
        fill: computedFill,
        transition: computedTransition,
        ...word,
      };

      const renderedWord = renderWord(data, (ref) => {
        wordRefs.current[index] = ref;
      });
      return <Fragment key={index}>{renderedWord}</Fragment>;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    computedWords,
    fill,
    handleWordMouseOut,
    handleWordMouseOver,
    onWordClick,
    renderWord,
    transition,
    fillCacheVersion,
    transitionCacheVersion,
  ]);

  return (
    <>
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} data-testid={svgTestId} {...svgProps}>
        <GradientDefs gradients={gradients} />

        <g transform={`translate(${width / 2},${height / 2})`}>{words}</g>
      </svg>

      {tooltip}
    </>
  );
};

export const WordCloud = memo(Cloud, isDeepEqual);
