/**
 * Fabric Datagen。Quilt 无足够 QSL 类名，不走本模板。
 * recipe 骨架只发 **Mojmap 单一映射**（`buildRecipes` / `RecipeOutput`）：`generate` / `RecipeExporter`
 * 是同一方法的 Yarn 名（实测 Mojang 官方 client.txt：1.21.1–1.21.11 Mojmap 一律 `buildRecipes`，
 * 且 `RecipeExporter` 类在 mojmap 中不存在），不是版本差异。Yarn 工程整段换名，禁止同文件混映射。
 * Mojmap 骨架：1.21.1–1.21.10 用 net.minecraft.resources.ResourceLocation；1.21.11 起改名为
 * net.minecraft.resources.Identifier（fromNamespaceAndPath）。禁止混入 Yarn 的 net.minecraft.util.Identifier/of。
 * 26.1.x：FabricPackOutput + FabricBlockLootSubProvider + Identifier（fabric-docs 26.1.2）。
 * **层数轴（与映射轴正交，是真实版本差异）**：`recipeTwoLayer=true`（1.21.3+）时发两层形态——
 * `FabricRecipeProvider` 只实现 `createRecipeProvider(HolderLookup.Provider, RecipeOutput)` 返回 vanilla
 * `RecipeProvider`，配方写在返回对象的**无参** `buildRecipes()` 里；单层带参 `buildRecipes(RecipeOutput)`
 * 仅 1.21.1 有效，1.21.3+ 编译不过（判据见 datagen/index.ts 的 FABRIC_RECIPE_TWO_LAYER_VERSIONS 注释）。
 */
import { toPascalCase } from "./common.js";

export type FabricProviderType =
  | "recipe"
  | "blockstate"
  | "itemmodel"
  | "loottable"
  | "tag"
  | "advancement"
  | "particle"
  | "sound";

function entrypoint(modId: string, pascalName: string, providerClass: string): string {
  return `
// fabric.mod.json entrypoints["fabric-datagen"] = ["com.example.${modId}.datagen.${pascalName}DataGenerator"]
public class ${pascalName}DataGenerator implements DataGeneratorEntrypoint {
    @Override
    public void onInitializeDataGenerator(FabricDataGenerator fabricDataGenerator) {
        FabricDataGenerator.Pack pack = fabricDataGenerator.createPack();
        pack.addProvider(${providerClass}::new);
    }
}
`;
}

export type FabricIdStyle = "ResourceLocation" | "Identifier";

function fabricIdImport(idStyle: FabricIdStyle): string {
  return idStyle === "Identifier"
    ? "import net.minecraft.resources.Identifier;"
    : "import net.minecraft.resources.ResourceLocation;";
}

function fabricIdFactory(idStyle: FabricIdStyle, modId: string, target: string): string {
  const cls = idStyle === "Identifier" ? "Identifier" : "ResourceLocation";
  return `${cls}.fromNamespaceAndPath("${modId}", "${target}")`;
}

export function generateFabric(
  providerType: FabricProviderType,
  modId: string,
  targetName: string,
  classBase: string,
  version26: boolean,
  idStyle: FabricIdStyle = "ResourceLocation",
  recipeTwoLayer = false,
): string {
  const pascalName = classBase || toPascalCase(modId);
  if (version26) return generateFabric261(providerType, modId, targetName, pascalName);
  return generateFabric21(providerType, modId, targetName, pascalName, idStyle, recipeTwoLayer);
}

