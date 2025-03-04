import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { FillValue, FontSizeValue, RotateValue, TooltipRenderer, WordRenderer } from "../types.ts";
import { DefaultTooltipRenderer, DefaultWordRenderer } from "../../components";

const defaultScaleOrdinal = scaleOrdinal(schemeCategory10);
export const defaultFill: FillValue = (_, index) => defaultScaleOrdinal(String(index));
export const defaultRotate: RotateValue = () => (~~(Math.random() * 6) - 3) * 30;
export const defaultFontSize: FontSizeValue = (word) => Math.sqrt(word.value);
export const defaultWordRenderer: WordRenderer = (data) => <DefaultWordRenderer data={data} />;
export const defaultTooltipRenderer: TooltipRenderer = (data) => (
  <DefaultTooltipRenderer data={data} />
);
