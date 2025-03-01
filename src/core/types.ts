import { Property } from "csstype";
import cloud from "d3-cloud";

export type Word = {
  text: string;
  size: number;
};

export type ComputedWord = cloud.Word;

export type ValueOrAccessor<Value> = Value | ((datum: Partial<Word>, datumIndex: number) => Value);

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

export type WorkerMessage = {
  requestId: number;
  words: Word[];
  layoutWidth: number;
  layoutHeight: number;
  timeInterval?: number;
  spiral?: SpiralValue;
  padding?: PaddingValue;
  random?: RandomNumberGenerator;
  fontFamily?: FontValue;
  fontStyle?: FontStyleValue;
  fontWeight?: FontWeightValue;
  fontSize?: FontSizeValue;
  rotate?: RotateValue;
};

export type WorkerResponse = {
  requestId: number;
  computedWords: ComputedWord[];
};
