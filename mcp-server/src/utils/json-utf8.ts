/**
 * UTF-8 JSON helpers. Strip U+FEFF so Windows/editor-saved files parse.
 * Callers must pass already-decoded text (not file paths).
 */
import { stripUtf8Bom } from "./text.js";

export { stripUtf8Bom };

/** JSON.parse after stripping a leading U+FEFF. */
export function parseJsonUtf8(text: string): unknown {
  return JSON.parse(stripUtf8Bom(text));
}
