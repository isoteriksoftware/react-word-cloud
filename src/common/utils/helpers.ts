export const computeLinearGradientCoords = (angle: number) => {
  const rad = (angle * Math.PI) / 180;
  const x1 = ((Math.cos(rad + Math.PI) + 1) / 2) * 100;
  const y1 = ((Math.sin(rad + Math.PI) + 1) / 2) * 100;
  const x2 = ((Math.cos(rad) + 1) / 2) * 100;
  const y2 = ((Math.sin(rad) + 1) / 2) * 100;
  return { x1, y1, x2, y2 };
};
