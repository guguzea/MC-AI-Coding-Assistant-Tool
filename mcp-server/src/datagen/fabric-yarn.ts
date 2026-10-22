/**
 * Fabric Datagen 的 **Yarn** 骨架（与 fabric.ts 的 Mojmap 骨架并存，互不混映射）。
 *
 * 每一条类名/方法名都按以下两类一手证据取，禁止凭记忆补名：
 *  ① 本档 `data/fabric_<ver>/mappings/yarn-mappings.sqlite`（classes/methods/fields 的 named 列 = Yarn 名）；
 *  ② 本档 `mcp-server/data/loader-api-summaries/<ver>-fabric-api.json`（Fabric API 自身类名 + 抽象方法槽位，
 *     参数里的 vanilla 类型是 intermediary `class_xxxx`，用 ① 转名）。
 * 逐档台账见本轮核对记录（scratch-tmp/yarn-ledger.json，不提交）。
 *
 * 代际（差异都是实测的，不是外推）：
 *  - 1.17.1  ：FabricDataGenerator.addProvider(Function) 旧入口；FabricRecipesProvider.generateRecipes(Consumer<RecipeJsonProvider>)；
 *               FabricBlockLootTablesProvider.generateBlockLootTables()；FabricTagProvider.generateTags()；
 *               tag 用 net.minecraft.tag.Tag$Identified（该档无 TagKey）；无 FabricLanguageProvider。
 *  - 1.18.2  ：仍走 addProvider(Function)；FabricRecipeProvider.generateRecipes(Consumer<RecipeJsonProvider>)；
 *               FabricTagProvider.generateTags()；TagKey 在 net.minecraft.tag.TagKey。
 *  - 1.19.4/1.20.1：createPack()；provider 构造统一 (FabricDataOutput)；
 *               recipe generate(Consumer<RecipeJsonProvider>)；tag configure(RegistryWrapper.WrapperLookup)。
 *  - 1.20.4  ：recipe generate(RecipeExporter)；advancement 改用 AdvancementEntry。
 *  - 1.21.1  ：language/advancement 的抽象方法改双参（WrapperLookup + ...）。
 *  - 1.21.3  ：recipe 两层 getRecipeGenerator(WrapperLookup, RecipeExporter) → RecipeGenerator；
 *               内部无参 generate()；配方 builder 的 create 首参要 RegistryEntryLookup<Item>。
 *  - 1.21.4  ：模型 provider 从 datagen 包换到 client.datagen 包；vanilla 模型类换到 net.minecraft.client.data。
 *  - 1.21.8+ ：recipe/tag 的 vanilla 包移到 net.minecraft.data.{recipe,tag}；
 *               FabricTagProvider 的 getOrCreateTagBuilder 换成 builder(TagKey)，
 *               ItemTagProvider 的 valueLookupBuilder 来自 FabricValueLookupTagProvider（源码实测继承）；
 *               新增 FabricSoundsProvider（client.datagen 包）。
 *  - 1.21.10/1.21.11：与 1.21.8 同形（仅 vanilla 包名继续沿用 data.recipe/data.tag）。
 */
import { toPascalCase } from "./common.js";

export type FabricYarnProviderType =
  | "recipe"
  | "blockstate"
  | "itemmodel"
  | "loottable"
  | "tag"
  | "advancement"
  | "language"
  | "sound"
  | "particle";

export type FabricYarnGeneration = "1.17" | "1.18" | "1.19" | "1.21.1" | "1.21.3" | "1.21.8";

/** 已核实的 Yarn 档（与 index.ts 的白名单同源；此处只做代际映射）。 */
export function fabricYarnGeneration(version: string): FabricYarnGeneration | null {
  switch (version.trim()) {
    case "1.17.1":
      return "1.17";
    case "1.18.2":
      return "1.18";
    case "1.19.4":
    case "1.20.1":
    case "1.20.4":
      return "1.19";
    case "1.21.1":
      return "1.21.1";
    case "1.21.3":
    case "1.21.4":
      return "1.21.3";
    case "1.21.8":
    case "1.21.10":
    case "1.21.11":
      return "1.21.8";
    default:
      return null;
  }
}

function is17(v: string): boolean {
  return v === "1.17.1";
}
function is18(v: string): boolean {
  return v === "1.18.2";
}
function is19(v: string): boolean {
  return v === "1.19.4" || v === "1.20.1" || v === "1.20.4";
}
function is204(v: string): boolean {
  return v === "1.20.4";
}
function is211(v: string): boolean {
  return v === "1.21.1";
}
function is213(v: string): boolean {
  return v === "1.21.3";
}
function is214(v: string): boolean {
  return v === "1.21.4";
}
function is218plus(v: string): boolean {
  return v === "1.21.8" || v === "1.21.10" || v === "1.21.11";
}
function legacyEntry(v: string): boolean {
  return is17(v) || is18(v);
}
/** 1.21.4 起模型用 client 包（yarn: net.minecraft.client.data / FAPI: client.datagen）。 */
function modelClientPkg(v: string): boolean {
  return is214(v) || is218plus(v);
}
/** 1.21.3 起两层配方生成器。 */
function recipeTwoLayer(v: string): boolean {
  return is213(v) || is214(v) || is218plus(v);
}

