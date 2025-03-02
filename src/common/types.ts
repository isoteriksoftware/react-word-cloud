import { Property } from "csstype";
import cloud from "d3-cloud";
import { SVGProps } from "react";

export type Word = {
  text: string;
  value: number;
};

export type ComputedWord = Word & Required<cloud.Word>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractValue<T> = T extends (...args: any[]) => infer R ? R : T;

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
export type FillValue = ValueOrAccessor<Property.Color>;

export type SpiralValue = "archimedean" | "rectangular";
export type PaddingValue = ValueOrAccessor<number>;

export type WorkerResolvedValue<Accessor> =
  | ExtractValue<Accessor>
  | ExtractValue<Accessor>[]
  | undefined;

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

export type WorkerMessage = Pick<
  WordCloudConfig,
  "words" | "width" | "height" | "timeInterval" | "spiral"
> & {
  requestId: number;
  padding?: WorkerResolvedValue<PaddingValue>;
  font?: WorkerResolvedValue<FontValue>;
  fontStyle?: WorkerResolvedValue<FontStyleValue>;
  fontWeight?: WorkerResolvedValue<FontWeightValue>;
  fontSize?: WorkerResolvedValue<FontSizeValue>;
  rotate?: WorkerResolvedValue<RotateValue>;
};

export type WorkerResponse = {
  requestId: number;
  computedWords: ComputedWord[];
};

export type WordCloudWorker = Worker & {
  onmessage: (evt: MessageEvent<WorkerResponse>) => void;
  postMessage: (this: Worker, message: MessageEvent<WorkerMessage>) => void;
};
