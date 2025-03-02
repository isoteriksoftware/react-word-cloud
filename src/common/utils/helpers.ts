import { ValueOrAccessor, Word, WorkerResolvedValue } from "../types.ts";

export const mapAccessorResults = <Value, Accessor extends ValueOrAccessor<Value>>(
  words: Word[],
  accessor?: Accessor,
): WorkerResolvedValue<Accessor> => {
  if (accessor === undefined) {
    return undefined;
  }

  if (typeof accessor === "function") {
    return words.map((word, index) => accessor(word, index));
  }

  return accessor as WorkerResolvedValue<Accessor>;
};
