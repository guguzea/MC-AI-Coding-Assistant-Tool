---
description: 07 — 数据生成器
---

# 07 — 数据生成器

> 适用版本：Fabric 1.21.11

---

## 约束

### 核心原则

- 入口：`DataGeneratorEntrypoint.onInitializeDataGenerator`
- `fabric.mod.json` 用 `"fabric-datagen"`，**不要** `init_data`
- 用 `generator.createPack()` 再 `pack.addProvider(...)`
- 配方是**两层**结构：`FabricRecipeProvider` 子类只实现构造 + 那个抽象工厂方法，配方写在**返回对象**的无参方法里
  - Mojmap：`createRecipeProvider(HolderLookup.Provider, RecipeOutput)` → 内部 `buildRecipes()`
  - Yarn：`getRecipeGenerator(RegistryWrapper.WrapperLookup, RecipeExporter)` → 内部 `generate()`
- 语言：`generateTranslations(RegistryWrapper.WrapperLookup, TranslationBuilder)`
- 不要把已过时的「不要抄 buildRecipes」当本档口径
- 生成目录常见 `src/main/generated`；**禁止**手改
- **禁止** `DataGeneratorInitializer`、`ExistingFileHelper`、`DataStreamOutputSupplier`、`offerShapedRecipe`
- 模型：`net.fabricmc.fabric.api.client.datagen.v1.provider.FabricModelProvider`（不要用旧包 `datagen.v1.provider` 无 client）

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

IF 生成自定义附魔定义
  → `FabricDynamicRegistryProvider`，在生成器 **`bootstrap()`** 里 `register()`
  → 附魔 tag 用 `FabricTagProvider<Enchantment>`，构造里把 `Registries.ENCHANTMENT` 传给 `super` 作 registryKey
  → **不要**在 `onInitialize()` 里 `Registry.register(Registries.ENCHANTMENT, ...)`
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
        pack.addProvider(MyRecipeProvider::new);   // 直接传构造引用；没有静态 createRecipeProvider 工厂
        pack.addProvider(MyModelProvider::new);
        pack.addProvider(MyEnLangProvider::new);
        pack.addProvider(MyBlockLootProvider::new);
        pack.addProvider(MyItemTagProvider::new);
    }
}
```
> 实测出处（1.21.11）：`FabricRecipeProvider` 上**只有**构造 + 一个抽象工厂方法 + `withConditions` / `run` / `getRecipeIdentifier`；没有静态 `createRecipeProvider` 工厂。抽象工厂方法在 Mojmap 叫 `createRecipeProvider`、Yarn 叫 `getRecipeGenerator`（同一 intermediary 槽位），它返回的 vanilla 生成器里才有无参 `buildRecipes()`（Mojmap）/ `generate()`（Yarn）。**注意**：`query_loader_api` 摘要里 vanilla 类型仍显示 `class_7225.class_7874` / `method_62766` 这类中间名（fabric-api 自名 + vanilla 中间名的混合体），照摘要抄示例会写出编译不过的代码——以本档示例或反编译树为准。

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

1.21.11 的配方生成器是**两层**：`FabricRecipeProvider` 子类只负责造出一个 vanilla 生成器，配方写在**返回对象**的无参方法里。两层的名字按映射不同，同一段代码里**禁止混用**。

| 位置 | Yarn（本档默认 `yarn_mappings=1.21.11+build.6`） | Mojmap（`loom.officialMojangMappings()`） |
| --- | --- | --- |
| 继承的父类 | `RecipeGenerator.RecipeProvider` | `RecipeProvider.Runner` |
| 唯一要实现的抽象方法 | `getRecipeGenerator(RegistryWrapper.WrapperLookup, RecipeExporter)` → `RecipeGenerator` | `createRecipeProvider(HolderLookup.Provider, RecipeOutput)` → `RecipeProvider` |
| 返回对象里的无参方法 | `protected void generate()` | `protected void buildRecipes()` |
| 落地 | `offerTo(exporter, RegistryKey.of(RegistryKeys.RECIPE, Identifier.of(ns, path)))` | `save(output, ResourceKey...)` |
| 构造入参 | `FabricDataOutput` + `CompletableFuture<RegistryWrapper.WrapperLookup>` | `PackOutput` + `CompletableFuture<HolderLookup.Provider>` |

```java
public class MyRecipeProvider extends FabricRecipeProvider {
    public MyRecipeProvider(FabricDataOutput output,
                            CompletableFuture<RegistryWrapper.WrapperLookup> registriesFuture) {
        super(output, registriesFuture);
    }

