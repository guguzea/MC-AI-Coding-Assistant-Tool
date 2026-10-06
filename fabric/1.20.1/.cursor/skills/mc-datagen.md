---
name: mc-datagen
description: Fabric 数据生成器。DataGeneratorEntrypoint、fabric-datagen、FabricRecipeProvider。触发词：DataGen、DataGenerator、ModelProvider、RecipeProvider
platform: fabric
version: "1.20.1"
dependencies: []
mappings: yarn
---

# 数据生成器（Fabric 1.20.1）

## 快速开始

```groovy
// build.gradle — 用完整 fabric-api，不要单独钉死 fabric-data-generation-api-v1 的假版本号
dependencies {
    modImplementation "net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}"
}
```

datagen 的**运行配置属 Gradle 侧**（fabric-loom 的 `fabricApi { configureDataGeneration() }`），不是 MC / Fabric API 的 Java API，本仓的类名门对它无管辖权。本档语料没有 docs 正文逐字命中该 DSL（官方逐字写法在 fabric-docs 1.21.4+ 的 `develop_loom_fabric-api` 页），而本档 scaffold 钉的是 `fabric-loom 1.4-SNAPSHOT`（见 `fabric/1.20.1/scaffold/build.gradle:2`）——该 loom 是否提供此扩展**未核实**，请按你工程实际的 loom 版本核对后再写；旧 Loom 的手写 `loom { runs { … } }` 替代形成本仓同样没有出处，留 `// TODO(未核实)`。

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
abstract class MyRecipeProvider extends FabricRecipeProvider { }     // 骨架：需实现 generate(Consumer<RecipeJsonProvider>)
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
