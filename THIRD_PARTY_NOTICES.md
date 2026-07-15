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
