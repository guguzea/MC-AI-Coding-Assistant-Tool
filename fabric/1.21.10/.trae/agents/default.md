# Fabric 1.21.10 — Agent 总纲

> 只适用于 **Fabric 1.21.10**。文档：search_fabric_docs version=1.21.10（先 list_fabric_versions）。**禁止**复制 `fabric/1.21.11` 或邻版 wiki。

| 项 | 值 |
|---|---|
| 平台 | Fabric 1.21.10 |
| Java | **21** |
| 文档 mappings 示例 | 官方名（creating-a-project 页）。工程若用 Yarn 须自行对照，禁止把 class_ 中间名当 API |
| 注册 | Registry.register（search_fabric_docs query=registry version=1.21.10） |
| 网络 | PayloadTypeRegistry + CustomPayload |

核实表：knowledge/common/verified-api-1.21.10.md。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