function header(v: string, modId: string, targetName: string, classBase: string): string {
  return `// 修改此骨架前必须用 search_fabric_docs(version=${v}) + convert_mapping(from=mojang,to=yarn) 复核；禁止邻档 API。
// Fabric Datagen (Yarn) ${v} — DataGeneratorEntrypoint + fabric-datagen（${modId}:${targetName}）
package com.example.${modId}.datagen;

import java.util.concurrent.CompletableFuture;`;
}

/** 1.19.4+ 的 Pack 入口；1.17/1.18 是 generator.addProvider(Function)。 */
function entrypoint(v: string, pascalName: string, providerClass: string): string {
  if (legacyEntry(v)) {
    // 证据：1.17.1/1.18.2 摘要 FabricDataGenerator.addProvider(Function<FabricDataGenerator,P>) → P
    return `
// fabric.mod.json entrypoints["fabric-datagen"] = ["com.example.<modid>.datagen.${pascalName}DataGenerator"]
// build.gradle: fabricApi { configureDataGeneration() }；跑 ./gradlew runDatagen
public class ${pascalName}DataGenerator implements DataGeneratorEntrypoint {
    @Override
    public void onInitializeDataGenerator(FabricDataGenerator generator) {
        generator.addProvider(${providerClass}::new);
    }
}
`;
  }
  return `
// fabric.mod.json entrypoints["fabric-datagen"] = ["com.example.<modid>.datagen.${pascalName}DataGenerator"]
// build.gradle: fabricApi { configureDataGeneration() }；跑 ./gradlew runDatagen
public class ${pascalName}DataGenerator implements DataGeneratorEntrypoint {
    @Override
    public void onInitializeDataGenerator(FabricDataGenerator fabricDataGenerator) {
        FabricDataGenerator.Pack pack = fabricDataGenerator.createPack();
        pack.addProvider(${providerClass}::new);
    }
}
`;
}

/** 配方相关包名（逐档不同，别跨档抄）。 */
function recipePkg(v: string, kind: "exporter" | "builder" | "generator" | "provider" | "jsonProvider"): string {
  if (kind === "jsonProvider") return "net.minecraft.data.server.recipe.RecipeJsonProvider";
  if (kind === "provider") return "net.minecraft.data.server.recipe.RecipeProvider";
  // 包分界 = 1.21.4（1.21.4 真编译实测：RecipeExporter/RecipeGenerator 已移到 data.recipe；
  // 1.21.3 及以前在 data.server.recipe）。
  if (kind === "generator") {
    return is214(v) || is218plus(v) ? "net.minecraft.data.recipe.RecipeGenerator" : "net.minecraft.data.server.recipe.RecipeGenerator";
  }
  if (kind === "exporter") {
    return is214(v) || is218plus(v) ? "net.minecraft.data.recipe.RecipeExporter" : "net.minecraft.data.server.recipe.RecipeExporter";
  }
  // builder：1.21.4 起在 data.recipe；1.21.4 之前都在 data.server.recipe
  return is214(v) || is218plus(v)
    ? "net.minecraft.data.recipe.ShapedRecipeJsonBuilder"
    : "net.minecraft.data.server.recipe.ShapedRecipeJsonBuilder";
}

/**
 * 模型类包名（三个类可能不同包）：
 * - 1.17.1：BlockStateModelGenerator / Models 在 `net.minecraft.data.client.model`，
 *   ItemModelGenerator 在 `net.minecraft.data.client`（1.17.1 named jar 实测：
 *   net/minecraft/data/client/model/BlockStateModelGenerator.class、.../model/Models.class、
 *   net/minecraft/data/client/ItemModelGenerator.class）。
 * - 1.18.2–1.21.3：三者都在 `net.minecraft.data.client`（1.18.2 sqlite descriptor 实测）。
 * - 1.21.4+：换到 `net.minecraft.client.data`。
 */
function modelPackages(v: string): { bsm: string; item: string; models: string } {
  if (is17(v)) {
    return { bsm: "net.minecraft.data.client.model", item: "net.minecraft.data.client", models: "net.minecraft.data.client.model" };
  }
  if (modelClientPkg(v)) {
    return { bsm: "net.minecraft.client.data", item: "net.minecraft.client.data", models: "net.minecraft.client.data" };
  }
  return { bsm: "net.minecraft.data.client", item: "net.minecraft.data.client", models: "net.minecraft.data.client" };
}

/** Fabric API provider 包前缀：1.21.4 起模型/音效在 client 子包。 */
function fapiProvider(v: string, simple: "Model" | "Sounds" | "Other"): string {
  if (simple === "Model" && modelClientPkg(v)) return "net.fabricmc.fabric.api.client.datagen.v1.provider";
  if (simple === "Sounds") return "net.fabricmc.fabric.api.client.datagen.v1.provider";
  return "net.fabricmc.fabric.api.datagen.v1.provider";
}

/** Identifier 工厂：1.19.4+ 有 Identifier.of(ns,path)；1.17/1.18 只有 tryParse / 构造器。 */
function identifierExpr(v: string, modId: string, targetName: string): string {
  if (is17(v) || is18(v)) return `new Identifier("${modId}", "${targetName}")`;
  return `Identifier.of("${modId}", "${targetName}")`;
}

