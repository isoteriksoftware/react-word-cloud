import { ComputedWord, WordCloudConfig, WorkerMessage } from "../types";
import cloud from "d3-cloud";

export const computeWords = (config: WordCloudConfig): Promise<ComputedWord[]> => {
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

    layout.on("end", (computedWords) => {
      resolve(computedWords as ComputedWord[]);
    });

    layout.start();
  });
};

export const computeWordsInWorker = (
  config: Omit<WorkerMessage, "requestId">,
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

    if (padding !== undefined) {
      if (Array.isArray(padding)) {
        layout.padding((_, index) => padding[index]);
      } else {
        layout.padding(padding);
      }
    }

    if (font !== undefined) {
      if (Array.isArray(font)) {
        layout.font((_, index) => font[index]);
      } else {
        layout.font(font);
      }
    }

    if (fontStyle !== undefined) {
      if (Array.isArray(fontStyle)) {
        layout.fontStyle((_, index) => fontStyle[index]);
      } else {
        layout.fontStyle(fontStyle);
      }
    }

    if (fontWeight !== undefined) {
      if (Array.isArray(fontWeight)) {
        layout.fontWeight((_, index) => fontWeight[index]);
      } else {
        layout.fontWeight(fontWeight);
      }
    }

    if (fontSize !== undefined) {
      if (Array.isArray(fontSize)) {
        layout.fontSize((_, index) => fontSize[index]);
      } else {
        layout.fontSize(fontSize);
      }
    }

    if (rotate !== undefined) {
      if (Array.isArray(rotate)) {
        layout.rotate((_, index) => rotate[index]);
      } else {
        layout.rotate(rotate);
      }
    }

    layout.on("end", (computedWords) => {
      resolve(computedWords as ComputedWord[]);
    });

    layout.start();
  });
};
