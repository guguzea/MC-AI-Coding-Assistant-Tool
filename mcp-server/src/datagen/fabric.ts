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

/**
 * DataGeneratorEntrypoint 入口类。**本文件里唯一的 public 顶层类必须是它**：
 * ① 一条 Java 源文件只能有一个 public 顶层类；② fabric-loader 的 DefaultLanguageAdapter 用
 * `Class.getDeclaredConstructor().newInstance()` 实例化 entrypoint（实测 0.19.5 的
 * DefaultLanguageAdapter.class 常量池无 setAccessible）⇒ 包私有类会 IllegalAccessException。
 * 故 provider 类降为同文件的包私有顶层类，文件名取本类名（write-helper 按顶层类型改名）。
 */
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
  tagBuilderUsesLookup = false,
  // 1.21.4 起模型 datagen 从旧包换到 client 包（旧包→新包，逐档证据见 generateFabric21 的 model 分支）。
  // 默认 false = 保持旧包 ⇒ 既有 8 参调用（≤1.21.3）的产物逐字不变。
  modelProviderClient = false,
  // 1.21.8 起才有 FabricSoundsProvider（1.21.8/1.21.10/1.21.11 摘要实测）。
  // 默认 false ⇒ 既有调用（未传该位）的 sound 产物逐字不变。
  soundProviderAvailable = false,
): string {
  const pascalName = classBase || toPascalCase(modId);
  if (version26) return generateFabric261(providerType, modId, targetName, pascalName);
  return generateFabric21(
    providerType,
    modId,
    targetName,
    pascalName,
    idStyle,
    recipeTwoLayer,
    tagBuilderUsesLookup,
    modelProviderClient,
    soundProviderAvailable,
  );
}

