import { TooltipRendererData } from "../../types";
import { useFloating, UseFloatingOptions } from "@floating-ui/react-dom";
import { useEffect } from "react";

export type UseTooltipArgs = UseFloatingOptions & {
  data: TooltipRendererData;
};

export const useTooltip = ({ data, ...useFloatingOptions }: UseTooltipArgs) => {
  const { refs, floatingStyles, ...otherValues } = useFloating(useFloatingOptions);

  useEffect(() => {
    if (data.word) {
      refs.setReference(data.wordElement ?? null);
    }
  }, [data.word, data.wordElement, refs]);

  return { refs, floatingStyles, ...otherValues };
};
