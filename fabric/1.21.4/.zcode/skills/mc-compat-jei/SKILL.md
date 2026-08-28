[DONOR_SKILL 禁止直接抄写]
本 Skill 正文来自 fabric/1.21.4，仅作结构/流程提示，不是 1.21.4 官方 API。不得直接使用 donor 正文里的类名/方法。先 search_fabric_docs(version=1.21.4) 核对类名/方法签名（不要用 version=1.21.3），对不上就改口官方文档、禁止照抄。Yarn 档互捐，禁止把 26.1.2 mojmap 当本档。

---

---
name: mc-compat-jei
description: Fabric JEI/REI 兼容。REI（Roughly Enough Items）插件开发。触发词：JEI、REI、RoughlyEnoughItems、Plugin
platform: fabric
version: "1.21.4"
dependencies: []
mappings: yarn
---

# JEI / REI 兼容（Fabric 1.21.4）

## 概述

Fabric 主要使用 **REI（Roughly Enough Items）** 作为物品管理器。JEI 主要在 Forge 中使用。

## 添加 REI 依赖

```groovy
dependencies {
    modImplementation "com.github.shedaniel:RoughlyEnoughItems:9.1.618+1.20.1"
}
```

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

```json
// fabric.mod.json
{
  "entrypoints": {
    "rei_client": ["com.example.examplemod.MyModPlugin"]
  },
  "depends": {
    "roughlyenoughitems": ">=9.1.618"
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
