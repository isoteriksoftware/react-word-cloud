import {
  defaultFill,
  defaultWordRenderer,
  FillValue,
  Gradient,
  TransitionValue,
  WordRenderer,
  WordRendererData,
  useWordCloud,
  UseWordCloudArgs,
} from "../../core";
import { Fragment, memo } from "react";
import { GradientDefs } from "../GradientDefs";

export type WordCloudProps = UseWordCloudArgs &
  Pick<WordRendererData, "onWordClick" | "onWordMouseOver" | "onWordMouseOut"> & {
    fill?: FillValue;
    transition?: TransitionValue;
    gradients?: Gradient[];
    renderWord?: WordRenderer;
  };

const Cloud = ({
  fill = defaultFill,
  transition = "all .5s ease",
  renderWord = defaultWordRenderer,
  width,
  height,
  gradients,
  onWordClick,
  onWordMouseOver,
  onWordMouseOut,
  ...useWordCloudArgs
}: WordCloudProps) => {
  const { computedWords } = useWordCloud({ width, height, ...useWordCloudArgs });

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

          const renderedWord = renderWord(data);
          return <Fragment key={index}>{renderedWord}</Fragment>;
        })}
      </g>
    </svg>
  );
};

export const WordCloud = memo(Cloud);
