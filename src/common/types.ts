import { Property } from "csstype";
import cloud from "d3-cloud";
import { SVGProps } from "react";

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
export type CustomTextProps = Accessor<SVGProps<SVGTextElement>>;

export type WordCloudSize = [width: number, height: number];
export type SpiralValue =
  | "archimedean"
  | "rectangular"
  | ((size: WordCloudSize) => (currentStep: number) => [x: number, y: number]);
export type PaddingValue = number | (() => number);
export type RandomNumberGenerator = () => number;

export type FillValue = ValueOrAccessor<Property.Color>;

export type WordCloudConfig = {
  words: Word[];
  width: number;
  height: number;
  timeInterval?: number;
  spiral?: SpiralValue;
  padding?: PaddingValue;
  random?: RandomNumberGenerator;
  font?: FontValue;
  fontStyle?: FontStyleValue;
  fontWeight?: FontWeightValue;
  fontSize?: FontSizeValue;
  rotate?: RotateValue;
};
