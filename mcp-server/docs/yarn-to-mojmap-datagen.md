# Yarn → Mojmap：Fabric Datagen 名对照表（逐档）

> 背景：Yarn 映射已于 2026-10 停止维护，Fabric 生态全面转向 Mojmap。
> 本表只解决一件事：**读旧 Yarn 代码 / 迁移到 Mojmap 时，把名字对上**。
>
> 生成链路（可复跑）：
> 1. `data/fabric_<ver>/mappings/yarn-mappings.sqlite`（Yarn 名 ↔ official 名）
> 2. Mojang `client_mappings`（official ↔ mojmap）
> 3. 方法按 `(owner, name, descriptor)` 精确匹配；缺证写 `—`，**不跨档外推**
>
> 证据口径：类名来自第 1+2 步 join；方法名额外要求描述符一致（避免重载错配）。

## 已核结论（2026-10-22）

### 1. 模型 datagen 的公开面：不是"不可用"，而是靠 access widener

`fabric-data-generation-api-v1` 模块 jar 内带 `fabric-data-generation-api-v1.accesswidener`（1.21.8 实测 361 行），
其中把 `class_4910`（BlockStateModelGenerator）与 `class_4915`（ItemModelGenerator）的大量成员标成
`transitive-accessible`，例如：

```
transitive-accessible method net/minecraft/class_4910 method_25537 (Lnet/minecraft/class_1792;)V
transitive-accessible method net/minecraft/class_4910 method_25600 (Lnet/minecraft/class_2248;)V
```

因此 `gen.registerSimpleCubeAll(...)` 在真实 Loom 工程里可编译；**裸 javac 报 private 是假阴性**（没应用 AW）。

### 2. Mojmap 侧的模型类名与 Yarn 完全不同（易错点）

| 概念 | Yarn | Mojmap（1.21.8 mojmap jar javap 实测） |
| --- | --- | --- |
| 方块模型生成器 | `net.minecraft.client.data.BlockStateModelGenerator` | `net.minecraft.client.data.models.BlockModelGenerators`（复数） |
| 物品模型生成器 | `net.minecraft.client.data.ItemModelGenerator` | `net.minecraft.client.data.models.ItemModelGenerators`（复数） |
| 简易方块模型 | `registerSimpleCubeAll(Block)` | `createTrivialCube(Block)` |
| Fabric provider 的参数类型 | `BlockStateModelGenerator` / `ItemModelGenerator` | `BlockModelGenerators` / `ItemModelGenerators` |

```
public abstract void generateBlockStateModels(net.minecraft.client.data.models.BlockModelGenerators);
public abstract void generateItemModels(net.minecraft.client.data.models.ItemModelGenerators);
```

### 3. 1.17.1 的 `Tag.Identified` 确实无法构造

1.17.1 named jar `javap -p`：

```
public interface net.minecraft.tag.Tag$Identified<T> extends net.minecraft.tag.Tag<T> {
  public abstract net.minecraft.util.Identifier getId();
}
```

只有 `getId()`，没有静态工厂或公开构造 ⇒ 该档 tag 生成请手写 JSON，或改用 `Tag` 的其它入口。

### 4. 26.1.2 的 `FabricSoundsProvider` 构造（摘要未列，源码已核）

`26.1.2-fabric-api.jar` 是 **sources jar**，源码实测：

```java
public FabricSoundsProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> registriesFuture)
```

（`configure(HolderLookup.Provider, SoundExporter)` 与摘要一致。）

---

# Yarn → Mojmap：Fabric Datagen 名对照表

> 反查链路：`data/fabric_<ver>/mappings/yarn-mappings.sqlite`（Yarn 名 → official 名）+ Mojang `client_mappings`（official → mojmap）。
> 方法按 `(owner, name, descriptor)` 精确匹配；`(未收录)` 表示 client_mappings 里该 owner/name 下没有对应描述符。缺证写 `—`，不跨档外推。
> Yarn 已于 2026-10 停止维护，本表仅用于迁移旧代码/读旧示例。

## 1.17.1

