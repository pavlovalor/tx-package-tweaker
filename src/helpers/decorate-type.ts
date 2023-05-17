export function decorate(value: unknown) {
  return typeof value === 'string'
    ? `"${value}"`
    : value
}
