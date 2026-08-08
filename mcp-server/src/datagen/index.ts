/**
 * 数据生成辅助模块
 *
 * 生成 DataGen 类代码模板（Forge 1.20.1 可编译）
 *
 * 模板依据：data/forge_1.20.1/forge-docs/
 *   - datagen_server_recipes.md
 *   - datagen_server_loottables.md
 *   - datagen_server_tags.md
 *   - datagen_client_modelproviders.md
 */

export interface DatagenQuery {
  providerType: "recipe" | "blockstate" | "itemmodel" | "loottable" | "tag";
  modId: string;
  targetName: string;
  version?: string;
}

export interface DatagenResult {
  code: string | null;
  usedModId: string;
  usedTargetName: string;
  warnings?: string[];
  errors?: string[];
}

const IDEAL_ID = /^[a-z][a-z0-9_]*$/;

/** 归一化 modId/targetName：大写→小写，./-→_；无法得到合法标识则返回 null */
export function normalizeModIdentifier(raw: string): { value: string; warned: boolean } | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  let warned = false;
  if (!IDEAL_ID.test(trimmed)) warned = true;
  let v = trimmed.toLowerCase().replace(/[.\-]+/g, "_").replace(/[^a-z0-9_]/g, "_");
  v = v.replace(/_+/g, "_").replace(/^_|_$/g, "");
  if (!v || !/^[a-z]/.test(v)) {
    if (/^[0-9]/.test(v)) {
      v = `m_${v}`;
      warned = true;
    } else {
      return null;
    }
  }
  if (!IDEAL_ID.test(v)) return null;
  return { value: v, warned: warned || v !== trimmed };
}

export function generateDatagen(query: DatagenQuery): DatagenResult {
  const { providerType, version = "1.20.1" } = query;
  const warnings: string[] = [];

  const mod = normalizeModIdentifier(query.modId);
  const target = normalizeModIdentifier(query.targetName);
  if (!mod || !target) {
    return {
      code: null,
      usedModId: query.modId,
      usedTargetName: query.targetName,
      errors: [
        "无法归一化 modId/targetName：请使用字母开头，可含数字与下划线（非法字符会被尝试转为下划线）",
      ],
    };
  }
  if (mod.warned) {
    warnings.push(
      `modId "${query.modId}" 已归一化为 "${mod.value}"（Forge 虽偶允许 ./-，模板使用下划线更安全）`,
    );
  }
  if (target.warned) {
    warnings.push(`targetName "${query.targetName}" 已归一化为 "${target.value}"`);
  }

  const modId = mod.value;
  const targetName = target.value;
  void version;

  let code: string;
  switch (providerType) {
    case "recipe":
      code = generateRecipe(modId, targetName);
      break;
    case "blockstate":
      code = generateBlockState(modId, targetName);
      break;
    case "itemmodel":
      code = generateItemModel(modId, targetName);
      break;
    case "loottable":
      code = generateLootTable(modId, targetName);
      break;
    case "tag":
      code = generateTag(modId, targetName);
      break;
    default:
      return {
        code: null,
        usedModId: modId,
        usedTargetName: targetName,
        errors: [`Unknown provider type: ${providerType}`],
        warnings: warnings.length ? warnings : undefined,
      };
  }

  return {
    code,
    usedModId: modId,
    usedTargetName: targetName,
    warnings: warnings.length ? warnings : undefined,
  };
}

