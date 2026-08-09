---
id: authored/library-integration
title: 第三方库接入清单（Gradle → 运行时）
tags: [interop, optional, gradle, modlist, dist, forge, library]
summary: 硬/软依赖；Gradle 配置与 mods.toml；客户端专用 API；兼容类隔离；与 cursemaven、ModList 短文配合。
mcHint: 1.20.1+ Forge 为主
sourceKind: authored
---

# 第三方库接入清单（Gradle → 运行时）

自写短文。具体坐标、类名、事件名以**库官方文档**与当前 MC 版本为准；下文是工程化检查顺序。

## Decision：怎么接

```
IF 玩家不装该库就不能玩
  → 硬依赖：implementation + mods.toml mandatory=true

IF 装了才多一块功能（JEI、Curios、GeckoLib…）
  → 软依赖：compileOnly（或开发用 runtimeOnly 自测）+ ModList 门闩 + optional 声明
  → 详见 authored/soft-deps-modlist、authored/cursemaven-optional-deps

IF API 只在客户端存在（JEI/EMI、部分渲染库）
  → 兼容代码放 client 包；订阅事件带 Dist.CLIENT；禁止服务端类路径直接引用
```

## Gradle 侧（顺序）

1. **仓库**：官方 Maven > 作者自建 > CurseMaven（见 `authored/cursemaven-optional-deps`）。  
2. **配置**：  
   - 硬依赖：`implementation` + 常用 `fg.deobf(...)`（Forge 开发环境）。  
   - 软依赖：主代码用 `compileOnly`；本地跑游戏可加 `runtimeOnly` 完整 jar。  
3. **含 Mixin 的库**：确认对方 dev 说明；你的工程 mixin 插件与 refmap 已就绪，否则运行期注入失败。  
4. **刷新**：改依赖后 reimport / `--refresh-dependencies`；勿把 `run/mods` 手塞 jar 当长期方案（见 `authored/forge-dev-env-pitfalls`）。

## mods.toml 对齐

| 类型 | mandatory | 说明 |
|------|-----------|------|
| Forge / MC | true | 版本范围与 Gradle 一致 |
| 必装库 | true | 缺了应明确失败 |
| 可选联动 | false | 写清 modId 与推荐 versionRange |

发布页/README 也要写「可选：XXX」，避免用户只看你 jar 不知道要装什么。

## 代码侧：类加载隔离

软依赖**禁止**在主类或 `init` 的静态字段里直接 `import` 对方类型。

推荐：

```java
if (ModList.get().isLoaded("jei")) {
    JeiCompat.register(); // 独立类，内部才引用 JEI API
}
```

`JeiCompat` 整类仅在 `isLoaded` 为真时才会被加载；构造里再 `enqueueWork` 注册插件。

## 客户端 / 服务端

- 注册 JEI、EMI、Screen、模型动画渲染等 → **仅客户端**（`Dist.CLIENT`、`@OnlyIn`、client 源集）。  
- 专用服崩溃且堆栈出现 JEI/Screen → 先查是否把客户端兼容类打进了共通代码路径。

## 版本与映射

- 库版本必须匹配 **MC + 加载器**（Forge 47.x 对应 1.20.1 等）。  
- 你项目用 MCP/Parchment 时，库 jar 已是开发映射；混用 Yarn 工程不要直接抄 Forge 片段。  
- API 不确定 → `search_forge_docs` / 库 GitHub Wiki，**不要**凭社区短文硬编方法名。

## 自检清单

- [ ] 卸掉可选库：能进游戏，无 `NoClassDefFoundError`  
- [ ] 装上推荐版本：联动功能可用  
- [ ] `runServer` 与 `runClient` 行为符合 `side` 设计  
- [ ] mods.toml、Curse/Modrinth 依赖声明、README 三处一致  

## 专题短文

| 库 | 短文 |
|----|------|
| JEI / EMI | `authored/library-integration-jei-emi` |
| Gradle 坐标 | `authored/cursemaven-optional-deps` |
| 运行时探测 | `authored/soft-deps-modlist` |

## 不清楚时

- Skill：`mc-compat-jei`、`mc-curios`、`mc-geckolib`（骨架 + 指向官方）  
- `community_knowledge/AGENT_USAGE.md`：短文不能替代 API 查询