function generateFabric21(
  providerType: FabricProviderType,
  modId: string,
  targetName: string,
  pascalName: string,
  idStyle: FabricIdStyle = "ResourceLocation",
  recipeTwoLayer = false,
  tagBuilderUsesLookup = false,
  modelProviderClient = false,
  soundProviderAvailable = false,
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
${entrypoint(modId, pascalName, `${pascalName}RecipeProvider`)}
class ${pascalName}RecipeProvider extends FabricRecipeProvider {
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
`;
      }
      return `${header}import net.fabricmc.fabric.api.datagen.v1.provider.FabricRecipeProvider;
import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.minecraft.data.recipes.RecipeCategory;
import net.minecraft.data.recipes.RecipeOutput;
import net.minecraft.world.item.Items;
${entrypoint(modId, pascalName, `${pascalName}RecipeProvider`)}
class ${pascalName}RecipeProvider extends FabricRecipeProvider {
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
`;
    }
    case "loottable":
      return `${header}import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricBlockLootTableProvider;
${entrypoint(modId, pascalName, `${pascalName}BlockLootTableProvider`)}
class ${pascalName}BlockLootTableProvider extends FabricBlockLootTableProvider {
    public ${pascalName}BlockLootTableProvider(FabricDataOutput output, CompletableFuture<HolderLookup.Provider> registryLookup) {
        super(output, registryLookup);
    }

    @Override
    public void generate() {
        // dropSelf for ${modId}:${targetName}
    }
}
`;
    case "tag":
      return `${header}import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricTagProvider;
import net.minecraft.core.registries.Registries;
import net.minecraft.tags.TagKey;
${fabricIdImport(idStyle)}
import net.minecraft.world.item.Item;
import net.minecraft.world.item.Items;
${entrypoint(modId, pascalName, `${pascalName}ItemTagProvider`)}
class ${pascalName}ItemTagProvider extends FabricTagProvider.ItemTagProvider {
    public static final TagKey<Item> EXAMPLE =
        TagKey.create(Registries.ITEM, ${fabricIdFactory(idStyle, modId, targetName)});

    public ${pascalName}ItemTagProvider(FabricDataOutput output, CompletableFuture<HolderLookup.Provider> registriesFuture) {
        super(output, registriesFuture);
    }

    @Override
    protected void addTags(HolderLookup.Provider wrapperLookup) {
        ${tagBuilderUsesLookup ? "valueLookupBuilder" : "getOrCreateTagBuilder"}(EXAMPLE).add(Items.DIRT);
    }
}
`;
    case "blockstate":
    case "itemmodel": {
      // 模型 datagen 的包名在 **1.21.4** 换过一次（两处独立来源、逐档同向）：
      //   Fabric API 侧：net.fabricmc.fabric.api.datagen.v1.provider.FabricModelProvider（1.21.1 / 1.21.3）
      //     → net.fabricmc.fabric.api.client.datagen.v1.provider.FabricModelProvider（1.21.4+）
      //   vanilla 侧：net.minecraft.data.models[.model].{BlockModelGenerators,ItemModelGenerators,ModelTemplates}
      //     → net.minecraft.client.data.models[.model].*（1.21.4+）
      // 证据①（Fabric API 摘要的 fqcn 字段）：
      //   mcp-server/data/loader-api-summaries/1.21.1-fabric-api.json 与 1.21.3-fabric-api.json
      //     ⇒ net.fabricmc.fabric.api.datagen.v1.provider.FabricModelProvider
      //   mcp-server/data/loader-api-summaries/1.21.4-fabric-api.json
      //     ⇒ net.fabricmc.fabric.api.client.datagen.v1.provider.FabricModelProvider
      // 证据②（yarn↔mojmap 对照的 mojFqcn 字段）：
      //   data/_yarn-mojmap-pairs/yarn-mojmap-1.21.1.json / -1.21.3.json
      //     ⇒ net.minecraft.data.models.BlockModelGenerators / net.minecraft.data.models.model.ModelTemplates
      //   data/_yarn-mojmap-pairs/yarn-mojmap-1.21.4.json
      //     ⇒ net.minecraft.client.data.models.BlockModelGenerators / ...client.data.models.model.ModelTemplates
      // modelProviderClient=false（默认）保持旧包 ⇒ 既有 8 参调用的产物逐字不变。
      const modelPkg = modelProviderClient
        ? {
            provider: "net.fabricmc.fabric.api.client.datagen.v1.provider.FabricModelProvider",
            models: "net.minecraft.client.data.models",
          }
        : {
            provider: "net.fabricmc.fabric.api.datagen.v1.provider.FabricModelProvider",
            models: "net.minecraft.data.models",
          };
      // ⚠️ P0 回归修正（2026-10-21）：修 §四 #16 包名分叉时，这段重写 import 把
      // `import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;` 整行挤掉了 —— 行数不变、
      // tsc 不报（模板是字符串），但生成物里 FabricDataOutput 未定义 ⇒ javac 必红。
      // HEAD 版第 201 行原有一行，属本轮误删。该 import 两条分叉共用同一 FQCN（不随 1.21.4 改包）。
      return `${header}import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import ${modelPkg.provider};
import ${modelPkg.models}.BlockModelGenerators;
import ${modelPkg.models}.ItemModelGenerators;
import ${modelPkg.models}.model.ModelTemplates;
import net.minecraft.world.item.Items;
import net.minecraft.world.level.block.Blocks;
${entrypoint(modId, pascalName, `${pascalName}ModelProvider`)}
class ${pascalName}ModelProvider extends FabricModelProvider {
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
`;
    }
    case "advancement":
      return `${header}import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricAdvancementProvider;
import java.util.function.Consumer;
import net.minecraft.advancements.AdvancementHolder;
${entrypoint(modId, pascalName, `${pascalName}AdvancementProvider`)}
class ${pascalName}AdvancementProvider extends FabricAdvancementProvider {
    public ${pascalName}AdvancementProvider(FabricDataOutput output, CompletableFuture<HolderLookup.Provider> registryLookup) {
        super(output, registryLookup);
    }

    @Override
    public void generateAdvancement(HolderLookup.Provider registryLookup, Consumer<AdvancementHolder> consumer) {
        // TODO: Advancement.Builder 写入 consumer；search_fabric_docs develop_data-generation_advancements
    }
}
`;
    case "sound": {
      // 1.21.8 起才有 FabricSoundsProvider（1.21.8/1.21.10/1.21.11 的 fabric-api 摘要实测：
      // net.fabricmc.fabric.api.client.datagen.v1.provider.FabricSoundsProvider，
      // 抽象方法 configure(class_7225.class_7874, SoundExporter)；1.21.1–1.21.4 无该类）。
      if (!soundProviderAvailable) {
        return `${header}
/** 本档无 FabricSoundsProvider（1.21.8 才新增，摘要实测）。请手写 assets/${modId}/sounds.json。 */
public final class ${pascalName}SoundAssets {
    private ${pascalName}SoundAssets() {}
}
`;
      }
      return `${header}import net.fabricmc.fabric.api.client.datagen.v1.provider.FabricSoundsProvider;
import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.minecraft.core.HolderLookup;
${entrypoint(modId, pascalName, `${pascalName}SoundsProvider`)}
class ${pascalName}SoundsProvider extends FabricSoundsProvider {
    public ${pascalName}SoundsProvider(FabricDataOutput output, CompletableFuture<HolderLookup.Provider> registriesFuture) {
        super(output, registriesFuture);
    }

    // 摘要实测签名：configure(HolderLookup.Provider, SoundExporter)
    // SoundExporter.add 的三个重载（参数仍是 intermediary）：
    //   add(SoundEvent, SoundTypeBuilder) / add(Holder<SoundEvent>, SoundTypeBuilder) / add(Identifier, SoundTypeBuilder)
    @Override
    protected void configure(HolderLookup.Provider registryLookup, FabricSoundsProvider.SoundExporter exporter) {
        // TODO: exporter.add(...)；SoundTypeBuilder 的工厂用 query_loader_api 复核后再写。
    }

    // 1.21.11 javap 实测：FabricSoundsProvider 未实现 DataProvider.getName，子类必须补。
    @Override
    public String getName() {
        return "${pascalName}SoundsProvider";
    }
}
`;
    }
    case "particle":
      return `${header}
/** 无独立 Fabric particle Provider（逐档 fabric-api 摘要实测，1.14–26.1 均无）。请手写 assets/${modId}/particles.json 与 particles/${targetName}.json。 */
public final class ${pascalName}ParticleAssets {
    private ${pascalName}ParticleAssets() {}
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
${entrypoint(modId, pascalName, `${pascalName}RecipeProvider`)}
class ${pascalName}RecipeProvider extends FabricRecipeProvider {
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
`;
    case "loottable":
      return `${header}import net.fabricmc.fabric.api.datagen.v1.provider.FabricBlockLootSubProvider;
${entrypoint(modId, pascalName, `${pascalName}BlockLootTableProvider`)}
class ${pascalName}BlockLootTableProvider extends FabricBlockLootSubProvider {
    protected ${pascalName}BlockLootTableProvider(FabricPackOutput dataOutput, CompletableFuture<HolderLookup.Provider> registryLookup) {
        super(dataOutput, registryLookup);
    }

    @Override
    public void generate() {
        // dropSelf for ${modId}:${targetName}
    }
}
`;
    case "tag":
      return `${header}import net.fabricmc.fabric.api.datagen.v1.provider.FabricTagsProvider;
import net.minecraft.core.registries.Registries;
import net.minecraft.resources.Identifier;
import net.minecraft.tags.TagKey;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.Items;
${entrypoint(modId, pascalName, `${pascalName}ItemTagProvider`)}
class ${pascalName}ItemTagProvider extends FabricTagsProvider.ItemTagsProvider {
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
`;
    case "blockstate":
    case "itemmodel":
      return `${header}import net.fabricmc.fabric.api.client.datagen.v1.provider.FabricModelProvider;
import net.minecraft.client.data.models.BlockModelGenerators;
import net.minecraft.client.data.models.ItemModelGenerators;
import net.minecraft.client.data.models.model.ModelTemplates;
import net.minecraft.world.item.Items;
import net.minecraft.world.level.block.Blocks;
${entrypoint(modId, pascalName, `${pascalName}ModelProvider`)}
class ${pascalName}ModelProvider extends FabricModelProvider {
    public ${pascalName}ModelProvider(FabricPackOutput output) {
        super(output);
    }

    // 26.1.2 的 FabricModelProvider 抽象方法就是这两个（本仓 data/fabric_26.1.2 语料实测：
    // generateBlockStateModels 16 处、registerModels 0 处）。
    // 2026-10-21 修正：原文写「全档语料 grep registerModels = 0」——说大了。
    // registerModels 在 NeoForge 26.1 语料里确有（65 处，是 NeoForge 的 ModelProvider 抽象方法）；
    // 只是 Fabric 侧没有。两平台方法名不同，别互相套。
    // ⚠ 本段在 Java 模板字面量内 ⇒ 注释里禁止出现反引号（会终止 TS 模板串）。
    @Override
    public void generateBlockStateModels(BlockModelGenerators gen) {
        ${providerType === "blockstate" ? "gen.createTrivialCube(Blocks.STONE); // TODO: 换成已注册方块" : "// itemmodel：方块状态可留空"}
    }

    @Override
    public void generateItemModels(ItemModelGenerators gen) {
        ${providerType === "itemmodel" ? "gen.generateFlatItem(Items.APPLE, ModelTemplates.FLAT_ITEM); // TODO: 换成已注册物品" : "// blockstate：物品模型可留空"}
    }
}
`;
    case "advancement":
      return `${header}import net.fabricmc.fabric.api.datagen.v1.provider.FabricAdvancementProvider;
import java.util.function.Consumer;
import net.minecraft.advancements.AdvancementHolder;
${entrypoint(modId, pascalName, `${pascalName}AdvancementProvider`)}
class ${pascalName}AdvancementProvider extends FabricAdvancementProvider {
    public ${pascalName}AdvancementProvider(FabricPackOutput output, CompletableFuture<HolderLookup.Provider> registryLookup) {
        super(output, registryLookup);
    }

    @Override
    public void generateAdvancement(HolderLookup.Provider registryLookup, Consumer<AdvancementHolder> consumer) {
        // TODO: search_fabric_docs version=26.1.2 develop_data-generation_advancements
    }
}
`;
    case "sound":
      // 26.1.2 摘要里确有 FabricSoundsProvider（client.datagen 包，configure(HolderLookup.Provider, SoundExporter)），
      // 但**构造签名不在摘要里**（摘要只收 public 方法，该类构造未列）⇒ 不写骨架，避免编造。
      return `${header}
/** 26.1.2 有 FabricSoundsProvider，但本仓摘要未列其构造签名（configure 已核，ctor 未核）。
 *  手写 assets/${modId}/sounds.json，或用 get_minecraft_source / query_loader_api 复核构造后再写。 */
public final class ${pascalName}SoundAssets {
    private ${pascalName}SoundAssets() {}
}
`;
    case "particle":
      return `${header}
/** 无独立 Fabric particle Provider（逐档摘要实测，26.1.2 亦无）。请手写资源 JSON 并 search_fabric_docs(version=26.1.2)。 */
public final class ${pascalName}ParticleAssets {
    private ${pascalName}ParticleAssets() {}
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