| 概念 | Yarn | Mojmap |
| --- | --- | --- |
| RecipeExporter / RecipeOutput | — | — |
| RecipeGenerator / RecipeProvider | `net/minecraft/data/server/RecipesProvider` | `net.minecraft.data.recipes.RecipeProvider` |
| RecipeProvider$Runner / RecipeGenerator$RecipeProvider | — | — |
| DataProvider | `net/minecraft/data/DataProvider` | `net.minecraft.data.DataProvider` |
| DataOutput / PackOutput | — | — |
| RegistryWrapper / HolderLookup | — | — |
| Identifier / ResourceLocation | `net/minecraft/util/Identifier` | `net.minecraft.resources.ResourceLocation` |
| TagKey（1.18+） | — | — |
| Tag / Tag$Identified（1.17.1） | `net/minecraft/tag/Tag` | `net.minecraft.tags.Tag` |
| BlockStateModelGenerator | `net/minecraft/data/client/model/BlockStateModelGenerator` | `net.minecraft.data.models.BlockModelGenerators` |
| ItemModelGenerator | `net/minecraft/data/client/ItemModelGenerator` | `net.minecraft.data.models.ItemModelGenerators` |
| BlockLootTableGenerator | `net/minecraft/data/server/BlockLootTableGenerator` | `net.minecraft.data.loot.BlockLoot` |
| Registry | `net/minecraft/util/registry/Registry` | `net.minecraft.core.Registry` |
| RegistryKeys | — | — |
| ItemModelOutput | — | — |
| DataProvider.getName | `getName` | `getName` |
| RecipeProvider.generate / buildRecipes | `generate` | `buildCraftingRecipes` |
| getRecipeGenerator / createRecipeProvider | — | — |
| BlockLootTableGenerator.generate | — | — |
| TagProvider.configure | `configure` | `addTags` |
| TagProvider.getOrCreateTagBuilder / builder | `getOrCreateTagBuilder` | `tag` |

## 1.18.2

| 概念 | Yarn | Mojmap |
| --- | --- | --- |
| RecipeExporter / RecipeOutput | — | — |
| RecipeGenerator / RecipeProvider | — | — |
| RecipeProvider$Runner / RecipeGenerator$RecipeProvider | — | — |
| DataProvider | `net/minecraft/data/DataProvider` | `net.minecraft.data.DataProvider` |
| DataOutput / PackOutput | — | — |
| RegistryWrapper / HolderLookup | — | — |
| Identifier / ResourceLocation | `net/minecraft/util/Identifier` | `net.minecraft.resources.ResourceLocation` |
| TagKey（1.18+） | `net/minecraft/tag/TagKey` | `net.minecraft.tags.TagKey` |
| Tag / Tag$Identified（1.17.1） | `net/minecraft/tag/Tag` | `net.minecraft.tags.Tag` |
| BlockStateModelGenerator | `net/minecraft/data/client/BlockStateModelGenerator` | `net.minecraft.data.models.BlockModelGenerators` |
| ItemModelGenerator | `net/minecraft/data/client/ItemModelGenerator` | `net.minecraft.data.models.ItemModelGenerators` |
| BlockLootTableGenerator | `net/minecraft/data/server/BlockLootTableGenerator` | `net.minecraft.data.loot.BlockLoot` |
| Registry | `net/minecraft/util/registry/Registry` | `net.minecraft.core.Registry` |
| RegistryKeys | — | — |
| ItemModelOutput | — | — |
| DataProvider.getName | `getName` | `getName` |
| RecipeProvider.generate / buildRecipes | — | — |
| getRecipeGenerator / createRecipeProvider | — | — |
| BlockLootTableGenerator.generate | — | — |
| TagProvider.configure | `configure` | `addTags` |
| TagProvider.getOrCreateTagBuilder / builder | `getOrCreateTagBuilder` | `tag` |

## 1.19.4

