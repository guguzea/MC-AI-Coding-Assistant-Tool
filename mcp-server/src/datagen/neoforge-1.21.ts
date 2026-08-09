import { toPascalCase, toUpperSnake } from "./common.js";

export function generateRecipe(modId: string, targetName: string): string {
  const pascalName = toPascalCase(modId);
  void targetName;
  return `// Recipe Provider — NeoForge 1.21.x
package com.example.${modId}.datagen;

import java.util.concurrent.CompletableFuture;
import net.minecraft.core.HolderLookup;
import net.minecraft.data.PackOutput;
import net.minecraft.data.recipes.RecipeCategory;
import net.minecraft.data.recipes.RecipeOutput;
import net.minecraft.data.recipes.RecipeProvider;
import net.minecraft.data.recipes.ShapedRecipeBuilder;
import net.minecraft.data.recipes.SimpleCookingRecipeBuilder;
import net.minecraft.world.item.Items;
import net.minecraft.world.item.crafting.Ingredient;
import net.neoforged.neoforge.data.event.GatherDataEvent;

public class ${pascalName}RecipeProvider extends RecipeProvider {
    public ${pascalName}RecipeProvider(
            PackOutput output, CompletableFuture<HolderLookup.Provider> registries) {
        super(output, registries);
    }

    @Override
    protected void buildRecipes(RecipeOutput output) {
        ShapedRecipeBuilder.shaped(RecipeCategory.MISC, Items.DIAMOND)
            .pattern("AAA")
            .pattern("ABA")
            .pattern("AAA")
            .define('A', Items.DIAMOND)
            .define('B', Items.EMERALD)
            .unlockedBy("has_diamond", has(Items.DIAMOND))
            .save(output);

        SimpleCookingRecipeBuilder.smelting(
                Ingredient.of(Items.DIRT), RecipeCategory.MISC, Items.DIAMOND, 0.1f, 200)
            .unlockedBy("has_dirt", has(Items.DIRT))
            .save(output);
    }

    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeServer(),
            (PackOutput output) -> new ${pascalName}RecipeProvider(output, event.getLookupProvider()));
    }
}
`;
}

export function generateBlockState(modId: string, targetName: string): string {
  const pascalName = toPascalCase(modId);
  const upperName = toUpperSnake(targetName);
  return `// Block State Provider — NeoForge 1.21.x
package com.example.${modId}.datagen;

import net.minecraft.data.PackOutput;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.neoforged.neoforge.client.model.generators.BlockStateProvider;
import net.neoforged.neoforge.common.data.ExistingFileHelper;
import net.neoforged.neoforge.data.event.GatherDataEvent;
import net.neoforged.neoforge.registries.DeferredBlock;
import net.neoforged.neoforge.registries.DeferredRegister;

public class ${pascalName}BlockStatesProvider extends BlockStateProvider {
    public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks("${modId}");

    public static final DeferredBlock<Block> ${upperName}_BLOCK =
        BLOCKS.register("${targetName}", () -> new Block(BlockBehaviour.Properties.of()));

    public ${pascalName}BlockStatesProvider(PackOutput output, ExistingFileHelper existingFileHelper) {
        super(output, "${modId}", existingFileHelper);
    }

    @Override
    protected void registerStatesAndModels() {
        simpleBlock(${upperName}_BLOCK.get());
    }

    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeClient(),
            (PackOutput output) -> new ${pascalName}BlockStatesProvider(
                output, event.getExistingFileHelper()));
    }
}
`;
}

export function generateItemModel(modId: string, targetName: string): string {
  const pascalName = toPascalCase(modId);
  const upperName = toUpperSnake(targetName);
  return `// Item Model Provider — NeoForge 1.21.x
package com.example.${modId}.datagen;

import net.minecraft.data.PackOutput;
import net.minecraft.world.item.Item;
import net.neoforged.neoforge.client.model.generators.ItemModelProvider;
import net.neoforged.neoforge.common.data.ExistingFileHelper;
import net.neoforged.neoforge.data.event.GatherDataEvent;
import net.neoforged.neoforge.registries.DeferredItem;
import net.neoforged.neoforge.registries.DeferredRegister;

public class ${pascalName}ItemModelProvider extends ItemModelProvider {
    public static final DeferredRegister.Items ITEMS = DeferredRegister.createItems("${modId}");

    public static final DeferredItem<Item> ${upperName}_ITEM =
        ITEMS.register("${targetName}", () -> new Item(new Item.Properties()));

    public ${pascalName}ItemModelProvider(PackOutput output, ExistingFileHelper existingFileHelper) {
        super(output, "${modId}", existingFileHelper);
    }

    @Override
    protected void registerModels() {
        basicItem(${upperName}_ITEM.get());
    }

    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeClient(),
            (PackOutput output) -> new ${pascalName}ItemModelProvider(
                output, event.getExistingFileHelper()));
    }
}
`;
}

