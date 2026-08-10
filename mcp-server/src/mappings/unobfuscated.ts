/**
 * Minecraft 26.1+ shipped without obfuscation (Mojang names in the jar).
 * Yarn / Intermediary / classic remap stacks do not apply.
 */

/** True for MC / NeoForge / Fabric version strings in the 26.x+ era. */
export function isUnobfuscatedMcVersion(version: string | undefined | null): boolean {
  if (!version) return false;
  const v = String(version).trim().replace(/^v/i, "");
  const m = /^(\d+)\.(\d+)/.exec(v);
  if (!m) return false;
  const major = Number(m[1]);
  const minor = Number(m[2]);
  if (major > 26) return true;
  if (major === 26 && minor >= 1) return true;
  return false;
}

export const UNOBFUSCATED_MAPPING_HINT =
  "Minecraft 26.1+ 已去混淆：运行时即为 Mojang 名（mojmap），无需 Yarn/Intermediary remap。" +
  "请用 search_neoforge_docs / search_fabric_docs，或直接按源码名编写。";
