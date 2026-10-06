---
name: mc-datagen
description: Fabric 数据生成器。DataGeneratorEntrypoint、fabric-datagen、FabricRecipeProvider。触发词：DataGen、DataGenerator、ModelProvider、RecipeProvider
platform: fabric
version: "1.21.3"
dependencies: []
mappings: yarn
---

# 数据生成器（Fabric 1.21.3）

## 快速开始

```groovy
// 下面两行是 fabric-loom 的 Gradle DSL，不是 MC / Fabric API 的 Java API（类名门对它无管辖权）。
// 本档语料没有 docs 正文逐字命中它；官方逐字写法在 fabric-docs 1.21.4+ 的 develop_loom_fabric-api 页。
// 本档 scaffold 钉 fabric-loom 1.8.13（fabric/1.21.3/scaffold/build.gradle:12），仍请按你工程实际 loom 版本核对。
fabricApi {                     // Gradle DSL ⇒ 本档语料没有逐字出处
    configureDataGeneration()   // 同上：Gradle DSL，本档语料同样没有出处
}
// build.gradle — 用完整 fabric-api，不要单独钉死 fabric-data-generation-api-v1 的假版本号
dependencies {
    modImplementation "net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}"
}
```

```java
public class ExampleModDataGenerator implements DataGeneratorEntrypoint {
    @Override
    public void onInitializeDataGenerator(FabricDataGenerator generator) {
        // createPack() 自 1.19.4 起存在：fabric-api 摘要 ⇒ FabricDataGenerator 上有 Pack createPack()
        FabricDataGenerator.Pack pack = generator.createPack(); // 本档语料没有 docs 正文可逐字对照 ⇒ 签名以摘要件为准
        pack.addProvider(MyRecipeProvider::new);
        pack.addProvider(MyModelProvider::new);
        pack.addProvider(MyLanguageProvider::new);
    }
}

// 下面三个是**你工程里的示例类**（本件声明，不是 Fabric API 的类）；完整写法见 mc-recipe / mc-model / mc-lang
abstract class MyRecipeProvider extends FabricRecipeProvider { }     // 骨架：1.21.2+ 需实现 getRecipeGenerator（见 mc-recipe）
abstract class MyModelProvider extends FabricModelProvider { }       // 骨架：需实现两个 generate* 方法
abstract class MyLanguageProvider extends FabricLanguageProvider { }  // 骨架：需实现 generateTranslations
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

配方自 **1.21.2 起是两层**（本档实测：`RecipeGenerator$RecipeProvider.getRecipeGenerator(RegistryWrapper$WrapperLookup, RecipeExporter)` ⇒ `RecipeGenerator`，`RecipeGenerator` 里才是无参 `generate()`）；`FabricRecipeProvider` 子类上**没有** 1.21.1 那种单参 `generate(RecipeExporter)`，也不要抄 wiki/Mojmap 的 `buildRecipes`。形状见 mc-recipe.md。

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
