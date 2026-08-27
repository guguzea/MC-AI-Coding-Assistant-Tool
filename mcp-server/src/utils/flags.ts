/**
 * CLI / 工具布尔旗标解析。裸 flag 为开；显式 false/0/no/off 为关。
 * `--flag=junk` 拒绝（不得静默当 true）。
 */

export class InvalidBooleanFlagError extends Error {
  constructor(
    readonly value: string,
    readonly flag?: string,
  ) {
    const shown = flag ? `--${flag}=${value}` : String(value);
    super(`布尔参数 ${shown} 无效，只接受 true/false/1/0/yes/no/on/off（裸 --flag 为 true）`);
    this.name = "InvalidBooleanFlagError";
  }
}

const BOOL_TRUE = new Set(["true", "1", "yes", "on"]);
const BOOL_FALSE = new Set(["false", "0", "no", "off"]);

/** 解析布尔 token；无法识别时返回 undefined（空串不当 true）。 */
export function parseBooleanToken(value: string): boolean | undefined {
  const v = value.trim().toLowerCase();
  if (BOOL_TRUE.has(v)) return true;
  if (BOOL_FALSE.has(v)) return false;
  return undefined;
}

export function parseFlagTruthy(v: unknown, flag?: string): boolean {
  if (v === undefined || v === null) return false;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (Array.isArray(v)) {
    const last = v.at(-1);
    return parseFlagTruthy(last, flag);
  }
  const s = String(v).trim().toLowerCase();
  if (s === "") return true;
  const parsed = parseBooleanToken(s);
  if (parsed !== undefined) return parsed;
  throw new InvalidBooleanFlagError(String(v), flag);
}