export interface FabricYarnQuery {
  providerType: FabricYarnProviderType;
  modId: string;
  targetName: string;
  /** 传入 PascalCase 基名（不含 Provider 后缀）。 */
  classBase: string;
  version: string;
}

export function generateFabricYarn(q: FabricYarnQuery): string {
  const { providerType, modId, targetName, version } = q;
  const pascalName = q.classBase || toPascalCase(modId);
  const gen = fabricYarnGeneration(version);
  if (!gen) throw new Error(`generateFabricYarn: 未核实的 Yarn 档 ${version}`);

  switch (providerType) {
    case "recipe":
      return recipeTemplate(version, modId, targetName, pascalName);
    case "loottable":
      return lootTemplate(version, modId, targetName, pascalName);
    case "tag":
      return tagTemplate(version, modId, targetName, pascalName);
    case "blockstate":
    case "itemmodel":
      return modelTemplate(version, modId, targetName, pascalName, providerType);
    case "advancement":
      return advancementTemplate(version, modId, targetName, pascalName);
    case "language":
      return languageTemplate(version, modId, targetName, pascalName);
    case "sound":
      return soundTemplate(version, modId, targetName, pascalName);
    case "particle":
    default:
      return particleTemplate(version, modId, targetName, pascalName);
  }
}

// ── recipe ───────────────────────────────────────────────────────────────────