| 概念 | Yarn | Mojmap |
| --- | --- | --- |
| RecipeExporter / RecipeOutput | — | — |
| RecipeGenerator / RecipeProvider | `net/minecraft/data/server/recipe/RecipeProvider` | `net.minecraft.data.recipes.RecipeProvider` |
| RecipeProvider$Runner / RecipeGenerator$RecipeProvider | — | — |
| DataProvider | `net/minecraft/data/DataProvider` | `net.minecraft.data.DataProvider` |
| DataOutput / PackOutput | `net/minecraft/data/DataOutput` | `net.minecraft.data.PackOutput` |
| RegistryWrapper / HolderLookup | `net/minecraft/registry/RegistryWrapper` | `net.minecraft.core.HolderLookup` |
| Identifier / ResourceLocation | `net/minecraft/util/Identifier` | `net.minecraft.resources.ResourceLocation` |
| TagKey（1.18+） | `net/minecraft/registry/tag/TagKey` | `net.minecraft.tags.TagKey` |
| Tag / Tag$Identified（1.17.1） | — | — |
| BlockStateModelGenerator | `net/minecraft/data/client/BlockStateModelGenerator` | `net.minecraft.data.models.BlockModelGenerators` |
| ItemModelGenerator | `net/minecraft/data/client/ItemModelGenerator` | `net.minecraft.data.models.ItemModelGenerators` |
| BlockLootTableGenerator | — | — |
| Registry | `net/minecraft/registry/Registry` | `net.minecraft.core.Registry` |
| RegistryKeys | `net/minecraft/registry/RegistryKeys` | `net.minecraft.core.registries.Registries` |
| ItemModelOutput | — | — |
| DataProvider.getName | `getName` | `getName` |
| RecipeProvider.generate / buildRecipes | `generate` | `buildRecipes` |
| getRecipeGenerator / createRecipeProvider | — | — |
| BlockLootTableGenerator.generate | — | — |
| TagProvider.configure | — | — |
| TagProvider.getOrCreateTagBuilder / builder | — | — |

## 1.20.1

| 概念 | Yarn | Mojmap |
| --- | --- | --- |
| RecipeExporter / RecipeOutput | — | — |
| RecipeGenerator / RecipeProvider | `net/minecraft/data/server/recipe/RecipeProvider` | `net.minecraft.data.recipes.RecipeProvider` |
| RecipeProvider$Runner / RecipeGenerator$RecipeProvider | — | — |
| DataProvider | `net/minecraft/data/DataProvider` | `net.minecraft.data.DataProvider` |
| DataOutput / PackOutput | `net/minecraft/data/DataOutput` | `net.minecraft.data.PackOutput` |
| RegistryWrapper / HolderLookup | `net/minecraft/registry/RegistryWrapper` | `net.minecraft.core.HolderLookup` |
| Identifier / ResourceLocation | `net/minecraft/util/Identifier` | `net.minecraft.resources.ResourceLocation` |
| TagKey（1.18+） | `net/minecraft/registry/tag/TagKey` | `net.minecraft.tags.TagKey` |
| Tag / Tag$Identified（1.17.1） | — | — |
| BlockStateModelGenerator | `net/minecraft/data/client/BlockStateModelGenerator` | `net.minecraft.data.models.BlockModelGenerators` |
| ItemModelGenerator | `net/minecraft/data/client/ItemModelGenerator` | `net.minecraft.data.models.ItemModelGenerators` |
| BlockLootTableGenerator | — | — |
| Registry | `net/minecraft/registry/Registry` | `net.minecraft.core.Registry` |
| RegistryKeys | `net/minecraft/registry/RegistryKeys` | `net.minecraft.core.registries.Registries` |
| ItemModelOutput | — | — |
| DataProvider.getName | `getName` | `getName` |
| RecipeProvider.generate / buildRecipes | `generate` | `buildRecipes` |
| getRecipeGenerator / createRecipeProvider | — | — |
| BlockLootTableGenerator.generate | — | — |
| TagProvider.configure | — | — |
| TagProvider.getOrCreateTagBuilder / builder | — | — |

## 1.20.4

