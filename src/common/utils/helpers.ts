import {
  RandomNumberGenerator,
  SerializedAccessor,
  SpiralValue,
  ValueOrAccessor,
} from "../types.ts";

export const serializeAccessor = <Value>(
  accessor: ValueOrAccessor<Value> | SpiralValue | RandomNumberGenerator | undefined,
): SerializedAccessor | undefined => {
  if (accessor === undefined) {
    return undefined;
  }

  const fn = typeof accessor === "function" ? accessor : () => accessor;
  return fn.toString();
};

export const deserializeAccessor = <Accessor>(
  serializedAccessor: SerializedAccessor | undefined,
): Accessor | undefined => {
  if (serializedAccessor === undefined) {
    return undefined;
  }

  return eval(`(${serializedAccessor})`);
};
