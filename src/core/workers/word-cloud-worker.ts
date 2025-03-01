import { WorkerMessage } from "../types";
import { computeWords } from "../utils";

self.onmessage = (evt: MessageEvent<WorkerMessage>) => {
  const { requestId, ...config } = evt.data;

  computeWords(config).then((computedWords) => {
    self.postMessage({ requestId, computedWords });
  });
};
