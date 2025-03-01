import { ComputedWord, WordCloudConfig } from "../types";
import cloud from "d3-cloud";

export const computeWords = (config: WordCloudConfig): Promise<ComputedWord[]> => {
  const {
    words,
    width,
    height,
    timeInterval,
    spiral,
    padding,
    random,
    font,
    fontStyle,
    fontWeight,
    fontSize,
    rotate,
  } = config;

  return new Promise((resolve) => {
    const layout = cloud<cloud.Word>().size([width, height]).words(words);

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

    if (font) {
      layout.font((datum, index) => {
        return typeof font === "function" ? font(datum as ComputedWord, index) : font;
      });
    }

    if (fontStyle) {
      layout.fontStyle((datum, index) => {
        return typeof fontStyle === "function"
          ? fontStyle(datum as ComputedWord, index)
          : fontStyle;
      });
    }

    if (fontWeight) {
      layout.fontWeight((datum, index) => {
        return typeof fontWeight === "function"
          ? fontWeight(datum as ComputedWord, index)
          : fontWeight;
      });
    }

    if (fontSize) {
      layout.fontSize((datum, index) => {
        return typeof fontSize === "function" ? fontSize(datum as ComputedWord, index) : fontSize;
      });
    }

    if (rotate) {
      layout.rotate((datum, index) => {
        return typeof rotate === "function" ? rotate(datum as ComputedWord, index) : rotate;
      });
    }

    layout.on("end", (computedWords) => {
      resolve(computedWords as ComputedWord[]);
    });

    layout.start();
  });
};
