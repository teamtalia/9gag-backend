/* eslint-disable no-param-reassign */
export const trim = (obj: any): any => {
  Object.keys(obj).forEach(
    k =>
      (obj[k] && typeof obj[k] === 'object' && trim(obj[k])) ||
      (!obj[k] && obj[k] !== undefined && delete obj[k]),
  );
  return obj;
};
