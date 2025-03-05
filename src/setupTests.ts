import "@testing-library/jest-dom";
import { vi } from "vitest";

class OffscreenCanvasMock {
  constructor(width: number, height: number) {
    const context = {
      // Canvas state
      save: vi.fn(),
      restore: vi.fn(),

      // Transformations
      scale: vi.fn(),
      rotate: vi.fn(),
      translate: vi.fn(),
      transform: vi.fn(),
      setTransform: vi.fn(),

      // Drawing methods
      beginPath: vi.fn(),
      closePath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      fillRect: vi.fn(),
      clearRect: vi.fn(),

      // Text methods
      measureText: (text: string) => ({
        width: text.length * 10,
        actualBoundingBoxAscent: 10,
        actualBoundingBoxDescent: 4,
      }),
      fillText: vi.fn(),
      strokeText: vi.fn(),

      // Image data
      getImageData: (_x: number, _y: number, w: number, h: number) => ({
        data: new Uint8ClampedArray(w * h * 4),
        width: w,
        height: h,
      }),
      putImageData: vi.fn(),

      // Properties
      canvas: { width, height },
      fillStyle: "",
      strokeStyle: "",
      textAlign: "start",
      textBaseline: "alphabetic",
      lineWidth: 1,
    };

    return {
      width,
      height,
      getContext: () => context,
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.OffscreenCanvas = OffscreenCanvasMock as any;
