import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { GradientDefs } from "./index";
import { Gradient } from "../../core";

describe("GradientDefs", () => {
  const renderGradients = (gradients?: Gradient[]) =>
    render(
      <svg>
        <GradientDefs gradients={gradients} />
      </svg>,
    );

  it("returns null when no gradients are provided", () => {
    const { container } = renderGradients();
    expect(container.querySelector("defs")).toBeNull();
  });

  it("renders linear gradient correctly", () => {
    const gradients: Gradient[] = [
      {
        id: "linear1",
        type: "linear" as const,
        angle: 45,
        stops: [
          { offset: "0%", color: "#ff0000" },
          { offset: "100%", color: "#0000ff" },
        ],
      },
    ];

    const { container } = renderGradients(gradients);

    const linearGradient = container.querySelector("linearGradient");
    expect(linearGradient).toBeTruthy();
    expect(linearGradient?.id).toBe("linear1");
    expect(linearGradient?.getAttribute("gradientUnits")).toBe("userSpaceOnUse");

    const stops = container.querySelectorAll("stop");
    expect(stops).toHaveLength(2);
    expect(stops[0].getAttribute("stop-color")).toBe("#ff0000");
    expect(stops[1].getAttribute("stop-color")).toBe("#0000ff");
  });

  it("renders radial gradient correctly", () => {
    const gradients: Gradient[] = [
      {
        id: "radial1",
        type: "radial" as const,
        stops: [
          { offset: "0%", color: "#ff0000" },
          { offset: "100%", color: "#0000ff" },
        ],
      },
    ];

    const { container } = renderGradients(gradients);

    const radialGradient = container.querySelector("radialGradient");
    expect(radialGradient).toBeTruthy();
    expect(radialGradient?.id).toBe("radial1");

    const stops = container.querySelectorAll("stop");
    expect(stops).toHaveLength(2);
    expect(stops[0].getAttribute("stop-color")).toBe("#ff0000");
    expect(stops[1].getAttribute("stop-color")).toBe("#0000ff");
  });

  it("renders multiple gradients correctly", () => {
    const gradients: Gradient[] = [
      {
        id: "linear1",
        type: "linear" as const,
        angle: 90,
        stops: [
          { offset: "0%", color: "#ff0000" },
          { offset: "100%", color: "#0000ff" },
        ],
      },
      {
        id: "radial1",
        type: "radial" as const,
        stops: [
          { offset: "0%", color: "#00ff00" },
          { offset: "100%", color: "#000000" },
        ],
      },
    ];

    const { container } = renderGradients(gradients);

    expect(container.querySelectorAll("linearGradient")).toHaveLength(1);
    expect(container.querySelectorAll("radialGradient")).toHaveLength(1);
    expect(container.querySelectorAll("stop")).toHaveLength(4);
  });
});
