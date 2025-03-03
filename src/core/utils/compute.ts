import { ComputedWord, WordCloudConfig } from "../types";
import cloud from "d3-cloud";

export const computeWords = (
  config: WordCloudConfig,
  onComputeWord: (word: ComputedWord) => void,
): Promise<ComputedWord[]> => {
  const {
    words,
    width,
    height,
    timeInterval,
    spiral,
    padding,
    font,
    fontStyle,
    fontWeight,
    fontSize,
    rotate,
  } = config;

  return new Promise((resolve) => {
    const layout = cloud<cloud.Word>().size([width, height]).words(words);

    layout.canvas(() => new OffscreenCanvas(1, 1) as unknown as HTMLCanvasElement);

    if (timeInterval) {
      layout.timeInterval(timeInterval);
    }

    if (spiral) {
      layout.spiral(spiral);
    }

    if (padding) {
      if (typeof padding === "function") {
        layout.padding((datum, index) => padding(datum as ComputedWord, index));
      } else {
        layout.padding(padding);
      }
    }

    if (font) {
      if (typeof font === "function") {
        layout.font((datum, index) => font(datum as ComputedWord, index));
      } else {
        layout.font(font);
      }
    }

    if (fontStyle) {
      if (typeof fontStyle === "function") {
        layout.fontStyle((datum, index) => fontStyle(datum as ComputedWord, index));
      } else {
        layout.fontStyle(fontStyle);
      }
    }

    if (fontWeight) {
      if (typeof fontWeight === "function") {
        layout.fontWeight((datum, index) => fontWeight(datum as ComputedWord, index));
      } else {
        layout.fontWeight(fontWeight);
      }
    }

    if (fontSize) {
      if (typeof fontSize === "function") {
        layout.fontSize((datum, index) => fontSize(datum as ComputedWord, index));
      } else {
        layout.fontSize(fontSize);
      }
    }

    if (rotate) {
      layout.rotate((datum, index) => rotate(datum as ComputedWord, index));
    }

    layout.on("word", (word) => {
      onComputeWord(word as ComputedWord);
    });

    layout.on("end", (computedWords) => {
      resolve(computedWords as ComputedWord[]);
    });

    layout.start();
  });
};
