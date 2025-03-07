import { Ref, useCallback } from "react";

export const useMergedRefs = <T>(...refs: (Ref<T> | undefined)[]) => {
  return useCallback(
    (node: T) => {
      refs.forEach((ref) => {
        if (!ref) return;
        if (typeof ref === "function") {
          ref(node);
        } else {
          ref.current = node;
        }
      });
    },
    [refs],
  );
};
