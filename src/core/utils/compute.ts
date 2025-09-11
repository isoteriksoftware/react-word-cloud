import { ComputedWordData, WordCloudConfig } from "../types";
import cloud from "d3-cloud";

export const computeWords = (
  config: WordCloudConfig,
  onComputeWord: (word: ComputedWordData) => void,
): Promise<ComputedWordData[]> => {
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
    random,
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
        layout.padding((datum, index) => padding(datum as ComputedWordData, index));
      } else {
        layout.padding(padding);
      }
    }

    if (font) {
      if (typeof font === "function") {
        layout.font((datum, index) => font(datum as ComputedWordData, index));
      } else {
        layout.font(font);
      }
    }

    if (fontStyle) {
      if (typeof fontStyle === "function") {
        layout.fontStyle((datum, index) => fontStyle(datum as ComputedWordData, index));
      } else {
        layout.fontStyle(fontStyle);
      }
    }

    if (fontWeight) {
      if (typeof fontWeight === "function") {
        layout.fontWeight((datum, index) => fontWeight(datum as ComputedWordData, index));
      } else {
        layout.fontWeight(fontWeight);
      }
    }

    if (fontSize) {
      if (typeof fontSize === "function") {
        layout.fontSize((datum, index) => fontSize(datum as ComputedWordData, index));
      } else {
        layout.fontSize(fontSize);
      }
    }

    if (rotate) {
      layout.rotate((datum, index) => rotate(datum as ComputedWordData, index));
    }

    if (random) {
      layout.random(random);
    }

    layout.on("word", (word) => {
      onComputeWord(word as ComputedWordData);
    });

    layout.on("end", (computedWords) => {
      resolve(computedWords as ComputedWordData[]);
    });

    layout.start();
  });
};

export const computeLinearGradientCoords = (angle: number) => {
  const rad = (angle * Math.PI) / 180;
  const x1 = ((Math.cos(rad + Math.PI) + 1) / 2) * 100;
  const y1 = ((Math.sin(rad + Math.PI) + 1) / 2) * 100;
  const x2 = ((Math.cos(rad) + 1) / 2) * 100;
  const y2 = ((Math.sin(rad) + 1) / 2) * 100;
  return { x1, y1, x2, y2 };
};
