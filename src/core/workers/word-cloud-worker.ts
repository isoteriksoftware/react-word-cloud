import { WorkerMessage } from "../types";
import cloud from "d3-cloud";

self.onmessage = (evt: MessageEvent<WorkerMessage>) => {
  const {
    requestId,
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
  } = evt.data;

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
    self.postMessage({ requestId, computedWords });
  });
};
