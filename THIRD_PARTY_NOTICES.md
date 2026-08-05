# Third-Party Notices

This repository’s **own code** (MCP server, scripts, agent rules, scaffolds, etc.) is licensed under the MIT License — see [`LICENSE`](./LICENSE).

The offline bundle under `data/` (and the GitHub Release `mc-skill-data-full-*.zip`) may include third-party documentation extracts, mapping artefacts, and related materials. Those retain their **upstream licenses and terms**. This notice must be kept when redistributing the full data asset, alongside the MIT `LICENSE` for this project’s code.

## Runtime / build dependencies (MCP server)

Declared in `mcp-server/package.json` (install via `npm ci`; not vendored in git / Release):

| Package | Role | Upstream |
|---------|------|----------|
| `@modelcontextprotocol/sdk` | MCP stdio protocol SDK | https://github.com/modelcontextprotocol |
| `zod` | Schema validation | https://github.com/colinhacks/zod |
| `typescript` / `@types/node` / `tsx` (dev) | Build & types | respective upstreams |

Follow each package’s license as published on npm.

## Minecraft Forge documentation / Javadoc extracts

- Source: Minecraft Forge project documentation and related materials
- Upstream: https://docs.minecraftforge.net / https://github.com/MinecraftForge
- Typical local paths: `data/forge_*/forge-docs/`
- License: follow upstream Forge / documentation terms

## Fabric documentation and Wiki extracts

- Fabric Docs: https://github.com/FabricMC/fabric-docs
- Fabric Wiki: https://fabricmc.net/wiki/
- Typical local paths: `data/fabric_*/fabric-docs/`、`data/fabric_*/fabric-wiki/`
- License: follow FabricMC / page-specific terms

## Yarn mappings

- Upstream: Fabric Yarn (Maven `net.fabricmc:yarn`) / https://fabricmc.net/wiki/documentation:yarn
- Typical local artefacts: `yarn-*.jar`、`yarn-*-tiny.gz`、`yarn-mappings.json`、generated `yarn-mappings.sqlite`
- License: follow Yarn / FabricMC mapping license terms
- Note: the MCP server must use **SQLite point lookups** at runtime; do not treat the full JSON as a redistributable “load everything” database API

## Parchment mappings

- Upstream: https://parchmentmc.org / https://github.com/ParchmentMC
- Typical local paths: `data/*/mappings/parchment*.json` / related zips
- License: follow ParchmentMC terms

## MCP (Mod Coder Pack) historical mappings

- Used for older Forge versions where applicable (`data/forge_*/mappings/` etc.)
- Follow historical MCP redistribution terms

## NeoForge documentation / primers

- Upstream: https://docs.neoforged.net / https://github.com/neoforged
- Typical local paths: `data/neoforge_*/`（及文档子目录）
- License: follow NeoForged terms
- Note: some NeoForge `1.20.1` doc queries may surface Forge 1.20.1 content via a compatibility fallback in this tool

## Release assets

When publishing or mirroring:

1. Keep this file with any full `data/` zip.
2. Prefer verifying downloads with `SHA256SUMS-*.txt`（checksum entries use **bare filenames**, matching GitHub Release asset names such as `data-manifest.json`）.
3. Do not strip upstream attribution from regenerated indexes if your redistribution policy requires retaining provenance metadata (`meta.json`、manifests、fetch URLs / hashes).

## Disclaimer

Minecraft is a trademark of Mojang Synergies AB. This project is not affiliated with Mojang, Microsoft, Forge, FabricMC, or NeoForged. Documentation and mappings are provided for offline developer assistance; redistribute only in accordance with each upstream project’s license.

## Community knowledge（`community_knowledge/`）

本仓库另含社区实务知识库（与 `data/` 官方文档分离）：

| 来源 | 说明 |
|------|------|
| MC百科教程（耿悠博） | 《如何制作并且维护你的mod？（Forge，1.18–1.20）》；作者评论区约 51 楼「随意吧」许可收录提炼。原文：https://www.mcmod.cn/post/3993.html 。详见 `community_knowledge/ATTRIBUTION.md`。 |
| 仅外链（禁转载） | 例：https://www.mcmod.cn/post/6071.html（Kadar_Visico 工程化指南）→ `links/` stub，正文不入库。 |
| 本仓库自写短文 | `community_knowledge/authored/`（发布、崩溃、软依赖、创造页签、工程结构、注册 helper、机器/GUI/BE/Capability、多面模型、开发环境、本地化、CurseMaven 等）；Agent 用法见 `community_knowledge/AGENT_USAGE.md` |
| 外链 stub | `community_knowledge/links/`（仅 URL，无网页正文入库） |

社区内容经 MCP `search_community_docs` 等工具查询；**API / 注册细节仍以官方 Forge/Fabric/NeoForge 文档工具为准**。
