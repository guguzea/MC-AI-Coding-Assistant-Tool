---
name: mc-energy
description: FE/能量系统互通概念。触发词：ForgeEnergy、IFNFEnergyStorage
platform: fabric
version: "1.21.3"
dependencies: []
mappings: yarn
---

# mc-energy

> Wave D 技能骨架（fabric 1.21.3）。详细规则见对应 `.cursor/rules/` 与 MCP `search_fabric_docs` / 专题工具。

### ⚠️ 映射口径：本档 = Yarn（本件无跨映射名）

本件仍是**技能骨架**，且正文里的类名在 mojmap 与 Yarn 两套映射里**同名**（`client.txt` ⋈ `yarn-mappings.sqlite` 逐名核对）⇒ 没有需要对照改写的名。
本件触发词在本档 docs 语料 0 命中的原因是**上游文档未覆盖该主题**（不是映射口径问题）。落笔仍按本档 Yarn 基线：`gradle.properties` 的 `yarn_mappings` + `mappings "net.fabricmc:yarn:${yarn_mappings}:v2"`。

- 需要该主题的签名/流程时：`search_fabric_docs version=1.21.3 query=…`；0 命中就留 `// TODO(未核实)`，**禁止**用邻版或另一套映射的名顶上。


## 快速入口

- 注册与生命周期：`mc-registry`、`01-registry.mdc`
- 数据与资源：`mc-datagen`、`mc-datapack`、`generate_*` MCP 工具
- 反模式：`fabric/1.21.3/knowledge/antipatterns/`

## 下一步

根据任务打开官方文档全文（`get_doc_full`）或社区短文（遵守 `community_knowledge/AGENT_USAGE.md`）。
