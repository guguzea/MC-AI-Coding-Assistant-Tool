# Quilt 1.20.1 — Agent 总纲

> 本规则集适用于 **Quilt 1.20.1**。检测 `quilt.mod.json` 或 `org.quiltmc.loom`（可同时有 `fabric.mod.json`）。
> **必须再读** `fabric/1.20.1/.cursor/rules/` 的 **02–10**（方块/物品/实体/网络/datagen/客户端/反模式/GUI）。
> 本目录只写 QSL / Quilt Loader **差异**（00 / 01 / 05）。禁止把整棵 Fabric 规则复制进来。

## 基本信息

| 项目 | 值 |
|------|-----|
| 平台 | Quilt |
| Minecraft | 1.20.1 |
| Java | **Java 17** |
| Gradle | Quilt Loom（`id 'org.quiltmc.loom'`） |
| Mappings | Yarn / intermediary（与 Fabric 同层） |
| 元数据 | `quilt.mod.json`（`quilt_loader.id`） |
| 注册 | 优先 **QSL `org.quiltmc`**；不要生成 `net.fabricmc.fabric.api.event.registry` 当 QSL |

库 Skill：仍按 `fabric-only` + `all-platforms` 读 `knowledge/libs/`。

### 本规则集的 IDE 加载优先级

| AI 助手 | 读取路径 |
|---------|---------|
| Cursor | `.cursor/rules/*.mdc` + `.cursor/skills/` |
| OpenCode / Codex / ZCode | `AGENTS.md` |
| Pi | `.pi/rules/*.md`（+ `AGENTS.md`） |

当上述路径不存在时，降级读取本文件和 `.cursor/`。


## 规则文件

| 编号 | 本目录 | 说明 |
|------|--------|------|
| 00 | `00-project-setup.mdc` | Quilt Loom / quilt.mod.json |
| 01 | `01-registry.mdc` | QSL vs FAPI Registry（必读） |
| 05 | `05-events.mdc` | 仅 QSL 分叉；否则指向 fabric/1.20.1 的 05 |
| 02–04, 06–10 | **不要本目录找** | 打开 `fabric/1.20.1/.cursor/rules/` |

`query_api` 仅当 1.20.1 落在 Parchment 窗口（约 1.16.5–1.20.4）。平台 API 用 `search_docs({platform:"quilt"})`。QSL 专用查询禁止把 Fabric Registry 当命中。
