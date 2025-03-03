import { computeLinearGradientCoords, Gradient } from "../../common";

export type GradientDefsProps = {
  gradients?: Gradient[];
};

export const GradientDefs = ({ gradients }: GradientDefsProps) => {
  if (!gradients) {
    return null;
  }

  return (
    <defs>
      {gradients.map((gradient) => {
        if (gradient.type === "linear") {
          const angle = gradient.angle ?? 0;
          const { x1, y1, x2, y2 } = computeLinearGradientCoords(angle);

          return (
            <linearGradient
              key={gradient.id}
              id={gradient.id}
              gradientUnits="userSpaceOnUse"
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
            >
              {gradient.stops.map((stop) => (
                <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
          );
        } else if (gradient.type === "radial") {
          return (
            <radialGradient key={gradient.id} id={gradient.id}>
              {gradient.stops.map((stop) => (
                <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
              ))}
            </radialGradient>
          );
        }

        return null;
      })}
    </defs>
  );
};