function recipeTemplate(v: string, modId: string, targetName: string, pascalName: string): string {
  const cls = `${pascalName}RecipeProvider`;
  const id = `${modId}:${targetName}`;

  if (is17(v)) {
    // 证据：1.17.1 摘要 FabricRecipesProvider.generateRecipes(Consumer<class_2444>)；
    // sqlite: class_2444=net/minecraft/data/server/recipe/RecipeJsonProvider；
    //         ShapedRecipeJsonFactory.create(ItemConvertible)/input(Character,ItemConvertible)/criterion/offerTo(Consumer,String)。
    return `${header(v, modId, targetName, pascalName)}
import java.util.function.Consumer;
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricRecipesProvider;
import net.minecraft.data.server.recipe.RecipeJsonProvider;
import net.minecraft.data.server.recipe.ShapedRecipeJsonFactory;
import net.minecraft.item.Items;
${entrypoint(v, pascalName, cls)}
class ${cls} extends FabricRecipesProvider {
    public ${cls}(FabricDataGenerator generator) {
        super(generator);
    }

    @Override
    protected void generateRecipes(Consumer<RecipeJsonProvider> exporter) {
        // 1.17.1 没有 conditionsFromItem（recipe 包逐类 javap 实测 0 命中），criterion 需手写
        // CriterionConditions；此处只留能编译的最小骨架，落笔前用 query_loader_api 查
        // InventoryChangedCriterion.Conditions 的构造器。
        ShapedRecipeJsonFactory.create(Items.DIAMOND)
            .pattern("AA")
            .input('A', Items.EMERALD)
            .offerTo(exporter, "${id}");
    }
}
`;
  }

  if (is18(v)) {
    // 证据：1.18.2 摘要 FabricRecipeProvider.generateRecipes(Consumer<class_2444>)；
    // sqlite 1.18.2: ShapedRecipeJsonBuilder.create(ItemConvertible)/input(Character,ItemConvertible)/criterion/offerTo(Consumer,String)。
    return `${header(v, modId, targetName, pascalName)}
import java.util.function.Consumer;
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricRecipeProvider;
import net.minecraft.data.server.recipe.RecipeJsonProvider;
import net.minecraft.data.server.recipe.ShapedRecipeJsonBuilder;
import net.minecraft.item.Items;
${entrypoint(v, pascalName, cls)}
class ${cls} extends FabricRecipeProvider {
    public ${cls}(FabricDataGenerator generator) {
        super(generator);
    }

    @Override
    protected void generateRecipes(Consumer<RecipeJsonProvider> exporter) {
        // 1.18.2 的 conditionsFromItem 未公开（该档 javac 实测找不到方法），criterion 需手写
        // CriterionConditions；此处只留能编译的最小骨架。
        ShapedRecipeJsonBuilder.create(Items.DIAMOND)
            .pattern("AA")
            .input('A', Items.EMERALD)
            .offerTo(exporter, "${id}");
    }
}
`;
  }

  if (is19(v) && !is204(v)) {
    // 证据：1.19.4/1.20.1 摘要 FabricRecipeProvider 抽象 = method_10419(Consumer<class_2444>)；
    //        构造 (FabricDataOutput)（1.20.1 源码 FabricRecipeProvider.java:48）。
    return `${header(v, modId, targetName, pascalName)}
import java.util.function.Consumer;
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricRecipeProvider;
import net.minecraft.data.server.recipe.RecipeJsonProvider;
import net.minecraft.data.server.recipe.ShapedRecipeJsonBuilder;
import net.minecraft.item.Items;
import net.minecraft.recipe.book.RecipeCategory;
${entrypoint(v, pascalName, cls)}
class ${cls} extends FabricRecipeProvider {
    public ${cls}(FabricDataOutput output) {
        super(output);
    }

    // 1.20.1 javac 实测：父类该抽象方法可见性是 public，子类写 protected 会报「无法覆盖」。
    @Override
    public void generate(Consumer<RecipeJsonProvider> exporter) {
        // 1.19.4+ 的 create 首参是 RecipeCategory（1.18.2 才是单参，别跨档抄）。
        ShapedRecipeJsonBuilder.create(RecipeCategory.MISC, Items.DIAMOND)
            .pattern("AA")
            .input('A', Items.EMERALD)
            .criterion("has_emerald", conditionsFromItem(Items.EMERALD))
            .offerTo(exporter, "${id}");
    }
}
`;
  }

  if (is204(v) || is211(v)) {
    // 证据：1.20.4/1.21.1 摘要 FabricRecipeProvider 抽象 = method_10419(class_8790)；
    //        sqlite: class_8790=RecipeExporter；单层 generate(RecipeExporter)（无参 generate 是 1.21.3+ 的返回对象）。
    return `${header(v, modId, targetName, pascalName)}
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricRecipeProvider;
import net.minecraft.data.server.recipe.RecipeExporter;
import net.minecraft.data.server.recipe.ShapedRecipeJsonBuilder;
import net.minecraft.item.Items;
import net.minecraft.recipe.book.RecipeCategory;
import net.minecraft.registry.RegistryWrapper;
${entrypoint(v, pascalName, cls)}
class ${cls} extends FabricRecipeProvider {
    // 1.21.1 真编译实测：构造已是两参 (FabricDataOutput, CompletableFuture<WrapperLookup>)；
    // 1.20.4 仍是单参 (FabricDataOutput)。方法层两者都是单层 generate(RecipeExporter)。
    public ${cls}(FabricDataOutput output${is211(v) ? ", CompletableFuture<RegistryWrapper.WrapperLookup> registriesFuture" : ""}) {
        super(output${is211(v) ? ", registriesFuture" : ""});
    }

    @Override
    public void generate(RecipeExporter exporter) {
        ShapedRecipeJsonBuilder.create(RecipeCategory.MISC, Items.DIAMOND)
            .pattern("AA")
            .input('A', Items.EMERALD)
            .criterion("has_emerald", conditionsFromItem(Items.EMERALD))
            .offerTo(exporter, "${id}");
    }
}
`;
  }

  // 1.21.3+：两层。证据：摘要 method_62766(class_7225.class_7874, class_8790) → class_2446；
  //   sqlite: class_7225$class_7874=RegistryWrapper.WrapperLookup, class_8790=RecipeExporter, class_2446=RecipeGenerator；
  //   1.21.3/1.21.4 的 ShapedRecipeJsonBuilder.create 首参要 RegistryEntryLookup<Item>（sqlite descriptor 实测）。
  const exporterFqcn = recipePkg(v, "exporter");
  const generatorFqcn = recipePkg(v, "generator");
  const builderFqcn = recipePkg(v, "builder");
  return `${header(v, modId, targetName, pascalName)}
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricRecipeProvider;
import net.minecraft.item.Item;
import net.minecraft.item.Items;
import net.minecraft.registry.RegistryEntryLookup;
import net.minecraft.registry.RegistryKeys;
import net.minecraft.registry.RegistryWrapper;
import net.minecraft.recipe.book.RecipeCategory;
import ${exporterFqcn};
import ${generatorFqcn};
import ${builderFqcn};
${entrypoint(v, pascalName, cls)}
class ${cls} extends FabricRecipeProvider {
    public ${cls}(FabricDataOutput output, CompletableFuture<RegistryWrapper.WrapperLookup> registriesFuture) {
        super(output, registriesFuture);
    }

    // 两层：本类只负责造出 vanilla 生成器，配方写在返回对象的**无参** generate() 里。
    @Override
    protected RecipeGenerator getRecipeGenerator(RegistryWrapper.WrapperLookup registries, RecipeExporter exporter) {
        return new RecipeGenerator(registries, exporter) {
            @Override
            public void generate() {
                // 1.21.3 起 create 首参必需 RegistryEntryLookup<Item>（sqlite descriptor 实测）。
                RegistryEntryLookup<Item> items = registries.getOrThrow(RegistryKeys.ITEM);
                ShapedRecipeJsonBuilder.create(items, RecipeCategory.MISC, Items.DIAMOND)
                    .pattern("AA")
                    .input('A', Items.EMERALD)
                    .criterion("has_emerald", conditionsFromItem(Items.EMERALD))
                    .offerTo(exporter, "${id}");
            }
        };
    }

    // 1.21.11 javap 实测：父链 RecipeGenerator$RecipeProvider 未实现 DataProvider.getName，
    // 子类必须补（javap 仅列本类方法，父类该抽象由编译期检查暴露）。
    @Override
    public String getName() {
        return "${pascalName}RecipeProvider";
    }
}
`;
}

// ── loottable ────────────────────────────────────────────────────────────────

