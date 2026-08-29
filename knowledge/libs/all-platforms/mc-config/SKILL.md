---
name: mc-config
description: 配置库选型总纲。触发词：配置、config、ConfigScreen、ForgeConfigSpec、Cloth、YACL、Fzzy、owo-config、配置界面、ConfigBuilder、Mod Menu
platforms: [fabric, forge, neoforge]
mcVersions: ["1.14-26.2"]
communityDocId: authored/lib-cloth-config
---

# 配置库选型总纲

先定"要不要 GUI 配置界面"，再按平台和版本选库。库的接入细节读对应 skill 源稿（mc-yacl / mc-owo）。

## Decision: 选哪个配置方案

```
IF 单平台 Forge 1.20.1 / NeoForge 1.20.1 且只做服务端配置
  → ForgeConfigSpec（原版能力，零第三方依赖）
IF 单平台 NeoForge ≥1.20.4 且只做服务端配置
  → ModConfigSpec
IF 需要客户端配置 GUI：
  → 新项目 / 长期维护 → YACL（1.19-26.3，F/Forge/Neo/Quilt）优先
     → 或 Fzzy Config（1.20.1-26.2，自动 GUI、强校验、服务端-客户端同步）
  → 已在 REI / Kiwi 生态，只需现成 API → Cloth Config（1.14-26.2，已冷冻，别期待新特性）
  → Fabric / NeoForge / Quilt 且想要注解式 + 自动 GUI + 同步 → owo-config（⚠️ 无 Forge）
IF MC 版本在 YACL 窗口外（< 1.19）
  → 回退 Cloth Config
```

## 硬 / 软依赖与类加载隔离

- GUI 库一律软依赖：主代码 `compileOnly`，开发自测加 `runtimeOnly`；`fabric.mod.json` 用 `suggests`，`mods.toml` 用 optional
- Screen 构建只在客户端触发：Forge/Neo 用 `Dist.CLIENT` 门闩；Fabric/Quilt 用 client 源集 + `@Environment(EnvType.CLIENT)` / Loom split sources；Screen 类放 client 包，公共代码只留「打开配置屏」的客户端门闩
- 未装库时模组必须正常进游戏（不加载库类，无 NoClassDefFoundError）
- Fabric 用 Mod Menu 软依赖挂「Config」按钮（modId `modmenu`）；Forge / Neo 自建按钮或 ModMenuPort

## 配置持有纪律

- 配置数据由你自己的 POJO + 序列化持有，GUI 库只做界面桥
- 禁止双份配置：ForgeConfigSpec 与 GUI 库各存一份会互相覆盖，选一个数据源

## 官方文档

- Cloth Config：https://github.com/shedaniel/cloth-config
- YACL：https://github.com/isXander/YetAnotherConfigLib
- Fzzy Config：https://github.com/Fuzss/fzzy-config
- owo-config：https://docs.wispforest.io/

## 常见错误

- Screen 类被公共 / 服务端代码引用 → 专用服崩溃
- 双份配置（ForgeConfigSpec + GUI 库各一份）互相覆盖
- 只 compileOnly 却当硬依赖用，未装库时 NoClassDefFoundError
- 期待 Cloth 加新特性（已冷冻，需求不满足时换 YACL / Fzzy）
- owo-config 用在纯 Forge 项目（无 Forge 构建）

## 相关

- 短文：`authored/lib-cloth-config`、`authored/lib-yacl`、`authored/lib-owo`、`authored/library-integration`
- Skill：`mc-yacl`、`mc-owo`；patterns `config-spec`
- MCP：`generate_config`、`check_dependencies`、`search_community_docs`
