import { Property } from "csstype";
import cloud from "d3-cloud";
import React, { ReactNode } from "react";

export type Position = {
  x: number;
  y: number;
};

export type Word = {
  text: string;
  value: number;
};

export type ComputedWord = Word & Required<cloud.Word>;

export type Accessor<Value> = (word: ComputedWord, wordIndex: number) => Value;
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

export type WordRendererData = ComputedWord & {
  index: number;
  fill: string;
  transition: string;
  onWordClick?: (word: ComputedWord, index: number, event: WordMouseEvent) => void;
  onWordMouseOver?: (word: ComputedWord, index: number, event: WordMouseEvent) => void;
  onWordMouseOut?: (word: ComputedWord, index: number, event: WordMouseEvent) => void;
  onWorldTooltip?: (word: ComputedWord, index: number, event: WordMouseEvent) => void;
};
export type TooltipRendererData = {
  word?: ComputedWord;
  svgElement?: SVGElement;
  event?: WordMouseEvent;
  layoutWidth: number;
  layoutHeight: number;
};

export type WordRenderer = (data: WordRendererData) => ReactNode;
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
};
