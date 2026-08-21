import { docsToolForPlatform } from "../loader-api/keys.js";

export function listVersionsToolForPlatform(platform: string): string {
  const p = platform.trim().toLowerCase();
  if (p === "fabric") return "list_fabric_versions";
  if (p === "neoforge") return "list_neoforge_versions";
  if (p === "forge") return "list_forge_versions";
  return "list_doc_versions";
}

function docsToolForPackNotFound(platform: string): string {
  const p = platform.trim().toLowerCase();
  if (p === "quilt") return "search_docs";
  return docsToolForPlatform(p);
}

export function packNotFoundExtraHints(platform: string, minecraftVersion: string): string[] {
  if (platform === "fabric" && minecraftVersion === "1.21.5") {
    return [
      "禁止读 fabric/1.21.4 或 1.21.8 的 00–10 顶上。",
      "可改口 search_fabric_docs（先 list_fabric_versions）；最近有文档树的是 1.21.4 / 1.21.8，不要 fallback 正文。",
    ];
  }
  if (platform === "forge" && minecraftVersion === "1.21.1") {
    return [
      "禁止用 NeoForge 1.21.1 规则顶上。Forge 文档止于 1.20.4；可 search_forge_docs version=1.20.4（须标明不是 1.21.1 规则树）。",
    ];
  }
  return [];
}

export function packNotFoundNextSteps(
  platform: string,
  minecraftVersion: string,
  ask?: string,
): string[] {
  const listTool = listVersionsToolForPlatform(platform);
  const docs = docsToolForPackNotFound(platform);
  return [
    `改用 ${docs}（先 ${listTool}）`,
    "禁止读邻档 00–10",
    "ok≠已加载规则",
    ...(ask ? [ask] : []),
    ...packNotFoundExtraHints(platform, minecraftVersion),
  ];
}

export function packNotFoundRelatedTools(platform: string): string[] {
  return [
    docsToolForPackNotFound(platform),
    listVersionsToolForPlatform(platform),
    "activate_platform_pack",
  ];
}
