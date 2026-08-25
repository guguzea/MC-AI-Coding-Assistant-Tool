# NeoForge 1.20.1 — Agent 总纲

> 只适用于 **NeoForge 1.20.1**。文档数据为 Forge 1.20.1 兼容（search_neoforge_docs version=1.20.1，forgeCompatible）。
> **禁止**读取 `neoforge/1.20.4/.cursor/rules` 或其它邻档 00–10。

| 项 | 值 |
|---|---|
| 平台 | NeoForge 1.20.1 |
| 文档 | search_neoforge_docs version=1.20.1 |
| 注册 | DeferredRegister 与 RegisterEvent（1.20.1/concepts_registries） |
| 禁止 | 把 1.20.4+ DeferredBlock / RegisterPayloadHandlersEvent / AttachmentType 当本档已核；包名禁止默写 |
| 技能 | **thin overlay**：本档磁盘仅 `mc-registry`；其余走 Forge 1.20.1 overlay（02–08/10）与知识库 libs。`pack.meta.json` 为 `pack-status=overlay` + `layout=thin`；`status=ready` 只表示可 session，**不等于技能齐全** |

1.20.1 = Forge 兼容层：`activate_platform_pack session` 注入 Forge 1.20.1 的 02–08/10（SimpleChannel / Capability 形态）。仍禁止读 `neoforge/1.20.4` 邻档。

核实表：knowledge/common/verified-api-1.20.1.md。核不到禁止默写。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

