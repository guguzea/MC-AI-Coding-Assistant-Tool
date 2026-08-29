---
description: 07 — 数据生成器
---

# 07 — 数据生成器

> 适用版本：Fabric 26.1.2（Mojmap）

文档入口（若本机文档索引有 26.1.2）：`develop_data-generation_setup` / `recipes` / `loot-tables` / `tags`。
本档方法名来自 `query_loader_api`（26.1.2 fabric-api），**不要**把 Yarn 1.21 的 `generate(Consumer)` 抄过来。

> ⚠️ 易错点：**`Identifier` 不是 Yarn 名**。Mojang 官方映射自 **1.21.11** 起把 `ResourceLocation`
> 改名为 `Identifier`（mappings.dev 核实：1.21.10 及更早为 `ResourceLocation`，1.21.11 起为 `Identifier`）。
> 26.1 的「去混淆」是另一件事，与本次改名不是同一节点。本档（26.1.2）与 1.21.11 起各档一律用 `Identifier`；
> 1.21.10 及更早才用 `ResourceLocation`。

---

## 约束

### 核心原则

- 入口：`DataGeneratorEntrypoint.onInitializeDataGenerator(FabricDataGenerator)`
- `fabric.mod.json` 用 `"fabric-datagen"`
- **禁止** `DataGeneratorInitializer` / `init_data`
- 配方：`FabricRecipeProvider.createRecipeProvider(HolderLookup.Provider, RecipeOutput)`，在返回的 `RecipeProvider` 里写 `buildRecipes()`
- 掉落：`FabricBlockLootSubProvider.generate()` + Mojmap `dropSelf`
- 语言：`FabricLanguageProvider.generateTranslations(HolderLookup.Provider, TranslationBuilder)`
- **禁止** `ExistingFileHelper`、Yarn 的 `ShapedRecipeJsonBuilder` 包名

---

## Decision Flow

```
IF 入口 → DataGeneratorEntrypoint + fabric-datagen
IF 配方 → FabricRecipeProvider.createRecipeProvider
IF 方块掉落 → FabricBlockLootSubProvider
IF 语言 → FabricLanguageProvider
IF 标签 → FabricTagProvider 系（以本版 loader-api 为准）
```

---

## 添加 DataGen 依赖

```groovy
fabricApi {
    configureDataGeneration()
}
// build.gradle — 用完整 fabric-api，不要单独钉死 fabric-datagen-api-v0 的假版本号
dependencies {
    implementation "net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}"
}
```

## 创建 DataGeneratorEntrypoint

```java
public class ExampleModDataGenerator implements DataGeneratorEntrypoint {
    @Override
    public void onInitializeDataGenerator(FabricDataGenerator generator) {
        FabricDataGenerator.Pack pack = generator.createPack();
        pack.addProvider(MyRecipeProvider::new);
        pack.addProvider(MyBlockLootProvider::new);
        pack.addProvider(MyEnLangProvider::new);
    }
}
```

## 注册 fabric-datagen

```json
{
  "entrypoints": {
    "fabric-datagen": [
      "com.example.examplemod.ExampleModDataGenerator"
    ]
  }
}
```

## 生成配方

```java
public class MyRecipeProvider extends FabricRecipeProvider {
    public MyRecipeProvider(FabricDataOutput output,
                            CompletableFuture<HolderLookup.Provider> registriesFuture) {
        super(output, registriesFuture);
    }

    @Override
    protected RecipeProvider createRecipeProvider(HolderLookup.Provider registries, RecipeOutput output) {
        return new RecipeProvider(registries, output) {
            @Override
            public void buildRecipes() {
                ShapedRecipeBuilder.shaped(RecipeCategory.MISC, MY_ITEM)
                    .pattern("AAA")
                    .pattern("A A")
                    .pattern(" A ")
                    .define('A', Items.DIAMOND)
                    .unlockedBy("has_diamond", has(Items.DIAMOND))
                    .save(output);
            }
        };
    }
}
```

## 生成 Loot Table

```java
public class MyBlockLootProvider extends FabricBlockLootSubProvider {
    public MyBlockLootProvider(FabricDataOutput output,
                               CompletableFuture<HolderLookup.Provider> registriesFuture) {
        super(output, registriesFuture);
    }

    @Override
    public void generate() {
        dropSelf(MY_BLOCK);
    }
}
```

## 生成语言文件

```java
public class MyEnLangProvider extends FabricLanguageProvider {
    public MyEnLangProvider(FabricDataOutput output,
                            CompletableFuture<HolderLookup.Provider> registriesFuture) {
        super(output, "en_us", registriesFuture);
    }

    @Override
    public void generateTranslations(HolderLookup.Provider registryLookup,
                                     TranslationBuilder translationBuilder) {
        translationBuilder.add(MY_ITEM, "My Item");
        translationBuilder.add(MY_BLOCK, "My Block");
    }
}
```

## 运行 DataGen

```bash
./gradlew runDatagen
```

## 常见错误

- ❌ 忘记在 `fabric.mod.json` 中注册 `fabric-datagen` entrypoint — DataGen 不执行
- ❌ 使用 `DataGeneratorInitializer` / `init_data` — 那是编造入口
- ❌ 手动编辑生成目录 — 文件会被重新生成覆盖
- ❌ 引用未注册的资源 — DataGen / 游戏找不到现有文件
- ❌ 在 DataGen 中使用动态路径 — 必须使用确定的 `Identifier`
- ❌ 抄 Forge 的 `ExistingFileHelper` / `ItemModelProvider` / `DatapackBuiltinEntriesProvider`
- ❌ 调用不存在的 `offerShapedRecipe` — 用 `ShapedRecipeJsonBuilder` + `offerTo(exporter)`
- ❌ 把 Yarn `CommandManager` / `Text.literal` / `addDrop` 抄进本档 — 本档是 Mojmap（`Commands` / `Component` / `dropSelf`）

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-item` | DataGen 生成物品模型 JSON |
| `mc-block` | DataGen 生成方块模型和掉落表 |
| `mc-entity` | DataGen 生成实体语言名和 loot table |
| `mc-registry` | DataGen 引用已注册的方块/物品/实体 |
