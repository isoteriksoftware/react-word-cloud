import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { useWordCloud } from "./index";
import { computeWords } from "../../utils";
import { ComputedWordData, Word, WordCloudConfig } from "../../types";

vi.mock("../../utils", () => ({
  computeWords: vi.fn(() => Promise.resolve([])),
  defaultFontSize: (word: Word) => Math.sqrt(word.value),
  defaultRotate: () => 0,
}));

describe("useWordCloud", () => {
  const mockWords: Word[] = [
    { text: "hello", value: 10 },
    { text: "world", value: 5 },
  ];

  const mockComputedWords: ComputedWordData[] = [
    {
      text: "hello",
      value: 10,
      x: 0,
      y: 0,
      size: 10,
      rotate: 0,
      font: "Arial",
      weight: "normal",
      style: "normal",
      padding: 1,
    },
    {
      text: "world",
      value: 5,
      x: 100,
      y: 100,
      size: 5,
      rotate: 0,
      font: "Arial",
      weight: "normal",
      style: "normal",
      padding: 1,
    },
  ];

  const defaultProps = {
    words: mockWords,
    width: 500,
    height: 500,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize with empty computed words and loading state", async () => {
    const { result } = renderHook(() => useWordCloud(defaultProps));

    // Initial state check
    expect(result.current.computedWords).toEqual([]);
    expect(result.current.isLoading).toBe(true);

    // Wait for initial computation to complete
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("should call onStartComputation when computation begins", async () => {
    const onStartComputation = vi.fn();

    renderHook(() =>
      useWordCloud({
        ...defaultProps,
        onStartComputation,
      }),
    );

    expect(onStartComputation).toHaveBeenCalledTimes(1);

    // Wait for computation to complete
    await act(async () => {
      await vi.runAllTimersAsync();
    });
  });

  it("should handle word computation and callbacks", async () => {
    const onWordComputed = vi.fn();
    const onCompleteComputation = vi.fn();

    (computeWords as Mock).mockImplementation(
      (_: WordCloudConfig, onWordCallback: (word: ComputedWordData) => void) => {
        mockComputedWords.forEach((word) => onWordCallback(word));
        return Promise.resolve(mockComputedWords);
      },
    );

    const { result } = renderHook(() =>
      useWordCloud({
        ...defaultProps,
        onWordComputed,
        onCompleteComputation,
      }),
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(onWordComputed).toHaveBeenCalledTimes(2);
    expect(onCompleteComputation).toHaveBeenCalledWith(mockComputedWords);
    expect(result.current.isLoading).toBe(false);
  });

  it("should recompute when dependencies change", async () => {
    const { rerender } = renderHook((props) => useWordCloud(props), { initialProps: defaultProps });

    // First render triggers computation
    expect(computeWords).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Rerender with new width
    await act(async () => {
      rerender({ ...defaultProps, width: 600 });
    });

    // Should trigger new computation
    expect(computeWords).toHaveBeenCalledTimes(2);

    await act(async () => {
      await vi.runAllTimersAsync();
    });
  });

  it("should flush all words in proper order", async () => {
    // Ensure that all computed words are processed (with correct indices)
    // before the onCompleteComputation callback is fired.
    const callOrder: string[] = [];
    const onWordComputed = vi.fn((word: ComputedWordData, index: number) => {
      callOrder.push(`word-${word.text}-${index}`);
    });
    const onCompleteComputation = vi.fn(() => {
      callOrder.push("complete");
    });

    (computeWords as Mock).mockImplementation(
      (_: WordCloudConfig, onWordCallback: (word: ComputedWordData) => void) => {
        // Simulate sequential processing of words.
        mockComputedWords.forEach((word) => onWordCallback(word));
        return Promise.resolve(mockComputedWords);
      },
    );

    renderHook(() =>
      useWordCloud({
        ...defaultProps,
        onWordComputed,
        onCompleteComputation,
      }),
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // The expected order is:
    // 1. The first word ("hello") is processed with index 0.
    // 2. The second word ("world") is processed with index 1.
    // 3. Finally, the complete callback is called.
    expect(callOrder).toEqual(["word-hello-0", "word-world-1", "complete"]);
  });
});
