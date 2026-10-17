---
name: mc-compat-jei
description: Fabric JEI/REI 兼容。REI（Roughly Enough Items）插件开发。触发词：JEI、REI、RoughlyEnoughItems、Plugin
platform: fabric
version: "1.14.4"
dependencies: []
mappings: yarn
---
<!-- external-apis: rei-plugin-api -->


# JEI / REI 兼容（Fabric 1.14.4）

## 概述

Fabric 主要使用 **REI（Roughly Enough Items）** 作为物品管理器。JEI 主要在 Forge 中使用。

**本档没有已核实的 REI 坐标与插件 API**：`maven.shedaniel.me` 的 `RoughlyEnoughItems-fabric/maven-metadata.xml` 最低版本是 `6.0.277-alpha`，没有 1.14.4 档的构件可取证。⇒ 本档不提供可抄的插件代码；动手前必须让用户自备该版本 jar，走 `ingest_loader_api` 入库后逐签名回填。

## 添加 REI 依赖

```groovy
dependencies {
    modImplementation "com.github.shedaniel:RoughlyEnoughItems:TODO(未核实)" // 本档无已核实坐标：REI 从 6.0.277-alpha 起才有构件，属更高 MC 线；禁止抄别的版本档
}
```

## 本档禁止默写

- 本档没有可抄的 REI 插件类：插件接口名、注册方法名、参数类型都必须先有该版本 jar 的 javap 或 `ingest_loader_api` 摘要。
- 旧稿里的 `REIPluginClient` / `RegisterClientPluginsEvent` 在已核实的 REI 构件（如 21.11.816）里 **0 命中**，本档同样 **未核实**，不要写。
- 现代 REI 的真实接口是 `me.shedaniel.rei.api.client.plugins.REIClientPlugin`，入口键为 `rei_client`；但这套形状来自较高版本，**不许**直接搬到 1.14.4。

## 常见错误

- ❌JEI 在 Fabric 中不常用 — 使用 REI 代替
- ❌忘记在 `fabric.mod.json` 中注册 entrypoint

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | REI 显示已注册物品 |
| `mc-item` | 物品可以在 REI 中显示 |
