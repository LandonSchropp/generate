export function compact(array) {
  return array.filter((value) => value !== null && value !== undefined);
}

export async function asyncFilter(array, predicate) {
  let results = await Promise.all(array.map(predicate));
  return array.filter((_, index) => results[index]);
}
