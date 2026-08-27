import { toPascalCase, toUpperSnake } from "./common.js";

export function generateRecipe(modId: string, targetName: string, classBase?: string): string {
  const pascalName = classBase || toPascalCase(modId);
  return `// Recipe Provider — Forge 1.20.1 (${modId}:${targetName})
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
            .save(consumer, "${modId}:${targetName}");

        SimpleCookingRecipeBuilder.smelting(
            Ingredient.of(Items.DIRT),
            RecipeCategory.MISC,
            Items.DIAMOND, 0.1f, 200)
            .unlockedBy("has_dirt", has(Items.DIRT))
            .save(consumer, "${modId}:${targetName}_smelting");
    }

    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeServer(),
            ${pascalName}RecipeProvider::new);
    }
}
`;
}

export function generateBlockState(modId: string, targetName: string, classBase?: string): string {
  const pascalName = classBase || toPascalCase(modId);
  const upperName = toUpperSnake(targetName);
  return `// Block State Provider — Forge 1.20.1
package com.example.${modId}.datagen;

import net.minecraft.data.PackOutput;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraftforge.client.model.generators.BlockStateProvider;
import net.minecraftforge.common.data.ExistingFileHelper;
import net.minecraftforge.data.event.GatherDataEvent;
// 注：DeferredRegister 需在 @Mod 主类构造中挂 modEventBus（register(modEventBus)），否则运行期 get() 会失败（registry demo 通用提醒）
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

export function generateItemModel(modId: string, targetName: string, classBase?: string): string {
  const upperName = toUpperSnake(targetName);
  const pascalName = classBase || toPascalCase(modId);
  return `// Item Model Provider — Forge 1.20.1
package com.example.${modId}.datagen;

import net.minecraft.data.PackOutput;
import net.minecraft.world.item.Item;
import net.minecraftforge.client.model.generators.ItemModelProvider;
import net.minecraftforge.common.data.ExistingFileHelper;
import net.minecraftforge.data.event.GatherDataEvent;
// 注：DeferredRegister 需在 @Mod 主类构造中挂 modEventBus（register(modEventBus)），否则运行期 get() 会失败（registry demo 通用提醒）
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

export function generateLootTable(modId: string, targetName: string, classBase?: string): string {
  const pascalName = classBase || toPascalCase(modId);
  const upperName = toUpperSnake(targetName);
  return `// Loot Table Provider — Forge 1.20.1
package com.example.${modId}.datagen;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import net.minecraft.data.PackOutput;
import net.minecraft.data.loot.BlockLootSubProvider;
import net.minecraft.data.loot.LootTableProvider;
import net.minecraft.world.flag.FeatureFlags;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.storage.loot.parameters.LootContextParamSets;
import net.minecraftforge.data.event.GatherDataEvent;
// 注：DeferredRegister 需在 @Mod 主类构造中挂 modEventBus（register(modEventBus)），否则运行期 get() 会失败（registry demo 通用提醒）
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class ${pascalName}LootTableProvider extends LootTableProvider {
    public static final DeferredRegister<Block> LOOT_DEMO_BLOCKS =
        DeferredRegister.create(ForgeRegistries.BLOCKS, "${modId}");

    public static final RegistryObject<Block> ${upperName}_BLOCK =
        LOOT_DEMO_BLOCKS.register("${targetName}", () -> new Block(BlockBehaviour.Properties.of()));

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
        return ${pascalName}LootTableProvider.LOOT_DEMO_BLOCKS.getEntries().stream()
            .map(RegistryObject::get)
            .collect(Collectors.toList());
    }
}
`;
}

export function generateTag(modId: string, targetName: string, classBase?: string): string {
  const pascalName = classBase || toPascalCase(modId);
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
// 注：DeferredRegister 需在 @Mod 主类构造中挂 modEventBus（register(modEventBus)），否则运行期 get() 会失败（registry demo 通用提醒）
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;
import org.jetbrains.annotations.Nullable;

public class ${pascalName}BlockTagsProvider extends BlockTagsProvider {
    public static final DeferredRegister<Block> TAG_DEMO_BLOCKS =
        DeferredRegister.create(ForgeRegistries.BLOCKS, "${modId}");

    public static final RegistryObject<Block> ${upperName}_BLOCK =
        TAG_DEMO_BLOCKS.register("${targetName}", () -> new Block(BlockBehaviour.Properties.of()));

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

export function generateAdvancement(modId: string, targetName: string, classBase?: string): string {
  const pascalName = classBase || toPascalCase(modId);
  return `// Advancement Provider — Forge 1.20.1 (ForgeAdvancementProvider)
// 1.20.2+ 才有 Holder 包装类型，禁止从 neo 1.21 回植。
package com.example.${modId}.datagen;

import java.util.List;
import java.util.function.Consumer;
import net.minecraft.advancements.Advancement;
import net.minecraft.advancements.critereon.InventoryChangeTrigger;
import net.minecraft.core.HolderLookup;
import net.minecraft.data.PackOutput;
import net.minecraft.world.item.Items;
import net.minecraftforge.common.data.ExistingFileHelper;
import net.minecraftforge.common.data.ForgeAdvancementProvider;
import net.minecraftforge.data.event.GatherDataEvent;

public class ${pascalName}AdvancementProvider extends ForgeAdvancementProvider {
    public ${pascalName}AdvancementProvider(
            PackOutput output,
            java.util.concurrent.CompletableFuture<HolderLookup.Provider> lookup,
            ExistingFileHelper efh) {
        super(output, lookup, efh, List.of(new ${pascalName}AdvancementGenerator()));
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
                Consumer<Advancement> saver,
                ExistingFileHelper existingFileHelper) {
            Advancement.Builder.advancement()
                .addCriterion(
                    "has_${targetName}",
                    InventoryChangeTrigger.TriggerInstance.hasItems(Items.DIAMOND))
                .save(saver, "${modId}:${targetName}");
        }
    }
}
`;
}

export function generateParticle(modId: string, targetName: string, classBase?: string): string {
  const pascalName = classBase || toPascalCase(modId);
  const upper = toUpperSnake(targetName);
  return `// ParticleType 注册 + particles.json — Forge 1.20.1
package com.example.${modId}.init;

import net.minecraft.core.particles.ParticleType;
import net.minecraft.core.particles.SimpleParticleType;
// 注：DeferredRegister 需在 @Mod 主类构造中挂 modEventBus（register(modEventBus)），否则运行期 get() 会失败（registry demo 通用提醒）
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class ${pascalName}Particles {
    public static final DeferredRegister<ParticleType<?>> PARTICLE_TYPES =
        DeferredRegister.create(ForgeRegistries.PARTICLE_TYPES, "${modId}");

    public static final RegistryObject<SimpleParticleType> ${upper} =
        PARTICLE_TYPES.register("${targetName}", () -> new SimpleParticleType(false));

    // assets/${modId}/particles/${targetName}.json
    // { "textures": [ "${modId}:particle/${targetName}" ] }
    // 客户端：RegisterParticleProvidersEvent 中注册 ParticleProvider
}
`;
}

export function generateSound(modId: string, targetName: string, classBase?: string): string {
  const pascalName = classBase || toPascalCase(modId);
  const upper = toUpperSnake(targetName);
  return `// SoundEvent + SoundDefinitionsProvider — Forge 1.20.1
package com.example.${modId}.datagen;

import net.minecraft.data.PackOutput;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.sounds.SoundEvent;
import net.minecraftforge.common.data.ExistingFileHelper;
import net.minecraftforge.common.data.SoundDefinitionsProvider;
import net.minecraftforge.data.event.GatherDataEvent;
// 注：DeferredRegister 需在 @Mod 主类构造中挂 modEventBus（register(modEventBus)），否则运行期 get() 会失败（registry demo 通用提醒）
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class ${pascalName}SoundDefinitionsProvider extends SoundDefinitionsProvider {
    public static final DeferredRegister<SoundEvent> SOUND_EVENTS =
        DeferredRegister.create(ForgeRegistries.SOUND_EVENTS, "${modId}");

    public static final RegistryObject<SoundEvent> ${upper} = SOUND_EVENTS.register(
        "${targetName}",
        () -> SoundEvent.createVariableRangeEvent(
            new ResourceLocation("${modId}", "${targetName}")));

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
                .with(sound(new ResourceLocation("${modId}", "${targetName}"))));
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