export function generateLootTable(modId: string, targetName: string): string {
  const pascalName = toPascalCase(modId);
  const upperName = toUpperSnake(targetName);
  return `// Loot Table Provider — NeoForge 1.21.x
package com.example.${modId}.datagen;

import java.util.List;
import java.util.Set;
import net.minecraft.data.PackOutput;
import net.minecraft.data.loot.BlockLootSubProvider;
import net.minecraft.data.loot.LootTableProvider;
import net.minecraft.world.flag.FeatureFlags;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.storage.loot.parameters.LootContextParamSets;
import net.neoforged.neoforge.data.event.GatherDataEvent;
import net.neoforged.neoforge.registries.DeferredBlock;
import net.neoforged.neoforge.registries.DeferredRegister;

public class ${pascalName}LootTableProvider extends LootTableProvider {
    public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks("${modId}");

    public static final DeferredBlock<Block> ${upperName}_BLOCK =
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
    protected void generate() {
        dropSelf(${pascalName}LootTableProvider.${upperName}_BLOCK.get());
    }

    @Override
    protected Iterable<Block> getKnownBlocks() {
        return List.of(${pascalName}LootTableProvider.${upperName}_BLOCK.get());
    }
}
`;
}

export function generateTag(modId: string, targetName: string): string {
  const pascalName = toPascalCase(modId);
  const upperName = toUpperSnake(targetName);
  return `// Block Tags Provider — NeoForge 1.21.x
package com.example.${modId}.datagen;

import java.util.concurrent.CompletableFuture;
import net.minecraft.core.HolderLookup;
import net.minecraft.data.PackOutput;
import net.minecraft.tags.BlockTags;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.neoforged.neoforge.common.data.BlockTagsProvider;
import net.neoforged.neoforge.common.data.ExistingFileHelper;
import net.neoforged.neoforge.data.event.GatherDataEvent;
import net.neoforged.neoforge.registries.DeferredBlock;
import net.neoforged.neoforge.registries.DeferredRegister;
import org.jetbrains.annotations.Nullable;

public class ${pascalName}BlockTagsProvider extends BlockTagsProvider {
    public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks("${modId}");

    public static final DeferredBlock<Block> ${upperName}_BLOCK =
        BLOCKS.register("${targetName}", () -> new Block(BlockBehaviour.Properties.of()));

    public ${pascalName}BlockTagsProvider(
            PackOutput output,
            CompletableFuture<HolderLookup.Provider> lookup,
            @Nullable ExistingFileHelper existingFileHelper) {
        super(output, lookup, "${modId}", existingFileHelper);
    }

    @Override
    protected void addTags(HolderLookup.Provider provider) {
        tag(BlockTags.NEEDS_DIAMOND_TOOL).add(${upperName}_BLOCK.get());
        tag(BlockTags.MINEABLE_WITH_PICKAXE).add(${upperName}_BLOCK.get());
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

export function generateAdvancement(modId: string, targetName: string): string {
  const pascalName = toPascalCase(modId);
  return `// Advancement Provider — NeoForge 1.21.x (use NeoForge AdvancementProvider)
package com.example.${modId}.datagen;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;
import net.minecraft.advancements.Advancement;
import net.minecraft.advancements.AdvancementHolder;
import net.minecraft.advancements.critereon.InventoryChangeTrigger;
import net.minecraft.core.HolderLookup;
import net.minecraft.data.PackOutput;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.item.Items;
import net.neoforged.neoforge.common.data.AdvancementProvider;
import net.neoforged.neoforge.common.data.ExistingFileHelper;
import net.neoforged.neoforge.data.event.GatherDataEvent;

public class ${pascalName}AdvancementProvider extends AdvancementProvider {
    public ${pascalName}AdvancementProvider(
            PackOutput output,
            CompletableFuture<HolderLookup.Provider> lookupProvider,
            ExistingFileHelper existingFileHelper) {
        super(output, lookupProvider, existingFileHelper, List.of(new ${pascalName}AdvancementGenerator()));
    }

    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeServer(),
            (PackOutput output) -> new ${pascalName}AdvancementProvider(
                output,
                event.getLookupProvider(),
                event.getExistingFileHelper()));
    }

    private static final class ${pascalName}AdvancementGenerator implements AdvancementGenerator {
        @Override
        public void generate(
                HolderLookup.Provider registries,
                Consumer<AdvancementHolder> saver,
                ExistingFileHelper existingFileHelper) {
            Advancement.Builder.advancement()
                .addCriterion(
                    "has_${targetName}",
                    InventoryChangeTrigger.TriggerInstance.hasItems(Items.DIAMOND))
                .save(
                    saver,
                    ResourceLocation.fromNamespaceAndPath("${modId}", "${targetName}"),
                    existingFileHelper);
        }
    }
}
`;
}

export function generateParticle(modId: string, targetName: string): string {
  const pascalName = toPascalCase(modId);
  const upper = toUpperSnake(targetName);
  return `// ParticleType + ParticleDescriptionProvider — NeoForge 1.21.x