function generateFabric21(
  providerType: FabricProviderType,
  modId: string,
  targetName: string,
  pascalName: string,
  idStyle: FabricIdStyle = "ResourceLocation",
  recipeTwoLayer = false,
): string {
  const header = `// Fabric Datagen 1.21.x — DataGeneratorEntrypoint + fabric-datagen（${modId}:${targetName}）
package com.example.${modId}.datagen;

import java.util.concurrent.CompletableFuture;
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.minecraft.core.HolderLookup;
`;

  switch (providerType) {
    case "recipe": {
      if (recipeTwoLayer) {
        return `${header}import net.fabricmc.fabric.api.datagen.v1.provider.FabricRecipeProvider;
import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.minecraft.data.recipes.RecipeCategory;
import net.minecraft.data.recipes.RecipeOutput;
import net.minecraft.data.recipes.RecipeProvider;
import net.minecraft.world.item.Items;

public class ${pascalName}RecipeProvider extends FabricRecipeProvider {
    public ${pascalName}RecipeProvider(FabricDataOutput output, CompletableFuture<HolderLookup.Provider> registriesFuture) {
        super(output, registriesFuture);
    }

    // 两层：本类只负责造出 vanilla 生成器，配方写在返回对象的**无参** buildRecipes() 里。
    // 1.21.1 才是带参的单层形态，不要跨版套用。
    @Override
    protected RecipeProvider createRecipeProvider(HolderLookup.Provider registryLookup, RecipeOutput exporter) {
        return new RecipeProvider(registryLookup, exporter) {
            @Override
            public void buildRecipes() {
                shapeless(RecipeCategory.MISC, Items.DIAMOND)
                    .requires(Items.EMERALD)
                    .unlockedBy(getHasName(Items.EMERALD), has(Items.EMERALD))
                    .save(output, "${modId}:${targetName}");
            }
        };
    }

    @Override
    public String getName() {
        return "${pascalName}RecipeProvider";
    }
}
${entrypoint(modId, pascalName, `${pascalName}RecipeProvider`)}
`;
      }
      return `${header}import net.fabricmc.fabric.api.datagen.v1.provider.FabricRecipeProvider;
import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.minecraft.data.recipes.RecipeCategory;
import net.minecraft.data.recipes.RecipeOutput;
import net.minecraft.world.item.Items;

public class ${pascalName}RecipeProvider extends FabricRecipeProvider {
    public ${pascalName}RecipeProvider(FabricDataOutput output, CompletableFuture<HolderLookup.Provider> registriesFuture) {
        super(output, registriesFuture);
    }

    // 单层（仅 1.21.1）：buildRecipes(RecipeOutput) 带参，配方直接写在本类。1.21.3 起改两层形态，勿跨版套用。
    @Override
    public void buildRecipes(RecipeOutput output) {
        shapeless(RecipeCategory.MISC, Items.DIAMOND)
            .requires(Items.EMERALD)
            .unlockedBy("has_emerald", has(Items.EMERALD))
            .save(output, "${modId}:${targetName}");
    }

    @Override
    public String getName() {
        return "${pascalName}RecipeProvider";
    }
}
${entrypoint(modId, pascalName, `${pascalName}RecipeProvider`)}
`;
    }
    case "loottable":
      return `${header}import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricBlockLootTableProvider;

public class ${pascalName}BlockLootTableProvider extends FabricBlockLootTableProvider {
    public ${pascalName}BlockLootTableProvider(FabricDataOutput output, CompletableFuture<HolderLookup.Provider> registryLookup) {
        super(output, registryLookup);
    }

    @Override
    public void generate() {
        // dropSelf for ${modId}:${targetName}
    }
}
${entrypoint(modId, pascalName, `${pascalName}BlockLootTableProvider`)}
`;
    case "tag":
      return `${header}import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricTagProvider;
import net.minecraft.core.registries.Registries;
import net.minecraft.tags.TagKey;
${fabricIdImport(idStyle)}
import net.minecraft.world.item.Item;
import net.minecraft.world.item.Items;

public class ${pascalName}ItemTagProvider extends FabricTagProvider.ItemTagProvider {
    public static final TagKey<Item> EXAMPLE =
        TagKey.create(Registries.ITEM, ${fabricIdFactory(idStyle, modId, targetName)});

    public ${pascalName}ItemTagProvider(FabricDataOutput output, CompletableFuture<HolderLookup.Provider> registriesFuture) {
        super(output, registriesFuture);
    }

    @Override
    protected void addTags(HolderLookup.Provider wrapperLookup) {
        getOrCreateTagBuilder(EXAMPLE).add(Items.DIRT);
    }
}
${entrypoint(modId, pascalName, `${pascalName}ItemTagProvider`)}
`;
    case "blockstate":
    case "itemmodel":
      return `${header}import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricModelProvider;
import net.minecraft.data.models.BlockModelGenerators;
import net.minecraft.data.models.ItemModelGenerators;
import net.minecraft.data.models.model.ModelTemplates;
import net.minecraft.world.item.Items;
import net.minecraft.world.level.block.Blocks;

public class ${pascalName}ModelProvider extends FabricModelProvider {
    public ${pascalName}ModelProvider(FabricDataOutput output) {
        super(output);
    }

    @Override
    public void generateBlockStateModels(BlockModelGenerators gen) {
        ${providerType === "blockstate" ? "gen.createTrivialCube(Blocks.STONE); // TODO: 换成已注册方块" : "// itemmodel：方块状态可留空"}
    }

    @Override
    public void generateItemModels(ItemModelGenerators gen) {
        ${providerType === "itemmodel" ? "gen.generateFlatItem(Items.APPLE, ModelTemplates.FLAT_ITEM); // TODO: 换成已注册物品" : "// blockstate：物品模型可留空"}
    }
}
${entrypoint(modId, pascalName, `${pascalName}ModelProvider`)}
`;
    case "advancement":
      return `${header}import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricAdvancementProvider;
import java.util.function.Consumer;
import net.minecraft.advancements.AdvancementHolder;

public class ${pascalName}AdvancementProvider extends FabricAdvancementProvider {
    public ${pascalName}AdvancementProvider(FabricDataOutput output, CompletableFuture<HolderLookup.Provider> registryLookup) {
        super(output, registryLookup);
    }

    @Override
    public void generateAdvancement(HolderLookup.Provider registryLookup, Consumer<AdvancementHolder> consumer) {
        // TODO: Advancement.Builder 写入 consumer；search_fabric_docs develop_data-generation_advancements
    }
}
${entrypoint(modId, pascalName, `${pascalName}AdvancementProvider`)}
`;
    case "particle":
    case "sound":
      return `${header}
/** 无独立 Fabric ${providerType} Provider。请手写 assets/${modId}/${providerType === "particle" ? "particles" : "sounds.json"} 并 search_fabric_docs。 */
public final class ${pascalName}${providerType === "particle" ? "Particle" : "Sound"}Assets {
    private ${pascalName}${providerType === "particle" ? "Particle" : "Sound"}Assets() {}
}
`;
    default:
      return `${header}
public class ${pascalName}DataGenerator implements DataGeneratorEntrypoint {
    @Override
    public void onInitializeDataGenerator(FabricDataGenerator fabricDataGenerator) {
        FabricDataGenerator.Pack pack = fabricDataGenerator.createPack();
        // ${providerType}：见 search_fabric_docs develop_data-generation_* （${modId}:${targetName}）
    }
}
`;
  }
}

