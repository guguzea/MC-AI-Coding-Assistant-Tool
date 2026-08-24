---
name: mc-compat-jei
description: Minecraft Forge JEI/EMI 1.18.2 兼容层（JEI 10.x 构件核验；EMI 类名以官方仓库为准）。触发词：JEI、EMI、IModPlugin、RecipeCategory
platform: forge
version: "1.18.2"
dependencies: []
mappings: mcp
---

# JEI/EMI 兼容（Forge 1.18.2）

> 核验声明（2026-08）：以下接口名全部来自对应 MC 版本的官方构件（Modrinth JEI/EMI/REI jar），用 mcp-server 自家 zip 读取 + 字节码解析逐类核对；签名细节以官方 wiki（github.com/mezz/JustEnoughItems/wiki、github.com/emilyploszaj/emi）与工程实际依赖为准，禁止默写。

## Decision: 选择兼容方案

```
IF 配方已通过 DataGen / 数据包 JSON 定义
  → 查看器自动读取，无需额外代码（推荐）

IF 需要自定义配方 UI / 类别
  → @JeiPlugin + IModPlugin（registerCategories / registerRecipes）

IF 需要显示子类
  → registerCategories 内定义 IRecipeCategory
```

## 方案 A：自动读取（无代码，推荐）

配方 JSON 位于 `data/{modid}/recipes/`（或 DataGen 输出目录）→ 加载时自动发现。

## 方案 B：查看器插件（构件核验签名）

- 注解：`@JeiPlugin`（`mezz/jei/api/JeiPlugin`）。
- 接口：`IModPlugin`（`mezz/jei/api/IModPlugin`）；方法族：`registerCategories(IRecipeCategoryRegistration)` / `registerRecipes(IRecipeRegistration)` / `registerRecipeCatalysts(IRecipeCatalystRegistration)` / `registerGuiHandlers(IGuiHandlerRegistration)` 等（版本间方法族主体一致，个别年代有增删——以工程实际依赖为准）。
- 类别：`IRecipeCategory`（`mezz/jei/api/recipe/category/`）、`IGuiHelper`（`mezz/jei/api/IGuiHelper`）。
- EMI：本档未核验 0.9.x 构件内的类名，具体 API 以 github.com/emilyploszaj/emi 为准（依赖坐标参考 `dev.emi:EMI:0.9.3+1.18.2` 属真实发布，但类名不默写）。

## 常见错误

- ❌ 把 1.13.2+（JEI 5.x+）写成 `@JEIPlugin` + `IModRegistry`（该组合仅 JEI 4.x 真实存在）
- ❌ 在服务端注册查看器类（必须客户端）
- ❌ 配方 JSON 放在错误路径（应在 `data/{modid}/recipes/`）


## 参考资料

- EMI GitHub：https://github.com/emilyploszaj/emi（EMI 作者为 emilyploszaj；EMI 文档以 GitHub 仓库 wiki 为准）