| 概念 | Yarn | Mojmap |
| --- | --- | --- |
| RecipeExporter / RecipeOutput | `net/minecraft/data/server/recipe/RecipeExporter` | `net.minecraft.data.recipes.RecipeOutput` |
| RecipeGenerator / RecipeProvider | `net/minecraft/data/server/recipe/RecipeProvider` | `net.minecraft.data.recipes.RecipeProvider` |
| RecipeProvider$Runner / RecipeGenerator$RecipeProvider | — | — |
| DataProvider | `net/minecraft/data/DataProvider` | `net.minecraft.data.DataProvider` |
| DataOutput / PackOutput | `net/minecraft/data/DataOutput` | `net.minecraft.data.PackOutput` |
| RegistryWrapper / HolderLookup | `net/minecraft/registry/RegistryWrapper` | `net.minecraft.core.HolderLookup` |
| Identifier / ResourceLocation | `net/minecraft/util/Identifier` | `net.minecraft.resources.ResourceLocation` |
| TagKey（1.18+） | `net/minecraft/registry/tag/TagKey` | `net.minecraft.tags.TagKey` |
| Tag / Tag$Identified（1.17.1） | — | — |
| BlockStateModelGenerator | `net/minecraft/data/client/BlockStateModelGenerator` | `net.minecraft.data.models.BlockModelGenerators` |
| ItemModelGenerator | `net/minecraft/data/client/ItemModelGenerator` | `net.minecraft.data.models.ItemModelGenerators` |
| BlockLootTableGenerator | — | — |
| Registry | `net/minecraft/registry/Registry` | `net.minecraft.core.Registry` |
| RegistryKeys | `net/minecraft/registry/RegistryKeys` | `net.minecraft.core.registries.Registries` |
| ItemModelOutput | — | — |
| DataProvider.getName | `getName` | `getName` |
| RecipeProvider.generate / buildRecipes | `generate` | `buildRecipes` |
| getRecipeGenerator / createRecipeProvider | — | — |
| BlockLootTableGenerator.generate | — | — |
| TagProvider.configure | — | — |
| TagProvider.getOrCreateTagBuilder / builder | — | — |

## 1.21.1

| 概念 | Yarn | Mojmap |
| --- | --- | --- |
| RecipeExporter / RecipeOutput | `net/minecraft/data/server/recipe/RecipeExporter` | `net.minecraft.data.recipes.RecipeOutput` |
| RecipeGenerator / RecipeProvider | `net/minecraft/data/server/recipe/RecipeProvider` | `net.minecraft.data.recipes.RecipeProvider` |
| RecipeProvider$Runner / RecipeGenerator$RecipeProvider | — | — |
| DataProvider | `net/minecraft/data/DataProvider` | `net.minecraft.data.DataProvider` |
| DataOutput / PackOutput | `net/minecraft/data/DataOutput` | `net.minecraft.data.PackOutput` |
| RegistryWrapper / HolderLookup | `net/minecraft/registry/RegistryWrapper` | `net.minecraft.core.HolderLookup` |
| Identifier / ResourceLocation | `net/minecraft/util/Identifier` | `net.minecraft.resources.ResourceLocation` |
| TagKey（1.18+） | `net/minecraft/registry/tag/TagKey` | `net.minecraft.tags.TagKey` |
| Tag / Tag$Identified（1.17.1） | — | — |
| BlockStateModelGenerator | `net/minecraft/data/client/BlockStateModelGenerator` | `net.minecraft.data.models.BlockModelGenerators` |
| ItemModelGenerator | `net/minecraft/data/client/ItemModelGenerator` | `net.minecraft.data.models.ItemModelGenerators` |
| BlockLootTableGenerator | — | — |
| Registry | `net/minecraft/registry/Registry` | `net.minecraft.core.Registry` |
| RegistryKeys | `net/minecraft/registry/RegistryKeys` | `net.minecraft.core.registries.Registries` |
| ItemModelOutput | — | — |
| DataProvider.getName | `getName` | `getName` |
| RecipeProvider.generate / buildRecipes | `generate` | `buildRecipes` |
| getRecipeGenerator / createRecipeProvider | — | — |
| BlockLootTableGenerator.generate | — | — |
| TagProvider.configure | — | — |
| TagProvider.getOrCreateTagBuilder / builder | — | — |