    @Override
    protected RecipeGenerator getRecipeGenerator(RegistryWrapper.WrapperLookup registries,
                                                 RecipeExporter exporter) {
        return new RecipeGenerator(registries, exporter) {
            @Override
            protected void generate() {
                RegistryEntryLookup<Item> items = registries.getOrThrow(RegistryKeys.ITEM);
                ShapedRecipeJsonBuilder.create(items, RecipeCategory.MISC, MY_ITEM)  // 首参必需
                    .pattern("AAA")
                    .pattern("A A")
                    .pattern(" A ")
                    .input('A', Items.DIAMOND)
                    .criterion(hasItem(Items.DIAMOND), conditionsFromItem(Items.DIAMOND))
                    .offerTo(exporter, RegistryKey.of(RegistryKeys.RECIPE,
                        Identifier.of("examplemod", "my_item")));
            }
        };
    }
}
```

以下写法在 1.21.11 **不存在**，编译器直接拒（都是本档旧示例踩过的坑）：

- `@Override public void buildRecipes(RecipeOutput output)` 写在 `FabricRecipeProvider` 子类上 — 该方法在无参、且在返回的 vanilla 生成器上
- `ShapedRecipeJsonBuilder.create(RecipeCategory.MISC, MY_ITEM)` 2 参 — 只有 `(RegistryEntryLookup<Item>, RecipeCategory, ItemConvertible[, int])`
- `.offerTo(output)` 单参传 Mojmap `RecipeOutput` — Yarn 侧形参是 `RecipeExporter`

## 生成 Loot Table

```java
public class MyBlockLootProvider extends FabricBlockLootTableProvider {
    public MyBlockLootProvider(FabricDataOutput output,
                              CompletableFuture<RegistryWrapper.WrapperLookup> registriesFuture) {
        super(output, registriesFuture);
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
    public MyEnLangProvider(FabricDataOutput output,
                            CompletableFuture<RegistryWrapper.WrapperLookup> registriesFuture) {
        super(output, registriesFuture);
    }

    @Override
    public void generateTranslations(RegistryWrapper.WrapperLookup registryLookup,
                                       TranslationBuilder translationBuilder) {
        translationBuilder.add(MY_ITEM, "My Item");
        translationBuilder.add(MY_BLOCK, "My Block");
        translationBuilder.add(MY_ENTITY, "My Entity");
    }
}

public class MyZhLangProvider extends FabricLanguageProvider {
    public MyZhLangProvider(FabricDataOutput output, CompletableFuture<RegistryWrapper.WrapperLookup> registriesFuture) {
        super(output, "zh_cn", registriesFuture);
    }

    @Override
    public void generateTranslations(RegistryWrapper.WrapperLookup registryLookup,
                                       TranslationBuilder translationBuilder) {
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

## 自定义附魔（数据驱动）

1.21.11 附魔定义走 DataGen，不在 `onInitialize()` 里 `Registry.register`。官方页：`search_fabric_docs` → `develop/data-generation/enchantments`。

- 生成器类里用 **`bootstrap()`** 调 `register()` 写出附魔定义
- tag：`FabricTagProvider<Enchantment>`，构造把 `Registries.ENCHANTMENT` 传给 `super` 作 `registryKey`
- 签名与 Yarn/Mojmap 类名以本档 loader-api / 该页为准，禁止默写邻版 `Enchantment.Builder`

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
- ❌ 调用不存在的 `offerShapedRecipe` — 用 `ShapedRecipeJsonBuilder` + `offerTo(RecipeExporter, RegistryKey<Recipe<?>>)`。实测出处：1.21.11 fabric-api 源（解包 `-sources.jar`）里 `FabricRecipeProvider` 成员仅 ctor / 抽象 `getRecipeGenerator` / `withConditions` / `run` / `getRecipeIdentifier`，无 `offerShapedRecipe`、无 `buildRecipes`
- ❌ 把带参 `buildRecipes(RecipeOutput)` 当 `FabricRecipeProvider` 的覆写 — 见上「生成配方」；1.21.11 该方法无参且在返回的 vanilla 生成器上

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-item` | DataGen 生成物品模型 JSON |
| `mc-block` | DataGen 生成方块模型和掉落表 |
| `mc-entity` | DataGen 生成实体语言名和 loot table |
| `mc-registry` | DataGen 引用已注册的方块/物品/实体 |
