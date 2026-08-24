---
name: mc-compat-jei
description: JEI/EMI 兼容层（构件核验白名单）。触发词：JEI、EMI、RecipeCategory、jei_plugins、EmiPlugin、IModPlugin
platform: forge
version: "1.20.4"
dependencies: []
---

> ⚠️ 本档内容经对应版本官方构件逐类核验（2026-08，用 mcp-server 自家 zip 读取 + 字节码解析）：只列构件中真实存在的接口名；签名以官方 wiki（github.com/mezz/JustEnoughItems/wiki）与工程实际依赖为准，禁止默写。
> 已移除的过时写法（请勿重新引入）：JEI ≤4.x 时代的 `@JEIPlugin` / `IModRegistry` / `registry.addRecipeCategories(...)` 组合在 1.13.2+ 不存在；EMI 侧勿使用未经构件核验的类名。

> EMI 白名单（EMI 构件核验存在，具体用法以 github.com/emilyploszaj/emi 为准）：`EmiPlugin`、`EmiRegistry`、`EmiRecipe`、`BasicEmiRecipe`（均在 `dev/emi/emi/api/...`）。
> 注意 `EmiStackProvider` 类真实存在，但旧版本文档中的用法（作为 addRecipes 参数）未核验，不引用。

## Decision: 选择兼容方案

```
IF 配方已通过 DataGen 生成
  → JEI/EMI 自动读取 DataPack JSON，无需额外代码（推荐）

IF 需要自定义配方 UI（如 2x2 合成网格、多输入槽）
  → EMI：EmiPlugin + EmiRegistry（以官方 wiki 为准）
  → 或 JEI：@JeiPlugin + IModPlugin（registerCategories / registerRecipes）
```

## 方案 A：JEI/EMI 自动读取（无代码）

RecipeProvider 输出 `src/generated/resources/data/{modid}/recipes/` → 自动展示。

## 方案 B：JEI 插件（构件核验签名）

- 注解：`@JeiPlugin`（`mezz/jei/api/JeiPlugin`）。
- 接口：`IModPlugin`（`mezz/jei/api/IModPlugin`）；方法族：`registerCategories(IRecipeCategoryRegistration)` / `registerRecipes(IRecipeRegistration)` / `registerRecipeCatalysts(IRecipeCatalystRegistration)` / `registerGuiHandlers(IGuiHandlerRegistration)` 等（同代方法族主体一致，个别年代新增方法——签名以工程实际依赖为准）。
- 类别：`IRecipeCategory`（`mezz/jei/api/recipe/category/`）、`IGuiHelper`（`mezz/jei/api/IGuiHelper`）。

## 方案 C：EMI（仅列构件核验接口名）

- `EmiPlugin` / `EmiRegistry`（`dev/emi/emi/api/`）
- `EmiRecipe` / `BasicEmiRecipe`（`dev/emi/emi/api/recipe/`）
- 注册入口（fabric.mod.json 的 `emi:plugins` 等）与具体方法以官方 README / wiki 为准，本 Skill 不确定时不默写。

## 常见错误

- ❌ JEI/EMI 侧未经构件核验的类名（含旧稿中出现的若干拼写变体）
- ❌ 在服务端注册 JEI/EMI（必须客户端）
（EMI 无官方文档站，以 GitHub 仓库为准）

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | DataGen 生成的配方 JSON 自动被 JEI/EMI 读取 |
| `mc-registry` | 自定义配方类需要注册表引用配方物品/方块 |
