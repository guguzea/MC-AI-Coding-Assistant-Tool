---
id: authored/soft-deps-modlist
title: 软依赖：ModList.isLoaded 与可选联动
tags: [soft-deps, modlist, interop, optional, mixin]
summary: 硬/软依赖区分；ModList 探测；类加载隔离；mods.toml optional；与 compileOnly/Mixin 条件注册配合。
sourceKind: authored
---

# 软依赖：ModList.isLoaded 与可选联动

自写短文。Gradle 侧见 `authored/cursemaven-optional-deps`。

## 硬依赖 vs 软依赖

| | 硬依赖 | 软依赖（可选联动） |
|--|--------|-------------------|
| 对方未装 | **不能**正常启动 | **可以**启动 |
| 声明 | `mods.toml` / `fabric.mod.json` 中 `mandatory=true`（或等价） | `mandatory=false` / optional，或仅文档说明 |
| 代码 | 可直接 import 对方 API | 运行时探测后再碰对方类型 |

## Forge：运行时探测

```java
if (ModList.get().isLoaded("othermod")) {
    OtherModCompat.init(); // 类里才引用 othermod 的类型
}
```

要点：

1. **`isLoaded` 的参数是对方 modId**（与对方 `mods.toml` 一致），不是显示名。  
2. 探测通过后再进入 **独立兼容类**（或反射），避免主类静态字段类型引用对方 → 对方不存在时 `NoClassDefFoundError`。  
3. 初始化时机：常在 `FMLCommonSetupEvent` / 模组构造之后、对方已进入加载列表时；过早可能误判。  
4. Mixin：目标类可能不存在时，用配置侧条件或拆分 mixin 配置，避免硬挂死。

## mods.toml 声明（建议）

即使是软依赖，也建议写 optional 依赖并给出 `versionRange`，让加载器与用户看清「推荐版本」：

```toml
[[dependencies.examplemod]]
modId = "othermod"
mandatory = false
versionRange = "[1.0,)"
ordering = "NONE"
side = "BOTH"
```

硬前置（Forge / Minecraft / 必装库）保持 `mandatory = true`。

## 常见错误

- 在静态初始化里 `OtherModItems.FOO.get()`。  
- 只写了代码探测，没在发布页说明「可选安装 XXX」。  
- 对方版本不对仍 `isLoaded==true`，随后 API 不兼容 → 要有 try/catch 或版本检查并打日志。  
- 服务端不装、客户端装（或相反）导致不一致 — `side` 与文档写清楚。

## 自检

- 卸掉可选模组：能进主菜单、无堆栈。  
- 装上兼容版本：联动功能开启且有日志。  
- 装上过旧版本：失败可见（日志），而非随机 NPE。

## 不清楚时

- Gradle 侧：`authored/cursemaven-optional-deps`  
- 原文维护向：https://www.mcmod.cn/post/3993.html  
- API：`search_forge_docs`（ModList、依赖声明）
