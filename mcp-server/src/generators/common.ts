export { normalizeModIdentifier } from "../datagen/index.js";

export function toPascalCase(modId: string): string {
  return modId.split(/[_-]/).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}

export interface GeneratorResult {
  code: string | null;
  files?: Record<string, string>;
  warnings?: string[];
  errors?: string[];
  experimental?: boolean;
}

export type PlatformTarget = "forge_1.20.1" | "neoforge_1.21";
