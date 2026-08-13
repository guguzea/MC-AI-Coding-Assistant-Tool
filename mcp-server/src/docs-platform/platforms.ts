/**
 * 文档平台枚举（search_docs 不含 bedrock：基岩走 search_bedrock_docs）。
 */
export const SEARCH_DOC_PLATFORMS = [
  "forge",
  "neoforge",
  "fabric",
  "quilt",
  "liteloader",
  "rift",
  "modloader",
] as const;

export type SearchDocPlatform = (typeof SEARCH_DOC_PLATFORMS)[number];

export const ALL_DOC_PLATFORMS = [...SEARCH_DOC_PLATFORMS, "bedrock"] as const;

export type Platform = (typeof ALL_DOC_PLATFORMS)[number];

export const PLATFORM_DOC_SUBDIR: Record<Platform, string> = {
  forge: "forge-docs",
  neoforge: "neoforge-docs",
  fabric: "fabric-docs",
  quilt: "quilt-docs",
  liteloader: "liteloader-docs",
  rift: "rift-docs",
  modloader: "modloader-docs",
  bedrock: "bedrock-docs",
};

export const KNOWN_VERSIONS: Record<Platform, string[]> = {
  forge: [
    "1.20.4", "1.20.1", "1.19.4", "1.18.2", "1.17.1", "1.16.5", "1.15.2", "1.14.4",
    "1.12.2", "1.11.2", "1.10.2", "1.9.4", "1.8.9", "1.7.10",
  ],
  neoforge: [
    "26.1", "1.21.11", "1.21.10", "1.21.8", "1.21.5", "1.21.3", "1.21.1", "1.20.6", "1.20.4",
    "1.20.1",
  ],
  fabric: ["26.1.2", "1.21.11", "1.21.3", "1.21.1", "1.20.4", "1.20.1", "1.19.4", "1.18.2", "1.17.1", "1.16.5", "1.14.4"],
  quilt: ["1.21.1", "1.20.4", "1.20.1", "1.19.4", "1.18.2"],
  liteloader: ["1.12.2", "1.10.2", "1.8.9"],
  rift: ["1.13.2"],
  modloader: ["1.6.4", "1.5.2", "1.2.5"],
  bedrock: ["stable"],
};