function lootTemplate(v: string, modId: string, targetName: string, pascalName: string): string {
  const cls = `${pascalName}BlockLootTableProvider`;

  if (is17(v)) {
    // 证据：1.17.1 摘要 FabricBlockLootTablesProvider(FabricDataGenerator) + generateBlockLootTables()
    return `${header(v, modId, targetName, pascalName)}
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricBlockLootTablesProvider;
import net.minecraft.block.Blocks;
${entrypoint(v, pascalName, cls)}
class ${cls} extends FabricBlockLootTablesProvider {
    public ${cls}(FabricDataGenerator generator) {
        super(generator);
    }

    @Override
    protected void generateBlockLootTables() {
        addDrop(Blocks.STONE); // TODO: 换成已注册方块
    }
}
`;
  }

  if (is18(v)) {
    // 证据：1.18.2 摘要 FabricBlockLootTableProvider 抽象 = generateBlockLootTables()（旧名，未改名）
    return `${header(v, modId, targetName, pascalName)}
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricBlockLootTableProvider;
import net.minecraft.block.Blocks;
${entrypoint(v, pascalName, cls)}
class ${cls} extends FabricBlockLootTableProvider {
    public ${cls}(FabricDataGenerator generator) {
        super(generator);
    }

    @Override
    protected void generateBlockLootTables() {
        addDrop(Blocks.STONE); // TODO: 换成已注册方块
    }
}
`;
  }

  // 1.19.4+：抽象方法 = method_10379() → sqlite: BlockLootTableGenerator.generate()。
  // 构造分界 = 1.21.4：1.21.4/1.21.8/1.21.10/1.21.11 的 FabricBlockLootTableProvider 摘要里
  // 构造是 (FabricDataOutput, CompletableFuture<WrapperLookup>)（1.21.4 ledger 实测，1.21.11 javap 复核）；
  // 1.19.4–1.21.3 是单参 (FabricDataOutput)。
  // 1.21.1/1.21.3 真编译实测都是两参（javap 报「需要 FabricDataOutput, CompletableFuture<WrapperLookup>」）。
  const lootTwoArg = is211(v) || is213(v) || is214(v) || is218plus(v);
  return `${header(v, modId, targetName, pascalName)}
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricBlockLootTableProvider;
import net.minecraft.block.Blocks;
${lootTwoArg ? "import net.minecraft.registry.RegistryWrapper;\n" : ""}${entrypoint(v, pascalName, cls)}
class ${cls} extends FabricBlockLootTableProvider {
    public ${cls}(FabricDataOutput output${lootTwoArg ? ", CompletableFuture<RegistryWrapper.WrapperLookup> registriesFuture" : ""}) {
        super(output${lootTwoArg ? ", registriesFuture" : ""});
    }

    @Override
    public void generate() {
        addDrop(Blocks.STONE); // TODO: 换成已注册方块
    }
}
`;
}

// ── tag ──────────────────────────────────────────────────────────────────────

function tagTemplate(v: string, modId: string, targetName: string, pascalName: string): string {
  const cls = `${pascalName}ItemTagProvider`;

  if (is17(v)) {
    // 证据：1.17.1 —— 该档 sqlite 无 TagKey（只有 net/minecraft/tag/Tag$Identified，且该类只声明 getId()）；
    //       摘要 FabricTagProvider(FabricDataGenerator, class_2378<T>, String,String) + generateTags()。
    //       Tag.Identified 的构造入口本波核不到 ⇒ 不写常量、只留 TODO（不编造 create）。
    return `${header(v, modId, targetName, pascalName)}
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricTagProvider;
import net.minecraft.item.Items;
${entrypoint(v, pascalName, cls)}
class ${cls} extends FabricTagProvider.ItemTagProvider {
    public ${cls}(FabricDataGenerator generator) {
        // 证据：1.17.1 源码 FabricTagProvider.java:149 的 ItemTagProvider 构造是单参 (FabricDataGenerator)；
        // 父类 4 参构造 (dataGenerator, registry, path, name) 由子类内部转调，不要在子类里再传 registry。
        super(generator);
    }

    @Override
    protected void generateTags() {
        // TODO(未核实)：1.17.1 的 getOrCreateTagBuilder 形参是 Tag.Identified<T>，
        // 而该档 Tag$Identified 只声明 getId() ⇒ 获取路径本波核不到，勿照抄邻档 TagKey.
        // 用 query_loader_api 查 FabricTagProvider 的 method_10512 实参类型后再落笔；此处留空跑通编译。
        // getOrCreateTagBuilder(<Tag.Identified<Item>>).add(Items.DIRT);
    }
}
`;
  }

  if (is18(v)) {
    // 证据：1.18.2 —— TagKey 在 net.minecraft.tag.TagKey（sqlite TagKey.of(RegistryKey, Identifier)）；
    //       摘要 FabricTagProvider(FabricDataGenerator, class_2378<T>, String[,String]) + generateTags()。
    //       RegistryKey 仍在 net.minecraft.util.registry。
    return `${header(v, modId, targetName, pascalName)}
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricTagProvider;
import net.minecraft.item.Item;
import net.minecraft.item.Items;
import net.minecraft.tag.TagKey;
import net.minecraft.util.Identifier;
import net.minecraft.util.registry.Registry;
import net.minecraft.util.registry.RegistryKey;
${entrypoint(v, pascalName, cls)}
class ${cls} extends FabricTagProvider.ItemTagProvider {
    // 1.18.2：Registry.ITEM_KEY 本身就是 RegistryKey<? extends Registry<Item>>，
    // 直接喂给 TagKey.of（javac 实测：再包一层 RegistryKey.of 会得到 RegistryKey<Item>，类型不符）。
    public static final TagKey<Item> EXAMPLE =
        TagKey.of(Registry.ITEM_KEY, ${identifierExpr(v, modId, targetName)});

    public ${cls}(FabricDataGenerator generator) {
        // 证据：1.18.2 源码 FabricTagProvider.java:166 的 ItemTagProvider 构造是单参 (FabricDataGenerator)。
        super(generator);
    }

    @Override
    protected void generateTags() {
        getOrCreateTagBuilder(EXAMPLE).add(Items.DIRT);
    }
}
`;
  }

  const twoArgAbstract = !legacyEntry(v);
  const lookupParam = twoArgAbstract ? "RegistryWrapper.WrapperLookup wrapperLookup" : "";
  const builderCall = is218plus(v) ? "valueLookupBuilder(EXAMPLE)" : "getOrCreateTagBuilder(EXAMPLE)";
  // 1.21.8+：ItemTagProvider extends FabricValueLookupTagProvider（1.21.8 源码第 161 行实测）⇒ valueLookupBuilder 在其作用域内。
  return `${header(v, modId, targetName, pascalName)}
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricTagProvider;
import net.minecraft.item.Item;
import net.minecraft.item.Items;
import net.minecraft.registry.RegistryKeys;
import net.minecraft.registry.RegistryWrapper;
import net.minecraft.registry.tag.TagKey;
import net.minecraft.util.Identifier;
${entrypoint(v, pascalName, cls)}
class ${cls} extends FabricTagProvider.ItemTagProvider {
    public static final TagKey<Item> EXAMPLE =
        TagKey.of(RegistryKeys.ITEM, Identifier.of("${modId}", "${targetName}"));

    public ${cls}(FabricDataOutput output, CompletableFuture<RegistryWrapper.WrapperLookup> registriesFuture) {
        super(output, registriesFuture);
    }

    @Override
    protected void configure(${lookupParam}) {
        ${builderCall}.add(Items.DIRT);
    }
}
`;
}

