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
  // 服务端面（插件）：Paper 官方开发文档。**版本轴是伪版本 `stable`** —— Paper 文档不按 MC 版本分目录，
  // 且 `fabric/store.ts` 的正文前缀剥离正则只白名单 `\d+\.\d+(\.\d+)?` 与 `stable`
  // （`fabric/store.ts:307`）⇒ 用别的字面量（例如 `main`）正文会被算成 `processed/main/<slug>.md` 而读空。
  // 版本面真身在 Javadoc（jd.papermc.io/paper/），不在本面。
  "paper",
  // Spigot/Bukkit **签名面**（Javadoc）。与 paper 的文档面不同源：本面只给 API 名字/签名/出处，
  // 上游 javadoc **URL 没有版本轴**（`/spigot/1.21.4/` 实测 404）⇒ 落伪版本 `stable`，
  // 真实上游版本串留在每页 frontmatter 的 `asOfVersion`（实测 `26.3-R0.1-SNAPSHOT`，取自 index.html:<title>）。
  "spigot",
  // Paper 的**签名层**（Javadoc）单独作一面 —— 它是 `paper` 平台下的**第二棵树**，而 `FabricDocStore` 是
  // **单源**（只读一个 `source` 子目录），所以要让它对检索可见就得有自己的平台 id。
  // 命名选 `paper-api`：① 与 `paper-docs`（教程面）分得清；② 目录前缀 `paper-api` 能让
  // `versionDataDir` / `hasPrefixedIndex` / `resolvePlatformDataDir` 三处的 `${platform}_` 拼法**全自动对上**
  // （⇒ 零特判分支，这是选它而不是选特殊-case 的原因）。
  "paper-api",
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
  paper: "paper-docs",
  spigot: "spigot-javadoc",
  "paper-api": "paper-javadoc",
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
  fabric: ["26.1.2", "1.21.11", "1.21.10", "1.21.8", "1.21.4", "1.21.3", "1.21.1", "1.20.4", "1.20.1", "1.19.4", "1.18.2", "1.17.1", "1.16.5", "1.14.4"],
  quilt: ["1.21.11", "1.21.10", "1.21.8", "1.21.4", "1.21.3", "1.21.1", "1.20.4", "1.20.1", "1.19.4", "1.18.2"],
  liteloader: ["1.12.2", "1.10.2", "1.8.9"],
  rift: ["1.13.2"],
  modloader: ["1.6.4", "1.5.2", "1.2.5"],
  bedrock: ["stable"],
  // 伪版本：Paper 开发文档是「当前」文档，不按 MC 版本分档（先例 = bedrock 的 `stable`）。
  // 落 `data/paper_stable/paper-docs/stable/`（`resolvePlatformDataDir` 按 `paper_<v>` 拼目录）。
  paper: ["stable"],
  // 签名面伪版本（同 bedrock 的 `stable` 先例）。上游真实版本串见各页 frontmatter 的 `asOfVersion`。
  spigot: ["stable"],
  // Paper 签名层：同样伪版本 `stable`（目录 `data/paper-api_stable/paper-javadoc/stable/`）。
  "paper-api": ["stable"],
};
