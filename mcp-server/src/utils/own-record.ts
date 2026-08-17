/** 普通对象上的自有属性读取，避免 `obj["constructor"]` 命中 Object.prototype。 */

export function ownGet<T>(rec: Record<string, T>, key: string): T | undefined {
  return Object.hasOwn(rec, key) ? rec[key] : undefined;
}
