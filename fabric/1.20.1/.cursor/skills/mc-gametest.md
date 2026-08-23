---
name: mc-gametest
description: GameTest 结构测试。触发词：GameTest、@GameTest
platform: fabric
version: "1.20.1"
dependencies: []
mappings: yarn
---

# mc-gametest（Fabric 1.20.1）

> **核实结论**：本版（1.20.1）**没有 fabric-docs 版本树**。
> - `data/fabric_1.20.1/meta.json`：`pages: []`；`fabric-docs/1.20.1/failures.json` 原文——「无 versions/1.20.1 与可用归档；不要把 main/VitePress 当本档官方树。search 走 wiki 或 DOC_NOT_FOUND」（removedRaw 25 / keptRaw 0：曾抓的 main 分支页已清除）。
> - 本档 wiki（`data/fabric_1.20.1/fabric-wiki/1.20.1/processed/`）只有 start / documentation_start / tutorial_blocks / tutorial_commands / tutorial_items / tutorial_kotlin——**无 GameTest 页**。
> **策略：机制路线 + 查证路径；禁止把 main 分支（其它版本）文档当 1.20.1 签名。**

## 可核实锚点（本仓库数据）

- 1.20.1 世代环境（meta.json 核实）：Yarn `1.20.1+build.10`、Fabric Loader 0.15.11、Installer 1.1.1。
- 同世代机制基线（1.21.1 页 `develop-automatic-testing`，**仅作机制对照，非本版核实**）：自动测试两条路——① Fabric Loader JUnit 单元测试（Mixin 等字节码修改使普通 JUnit 失效 → 官方 JUnit 插件；测试在 `src/test/java`；JUnit 5 `Assertions`；无参 void 实例方法即测试方法；注册表依赖类须在 `beforeAll` 开头初始化；每次 build 自动运行；CI 失败上传 reports artifact）；② GameTest 框架（拉起真实 client+server，测玩法/特性）。

## GameTest（机制路线；禁止补签名）

- 机制：GameTest = 游戏内（真实 client+server）自动化测试；框架执行游戏内场景断言并上报。
- 本仓库**没有任何 1.20.1 游戏测试接法**：注解名、测试类约定、Fabric 侧 run 配置、与 `gradle test` 的关系——一律不默写。
- 查证路径（按顺序）：
  1. `query_api`（约 1.16.5–1.20.4 覆盖范围内，1.20.1 可用）：按类名核 Vanilla 游戏测试相关类；`found:false` ≠ 不存在（索引覆盖/简名歧义）；
  2. `search_docs` / `search_fabric_docs`（1.20.1）→ 预期 DOC_NOT_FOUND（树空）；命中其它版本即视同不可用，禁止当 1.20.1；
  3. `search_community_docs`（社区实务知识，不代表 API 规范）；
  4. 官方文档站 https://docs.fabricmc.net/develop/automatic-testing 站内版本切换——以是否真出现 1.20.1 为准；无则在引用时标注「非本版」。

## 决策

```
IF 测纯逻辑 → Fabric Loader JUnit 思路（确切坐标以 query_api / community 复核）
IF 测玩法 → 先完成查证路径；未核到就停止输出方法名/示例代码
IF 需要签名 → 禁止用 1.21.x / 26.x 页改版本号冒充
```

## 快速入口

- 注册与生命周期：`mc-registry`、`01-registry.mdc`
- 数据与资源：`mc-datagen`、`mc-datapack`、`generate_*` MCP 工具
- 反模式：`fabric/1.20.1/knowledge/antipatterns/`

## 下一步

根据任务打开社区短文（遵守 `community_knowledge/AGENT_USAGE.md`）或改口 `search_community_docs` / `query_api`。