## 1.21.3

| 概念 | Yarn | Mojmap |
| --- | --- | --- |
| RecipeExporter / RecipeOutput | `net/minecraft/data/server/recipe/RecipeExporter` | `net.minecraft.data.recipes.RecipeOutput` |
| RecipeGenerator / RecipeProvider | — | — |
| RecipeProvider$Runner / RecipeGenerator$RecipeProvider | — | — |
| DataProvider | `net/minecraft/data/DataProvider` | `net.minecraft.data.DataProvider` |
| DataOutput / PackOutput | `net/minecraft/data/DataOutput` | `net.minecraft.data.PackOutput` |
| RegistryWrapper / HolderLookup | `net/minecraft/registry/RegistryWrapper` | `net.minecraft.core.HolderLookup` |
| Identifier / ResourceLocation | `net/minecraft/util/Identifier` | `net.minecraft.resources.ResourceLocation` |
| TagKey（1.18+） | `net/minecraft/registry/tag/TagKey` | `net.minecraft.tags.TagKey` |
| Tag / Tag$Identified（1.17.1） | — | — |
| BlockStateModelGenerator | `net/minecraft/data/client/BlockStateModelGenerator` | `net.minecraft.data.models.BlockModelGenerators` |
| ItemModelGenerator | `net/minecraft/data/client/ItemModelGenerator` | `net.minecraft.data.models.ItemModelGenerators` |
| BlockLootTableGenerator | — | — |
| Registry | `net/minecraft/registry/Registry` | `net.minecraft.core.Registry` |
| RegistryKeys | `net/minecraft/registry/RegistryKeys` | `net.minecraft.core.registries.Registries` |
| ItemModelOutput | — | — |
| DataProvider.getName | `getName` | `getName` |
| RecipeProvider.generate / buildRecipes | — | — |
| getRecipeGenerator / createRecipeProvider | — | — |
| BlockLootTableGenerator.generate | — | — |
| TagProvider.configure | — | — |
| TagProvider.getOrCreateTagBuilder / builder | — | — |

## 1.21.4

| 概念 | Yarn | Mojmap |
| --- | --- | --- |
| RecipeExporter / RecipeOutput | — | — |
| RecipeGenerator / RecipeProvider | `net/minecraft/data/recipe/RecipeGenerator` | `net.minecraft.data.recipes.RecipeProvider` |
| RecipeProvider$Runner / RecipeGenerator$RecipeProvider | `net/minecraft/data/recipe/RecipeGenerator$RecipeProvider` | `net.minecraft.data.recipes.RecipeProvider$Runner` |
| DataProvider | `net/minecraft/data/DataProvider` | `net.minecraft.data.DataProvider` |
| DataOutput / PackOutput | `net/minecraft/data/DataOutput` | `net.minecraft.data.PackOutput` |
| RegistryWrapper / HolderLookup | `net/minecraft/registry/RegistryWrapper` | `net.minecraft.core.HolderLookup` |
| Identifier / ResourceLocation | `net/minecraft/util/Identifier` | `net.minecraft.resources.ResourceLocation` |
| TagKey（1.18+） | `net/minecraft/registry/tag/TagKey` | `net.minecraft.tags.TagKey` |
| Tag / Tag$Identified（1.17.1） | — | — |
| BlockStateModelGenerator | `net/minecraft/client/data/BlockStateModelGenerator` | `net.minecraft.client.data.models.BlockModelGenerators` |
| ItemModelGenerator | `net/minecraft/client/data/ItemModelGenerator` | `net.minecraft.client.data.models.ItemModelGenerators` |
| BlockLootTableGenerator | `net/minecraft/data/loottable/BlockLootTableGenerator` | `net.minecraft.data.loot.BlockLootSubProvider` |
| Registry | `net/minecraft/registry/Registry` | `net.minecraft.core.Registry` |
| RegistryKeys | `net/minecraft/registry/RegistryKeys` | `net.minecraft.core.registries.Registries` |
| ItemModelOutput | `net/minecraft/client/data/ItemModelOutput` | `net.minecraft.client.data.models.ItemModelOutput` |
| DataProvider.getName | `getName` | `getName` |
| RecipeProvider.generate / buildRecipes | `generate` | `buildRecipes` |
| getRecipeGenerator / createRecipeProvider | `getRecipeGenerator` | `createRecipeProvider` |
| BlockLootTableGenerator.generate | `generate` | `generate` |
| TagProvider.configure | — | — |
| TagProvider.getOrCreateTagBuilder / builder | — | — |

