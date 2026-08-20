---
name: mc-datagen
description: Fabric 26.1.2 数据生成。DataGeneratorEntrypoint、FabricRecipeProvider.createRecipeProvider。触发词：DataGen、DataGenerator、RecipeProvider
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---

# DataGen（Fabric 26.1.2）

## 快速开始

- 入口：`DataGeneratorEntrypoint` + `fabric.mod.json` 的 `fabric-datagen`
- **禁止** `DataGeneratorInitializer` / `init_data`
- 配方：`createRecipeProvider` → 内部 `RecipeProvider.buildRecipes()`
- 掉落：`FabricBlockLootSubProvider.generate()` + `dropSelf`
- 完整示例见 `07-datagen.mdc`

```groovy
fabricApi {
    configureDataGeneration()
}
// build.gradle — 用完整 fabric-api，不要单独钉死 fabric-datagen-api-v0 的假版本号
dependencies {
    implementation "net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}"
}
```

## Decision: 选择生成内容

```
IF 配方 → FabricRecipeProvider.createRecipeProvider
IF 方块掉落 → FabricBlockLootSubProvider
IF 语言 → FabricLanguageProvider
```

## 常见错误

- ❌ Yarn 名字（`ShapedRecipeJsonBuilder` / `addDrop`）
- ❌ `ExistingFileHelper` / `init_data`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-item` | DataGen 生成物品模型 JSON |
| `mc-block` | DataGen 生成方块模型和掉落表 |
| `mc-entity` | DataGen 生成实体语言名和 loot table |
| `mc-registry` | DataGen 引用已注册的方块/物品/实体 |