function generateFabric261(
  providerType: FabricProviderType,
  modId: string,
  targetName: string,
  pascalName: string,
): string {
  const header = `// Fabric/Quilt Datagen 26.1 — FabricPackOutput + Identifier（${modId}:${targetName}）
package com.example.${modId}.datagen;

import java.util.concurrent.CompletableFuture;
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.fabricmc.fabric.api.datagen.v1.FabricPackOutput;
import net.minecraft.core.HolderLookup;
`;

  switch (providerType) {
    case "recipe":
      return `${header}import net.fabricmc.fabric.api.datagen.v1.provider.FabricRecipeProvider;
import net.minecraft.data.recipes.RecipeCategory;
import net.minecraft.data.recipes.RecipeOutput;
import net.minecraft.data.recipes.RecipeProvider;
import net.minecraft.world.item.Items;

public class ${pascalName}RecipeProvider extends FabricRecipeProvider {
    public ${pascalName}RecipeProvider(FabricPackOutput output, CompletableFuture<HolderLookup.Provider> registriesFuture) {
        super(output, registriesFuture);
    }

    @Override
    protected RecipeProvider createRecipeProvider(HolderLookup.Provider registryLookup, RecipeOutput exporter) {
        return new RecipeProvider(registryLookup, exporter) {
            @Override
            public void buildRecipes() {
                shapeless(RecipeCategory.MISC, Items.DIAMOND)
                    .requires(Items.EMERALD)
                    .unlockedBy(getHasName(Items.EMERALD), has(Items.EMERALD))
                    .save(output);
            }
        };
    }

    @Override
    public String getName() {
        return "${pascalName}RecipeProvider";
    }
}
${entrypoint(modId, pascalName, `${pascalName}RecipeProvider`)}
`;
    case "loottable":
      return `${header}import net.fabricmc.fabric.api.datagen.v1.provider.FabricBlockLootSubProvider;

public class ${pascalName}BlockLootTableProvider extends FabricBlockLootSubProvider {
    protected ${pascalName}BlockLootTableProvider(FabricPackOutput dataOutput, CompletableFuture<HolderLookup.Provider> registryLookup) {
        super(dataOutput, registryLookup);
    }

    @Override
    public void generate() {
        // dropSelf for ${modId}:${targetName}
    }
}
${entrypoint(modId, pascalName, `${pascalName}BlockLootTableProvider`)}
`;
    case "tag":
      return `${header}import net.fabricmc.fabric.api.datagen.v1.provider.FabricTagsProvider;
import net.minecraft.core.registries.Registries;
import net.minecraft.resources.Identifier;
import net.minecraft.tags.TagKey;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.Items;

public class ${pascalName}ItemTagProvider extends FabricTagsProvider.ItemTagsProvider {
    public static final TagKey<Item> EXAMPLE =
        TagKey.create(Registries.ITEM, Identifier.fromNamespaceAndPath("${modId}", "${targetName}"));

    public ${pascalName}ItemTagProvider(FabricPackOutput output, CompletableFuture<HolderLookup.Provider> registriesFuture) {
        super(output, registriesFuture);
    }

    @Override
    protected void addTags(HolderLookup.Provider wrapperLookup) {
        valueLookupBuilder(EXAMPLE).add(Items.DIRT);
    }
}
${entrypoint(modId, pascalName, `${pascalName}ItemTagProvider`)}
`;
    case "blockstate":
    case "itemmodel":
      return `${header}import net.fabricmc.fabric.api.datagen.v1.provider.FabricModelProvider;
import net.minecraft.client.data.models.BlockModelGenerators;
import net.minecraft.client.data.models.ItemModelGenerators;
import net.minecraft.client.data.models.model.ModelTemplates;
import net.minecraft.world.item.Items;
import net.minecraft.world.level.block.Blocks;

public class ${pascalName}ModelProvider extends FabricModelProvider {
    public ${pascalName}ModelProvider(FabricPackOutput output) {
        super(output);
    }

    @Override
    public void registerModels(BlockModelGenerators blockModels, ItemModelGenerators itemModels) {
        ${providerType === "blockstate" ? "blockModels.createTrivialCube(Blocks.STONE); // TODO: 换成已注册方块" : "itemModels.generateFlatItem(Items.APPLE, ModelTemplates.FLAT_ITEM); // TODO: 换成已注册物品"}
    }
}
${entrypoint(modId, pascalName, `${pascalName}ModelProvider`)}
`;
    case "advancement":
      return `${header}import net.fabricmc.fabric.api.datagen.v1.provider.FabricAdvancementProvider;
import java.util.function.Consumer;
import net.minecraft.advancements.AdvancementHolder;

public class ${pascalName}AdvancementProvider extends FabricAdvancementProvider {
    public ${pascalName}AdvancementProvider(FabricPackOutput output, CompletableFuture<HolderLookup.Provider> registryLookup) {
        super(output, registryLookup);
    }

    @Override
    public void generateAdvancement(HolderLookup.Provider registryLookup, Consumer<AdvancementHolder> consumer) {
        // TODO: search_fabric_docs version=26.1.2 develop_data-generation_advancements
    }
}
${entrypoint(modId, pascalName, `${pascalName}AdvancementProvider`)}
`;
    case "particle":
    case "sound":
      return `${header}
/** 无独立 Fabric ${providerType} Provider。请手写资源 JSON 并 search_fabric_docs(version=26.1.2)。 */
public final class ${pascalName}${providerType === "particle" ? "Particle" : "Sound"}Assets {
    private ${pascalName}${providerType === "particle" ? "Particle" : "Sound"}Assets() {}
}
`;
    default:
      return `${header}
public class ${pascalName}DataGenerator implements DataGeneratorEntrypoint {
    @Override
    public void onInitializeDataGenerator(FabricDataGenerator fabricDataGenerator) {
        FabricDataGenerator.Pack pack = fabricDataGenerator.createPack();
        // ${providerType}：search_fabric_docs 26.1.2/develop_data-generation_* （${modId}:${targetName}）
    }
}
`;
  }
}
