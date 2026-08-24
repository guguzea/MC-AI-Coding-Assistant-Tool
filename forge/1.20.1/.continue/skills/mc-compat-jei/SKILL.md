---
name: mc-compat-jei
description: JEI/EMI/REI 配方查看器插件集成。触发词：JEI、EMI、REI、配方显示、RecipeCategory、jei_plugins、EmiPlugin、REIClientPlugin、配方查看器、软依赖
platforms: [fabric, forge, neoforge]
mcVersions: ["1.20.1+"]
communityDocId: authored/library-integration-jei-emi
mappings: hint
---

# JEI / EMI / REI 配方查看器集成

三库都是软依赖（装了才显示配方界面），Fabric / Forge / NeoForge 均有构建。版本与注册 API 以各自官方仓库为准，不写死签名。

## Decision: 集成方案

```
IF 配方已通过 DataGen 生成到 data/<modid>/recipes/*.json
  → 零插件代码，三查看器自动显示（首选路径）
IF 需要自定义分类 / 隐藏条目 / 特殊展示
  → 新模组优先 JEI + EMI 双插件
  → 1.20.x 及更老以 JEI 为主；NeoForge 1.21+ 生态 EMI 渗透率上升，EMI 与 JEI 平级
IF 用户问要不要写 REI 插件
  → 通常不需要：REI 的 JEI 插件兼容层可直接跑 JEI 插件
  → 若 REI 与 JEI 同装，注意插件别被两边重复注册
```

## 每加载器声明（软依赖）

- Fabric：`fabric.mod.json` 用 `suggests`（写进 `depends` 会让玩家缺库进不了游戏），modId：JEI=`jei`、EMI=`emi`、REI=`roughlyenoughitems`；开发依赖 `compileOnly` + `runtimeOnly` 自测
- Forge / NeoForge：`mods.toml` / `neoforge.mods.toml` 写 optional 依赖；Gradle 坐标按官方 README 分 artifact（Forge/Neo 与 Fabric 不同），以官方为准
- 兼容入口只在客户端：Forge/Neo 用 `Dist.CLIENT` 门闩 + client 包；Fabric/Quilt 用 client 源集 + `@Environment(EnvType.CLIENT)` / Loom split sources；服务端禁止引用查看器类

## 集成要点

- 自定义展示：JEI 实现 `IModPlugin`（@JeiPlugin 注解），EMI 实现 `EmiPlugin` 在 register 回调加分类，REI 实现 `REIClientPlugin`；接口名以官方文档为准
- 1.21.2+ / 26.x：JEI 服务端也需安装以同步配方，只装客户端会出现配方缺失
- DataGen 已覆盖的配方不要重复注册，避免条目重复

## 官方文档

- JEI：https://github.com/mezz/JustEnoughItems
- EMI：https://github.com/emilyploszaj/emi 
- REI：https://github.com/shedaniel/RoughlyEnoughItems

## 常见错误

- 服务端注册查看器类 → 专用服崩溃
- 配方 JSON 在 src/main/resources 但从未 runData，IDE 有文件、游戏里没有
- 主类 static 字段直接引用查看器类型 → 未装时 NoClassDefFoundError
- 只 compileOnly 却当硬依赖用，从不 isLoaded 门闩
- 1.21.2+ 只在客户端装 JEI（服务端配方同步缺失）
- REI 与 JEI 同装时插件重复注册，出现条目重复

## 相关

- 短文：`authored/library-integration-jei-emi`、`authored/library-integration`
- MCP：`search_community_docs`、`check_dependencies`、`generate_datagen`
- 联动 skill：`mc-datagen`（配方 JSON 生成）、`mc-recipe`
