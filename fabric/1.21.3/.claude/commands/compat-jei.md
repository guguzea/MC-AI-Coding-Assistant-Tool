---
name: mc-compat-jei
description: Fabric JEI/REI 兼容。REI（Roughly Enough Items）插件开发。触发词：JEI、REI、RoughlyEnoughItems、Plugin
platform: fabric
version: "1.21.3"
dependencies: []
mappings: yarn
---

# JEI / REI 兼容（Fabric 1.21.3）

## 概述

Fabric 主要使用 **REI（Roughly Enough Items）** 作为物品管理器。JEI 主要在 Forge 中使用。

## 添加 REI 依赖

```groovy
repositories {
    maven { url "https://maven.shedaniel.me/" }   // REI 的 maven 坐标在这个仓库
}

dependencies {
    modImplementation "me.shedaniel:RoughlyEnoughItems-fabric:17.0.807"
}
```

> **坐标复核（读取日期 2026-09-13）**：原写 `com.github.shedaniel:RoughlyEnoughItems:9.1.618+1.20.1` —— 组名是 jitpack 形状、版本号属 1.20.1 档，与本档 MC 1.21.3 不匹配。现值：`curl -sS -o /dev/null -w '%{http_code}' https://maven.shedaniel.me/me/shedaniel/RoughlyEnoughItems-fabric/17.0.807/RoughlyEnoughItems-fabric-17.0.807.pom` → **200**；Modrinth `project/rei/version?game_versions=["1.21.3"]` 首条即 `17.0.807+fabric`。再次复核：`curl -sS "https://api.modrinth.com/v2/project/rei/version?limit=400"`。

## 创建 REI 插件

```java
// 1. 创建插件类
public class MyModPlugin implements REIPluginClient {
    @Override
    public void registerEntries(RegisterClientPluginsEvent event) {
        // 注册条目
    }
}
```

> **未核实**：`REIPluginClient` / `registerEntries(RegisterClientPluginsEvent)` 这组签名本轮未对上游 javadoc 复核（REI 的 API 站未取到；yarn 映射只覆盖原版类，帮不上）。本代理只改了坐标，**没有**据此改名；落地前请按 REI 官方文档复核插件接口与入口点键名。

```json
// fabric.mod.json
{
  "entrypoints": {
    "rei_client": ["com.example.examplemod.MyModPlugin"]
  },
  "depends": {
    "roughlyenoughitems": ">=17.0.807"
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
