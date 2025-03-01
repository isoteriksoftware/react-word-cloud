import { Property } from "csstype";
import cloud from "d3-cloud";

export type Word = {
  text: string;
  value: number;
};

export type ComputedWord = Word & Required<cloud.Word>;

export type ValueOrAccessor<Value> = Value | ((datum: ComputedWord, datumIndex: number) => Value);

export type FontValue = ValueOrAccessor<Property.FontFamily>;
export type FontStyleValue = ValueOrAccessor<Property.FontStyle>;
export type FontWeightValue = ValueOrAccessor<Property.FontWeight>;
export type FontSizeValue = ValueOrAccessor<number>;
export type RotateValue = ValueOrAccessor<number>;

export type LayoutSize = [width: number, height: number];
export type SpiralValue =
  | "archimedean"
  | "rectangular"
  | ((size: LayoutSize) => (currentStep: number) => [x: number, y: number]);
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

export type WorkerMessage = WordCloudConfig & {
  requestId: number;
};

export type WorkerResponse = {
  requestId: number;
  computedWords: ComputedWord[];
};
