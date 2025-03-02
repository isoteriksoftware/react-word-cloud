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
export type SerializedAccessor = string;

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
export type PaddingValue = ValueOrAccessor<number>;
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

export type WorkerMessage = Pick<WordCloudConfig, "words" | "width" | "height" | "timeInterval"> & {
  requestId: number;
  spiral?: SerializedAccessor;
  padding?: SerializedAccessor;
  random?: SerializedAccessor;
  font?: SerializedAccessor;
  fontStyle?: SerializedAccessor;
  fontWeight?: SerializedAccessor;
  fontSize?: SerializedAccessor;
  rotate?: SerializedAccessor;
};

export type WorkerResponse = {
  requestId: number;
  computedWords: ComputedWord[];
};

export type WordCloudWorker = Worker & {
  onmessage: (evt: MessageEvent<WorkerResponse>) => void;
  postMessage: (this: Worker, message: MessageEvent<WorkerMessage>) => void;
};
