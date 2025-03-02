import { WorkerMessage } from "../types";
import { computeWordsInWorker } from "../utils";

self.onmessage = (evt: MessageEvent<WorkerMessage>) => {
  const { requestId, ...config } = evt.data;

  computeWordsInWorker(config).then((computedWords) => {
    self.postMessage({ requestId, computedWords });
  });
};
