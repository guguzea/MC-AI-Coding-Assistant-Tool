# Quilt 1.21.11 — Agent 总纲

> 本规则集适用于 **Quilt 1.21.11**。检测 `quilt.mod.json` 或 `org.quiltmc.loom`（可同时有 `fabric.mod.json`）。
> **必须再读** `fabric/1.21.11/.cursor/rules/` 的 **02–10**。
> 本目录只写 QSL / Quilt Loader **差异**（00 / 01 / 05）。禁止把整棵 Fabric 规则复制进来。禁止用邻版 Fabric overlay。

## 基本信息

| 项目 | 值 |
|------|-----|
| 平台 | Quilt |
| Minecraft | 1.21.11 |
| Java | **Java 21** |
| Gradle | Quilt Loom（`id 'org.quiltmc.loom'`） |
| Mappings | 对齐当前工程 mappings（多为 Yarn named）。禁止 `class_` 中间名。不要写「Quilt 官方一律 Mojmap」。 |
| 元数据 | `quilt.mod.json`（`quilt_loader.id`） |
| 注册 | 优先 **QSL `org.quiltmc`**；不要生成 `net.fabricmc.fabric.api.event.registry` 当 QSL |

库 Skill：仍按 `fabric-only` + `all-platforms` 读 `knowledge/libs/`。

## 规则文件

| 编号 | 本目录 | 说明 |
|------|--------|------|
| 00 | `00-project-setup.mdc` | Quilt Loom / quilt.mod.json |
| 01 | `01-registry.mdc` | QSL vs FAPI Registry |
| 05 | `05-events.mdc` | 仅 QSL 分叉 |
| 02–04, 06–10 | overlay | `fabric/1.21.11/.cursor/rules/` |

`query_api` 对 1.21.11 无 Vanilla 索引。QSL：先 `list_doc_versions`；**禁止** `search_docs version=1.21.11`（`VERSION_NOT_FOUND`）。QSL 可 `search_docs({platform:"quilt", version:"1.21.1"})` 并声明 fallback。Vanilla/FAPI 走 `search_fabric_docs version=1.21.11`。
