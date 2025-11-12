import { Property } from "csstype";
import cloud from "d3-cloud";
import React, { ReactNode, Ref } from "react";

export type Word = {
  text: string;
  value: number;
};
export type ComputedWordData = Word & Required<cloud.Word>;
export type FinalWordData = ComputedWordData & {
  fill: string;
  transition: string;
};

export type Accessor<Value> = (word: Word, wordIndex: number) => Value;
export type ValueOrAccessor<Value> = Value | Accessor<Value>;

export type FontValue = ValueOrAccessor<Property.FontFamily>;
export type FontStyleValue = ValueOrAccessor<Property.FontStyle>;
export type FontWeightValue = ValueOrAccessor<Property.FontWeight>;
export type FontSizeValue = ValueOrAccessor<number>;
export type TransitionValue = ValueOrAccessor<Property.Transition>;
export type RotateValue = Accessor<number>;
export type FillValue = ValueOrAccessor<Property.Color>;
export type PaddingValue = ValueOrAccessor<number>;
export type SpiralValue = "archimedean" | "rectangular";
export type RandomFunction = () => number;

export type GradientStop = {
  offset: string;
  color: string;
};

export type Gradient = {
  id: string;
  type: "linear" | "radial";
  stops: GradientStop[];
  angle?: number;
};

export type WordMouseEvent = React.MouseEvent<SVGTextElement, MouseEvent>;

export type WordRendererData = FinalWordData & {
  index: number;
  onWordClick?: (word: FinalWordData, index: number, event: WordMouseEvent) => void;
  onWordMouseOver?: (word: FinalWordData, index: number, event: WordMouseEvent) => void;
  onWordMouseOut?: (word: FinalWordData, index: number, event: WordMouseEvent) => void;
};
export type TooltipRendererData = {
  word?: FinalWordData;
  wordElement?: SVGTextElement | null;
  svgElement?: SVGElement;
  event?: WordMouseEvent;
  layoutWidth: number;
  layoutHeight: number;
};

export type WordRenderer = (data: WordRendererData, ref?: Ref<SVGTextElement>) => ReactNode;
export type TooltipRenderer = (data: TooltipRendererData) => ReactNode;

export type WordCloudConfig = {
  words: Word[];
  width: number;
  height: number;
  timeInterval?: number;
  spiral?: SpiralValue;
  padding?: PaddingValue;
  font?: FontValue;
  fontStyle?: FontStyleValue;
  fontWeight?: FontWeightValue;
  fontSize?: FontSizeValue;
  rotate?: RotateValue;
  random?: RandomFunction;
};
