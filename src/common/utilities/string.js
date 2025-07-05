export const normalizeEmpty = (val) => {
  if (typeof val !== "string") return val;
  const result = val.trim();
  return result === "" ? undefined : result;
};