function generateRecipe(modId: string, targetName: string): string {
  const pascalName = toPascalCase(modId);
  return `// Recipe Provider — Forge 1.20.1
package com.example.${modId}.datagen;

import java.util.function.Consumer;
import net.minecraft.data.PackOutput;
import net.minecraft.data.recipes.FinishedRecipe;
import net.minecraft.data.recipes.RecipeCategory;
import net.minecraft.data.recipes.RecipeProvider;
import net.minecraft.data.recipes.ShapedRecipeBuilder;
import net.minecraft.data.recipes.SimpleCookingRecipeBuilder;
import net.minecraft.world.item.Items;
import net.minecraft.world.item.crafting.Ingredient;
import net.minecraftforge.common.data.ExistingFileHelper;
import net.minecraftforge.data.event.GatherDataEvent;

public class ${pascalName}RecipeProvider extends RecipeProvider {
    public ${pascalName}RecipeProvider(PackOutput output) {
        super(output);
    }

    @Override
    protected void buildRecipes(Consumer<FinishedRecipe> consumer) {
        ShapedRecipeBuilder.shaped(RecipeCategory.MISC, Items.DIAMOND, 1)
            .pattern("ABA")
            .pattern("CDC")
            .pattern("ABA")
            .define('A', Items.DIAMOND)
            .define('B', Items.EMERALD)
            .define('C', Items.IRON_INGOT)
            .define('D', Items.AIR)
            .unlockedBy("has_diamond", has(Items.DIAMOND))
            .save(consumer);

        SimpleCookingRecipeBuilder.smelting(
            Ingredient.of(Items.DIRT),
            RecipeCategory.MISC,
            Items.DIAMOND, 0.1f, 200)
            .unlockedBy("has_dirt", has(Items.DIRT))
            .save(consumer);
    }

    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeServer(),
            ${pascalName}RecipeProvider::new);
    }
}
`;
}

function generateBlockState(modId: string, targetName: string): string {
  const pascalName = toPascalCase(modId);
  const upperName = toUpperSnake(targetName);
  return `// Block State Provider — Forge 1.20.1
package com.example.${modId}.datagen;

import net.minecraft.data.PackOutput;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraftforge.client.model.generators.BlockStateProvider;
import net.minecraftforge.common.data.ExistingFileHelper;
import net.minecraftforge.data.event.GatherDataEvent;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class ${pascalName}BlockStatesProvider extends BlockStateProvider {
    public static final DeferredRegister<Block> BLOCKS =
        DeferredRegister.create(ForgeRegistries.BLOCKS, "${modId}");

    public static final RegistryObject<Block> ${upperName}_BLOCK =
        BLOCKS.register("${targetName}", () -> new Block(BlockBehaviour.Properties.of()));

    public ${pascalName}BlockStatesProvider(PackOutput output, ExistingFileHelper efh) {
        super(output, "${modId}", efh);
    }

    @Override
    protected void registerStatesAndModels() {
        simpleBlock(${upperName}_BLOCK.get());
    }

    public static void gatherData(GatherDataEvent event) {
        ExistingFileHelper efh = event.getExistingFileHelper();
        event.getGenerator().addProvider(
            event.includeClient(),
            (PackOutput output) -> new ${pascalName}BlockStatesProvider(output, efh));
    }
}
`;
}

function generateItemModel(modId: string, targetName: string): string {
  const upperName = toUpperSnake(targetName);
  const pascalName = toPascalCase(modId);
  return `// Item Model Provider — Forge 1.20.1
package com.example.${modId}.datagen;

import net.minecraft.data.PackOutput;
import net.minecraft.world.item.Item;
import net.minecraftforge.client.model.generators.ItemModelProvider;
import net.minecraftforge.common.data.ExistingFileHelper;
import net.minecraftforge.data.event.GatherDataEvent;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class ${pascalName}ItemModelProvider extends ItemModelProvider {
    public static final DeferredRegister<Item> ITEMS =
        DeferredRegister.create(ForgeRegistries.ITEMS, "${modId}");

    public static final RegistryObject<Item> ${upperName}_ITEM =
        ITEMS.register("${targetName}", () -> new Item(new Item.Properties()));

    public ${pascalName}ItemModelProvider(PackOutput output, ExistingFileHelper efh) {
        super(output, "${modId}", efh);
    }

    @Override
    protected void registerModels() {
        basicItem(${upperName}_ITEM.get());
    }

    public static void gatherData(GatherDataEvent event) {
        ExistingFileHelper efh = event.getExistingFileHelper();
        event.getGenerator().addProvider(
            event.includeClient(),
            (PackOutput output) -> new ${pascalName}ItemModelProvider(output, efh));
    }
}
`;
}

