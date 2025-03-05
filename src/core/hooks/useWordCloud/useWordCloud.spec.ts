import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useWordCloud } from "./index";
import { computeWords } from "../../utils";
import { ComputedWordData, Word, WordCloudConfig } from "../../types";

vi.mock("../../utils", () => ({
  computeWords: vi.fn(() => Promise.resolve([])),
  defaultFontSize: (word: Word) => Math.sqrt(word.value),
  defaultRotate: () => 0,
}));

describe("useWordCloud", () => {
  const mockWords = [
    { text: "hello", value: 10 },
    { text: "world", value: 5 },
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

  it("should call onStartCompute when computation begins", async () => {
    const onStartCompute = vi.fn();

    renderHook(() =>
      useWordCloud({
        ...defaultProps,
        onStartCompute,
      }),
    );

    expect(onStartCompute).toHaveBeenCalledTimes(1);

    // Wait for computation to complete
    await act(async () => {
      await vi.runAllTimersAsync();
    });
  });

  it("should handle word computation and callbacks", async () => {
    const onComputeWord = vi.fn();
    const onCompleteCompute = vi.fn();

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (computeWords as any).mockImplementation(
      (_: WordCloudConfig, onWordCallback: (word: ComputedWordData) => void) => {
        mockComputedWords.forEach((word) => onWordCallback(word));
        return Promise.resolve(mockComputedWords);
      },
    );

    const { result } = renderHook(() =>
      useWordCloud({
        ...defaultProps,
        onComputeWord,
        onCompleteCompute,
      }),
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(onComputeWord).toHaveBeenCalledTimes(2);
    expect(onCompleteCompute).toHaveBeenCalledWith(mockComputedWords);
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
});
