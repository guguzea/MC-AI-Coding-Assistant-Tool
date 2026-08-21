---
name: mc-datagen
description: Forge 1.13.2 数据以手写 JSON 为主。触发词：DataGen、DataGenerator、数据包、资源包、recipes、loot_tables
---

# 数据生成器（Forge 1.13.2）

## 快速开始

本版 DataGen 很早。**推荐手写 JSON** 到 `src/main/resources/data/{modid}/` 与 `assets/{modid}/`。

不要 `PackOutput`、`generator.getOutput()`、`ShapedRecipes` / `ShapedRecipesBuilder` 假类。

## Decision: 选择 Provider

| 数据类型 | 做法 |
|----------|------|
| 配方 / 掉落 / 模型 / 语言 | 手写 JSON |
| 若已接 GatherDataEvent | `addProvider(IDataProvider)`，对照 1.14.4 |

## 常见错误

- ❌ 抄 1.20 `PackOutput`
- ❌ 1.12 的 recipes 仍放在 `assets/`

## 参考资料

- 参见 `07-datagen.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 注册完成后方可生成对应标签和配方 |
| `mc-compat-jei` | DataGen 生成的配方自动被 JEI/EMI 读取 |