// ── blockstate / itemmodel ───────────────────────────────────────────────────

function modelTemplate(
  v: string,
  modId: string,
  targetName: string,
  pascalName: string,
  kind: "blockstate" | "itemmodel",
): string {
  const cls = `${pascalName}ModelProvider`;
  const p = modelPackages(v);
  const providerFqcn = fapiProvider(v, "Model") + ".FabricModelProvider";

  if (legacyEntry(v)) {
    // 1.17.1：FabricBlockStateDefinitionProvider(FabricDataGenerator)（摘要 + javap 实测）；
    // 1.18.2：类名换成 FabricModelProvider，但构造仍是 (FabricDataGenerator)——该档还没有 FabricDataOutput。
    const legacyProv = is17(v)
      ? "net.fabricmc.fabric.api.datagen.v1.provider.FabricBlockStateDefinitionProvider"
      : "net.fabricmc.fabric.api.datagen.v1.provider.FabricModelProvider";
    const legacyProvSimple = is17(v) ? "FabricBlockStateDefinitionProvider" : "FabricModelProvider";
    return `${header(v, modId, targetName, pascalName)}
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import ${legacyProv};
import net.minecraft.block.Blocks;
import net.minecraft.item.Items;
import ${p.bsm}.BlockStateModelGenerator;
import ${p.item}.ItemModelGenerator;
import ${p.models}.Models;
${entrypoint(v, pascalName, cls)}
class ${cls} extends ${legacyProvSimple} {
    public ${cls}(FabricDataGenerator generator) {
        super(generator);
    }

    // 1.17.1 的 BlockStateModelGenerator / ItemModelGenerator 只公开了无参 register()，
    // registerSimpleCubeAll / register(Item, Model) 在该档是 private（1.17.1 named jar javap 实测）。
    @Override
    public void generateBlockStateModels(BlockStateModelGenerator gen) {
        // TODO(未核实)：本档模型 API 未公开出可用的单方块方法，建议手写 assets 下的模型 JSON。
    }

    @Override
    public void generateItemModels(ItemModelGenerator gen) {
        // TODO(未核实)：本档 ItemModelGenerator 只公开 register()，物品模型建议手写 JSON。
    }
}
`;
  }

  // 模型 API 的公开面逐档不同（1.17.1 / 1.20.1 / 1.21.11 的 register 系列实测均为 private），
  // 因此骨架只保留 provider 接线，具体模型调用留 TODO，不编造。
  return `${header(v, modId, targetName, pascalName)}
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import ${providerFqcn};
import net.minecraft.block.Blocks;
import net.minecraft.item.Items;
import ${p.bsm}.BlockStateModelGenerator;
import ${p.item}.ItemModelGenerator;
import ${p.models}.Models;
${entrypoint(v, pascalName, cls)}
class ${cls} extends FabricModelProvider {
    public ${cls}(FabricDataOutput output) {
        super(output);
    }

    @Override
    public void generateBlockStateModels(BlockStateModelGenerator gen) {
        ${kind === "blockstate" ? "// TODO(未核实)：本档 BlockStateModelGenerator 的单方块方法公开性未逐档核（1.17.1/1.21.11 实测为 private），建议手写模型 JSON。" : "// itemmodel：方块状态可留空"}
    }

    @Override
    public void generateItemModels(ItemModelGenerator gen) {
        ${kind === "itemmodel" ? "// TODO(未核实)：ItemModelGenerator.register(Item, Model) 在 1.17.1/1.20.1/1.21.11 实测为 private，逐档公开面不同；物品模型建议手写 JSON。" : "// blockstate：物品模型可留空"}
    }
}
`;
}

