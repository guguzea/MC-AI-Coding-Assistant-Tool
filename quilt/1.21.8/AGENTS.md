# Quilt 1.21.8 — Agent 总纲

> 本规则集适用于 **Quilt 1.21.8**。检测 `quilt.mod.json` 或 `org.quiltmc.loom`（可同时有 `fabric.mod.json`）。
> **必须再读** `fabric/1.21.8/.cursor/rules/` 的 **02–04、07–08、10**（及缺的 09）。05/06 用本目录，不要 overlay Fabric 网络。
> 本目录只写 QSL / Quilt Loader **差异**（00 / 01 / 05 / 06）。禁止把整棵 Fabric 规则复制进来。禁止用邻版 Fabric overlay。
> 从零建工程用本档 scaffold/（基于 quilt/1.21.1 口径：quilt-loader + yarn；yarn build 号与 loom 版本对照官方模板再改，禁止臆造）。

## 基本信息

| 项目 | 值 |
|------|-----|
| 平台 | Quilt |
| Minecraft | 1.21.8 |
| Java | **Java 21** |
| Gradle | Quilt Loom（`id 'org.quiltmc.loom'`） |
| Mappings | 对齐当前工程 mappings（多为 Yarn named）。禁止 `class_` 中间名。 |
| 元数据 | `quilt.mod.json`（`quilt_loader.id`；Fabric/Quilt 允许连字符） |
| 注册 | 优先 **QSL `org.quiltmc`**；不要生成 `net.fabricmc.fabric.api.event.registry` 当 QSL |

库 Skill：仍按 `fabric-only` + `all-platforms` 读 `knowledge/libs/`。

## 规则文件

| 编号 | 本目录 | 说明 |
|------|--------|------|
| 00 | `00-project-setup.mdc` | Quilt Loom / quilt.mod.json |
| 01 | `01-registry.mdc` | QSL vs FAPI Registry（必读） |
| 05 | `05-events.mdc` | 仅 QSL 分叉 |
| 06 | `06-networking.mdc` | QSL ≠ FAPI；QFAPI 才对照 FAPI 网络 |
| 02–04, 07–08, 10 | overlay fabric | session 注入同版 Fabric（含缺的 09） |

`query_api` 对 1.21.8 无 Vanilla 索引。平台 API：`search_docs({platform:"quilt", version:"1.21.8"})`；无本档 quilt-docs 时改口 `list_doc_versions` 已入库档或 `search_fabric_docs version=1.21.8`。QSL 专用查询禁止把 Fabric Registry 当命中。
