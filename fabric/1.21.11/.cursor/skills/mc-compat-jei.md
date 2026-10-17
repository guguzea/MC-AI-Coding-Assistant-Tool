---
name: mc-compat-jei
description: Fabric JEI/REI 兼容。REI（Roughly Enough Items）插件开发。触发词：JEI、REI、RoughlyEnoughItems、Plugin
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
---
<!-- external-apis: rei-plugin-api -->


# JEI / REI 兼容（Fabric 1.21.11）

## 概述

Fabric 主要使用 **REI（Roughly Enough Items）** 作为物品管理器。JEI 主要在 Forge 中使用。

## 添加 REI 依赖

```groovy
repositories {
    maven { url "https://maven.shedaniel.me/" }   // REI 的 maven 坐标在这个仓库
}

dependencies {
    modImplementation "me.shedaniel:RoughlyEnoughItems-fabric:21.11.816"
}
```

> **坐标复核**：原写 `com.github.shedaniel:RoughlyEnoughItems:16.0.762+1.21` —— 组名是 jitpack 形状、版本号属 1.21 档，与本档 MC 1.21.11 不匹配。现值：`curl -sS -o /dev/null -w '%{http_code}' https://maven.shedaniel.me/me/shedaniel/RoughlyEnoughItems-fabric/21.11.816/RoughlyEnoughItems-fabric-21.11.816.pom` → **200**；Modrinth `project/rei/version?game_versions=["1.21.11"]` 首条即 `21.11.816+fabric`。再次复核：`curl -sS "https://api.modrinth.com/v2/project/rei/version?limit=400"`。

## 创建 REI 插件

插件接口是 **`REIClientPlugin`**（`me.shedaniel.rei.api.client.plugins.REIClientPlugin`）；`REIPluginClient` / `RegisterClientPluginsEvent` 这两个名字在 `RoughlyEnoughItems-21.11.816-fabric.jar` 里 **0 命中**（已 javap 全 jar 清单核实）。

```java
package com.example.examplemod;

import me.shedaniel.rei.api.client.plugins.REIClientPlugin;
import me.shedaniel.rei.api.client.registry.entry.EntryRegistry;

public class MyModPlugin implements REIClientPlugin {
    @Override
    public void registerEntries(EntryRegistry registry) {
        // 注册/修改条目；不需要就留空
    }
}
```

- 接口方法全部是 `default`，只覆写用得到的（javap @ 21.11.816）：`registerCategories` / `registerDisplays` / `registerScreens` / `registerEntries` / `registerInputMethods`（参数各自是 REI 的注册表接口）。
- `registerEntries` 的参数是 REI 的条目注册表接口（**不是** `RegisterClientPluginsEvent`）；常用方法 `addEntry(EntryStack<?>)` / `addEntries(Collection)` / `removeEntry(EntryStack<?>)`。

```json
// fabric.mod.json
{
  "entrypoints": {
    "rei_client": ["com.example.examplemod.MyModPlugin"]
  },
  "depends": {
    "roughlyenoughitems": ">=21.11.816"
  }
}
```

- 入口点键 **`rei_client`** 已由 REI 自己的 `fabric.mod.json` 逐字证实（该文件里同一个键下挂着 `me.shedaniel.rei.plugin.client.DefaultClientPlugin` 等）；"客户端 + 通用" 另有 `rei_common`。

## 常见错误

- ❌JEI 在 Fabric 中不常用 — 使用 REI 代替
- ❌忘记在 `fabric.mod.json` 中注册 entrypoint
- ❌把插件接口写成 `REIPluginClient` / 方法参数写成 `RegisterClientPluginsEvent` — 这两个名字不存在

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | REI 显示已注册物品 |
| `mc-item` | 物品可以在 REI 中显示 |
