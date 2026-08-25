/**
 * Fabric Datagen。Quilt 无足够 QSL 类名，不走本模板。
 * 1.21.1 / 1.21.3 / 1.21.4 / 1.21.8：FabricRecipeProvider#generate；1.21.10 / 1.21.11：#buildRecipes。
 * Mojmap 骨架：1.21.1–1.21.10 用 net.minecraft.resources.ResourceLocation；1.21.11 起改名为
 * net.minecraft.resources.Identifier（fromNamespaceAndPath）。禁止混入 Yarn 的 net.minecraft.util.Identifier/of。
 * 26.1.x：FabricPackOutput + FabricBlockLootSubProvider + Identifier（fabric-docs 26.1.2）。
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
  recipeMethod: "generate" | "buildRecipes" = "buildRecipes",
  idStyle: FabricIdStyle = "ResourceLocation",
): string {
  const pascalName = classBase || toPascalCase(modId);
  if (version26) return generateFabric261(providerType, modId, targetName, pascalName);
  return generateFabric21(providerType, modId, targetName, pascalName, recipeMethod, idStyle);
}

function generateFabric21(
  providerType: FabricProviderType,
  modId: string,
  targetName: string,
  pascalName: string,
  recipeMethod: "generate" | "buildRecipes" = "buildRecipes",
  idStyle: FabricIdStyle = "ResourceLocation",
): string {
  const header = `// Fabric Datagen 1.21.x — DataGeneratorEntrypoint + fabric-datagen（${modId}:${targetName}）
package com.example.${modId}.datagen;

import java.util.concurrent.CompletableFuture;
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.minecraft.core.HolderLookup;
`;

  switch (providerType) {
    case "recipe":
      return `${header}import net.fabricmc.fabric.api.datagen.v1.provider.FabricRecipeProvider;
import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.minecraft.data.recipes.RecipeCategory;
import net.minecraft.data.recipes.RecipeOutput;
import net.minecraft.world.item.Items;

public class ${pascalName}RecipeProvider extends FabricRecipeProvider {
    public ${pascalName}RecipeProvider(FabricDataOutput output, CompletableFuture<HolderLookup.Provider> registriesFuture) {
        super(output, registriesFuture);
    }

    // Mojmap: RecipeOutput；Yarn 工程改为 RecipeExporter（禁止混映射）
    @Override
    public void ${recipeMethod}(RecipeOutput exporter) {
        shapeless(RecipeCategory.MISC, Items.DIAMOND)
            .requires(Items.EMERALD)
            .unlockedBy("has_emerald", has(Items.EMERALD))
            .save(exporter, "${modId}:${targetName}");
    }

    @Override
    public String getName() {
        return "${pascalName}RecipeProvider";
    }
}
${entrypoint(modId, pascalName, `${pascalName}RecipeProvider`)}
`;
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
import net.fabricmc.fabric.api.datagen.v1.provider.FabricTagsProvider;
import net.minecraft.core.registries.Registries;
import net.minecraft.tags.TagKey;
${fabricIdImport(idStyle)}
import net.minecraft.world.item.Item;
import net.minecraft.world.item.Items;

public class ${pascalName}ItemTagProvider extends FabricTagsProvider.ItemTagsProvider {
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
