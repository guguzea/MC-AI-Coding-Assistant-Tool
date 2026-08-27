---
id: authored/library-integration
title: 第三方库接入清单（Gradle → 运行时）
tags: [interop, optional, gradle, modlist, dist, forge, fabric, neoforge, library, api]
summary: 硬/软依赖；Gradle 配置与 mods.toml / fabric.mod.json 声明；客户端专用 API；兼容类隔离；配方查看器与 lib-* 专题索引。
mcHint: 1.20.1+ / 1.21+ / 26.x；F/Forge/Neo
loaders: [fabric, forge, neoforge]
role: api
sourceKind: authored
---

# 第三方库接入清单（Gradle → 运行时）

自写短文。具体坐标、类名、事件名以**库官方文档**与当前 MC 版本为准；下文是工程化检查顺序。
## 何时用
需要给模组接**配方查看器/显示插件**（JEI / EMI / REI）、配置屏、动画、饰品、世界生成等第三方库时；各库细节走「专题短文」表的 lib-* 篇。

## 集成总决策
- 新模组接配方显示：**优先同时写 JEI + EMI 插件**（《社区常用库模组全览 2026 版》建议）；NeoForge 1.21+ 生态 **EMI 渗透率持续上升**，新项目把 EMI 与 JEI 平级对待；1.20.x 及更老以 JEI 为主。
- REI 可与 JEI 同装（互不排斥），一般无需单独写 REI 插件（其 JEI 插件兼容层可复用），详见 `authored/library-integration-jei-emi`。
## Decision：怎么接

```
IF 玩家不装该库就不能玩
  → 硬依赖：implementation + mods.toml mandatory=true / fabric.mod.json depends
IF 装了才多一块功能（JEI、Curios、GeckoLib…）
  → 软依赖：compileOnly（或开发用 runtimeOnly 自测）+ ModList 门闩 + optional / suggests 声明
  → 详见 authored/soft-deps-modlist、authored/cursemaven-optional-deps
IF API 只在客户端存在（JEI/EMI、部分渲染库）
  → 兼容代码放 client 包；Forge/Neo 订阅事件带 Dist.CLIENT；Fabric/Quilt 用 client 源集 + @Environment(EnvType.CLIENT) / Loom split sources；禁止服务端类路径直接引用
```

## Gradle 侧（顺序）
1. **仓库**：官方 Maven > 作者自建 > CurseMaven（见 `authored/cursemaven-optional-deps`）。
2. **配置**：硬依赖 `implementation` + 常用 `fg.deobf(...)`（Forge 开发环境）；软依赖主代码 `compileOnly`，本地跑游戏可加 `runtimeOnly` 完整 jar。
3. **含 Mixin 的库**：确认对方 dev 说明；你的工程 mixin 插件与 refmap 已就绪，否则运行期注入失败。
4. **刷新**：改依赖后 reimport / `--refresh-dependencies`；勿把 `run/mods` 手塞 jar 当长期方案（见 `authored/forge-dev-env-pitfalls`）。

## 元数据声明对齐
Forge / NeoForge（`mods.toml`）：

| 类型 | mandatory | 说明 |
|------|-----------|------|
| Forge / MC | true | 版本范围与 Gradle 一致 |
| 必装库 | true | 缺了应明确失败 |
| 可选联动 | false | 写清 modId 与推荐 versionRange |

Fabric（`fabric.mod.json`）不要只抄 mods.toml 的习惯：
```json
"depends":  { "cloth-config": ">=11.0.0" },  // 硬依赖，缺失直接拒绝加载
"suggests": { "jei": "*", "emi": "*" }        // 软依赖，缺失仅提示
```
- `depends` 是硬性必需；**软依赖写 `suggests`**（可选提示），误写进 `depends` 会让玩家缺库直接进不了游戏。
- 兼容入口可走 `entrypoints`（如 `client`）或代码内 `FabricLoader` / `ModList` 门闩，见 `authored/soft-deps-modlist`。

## 代码侧：类加载隔离
软依赖**禁止**在主类或 `init` 的静态字段里直接 `import` 对方类型。
```java
if (ModList.get().isLoaded("jei")) {
    JeiCompat.register(); // 独立类，内部才引用 JEI API
}
```
`JeiCompat` 整类仅在 `isLoaded` 为真时才会被加载；构造里再 `enqueueWork` 注册插件。

## 客户端 / 服务端
注册 JEI、EMI、REI、Screen、模型动画渲染等 → **仅客户端**（Forge/Neo：`Dist.CLIENT`、`@OnlyIn`；Fabric/Quilt：client 源集 + `@Environment(EnvType.CLIENT)` / Loom split sources）；专用服崩溃且堆栈出现 JEI/Screen → 先查是否把客户端兼容类打进了共通代码路径。

## 版本与映射
- 库版本必须匹配 **MC + 加载器**（Forge 47.x 对应 1.20.1 等）；你项目用 MCP/Parchment 时库 jar 已是开发映射，混用 Yarn 工程不要直接抄 Forge 片段。
- API 不确定 → `search_forge_docs` / 库 GitHub Wiki，**不要**凭社区短文硬编方法名。

## 自检清单
- [ ] 卸掉可选库：能进游戏，无 `NoClassDefFoundError`
- [ ] 装上推荐版本：联动功能可用
- [ ] `runServer` 与 `runClient` 行为符合 `side` 设计
- [ ] mods.toml / fabric.mod.json、Curse/Modrinth 依赖声明、README 三处一致
## 专题短文（lib-* 分类索引）
| 分类 | 库 | 短文 |
|------|-----|------|
| 配方查看器 | JEI / EMI / REI | `authored/library-integration-jei-emi` |
| 配置 | Cloth Config | `authored/lib-cloth-config` |
| 配置 | YACL | `authored/lib-yacl` |
| 动画 | GeckoLib | `authored/lib-geckolib` |
| 跨加载器 | Architectury | `authored/lib-architectury` |
| 饰品 | Curios | `authored/lib-curios` |
| 饰品 | Trinkets（Fabric） | `authored/lib-trinkets` |
| 世界生成 | TerraBlender | `authored/lib-terrablender` |
| GUI | owo-lib（含 UI） | `authored/lib-owo` |
| 指南书 | Patchouli | `authored/lib-patchouli` |
| 数据附加 | CCA（Cardinal Components） | `authored/lib-cca` |
| 服务端网络文本 | Polymer（服务端驱动显示） | `authored/lib-polymer` |
| 脚本语言 | KubeJS | `authored/lib-kubejs` |
| 版本陷阱 | 冻结 / 活跃窗口 | `authored/lib-traps-2026` |
| Gradle 坐标 | CurseMaven 等 | `authored/cursemaven-optional-deps` |
| 运行时探测 | ModList / Loader 门闩 | `authored/soft-deps-modlist` |
上表短文均已建成；不清楚方法名时回官方文档 / `search_community_docs`。
## 不清楚时
- Skill：`mc-compat-jei`、`mc-curios`、`mc-geckolib`（骨架 + 指向官方）
- `community_knowledge/AGENT_USAGE.md`：短文不能替代 API 查询
