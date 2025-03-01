import { ComputedWord, WorkerMessage } from "../types";
import cloud from "d3-cloud";

export const computeWords = (config: Omit<WorkerMessage, "requestId">): Promise<ComputedWord[]> => {
  const {
    words,
    layoutWidth,
    layoutHeight,
    timeInterval,
    spiral,
    padding,
    random,
    fontFamily,
    fontStyle,
    fontWeight,
    fontSize,
    rotate,
  } = config;

  return new Promise((resolve) => {
    const layout = cloud<cloud.Word>().size([layoutWidth, layoutHeight]).words(words);

    if (timeInterval) {
      layout.timeInterval(timeInterval);
    }

    if (spiral) {
      layout.spiral(spiral);
    }

    if (padding) {
      layout.padding(padding);
    }

    if (random) {
      layout.random(random);
    }

    if (fontFamily) {
      layout.font(fontFamily);
    }

    if (fontStyle) {
      layout.fontStyle(fontStyle);
    }

    if (fontWeight) {
      layout.fontWeight(fontWeight);
    }

    if (fontSize) {
      layout.fontSize(fontSize);
    }

    if (rotate) {
      layout.rotate(rotate);
    }

    layout.on("end", (computedWords) => {
      resolve(computedWords);
    });

    layout.start();
  });
};
