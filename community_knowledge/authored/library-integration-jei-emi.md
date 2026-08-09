---
id: authored/library-integration-jei-emi
title: JEI / EMI 软依赖接入要点
tags: [jei, emi, interop, optional, client, datagen, forge]
summary: DataGen 配方常零代码；软依赖 Gradle；Dist.CLIENT 注册；自定义分类再查官方；与 library-integration 总清单配合。
mcHint: 1.20.1+ Forge
sourceKind: authored
---

# JEI / EMI 软依赖接入要点

自写短文。JEI/EMI 版本与注册 API 以**当前 jar 对应官方文档**为准；写插件前请打开 [JEI](https://github.com/mezz/JustEnoughItems) / [EMI](https://github.com/emilyploszaj/emi) 说明。

## 最常见路径：零 JEI 代码

配方若已通过 DataGen 写到 `data/<modid>/recipes/*.json`，JEI 与 EMI 在客户端加载数据包时会**自动展示**，通常**不需要**写 `IRecipeCategory` 一类旧 API。

检查：

1. `runData` / CI 已生成 JSON  
2. 路径与命名空间正确（`modid:path`）  
3. 开发环境用 `runtimeOnly` 装 JEI/EMI 自测即可  

联动 Skill：`mc-datagen`、`mc-compat-jei`。

## Gradle（软依赖）

与 `authored/library-integration`、`authored/cursemaven-optional-deps` 一致：

- 编译期：`compileOnly fg.deobf('…jei…')` 或 EMI 坐标（按官方 README）  
- 本地游玩：`runtimeOnly` 完整模组  
- 发布：mods.toml 中 JEI/EMI 为 **optional**；jar 不捆绑对方  

## 运行时门闩

```java
// 示例：仅在 JEI 存在时注册客户端兼容
if (ModList.get().isLoaded("jei")) {
    DistExecutor.unsafeRunWhenOn(Dist.CLIENT, () -> () -> JeiClientCompat.init());
}
```

`JeiClientCompat` 放在 `client` 包，内部才 `import mezz.jei…`。

EMI 的 modId 以对方 `mods.toml` 为准（常见为 `emi`）；探测用 `ModList.get().isLoaded("emi")`。

## 何时才写插件代码

| 需求 | 方向 |
|------|------|
| 只展示合成/熔炼等数据包配方 | 优先 DataGen，无代码 |
| 隐藏/移动配方分类 | 查当前版本 JEI/EMI 的**客户端**插件事件（名称以官方为准） |
| 多输入槽、流体、自定义进度条 UI | EMI 或 JEI 现代扩展 API；先读官方示例再写 |

禁止：照搬已废弃的 `IRecipeWrapper` / 旧版 Category 教程而不核对版本。

## 常见错误

- 在服务端注册 JEI 类 → 专用服或逻辑服崩溃  
- 配方 JSON 在 `src/main/resources` 但从未 runData，IDE 里「有文件」、游戏里却没有  
- 主类 static 引用 JEI 类型 → 未装 JEI 时 `NoClassDefFoundError`（应用 `modlist-compat-gate` 模式）  
- 只 compileOnly 却在代码里当硬依赖用，从不 `isLoaded`  

## 自检

- 无 JEI/EMI：模组正常进世界，合成表仍可通过原版书查看你的数据包配方（若已生成）  
- 有 JEI/EMI：配方出现在对应界面；流体/自定义类无红字日志  
- `runServer` 不加载 JEI 相关类  

## 不清楚时

- 总清单：`authored/library-integration`  
- 官方 / Wiki：`search_forge_docs` 查不到 JEI 细节时，打开 JEI/EMI GitHub 与 `mc-compat-jei` Skill  
- `community_knowledge/AGENT_USAGE.md`