package com.example.${modId}.datagen;

import net.minecraft.core.particles.ParticleType;
import net.minecraft.core.particles.SimpleParticleType;
import net.minecraft.data.PackOutput;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.neoforge.common.data.ExistingFileHelper;
import net.neoforged.neoforge.common.data.ParticleDescriptionProvider;
import net.neoforged.neoforge.data.event.GatherDataEvent;
import net.neoforged.neoforge.registries.DeferredHolder;
import net.neoforged.neoforge.registries.DeferredRegister;
import net.neoforged.neoforge.registries.NeoForgeRegistries;

public class ${pascalName}ParticleDescriptionProvider extends ParticleDescriptionProvider {
    public static final DeferredRegister<ParticleType<?>> PARTICLE_TYPES =
        DeferredRegister.create(NeoForgeRegistries.PARTICLE_TYPES, "${modId}");

    public static final DeferredHolder<ParticleType<?>, SimpleParticleType> ${upper} =
        PARTICLE_TYPES.register("${targetName}", () -> new SimpleParticleType(false));

    public ${pascalName}ParticleDescriptionProvider(
            PackOutput output, String modId, ExistingFileHelper existingFileHelper) {
        super(output, modId, existingFileHelper);
    }

    @Override
    protected void addDescriptions() {
        spriteSet(
            ResourceLocation.fromNamespaceAndPath("${modId}", "${targetName}"),
            ResourceLocation.fromNamespaceAndPath("${modId}", "particle/${targetName}"));
    }

    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeClient(),
            (PackOutput output) -> new ${pascalName}ParticleDescriptionProvider(
                output, "${modId}", event.getExistingFileHelper()));
    }
}

// 客户端另注册 ParticleProvider：RegisterParticleProvidersEvent
`;
}

export function generateSound(modId: string, targetName: string): string {
  const pascalName = toPascalCase(modId);
  const upper = toUpperSnake(targetName);
  return `// SoundEvent + SoundDefinitionsProvider — NeoForge 1.21.x
package com.example.${modId}.datagen;

import net.minecraft.data.PackOutput;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.sounds.SoundEvent;
import net.neoforged.neoforge.common.data.ExistingFileHelper;
import net.neoforged.neoforge.common.data.SoundDefinitionsProvider;
import net.neoforged.neoforge.data.event.GatherDataEvent;
import net.neoforged.neoforge.registries.DeferredHolder;
import net.neoforged.neoforge.registries.DeferredRegister;
import net.neoforged.neoforge.registries.NeoForgeRegistries;

public class ${pascalName}SoundDefinitionsProvider extends SoundDefinitionsProvider {
    public static final DeferredRegister<SoundEvent> SOUND_EVENTS =
        DeferredRegister.create(NeoForgeRegistries.SOUND_EVENTS, "${modId}");

    public static final DeferredHolder<SoundEvent, SoundEvent> ${upper} = SOUND_EVENTS.register(
        "${targetName}",
        () -> SoundEvent.createVariableRangeEvent(
            ResourceLocation.fromNamespaceAndPath("${modId}", "${targetName}")));

    public ${pascalName}SoundDefinitionsProvider(
            PackOutput output, ExistingFileHelper existingFileHelper) {
        super(output, "${modId}", existingFileHelper);
    }

    @Override
    public void registerSounds() {
        add(
            ${upper}.get(),
            definition()
                .subtitle("subtitles.${modId}.${targetName}")
                .with(sound(ResourceLocation.fromNamespaceAndPath("${modId}", "${targetName}"))));
    }

    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeClient(),
            (PackOutput output) -> new ${pascalName}SoundDefinitionsProvider(
                output, event.getExistingFileHelper()));
    }
}
`;
}

export type NeoForge21ProviderType =
  | "recipe"
  | "blockstate"
  | "itemmodel"
  | "loottable"
  | "tag"
  | "advancement"
  | "particle"
  | "sound";

export function generateNeoForge21(
  providerType: NeoForge21ProviderType,
  modId: string,
  targetName: string,
): string {
  switch (providerType) {
    case "recipe":
      return generateRecipe(modId, targetName);
    case "blockstate":
      return generateBlockState(modId, targetName);
    case "itemmodel":
      return generateItemModel(modId, targetName);
    case "loottable":
      return generateLootTable(modId, targetName);
    case "tag":
      return generateTag(modId, targetName);
    case "advancement":
      return generateAdvancement(modId, targetName);
    case "particle":
      return generateParticle(modId, targetName);
    case "sound":
      return generateSound(modId, targetName);
    default:
      throw new Error(`Unknown NeoForge 1.21 provider: ${providerType}`);
  }
}
