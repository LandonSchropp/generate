export function compact(array) {
  return array.filter((value) => value !== null && value !== undefined);
}
