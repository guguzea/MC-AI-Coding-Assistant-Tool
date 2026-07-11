---
name: mc-compat-jei
description: Forge 1.12.2 JEI compat skill (JEI API, IRecipeHandler)
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# JEI 兼容（Forge 1.12.2）

## Decision: 选择兼容方案

```
IF 配方已通过 JSON 手动编写
  → JEI 自动读取 JSON，无需额外代码

IF 需要自定义配方 UI（如自定义工作台）
  → 使用 JEI IRecipeHandler API

IF 需要显示子类（sub-categories）
  → 使用 JEI CategoryExtension
```

## 方案 A：JEI 自动读取（JSON，无代码，最佳）

只要配方通过 JSON 文件放在 `assets/{modid}/recipes/`，JEI 会自动发现并显示，**无需任何 JEI 代码**。

## 方案 B：JEI 插件注册

### 添加 JEI 依赖

```groovy
dependencies {
    compile('mezz.jei:jei:1.12.2-4.16.1.302@jar') {
        transitive = false
    }
}
```

### 注册 JEI 插件

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class JEIPlugin {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<IRecipeHandler>> event) {
        // 注册自定义配方处理器
    }

    @SubscribeEvent
    public static void registerCategories(RegistryEvent.Register<IRecipeCategory>> event) {
        // 注册自定义配方分类
    }
}
```

## 常见错误

- ❌ 在服务端注册 JEI → JEI 只在客户端存在
- ❌ 配方 JSON 放在错误路径 → 应在 `assets/{modid}/recipes/`
- ❌ 忘记刷新 JEI 缓存

## Key Forge 1.12.2 Specs

- JEI 1.12.2 version: 4.16.1.302
- IRecipeHandler API
- IRecipeCategory API
- JEI only runs on client
- Recipe files in assets/{modid}/recipes/
