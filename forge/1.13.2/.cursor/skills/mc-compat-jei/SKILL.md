---
name: mc-compat-jei
description: Minecraft Forge JEI 兼容层。让 JEI 自动读取配方。触发词：JEI、RecipeCategory、jei_plugins
---

# JEI 兼容（Forge 1.13.2）

## Decision: 选择兼容方案

```
IF 配方已通过 JSON 文件定义
  → JEI 自动读取，无需额外代码（推荐）

IF 需要自定义配方 UI
  → @JEIPlugin + IModPlugin
```

## JEI 自动读取

只要配方放在 `data/{modid}/recipes/`，JEI 会在游戏加载时自动发现并显示。

## JEI 插件

```java
@JEIPlugin
public class MyJEIPlugin implements IModPlugin {
    @Override
    public void register(IModRegistry registry) {
        // 自定义配方类别、处理器
    }
}
```

## 常见错误

- ❌ `RegistryEvent.NewRegistry` / `onJEIInit` — JEI 用 `@JEIPlugin` + `IModPlugin`
- ❌ 在服务端（`Dist.DEDICATED_SERVER`）注册 JEI
- ❌ 配方 JSON 放在错误路径

## 参考资料

- JEI Wiki：https://github.com/mezz/JustEnoughItems/wiki
