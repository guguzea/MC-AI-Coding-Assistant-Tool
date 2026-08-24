---
name: mc-compat-jei
description: JEI/EMI 兼容层（构件核验白名单）。触发词：JEI、EMI、RecipeCategory、jei_plugins、EmiPlugin、IModPlugin
platform: forge
version: "1.19.4"
dependencies: []
---

> ⚠️ 本档内容经对应版本官方构件逐类核验（2026-08，用 mcp-server 自家 zip 读取 + 字节码解析）：只列构件中真实存在的接口名；签名以官方 wiki（github.com/mezz/JustEnoughItems/wiki）与工程实际依赖为准，禁止默写。
> 已移除的过时写法（请勿重新引入）：JEI ≤4.x 时代的 `@JEIPlugin` / `IModRegistry` / `registry.addRecipeCategories(...)` 组合在 1.13.2+ 不存在；EMI 侧勿使用未经构件核验的类名。

## Decision: 选择兼容方案

```
IF 配方已通过 DataGen / 数据包 JSON 定义
  → JEI 自动读取，无需额外代码（推荐）

IF 需要自定义配方 UI / 类别
  → @JeiPlugin + IModPlugin（registerCategories / registerRecipes）

IF 需要显示子类
  → registerCategories 内定义 IRecipeCategory
```

## 方案 A：JEI 自动读取（无代码，推荐）

配方放在 `data/{modid}/recipes/` 或 DataGen 输出目录，JEI 加载时自动发现。

## 方案 B：JEI 插件（构件核验签名）

- 注解：`@JeiPlugin`（`mezz/jei/api/JeiPlugin`）。
- 接口：`IModPlugin`（`mezz/jei/api/IModPlugin`）；方法族：`registerCategories(IRecipeCategoryRegistration)` / `registerRecipes(IRecipeRegistration)` / `registerRecipeCatalysts(IRecipeCatalystRegistration)` / `registerGuiHandlers(IGuiHandlerRegistration)` 等（同代方法族主体一致，个别年代新增方法——签名以工程实际依赖为准）。
- 类别：`IRecipeCategory`（`mezz/jei/api/recipe/category/`）、`IGuiHelper`（`mezz/jei/api/IGuiHelper`）。

## 常见错误

- ❌ JEI ≤4.x 的 `@JEIPlugin`/`IModRegistry` 组合（本年代不存在）
- ❌ JEI/EMI 侧未经构件核验的类名（含旧稿中出现的若干 EMI 拼写变体）
- ❌ 在服务端（`Dist.DEDICATED_SERVER`）注册 JEI
- ❌ 配方 JSON 放在错误路径（应在 `data/{modid}/recipes/`）

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | DataGen 生成的配方 JSON 自动被 JEI 读取，无需额外代码 |
| `mc-registry` | 自定义配方类需要注册表引用配方物品/方块 |
