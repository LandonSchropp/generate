export function humanizeList(list, connector = ", ", finalConnector = " and ") {
  if (list.length === 0) {
    return "";
  }

  if (list.length === 1) {
    return list[0];
  }

  return list.slice(0, -1).join(connector) + finalConnector + list.slice(-1);
}

export function compact(array) {
  return array.filter((value) => value !== null && value !== undefined);
}
