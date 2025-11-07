export function useState(_key, init) {
  const value = typeof init === 'function' ? init() : init;
  return { value };
}