function generateLootTable(modId: string, targetName: string): string {
  const pascalName = toPascalCase(modId);
  const upperName = toUpperSnake(targetName);
  return `// Loot Table Provider — Forge 1.20.1
package com.example.${modId}.datagen;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import net.minecraft.data.PackOutput;
import net.minecraft.data.loot.BlockLootSubProvider;
import net.minecraft.data.loot.LootTableProvider;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.flag.FeatureFlags;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.storage.loot.parameters.LootContextParamSets;
import net.minecraftforge.data.event.GatherDataEvent;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class ${pascalName}LootTableProvider extends LootTableProvider {
    public static final DeferredRegister<Block> BLOCKS =
        DeferredRegister.create(ForgeRegistries.BLOCKS, "${modId}");

    public static final RegistryObject<Block> ${upperName}_BLOCK =
        BLOCKS.register("${targetName}", () -> new Block(BlockBehaviour.Properties.of()));

    public ${pascalName}LootTableProvider(PackOutput output) {
        super(
            output,
            Set.of(),
            List.of(
                new LootTableProvider.SubProviderEntry(
                    ${pascalName}BlockLoot::new,
                    LootContextParamSets.BLOCK)));
    }

    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeServer(),
            ${pascalName}LootTableProvider::new);
    }
}

class ${pascalName}BlockLoot extends BlockLootSubProvider {
    public ${pascalName}BlockLoot() {
        super(Set.of(), FeatureFlags.REGISTRY.allFlags());
    }

    @Override
    public void generate() {
        dropSelf(${pascalName}LootTableProvider.${upperName}_BLOCK.get());
    }

    @Override
    protected Iterable<Block> getKnownBlocks() {
        return ${pascalName}LootTableProvider.BLOCKS.getEntries().stream()
            .map(RegistryObject::get)
            .collect(Collectors.toList());
    }
}
`;
}

function generateTag(modId: string, targetName: string): string {
  const pascalName = toPascalCase(modId);
  const upperName = toUpperSnake(targetName);
  return `// Block Tags Provider — Forge 1.20.1
package com.example.${modId}.datagen;

import java.util.concurrent.CompletableFuture;
import net.minecraft.core.HolderLookup;
import net.minecraft.data.PackOutput;
import net.minecraft.tags.BlockTags;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraftforge.common.data.BlockTagsProvider;
import net.minecraftforge.common.data.ExistingFileHelper;
import net.minecraftforge.data.event.GatherDataEvent;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;
import org.jetbrains.annotations.Nullable;

public class ${pascalName}BlockTagsProvider extends BlockTagsProvider {
    public static final DeferredRegister<Block> BLOCKS =
        DeferredRegister.create(ForgeRegistries.BLOCKS, "${modId}");

    public static final RegistryObject<Block> ${upperName}_BLOCK =
        BLOCKS.register("${targetName}", () -> new Block(BlockBehaviour.Properties.of()));

    public ${pascalName}BlockTagsProvider(
            PackOutput output,
            CompletableFuture<HolderLookup.Provider> lookup,
            @Nullable ExistingFileHelper efh) {
        super(output, lookup, "${modId}", efh);
    }

    @Override
    protected void addTags(HolderLookup.Provider provider) {
        tag(BlockTags.NEEDS_DIAMOND_TOOL)
            .add(${upperName}_BLOCK.get());
        tag(BlockTags.MINEABLE_WITH_PICKAXE)
            .add(${upperName}_BLOCK.get());
    }

    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeServer(),
            (PackOutput output) -> new ${pascalName}BlockTagsProvider(
                output,
                event.getLookupProvider(),
                event.getExistingFileHelper()));
    }
}
`;
}

function toPascalCase(modId: string): string {
  return modId.split(/[_-]/).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}

function toUpperSnake(name: string): string {
  return name.toUpperCase().replace(/-/g, "_");
}
