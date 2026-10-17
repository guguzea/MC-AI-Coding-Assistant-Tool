---
name: mc-compat-jei
description: Fabric JEI/REI 兼容。REI（Roughly Enough Items）插件开发。触发词：JEI、REI、RoughlyEnoughItems、Plugin
platform: fabric
version: "1.20.4"
dependencies: []
mappings: yarn
---
<!-- external-apis: rei-plugin-api -->


# JEI / REI 兼容（Fabric 1.20.4）

## 概述

Fabric 主要使用 **REI（Roughly Enough Items）** 作为物品管理器。JEI 主要在 Forge 中使用。

## 添加 REI 依赖

```groovy
dependencies {
    modImplementation "com.github.shedaniel:RoughlyEnoughItems:9.1.618+1.20.4"
}
```

## 创建 REI 插件

**本档没有已核实的 REI 插件 API**：旧稿的 `REIPluginClient` / `RegisterClientPluginsEvent` 在已核实的 REI 构件（21.11.816 / 17.0.807）里 **0 命中**；本档同样 **未核实**。动手前必须让用户自备该版本 jar，走 `ingest_loader_api` 入库后逐签名回填。

现代 REI 的真实接口是 `me.shedaniel.rei.api.client.plugins.REIClientPlugin`，注册方法是 `registerEntries(EntryRegistry)`；入口键 `rei_client`。这套形状**不许**直接搬到本档，除非你已用该版本 jar 核实过。

```json
// fabric.mod.json（入口键按现代 REI 的 fabric.mod.json 逐字核实；旧档同键未核实）
{
  "entrypoints": {
    "rei_client": ["com.example.examplemod.MyModPlugin"]
  }
}
```

## 常见错误

- ❌JEI 在 Fabric 中不常用 — 使用 REI 代替
- ❌忘记在 `fabric.mod.json` 中注册 entrypoint

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | REI 显示已注册物品 |
| `mc-item` | 物品可以在 REI 中显示 |