## 1.21.8

| 概念 | Yarn | Mojmap |
| --- | --- | --- |
| RecipeExporter / RecipeOutput | — | — |
| RecipeGenerator / RecipeProvider | `net/minecraft/data/recipe/RecipeGenerator` | `net.minecraft.data.recipes.RecipeProvider` |
| RecipeProvider$Runner / RecipeGenerator$RecipeProvider | `net/minecraft/data/recipe/RecipeGenerator$RecipeProvider` | `net.minecraft.data.recipes.RecipeProvider$Runner` |
| DataProvider | `net/minecraft/data/DataProvider` | `net.minecraft.data.DataProvider` |
| DataOutput / PackOutput | `net/minecraft/data/DataOutput` | `net.minecraft.data.PackOutput` |
| RegistryWrapper / HolderLookup | `net/minecraft/registry/RegistryWrapper` | `net.minecraft.core.HolderLookup` |
| Identifier / ResourceLocation | `net/minecraft/util/Identifier` | `net.minecraft.resources.ResourceLocation` |
| TagKey（1.18+） | `net/minecraft/registry/tag/TagKey` | `net.minecraft.tags.TagKey` |
| Tag / Tag$Identified（1.17.1） | — | — |
| BlockStateModelGenerator | `net/minecraft/client/data/BlockStateModelGenerator` | `net.minecraft.client.data.models.BlockModelGenerators` |
| ItemModelGenerator | `net/minecraft/client/data/ItemModelGenerator` | `net.minecraft.client.data.models.ItemModelGenerators` |
| BlockLootTableGenerator | `net/minecraft/data/loottable/BlockLootTableGenerator` | `net.minecraft.data.loot.BlockLootSubProvider` |
| Registry | `net/minecraft/registry/Registry` | `net.minecraft.core.Registry` |
| RegistryKeys | `net/minecraft/registry/RegistryKeys` | `net.minecraft.core.registries.Registries` |
| ItemModelOutput | `net/minecraft/client/data/ItemModelOutput` | `net.minecraft.client.data.models.ItemModelOutput` |
| DataProvider.getName | `getName` | `getName` |
| RecipeProvider.generate / buildRecipes | `generate` | `buildRecipes` |
| getRecipeGenerator / createRecipeProvider | `getRecipeGenerator` | `createRecipeProvider` |
| BlockLootTableGenerator.generate | `generate` | `generate` |
| TagProvider.configure | — | — |
| TagProvider.getOrCreateTagBuilder / builder | — | — |

## 1.21.10

