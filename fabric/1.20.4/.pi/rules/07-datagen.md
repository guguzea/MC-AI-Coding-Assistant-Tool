---
description: 07 — 数据生成器
---

# 07 — 数据生成器

> 适用版本：Fabric 1.20.4

---

## 约束

### 核心原则

- 入口：`DataGeneratorEntrypoint.onInitializeDataGenerator`
- `fabric.mod.json` 用 `"fabric-datagen"`，**不要** `init_data`
- 用 `generator.createPack()` 再 `pack.addProvider(...)`
- Yarn：配方覆盖 `RecipeProvider.generate(...)`，**不要**抄 wiki 的 `buildRecipes`（那是 Mojmap）
- 语言：`FabricLanguageProvider.generateTranslations(TranslationBuilder)`
- 生成目录常见 `src/main/generated`；**禁止**手改
- **禁止** `DataGeneratorInitializer`、`ExistingFileHelper`、`DataStreamOutputSupplier`、`offerShapedRecipe`

---

## Decision Flow

### Decision: 选择生成数据类型

```
IF 生成物品/方块模型 JSON
  → FabricModelProvider

IF 生成语言文件
  → FabricLanguageProvider

IF 生成配方
  → FabricRecipeProvider + ShapedRecipeJsonBuilder.offerTo

IF 生成方块掉落
  → FabricBlockLootTableProvider

IF 生成标签
  → FabricTagProvider.ItemTagProvider / BlockTagProvider
```

---

## 添加 DataGen 依赖

```groovy
fabricApi {
    configureDataGeneration()
}
// build.gradle — 用完整 fabric-api，不要单独钉死 fabric-datagen-api-v0 的假版本号
dependencies {
    modImplementation "net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}"
}
```

## 创建 DataGeneratorEntrypoint

```java
public class ExampleModDataGenerator implements DataGeneratorEntrypoint {
    @Override
    public void onInitializeDataGenerator(FabricDataGenerator generator) {
        FabricDataGenerator.Pack pack = generator.createPack();
        pack.addProvider(MyRecipeProvider::new);
        pack.addProvider(MyModelProvider::new);
        pack.addProvider(MyEnLangProvider::new);
        pack.addProvider(MyBlockLootProvider::new);
        pack.addProvider(MyItemTagProvider::new);
    }
}
```

## 注册 fabric-datagen

```json
// src/main/resources/fabric.mod.json
{
  "entrypoints": {
    "fabric-datagen": [
      "com.example.examplemod.ExampleModDataGenerator"
    ]
  }
}
```

## 生成物品/方块模型

```java
public class MyModelProvider extends FabricModelProvider {
    public MyModelProvider(FabricDataOutput output) {
        super(output);
    }

    @Override
    public void generateBlockStateModels(BlockStateModelGenerator gen) {
        gen.registerSimpleCubeAll(MY_BLOCK);
    }

    @Override
    public void generateItemModels(ItemModelGenerator gen) {
        gen.register(MY_ITEM, Models.GENERATED);
    }
}
```

## 生成配方

```java
public class MyRecipeProvider extends FabricRecipeProvider {
    public MyRecipeProvider(FabricDataOutput output) {
        super(output);
    }

    @Override
    public void generate(Consumer<RecipeJsonProvider> exporter) {
        ShapedRecipeJsonBuilder.create(RecipeCategory.MISC, MY_ITEM)
            .pattern("AAA")
            .pattern("A A")
            .pattern(" A ")
            .input('A', Items.DIAMOND)
            .criterion("has_diamond", conditionsFromItem(Items.DIAMOND))
            .offerTo(exporter);
    }
}
```

## 生成 Loot Table

```java
public class MyBlockLootProvider extends FabricBlockLootTableProvider {
    public MyBlockLootProvider(FabricDataOutput output) {
        super(output);
    }

    @Override
    public void generate() {
        addDrop(MY_BLOCK);
    }
}
```

## 生成语言文件

```java
public class MyEnLangProvider extends FabricLanguageProvider {
    public MyEnLangProvider(FabricDataOutput output) {
        super(output);
    }

    @Override
    public void generateTranslations(TranslationBuilder translationBuilder) {
        translationBuilder.add(MY_ITEM, "My Item");
        translationBuilder.add(MY_BLOCK, "My Block");
        translationBuilder.add(MY_ENTITY, "My Entity");
    }
}

public class MyZhLangProvider extends FabricLanguageProvider {
    public MyZhLangProvider(FabricDataOutput output) {
        super(output, "zh_cn");
    }

    @Override
    public void generateTranslations(TranslationBuilder translationBuilder) {
        translationBuilder.add(MY_ITEM, "我的物品");
        translationBuilder.add(MY_BLOCK, "我的方块");
        translationBuilder.add(MY_ENTITY, "我的实体");
    }
}
```

## 生成标签

```java
public class MyItemTagProvider extends FabricTagProvider.ItemTagProvider {
    public MyItemTagProvider(FabricDataOutput output,
                             CompletableFuture<RegistryWrapper.WrapperLookup> registriesFuture) {
        super(output, registriesFuture);
    }

    @Override
    protected void configure(RegistryWrapper.WrapperLookup lookup) {
        getOrCreateTagBuilder(MY_ITEM_TAG).add(MY_ITEM);
    }
}
```

## 运行 DataGen

```bash
# 生成所有数据（Loom 任务名以模板为准）
./gradlew runDatagen

# 清理后重新生成
./gradlew clean runDatagen
```

生成目录常见为 `src/main/generated`（也有模板用 `src/generated/resources`）。**禁止**手改该目录。

## 常见错误

- ❌ 忘记在 `fabric.mod.json` 中注册 `fabric-datagen` entrypoint — DataGen 不执行
- ❌ 使用 `DataGeneratorInitializer` / `init_data` — 那是编造入口
- ❌ 手动编辑生成目录 — 文件会被重新生成覆盖
- ❌ 引用未注册的资源 — DataGen / 游戏找不到现有文件
- ❌ 在 DataGen 中使用动态路径 — 必须使用确定的 `Identifier`
- ❌ 抄 Forge 的 `ExistingFileHelper` / `ItemModelProvider` / `DatapackBuiltinEntriesProvider`
- ❌ 调用不存在的 `offerShapedRecipe` — 用 `ShapedRecipeJsonBuilder` + `offerTo(exporter)`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-item` | DataGen 生成物品模型 JSON |
| `mc-block` | DataGen 生成方块模型和掉落表 |
| `mc-entity` | DataGen 生成实体语言名和 loot table |
| `mc-registry` | DataGen 引用已注册的方块/物品/实体 |