// ── advancement ──────────────────────────────────────────────────────────────

function advancementTemplate(v: string, modId: string, targetName: string, pascalName: string): string {
  const cls = `${pascalName}AdvancementProvider`;
  const entry = is204(v) || is211(v) || is213(v) || is214(v) || is218plus(v);

  if (legacyEntry(v) || (is19(v) && !is204(v))) {
    // 证据：1.17.1/1.18.2/1.19.4/1.20.1 摘要 generateAdvancement(Consumer<class_161>)；
    //       sqlite: class_161=net/minecraft/advancement/Advancement。
    //       1.17.1 的类名是复数 FabricAdvancementsProvider（1.17.1 datagen 模块 javap 实测），
    //       1.18.2 起才有单数 FabricAdvancementProvider。
    const advFqcn = is17(v)
      ? "net.fabricmc.fabric.api.datagen.v1.provider.FabricAdvancementsProvider"
      : "net.fabricmc.fabric.api.datagen.v1.provider.FabricAdvancementProvider";
    const advSimple = is17(v) ? "FabricAdvancementsProvider" : "FabricAdvancementProvider";
    return `${header(v, modId, targetName, pascalName)}
import java.util.function.Consumer;
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
${legacyEntry(v) ? `import ${advFqcn};` : `import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;\nimport ${advFqcn};`}
import net.minecraft.advancement.Advancement;
${entrypoint(v, pascalName, cls)}
class ${cls} extends ${advSimple} {
    public ${cls}(${legacyEntry(v) ? "FabricDataGenerator generator" : "FabricDataOutput output"}) {
        super(${legacyEntry(v) ? "generator" : "output"});
    }

    @Override
    public void generateAdvancement(Consumer<Advancement> consumer) {
        // TODO: Advancement.Builder 写入 consumer；search_fabric_docs version=${v} develop_data-generation_advancements
    }
}
`;
  }

  // 1.20.4 / 1.21.1 / 1.21.3+：Consumer<AdvancementEntry>；1.21.1 起抽象方法双参。
  const twoArg = is211(v) || is213(v) || is214(v) || is218plus(v);
  return `${header(v, modId, targetName, pascalName)}
import java.util.function.Consumer;
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricAdvancementProvider;
import net.minecraft.advancement.AdvancementEntry;
import net.minecraft.registry.RegistryWrapper;
${entrypoint(v, pascalName, cls)}
class ${cls} extends FabricAdvancementProvider {
    public ${cls}(FabricDataOutput output${twoArg ? ", CompletableFuture<RegistryWrapper.WrapperLookup> registriesFuture" : ""}) {
        super(output${twoArg ? ", registriesFuture" : ""});
    }

    @Override
    public void generateAdvancement(${twoArg ? "RegistryWrapper.WrapperLookup registryLookup, " : ""}Consumer<AdvancementEntry> consumer) {
        // TODO: Advancement.Builder 写入 consumer；search_fabric_docs version=${v} develop_data-generation_advancements
    }
}
`;
}

// ── language ─────────────────────────────────────────────────────────────────

function languageTemplate(v: string, modId: string, targetName: string, pascalName: string): string {
  const cls = `${pascalName}EnglishLangProvider`;
  if (is17(v)) {
    // 1.17.1 摘要里没有 FabricLanguageProvider ⇒ 不编造，吐一个显式说明（index.ts 会把它当 warning）。
    return `${header(v, modId, targetName, pascalName)}
// 本档未核实 FabricLanguageProvider 的 Yarn 签名（1.17.1 fabric-api 摘要里无该类），不生成骨架。
// 两条路：① 手写 assets/${modId}/lang/en_us.json（语言文件是纯 JSON，不需要 datagen）；② 用 search_fabric_docs version=${v} 复核后再写。
final class ${pascalName}LanguageNote {
    private ${pascalName}LanguageNote() {}
}
`;
  }

  if (is18(v) || is19(v)) {
    // 证据：1.18.2/1.19.4/1.20.1/1.20.4 摘要 generateTranslations(TranslationBuilder)（单参）。
    const legacy = is18(v);
    const outImport = legacy ? "" : "import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;";
    const ctorParam = legacy ? "FabricDataGenerator generator" : "FabricDataOutput output";
    const ctorArg = legacy ? "generator" : "output";
    return `${header(v, modId, targetName, pascalName)}
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
${outImport}
import net.fabricmc.fabric.api.datagen.v1.provider.FabricLanguageProvider;
${entrypoint(v, pascalName, cls)}
class ${cls} extends FabricLanguageProvider {
    public ${cls}(${ctorParam}) {
        super(${ctorArg});
    }

    @Override
    public void generateTranslations(TranslationBuilder translationBuilder) {
        // TODO: translationBuilder.add(ItemConvertible, "名称")；search_fabric_docs version=${v} develop_data-generation_translations
    }
}
`;
  }

  // 1.21.1+：双参 generateTranslations(WrapperLookup, TranslationBuilder)，构造 (FabricDataOutput, CompletableFuture)。
  return `${header(v, modId, targetName, pascalName)}
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.fabricmc.fabric.api.datagen.v1.FabricDataOutput;
import net.fabricmc.fabric.api.datagen.v1.provider.FabricLanguageProvider;
import net.minecraft.registry.RegistryWrapper;
${entrypoint(v, pascalName, cls)}
class ${cls} extends FabricLanguageProvider {
    public ${cls}(FabricDataOutput output, CompletableFuture<RegistryWrapper.WrapperLookup> registriesFuture) {
        super(output, registriesFuture);
    }

    @Override
    public void generateTranslations(RegistryWrapper.WrapperLookup registryLookup, TranslationBuilder translationBuilder) {
        // TODO: translationBuilder.add(ItemConvertible, "名称")；search_fabric_docs version=${v} develop_data-generation_translations
    }
}
`;
}