| 概念 | Yarn | Mojmap |
| --- | --- | --- |
| RecipeExporter / RecipeOutput | — | — |
| RecipeGenerator / RecipeProvider | `net/minecraft/data/recipe/RecipeGenerator` | `net.minecraft.data.recipes.RecipeProvider` |
| RecipeProvider$Runner / RecipeGenerator$RecipeProvider | `net/minecraft/data/recipe/RecipeGenerator$RecipeProvider` | `net.minecraft.data.recipes.RecipeProvider$Runner` |
| DataProvider | `net/minecraft/data/DataProvider` | `net.minecraft.data.DataProvider` |
| DataOutput / PackOutput | `net/minecraft/data/DataOutput` | `net.minecraft.data.PackOutput` |
| RegistryWrapper / HolderLookup | `net/minecraft/registry/RegistryWrapper` | `net.minecraft.core.HolderLookup` |
| Identifier / ResourceLocation | `net/minecraft/util/Identifier` | `net.minecraft.resources.ResourceLocation` |
| TagKey（1.18+） | `net/minecraft/registry/tag/TagKey` | `net.minecraft.tags.TagKey` |
| Tag / Tag$Identified（1.17.1） | — | — |
| BlockStateModelGenerator | `net/minecraft/client/data/BlockStateModelGenerator` | `net.minecraft.client.data.models.BlockModelGenerators` |
| ItemModelGenerator | `net/minecraft/client/data/ItemModelGenerator` | `net.minecraft.client.data.models.ItemModelGenerators` |
| BlockLootTableGenerator | `net/minecraft/data/loottable/BlockLootTableGenerator` | `net.minecraft.data.loot.BlockLootSubProvider` |
| Registry | `net/minecraft/registry/Registry` | `net.minecraft.core.Registry` |
| RegistryKeys | `net/minecraft/registry/RegistryKeys` | `net.minecraft.core.registries.Registries` |
| ItemModelOutput | `net/minecraft/client/data/ItemModelOutput` | `net.minecraft.client.data.models.ItemModelOutput` |
| DataProvider.getName | `getName` | `getName` |
| RecipeProvider.generate / buildRecipes | `generate` | `buildRecipes` |
| getRecipeGenerator / createRecipeProvider | `getRecipeGenerator` | `createRecipeProvider` |
| BlockLootTableGenerator.generate | `generate` | `generate` |
| TagProvider.configure | — | — |
| TagProvider.getOrCreateTagBuilder / builder | — | — |

## 1.21.11

| 概念 | Yarn | Mojmap |
| --- | --- | --- |
| RecipeExporter / RecipeOutput | — | — |
| RecipeGenerator / RecipeProvider | `net/minecraft/data/recipe/RecipeGenerator` | `net.minecraft.data.recipes.RecipeProvider` |
| RecipeProvider$Runner / RecipeGenerator$RecipeProvider | `net/minecraft/data/recipe/RecipeGenerator$RecipeProvider` | `net.minecraft.data.recipes.RecipeProvider$Runner` |
| DataProvider | `net/minecraft/data/DataProvider` | `net.minecraft.data.DataProvider` |
| DataOutput / PackOutput | `net/minecraft/data/DataOutput` | `net.minecraft.data.PackOutput` |
| RegistryWrapper / HolderLookup | `net/minecraft/registry/RegistryWrapper` | `net.minecraft.core.HolderLookup` |
| Identifier / ResourceLocation | `net/minecraft/util/Identifier` | `net.minecraft.resources.Identifier` |
| TagKey（1.18+） | `net/minecraft/registry/tag/TagKey` | `net.minecraft.tags.TagKey` |
| Tag / Tag$Identified（1.17.1） | — | — |
| BlockStateModelGenerator | `net/minecraft/client/data/BlockStateModelGenerator` | `net.minecraft.client.data.models.BlockModelGenerators` |
| ItemModelGenerator | `net/minecraft/client/data/ItemModelGenerator` | `net.minecraft.client.data.models.ItemModelGenerators` |
| BlockLootTableGenerator | `net/minecraft/data/loottable/BlockLootTableGenerator` | `net.minecraft.data.loot.BlockLootSubProvider` |
| Registry | `net/minecraft/registry/Registry` | `net.minecraft.core.Registry` |
| RegistryKeys | `net/minecraft/registry/RegistryKeys` | `net.minecraft.core.registries.Registries` |
| ItemModelOutput | `net/minecraft/client/data/ItemModelOutput` | `net.minecraft.client.data.models.ItemModelOutput` |
| DataProvider.getName | `getName` | `getName` |
| RecipeProvider.generate / buildRecipes | `generate` | `buildRecipes` |
| getRecipeGenerator / createRecipeProvider | `getRecipeGenerator` | `createRecipeProvider` |
| BlockLootTableGenerator.generate | `generate` | `generate` |
| TagProvider.configure | — | — |
| TagProvider.getOrCreateTagBuilder / builder | — | — |
