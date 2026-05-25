/**
 * 数据生成辅助模块
 *
 * 生成 DataGen 类代码模板
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

export function generateDatagen(query: DatagenQuery): string {
  const { providerType, modId, targetName, version = "1.20.1" } = query;

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
    default:
      return `// Unknown provider type: ${providerType}`;
  }
}

function generateRecipe(modId: string, targetName: string): string {
  const pascalName = toPascalCase(modId);
  return `// Recipe Provider — DeferredRegister 模式
// 适用于 Forge 1.20.1

import net.minecraft.data.PackOutput;
import net.minecraft.data.recipes.*;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.crafting.Ingredient;
import net.minecraftforge.data.event.GatherDataEvent;

public class ${pascalName}RecipeProvider extends RecipeProvider {
    public ${pascalName}RecipeProvider(PackOutput output) {
        super(output);
    }

    @Override
    protected void buildRecipes(Consumer<FinishedRecipe> consumer) {
        // 有序合成配方示例
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

        // 熔炉配方示例
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
            output -> new ${pascalName}RecipeProvider(output));
    }
}`;
}

function generateBlockState(modId: string, targetName: string): string {
  const pascalName = toPascalCase(modId);
  const upperName = toUpperSnake(targetName);
  return `// Block State Provider — DeferredRegister 模式
// 适用于 Forge 1.20.1

import net.minecraft.data.pack.PackOutput;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.level.block.Block;
import net.minecraftforge.data.event.GatherDataEvent;
import net.minecraftforge.common.data.ExistingFileHelper;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

// DeferredRegister 定义（通常在独立类或主类中）
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, "${modId}");

public static final RegistryObject<Block> ${upperName}_BLOCK =
    BLOCKS.register("${targetName}", () -> new Block(BlockBehaviour.Properties.of()));

// Block State Provider（通常在独立类中）
public class ${pascalName}BlockStatesProvider extends BlockStateProvider {
    public ${pascalName}BlockStatesProvider(PackOutput output) {
        super(output);
    }

    @Override
    protected void registerStatesAndModels() {
        // 使用 RegistryObject.get() 获取已注册的方块
        simpleBlock(${upperName}_BLOCK.get(),
            models().cubeAll("${modId}:${targetName}",
                modLoc("block/${targetName}")));
    }

    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeClient(),
            output -> new ${pascalName}BlockStatesProvider(output));
    }
}`;
}

function generateItemModel(modId: string, targetName: string): string {
  const upperName = toUpperSnake(targetName);
  const pascalName = toPascalCase(modId);
  return `// Item Model Provider — DeferredRegister 模式
// 适用于 Forge 1.20.1

import net.minecraft.data.pack.PackOutput;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.item.Item;
import net.minecraftforge.data.event.GatherDataEvent;
import net.minecraftforge.common.data.ExistingFileHelper;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

// DeferredRegister 定义
public static final DeferredRegister<Item> ITEMS =
    DeferredRegister.create(ForgeRegistries.ITEMS, "${modId}");

public static final RegistryObject<Item> ${upperName}_ITEM =
    ITEMS.register("${targetName}", () -> new Item(new Item.Properties()));

// Item Model Provider
public class ${pascalName}ItemModelProvider extends ItemModelProvider {
    public ${pascalName}ItemModelProvider(PackOutput output, ExistingFileHelper exFileHelper) {
        super(output, "${modId}", exFileHelper);
    }

    @Override
    public void registerModels() {
        // 继承方块模型（用于方块物品）
        withExistingParent("${modId}:${targetName}",
            modLoc("block/${targetName}"));

        // 或者独立物品模型（用于非方块物品）
        // basicItem(${upperName}_ITEM.get());
    }

    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeClient(),
            output -> new ${pascalName}ItemModelProvider(
                output,
                event.getExistingFileHelper()));
    }
}`;
}

function generateLootTable(modId: string, targetName: string): string {
  const pascalName = toPascalCase(modId);
  const upperName = toUpperSnake(targetName);
  return `// Loot Table Provider — DeferredRegister 模式
// 适用于 Forge 1.20.1

import net.minecraft.data.PackOutput;
import net.minecraft.data.pack.DatapackBuiltinEntriesProvider;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.storage.loot.parameters.LootContextParamSets;
import net.minecraftforge.data.event.GatherDataEvent;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

// DeferredRegister 定义
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, "${modId}");

public static final RegistryObject<Block> ${upperName}_BLOCK =
    BLOCKS.register("${targetName}", () -> new Block(BlockBehaviour.Properties.of()));

// Loot Table Provider
public class ${pascalName}LootTableProvider extends LootTableProvider {
    public ${pascalName}LootTableProvider(
            PackOutput output,
            Set<ResourceLocation> requiredTables,
            List<SubProviderEntry> subProviders,
            CompletableFuture<HolderLookup.Provider> registries) {
        super(output, requiredTables, subProviders, registries);
    }

    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeServer(),
            output -> new ${pascalName}LootTableProvider(
                output,
                Collections.emptySet(),
                List.of(
                    new SubProviderEntry(
                        ${pascalName}BlockLootSubProvider::new,
                        LootContextParamSets.BLOCK)),
                event.getLookupProvider()));
    }
}

// Block Loot Sub Provider
public class ${pascalName}BlockLootSubProvider extends BlockLootSubProvider {
    public ${pascalName}BlockLootSubProvider() {
        super(Collections.emptySet(), FeatureFlags.REGISTRY.allFlags());
    }

    @Override
    protected void addTables() {
        // 方块直接掉落自身
        dropSelf(${upperName}_BLOCK.get());

        // 或者带附魔掉落（如矿物）
        // this.add(${upperName}_BLOCK.get(),
        //     createOreDrop(${upperName}_BLOCK.get(), Items.DIAMOND));
    }

    @Override
    protected Iterable<Block> getKnownBlocks() {
        return BLOCKS.getEntries()
            .stream()
            .flatMap(RegistryObject::stream)
            ::iterator;
    }
}`;
}

function generateTag(modId: string, targetName: string): string {
  const pascalName = toPascalCase(modId);
  const upperName = toUpperSnake(targetName);
  return `// Block Tags Provider — DeferredRegister 模式
// 适用于 Forge 1.20.1

import net.minecraft.core.Holder;
import net.minecraft.data.PackOutput;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.Blocks;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraftforge.data.event.GatherDataEvent;
import net.minecraftforge.common.data.ExistingFileHelper;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;
import java.util.concurrent.CompletableFuture;

// DeferredRegister 定义
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, "${modId}");

public static final RegistryObject<Block> ${upperName}_BLOCK =
    BLOCKS.register("${targetName}", () -> new Block(BlockBehaviour.Properties.of()));

// Block Tags Provider
public class ${pascalName}BlockTagsProvider extends BlockTagsProvider {
    public ${pascalName}BlockTagsProvider(
            PackOutput output,
            CompletableFuture<HolderLookup.Provider> registries) {
        super(output, "${modId}", registries);
    }

    @Override
    protected void addTags(HolderLookup.Provider provider) {
        // 引用 Minecraft 标签
        tag(BlockTags.NEEDS_DIAMOND_TOOL)
            .add(${upperName}_BLOCK.get());

        // 自定义标签
        tag(new ResourceLocation("${modId}", "mineable/pickaxe"))
            .add(${upperName}_BLOCK.get());

        // 更多标签示例：
        // tag(BlockTags.MINEABLE_WITH_PICKAXE).add(${upperName}_BLOCK.get());
        // tag(BlockTags.SOLID).add(${upperName}_BLOCK.get());
    }

    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeServer(),
            output -> new ${pascalName}BlockTagsProvider(
                output,
                event.getLookupProvider()));
    }
}`;
}

function toPascalCase(modId: string): string {
  return modId.split(/[_-]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}

function toUpperSnake(name: string): string {
  return name.toUpperCase().replace(/-/g, "_");
}