// ── sound ────────────────────────────────────────────────────────────────────

function soundTemplate(v: string, modId: string, targetName: string, pascalName: string): string {
  if (!is218plus(v)) {
    return `${header(v, modId, targetName, pascalName)}
// 本档无 FabricSoundsProvider（1.21.8 才新增，摘要实测）。请手写 assets/${modId}/sounds.json。
final class ${pascalName}SoundAssets {
    private ${pascalName}SoundAssets() {}
}
`;
  }
  // 证据（逐条核过，1.21.8 fabric-api sources）：
  //  - FabricSoundsProvider 抽象 configure(class_7225.class_7874, SoundExporter)（摘要）
  //  - SoundExporter.add(SoundEvent | RegistryEntry<SoundEvent> | Identifier, SoundTypeBuilder)（摘要）
  //  - SoundTypeBuilder 是接口，静态工厂只有 of(SoundEvent) 与 of()（SoundTypeBuilder.java:50/60）
  //  - EntryBuilder 静态工厂 create(RegistrationType, Identifier) / ofFile(Identifier) /
  //    ofEvent(SoundEvent) / ofEvent(RegistryEntry<SoundEvent>)（同文件 163-192）
  //  - RegistrationType 只有 FILE("file") 与 SOUND_EVENT("event")（同文件 109-131）
  return `${header(v, modId, targetName, pascalName)}
import net.fabricmc.fabric.api.client.datagen.v1.builder.SoundTypeBuilder;
import net.fabricmc.fabric.api.client.datagen.v1.provider.FabricSoundsProvider;
import net.fabricmc.fabric.api.datagen.v1.DataGeneratorEntrypoint;
import net.fabricmc.fabric.api.datagen.v1.FabricDataGenerator;
import net.minecraft.data.DataOutput;
import net.minecraft.registry.RegistryWrapper;
import net.minecraft.util.Identifier;
${entrypoint(v, pascalName, `${pascalName}SoundsProvider`)}
class ${pascalName}SoundsProvider extends FabricSoundsProvider {
    // 1.21.11 javap 实测：FabricSoundsProvider 的构造形参是 vanilla 的 net.minecraft.data.DataOutput，
    // 不是 FabricDataOutput（1.21.8 摘要同形）。
    public ${pascalName}SoundsProvider(DataOutput output, CompletableFuture<RegistryWrapper.WrapperLookup> registriesFuture) {
        super(output, registriesFuture);
    }

    @Override
    protected void configure(RegistryWrapper.WrapperLookup registryLookup, FabricSoundsProvider.SoundExporter exporter) {
        // SoundExporter.add 的三个重载：add(SoundEvent, ...) / add(RegistryEntry<SoundEvent>, ...) / add(Identifier, ...)
        exporter.add(Identifier.of("${modId}", "${targetName}"),
            SoundTypeBuilder.of()
                // EntryBuilder.ofFile 的实参是**音频文件** id（不含 .ogg），不是 sound event id
                .sound(SoundTypeBuilder.EntryBuilder.ofFile(Identifier.of("${modId}", "${targetName}"))));
    }

    // 1.21.11 javap 实测：FabricSoundsProvider 实现 DataProvider 但未实现 getName，
    // 子类必须补（1.21.8 同形）。
    @Override
    public String getName() {
        return "${pascalName}SoundsProvider";
    }
}
`;
}

// ── particle（无 provider） ───────────────────────────────────────────────────

function particleTemplate(v: string, modId: string, targetName: string, pascalName: string): string {
  return `${header(v, modId, targetName, pascalName)}
// Fabric 1.14–1.21.11 无独立 particle DataGen Provider（逐档 fabric-api 摘要实测）。
// 手写 assets/${modId}/particles/${targetName}.json 与 assets/${modId}/particles.json。
final class ${pascalName}ParticleAssets {
    private ${pascalName}ParticleAssets() {}
}
`;
}
