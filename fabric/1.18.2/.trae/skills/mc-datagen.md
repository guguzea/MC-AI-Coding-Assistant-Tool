---
name: mc-datagen
description: Fabric 数据生成器。DataGeneratorEntrypoint、fabric-datagen、FabricRecipeProvider。触发词：DataGen、DataGenerator、ModelProvider、RecipeProvider
platform: fabric
version: "1.18.2"
dependencies: []
mappings: yarn
---

# 数据生成器（Fabric 1.18.2）

## 快速开始

```groovy
// build.gradle — 用完整 fabric-api，不要单独钉死 fabric-data-generation-api-v1 的假版本号
dependencies {
    modImplementation "net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}"
}
```

```java
public class ExampleModDataGenerator implements DataGeneratorEntrypoint {
    @Override
    public void onInitializeDataGenerator(FabricDataGenerator generator) {
        // 1.18.2 直接挂 generator：本档 FabricDataGenerator 上只有 addProvider，没有 createPack()/Pack
        generator.addProvider(MyRecipeProvider::new);
        generator.addProvider(MyModelProvider::new);
    }
}

// 下面两个是**你工程里的示例类**（本件声明，不是 Fabric API 的类）；完整写法见 mc-recipe / mc-model
abstract class MyRecipeProvider extends FabricRecipeProvider { }   // 骨架：需实现 generateRecipes
abstract class MyModelProvider extends FabricModelProvider { }     // 骨架：需实现两个 generate* 方法
```

```json
{
  "entrypoints": {
    "fabric-datagen": [
      "com.example.examplemod.ExampleModDataGenerator"
    ]
  }
}
```

完整 provider 示例见 `07-datagen.mdc`（模型 / 配方 / 掉落 / 语言 / 标签）。

## Decision: 选择生成内容

```
IF 生成模型 JSON
  → FabricModelProvider

IF 生成配方
  → FabricRecipeProvider

IF 生成战利品表
  → FabricBlockLootTableProvider

IF 生成语言文件
  → FabricLanguageProvider
```

1.18.2 用 `generator.addProvider`，没有 `createPack()`。

## 常见错误

- ❌ 忘记在 `fabric.mod.json` 中注册 `fabric-datagen` — DataGen 不执行
- ❌ 使用 `DataGeneratorInitializer` / `init_data`
- ❌ 手动编辑生成目录 — 文件会被重新生成覆盖
- ❌ 抄 Forge `ExistingFileHelper` 或编造 `offerShapedRecipe`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-item` | DataGen 生成物品模型 JSON |
| `mc-block` | DataGen 生成方块模型和掉落表 |
| `mc-entity` | DataGen 生成实体语言名和 loot table |
| `mc-registry` | DataGen 引用已注册的方块/物品/实体 |
