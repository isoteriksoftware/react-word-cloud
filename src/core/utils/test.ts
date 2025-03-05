export const generateTestId = (...components: string[]) => {
  const name = components.join("-");
  return `RWC__${name}`;
};
