---
name: mc-villager
description: 村民交易 VillagerTrades。触发词：villager、trade、POI
platform: fabric
version: "1.21.3"
dependencies: []
mappings: yarn
mappings_alt: mojmap
---

# mc-villager

> Wave D 技能骨架（fabric 1.21.3）。详细规则见对应 `.cursor/rules/` 与 MCP `search_fabric_docs` / 专题工具。

### ⚠️ 映射口径：本档语料是 mojmap

本件仍是**技能骨架**：本档 docs 语料对本件正文里的类名 0 命中。下表说明这些名字属于哪套映射 —— 本档工程用 Yarn（`gradle.properties` 的 `yarn_mappings` + `mappings "net.fabricmc:yarn:${yarn_mappings}:v2"`），照抄左列进 Yarn 工程必编译失败。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `VillagerTrades` | `TradeOffers` | 1.14.4–1.21.11 | join（`net.minecraft.village.TradeOffers`） |

- 上表只证**类名存在与包路径**，**不证**方法名/参数/返回值。逐签名以本档语料为准：`search_fabric_docs version=1.21.3`，或 `get_minecraft_source`（需 JDK 17+）/ IDE `./gradlew genSources`。
- 两套同名的类（`ItemStack` / `BlockPos` 等）不在表内，直接写。`net.fabricmc.fabric.api.*`（Fabric API 自身不混淆）与示例工程自造类名也不在表内。


## 快速入口

- 注册与生命周期：`mc-registry`、`01-registry.mdc`
- 数据与资源：`mc-datagen`、`mc-datapack`、`generate_*` MCP 工具
- 反模式：`fabric/1.21.3/knowledge/antipatterns/`

## 下一步

根据任务打开官方文档全文（`get_doc_full`）或社区短文（遵守 `community_knowledge/AGENT_USAGE.md`）。
