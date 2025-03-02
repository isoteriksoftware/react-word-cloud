import { WordCloudConfig, WorkerMessage } from "../types";
import { computeWords, deserializeAccessor } from "../utils";

self.onmessage = (evt: MessageEvent<WorkerMessage>) => {
  const { requestId, width, height, words, timeInterval, ...config } = evt.data;

  console.log({ requestId, width, height, words, timeInterval, config });

  const deserializedConfig: WordCloudConfig = {
    words,
    width,
    height,
    timeInterval,
    spiral: deserializeAccessor(config.spiral),
    padding: deserializeAccessor(config.padding),
    random: deserializeAccessor(config.random),
    font: deserializeAccessor(config.font),
    fontStyle: deserializeAccessor(config.fontStyle),
    fontWeight: deserializeAccessor(config.fontWeight),
    fontSize: deserializeAccessor(config.fontSize),
    rotate: deserializeAccessor(config.rotate),
  };

  console.log({ deserializedConfig });

  const canvas = new OffscreenCanvas(1, 1);
  computeWords(deserializedConfig, canvas as unknown as HTMLCanvasElement).then((computedWords) => {
    self.postMessage({ requestId, computedWords });
  });
};
