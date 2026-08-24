---
name: mc-compat-jei
description: Minecraft Forge JEI 1.12.2 兼容层（JEI 4.x 构件核验）。触发词：JEI、IModPlugin、IModRegistry、jei_plugins
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# JEI 兼容（Forge 1.12.2）

> 核验声明（2026-08）：本档接口名核验自 JEI 4.16.5.1029 构件（mezz/jei/api 顶层类 + IModPlugin/IModRegistry 方法签名逐类核对）。JEI 4.x 的注解拼写为大写 `@JEIPlugin`，与 5.x 起的 `@JeiPlugin` 不同——不要把本档写法抄给 1.13.2+。

## Decision: 选择兼容方案

```
IF 配方已通过 JSON 手动编写
  → JEI 自动读取 JSON，无需额外代码（推荐）

IF 需要自定义配方 UI / 类别
  → @JEIPlugin + IModPlugin.register(IModRegistry)

IF 需要自定义配方类型
  → IModRegistry.handleRecipes(...)（IRecipeWrapperFactory 形式）
```

## 方案 A：JEI 自动读取（JSON，无代码）

配方 JSON 放 `assets/{modid}/recipes/`（1.12.2 路径），JEI 自动发现。

## 方案 B：JEI 插件（4.x 构件核验签名）

- 注解：`@JEIPlugin`（`mezz/jei/api/JEIPlugin`）。
- 接口：`IModPlugin`——实现 `register(IModRegistry registry)`。
- `IModRegistry` 真实方法（核验自 4.16.5.1029）：`handleRecipes(Class, IRecipeWrapperFactory, String)`、`addRecipeCatalysts(Collection, Collection)` 等；签名以工程实际依赖为准。

```java
@JEIPlugin
public class MyJEIPlugin implements IModPlugin {
    @Override
    public void register(IModRegistry registry) {
        // 自定义配方处理器、隐藏配方等；具体方法以官方 wiki / 4.x 依赖为准
    }
}
```

## 常见错误

- ❌ 把它写成 5.x 的 `@JeiPlugin` + `registerCategories`（那是 JEI 5.x 起；1.12.2 的 JEI 4.x 不存在）
- ❌ 在服务端注册 JEI（JEI 只在客户端存在）
- ❌ 配方 JSON 放在错误路径（应为 `assets/{modid}/recipes/`）
- ❌ 忘记刷新 JEI 缓存

## 参考资料

- JEI GitHub：https://github.com/mezz/JustEnoughItems
- JEI Wiki：https://github.com/mezz/JustEnoughItems/wiki
