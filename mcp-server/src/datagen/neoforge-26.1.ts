/**
 * NeoForge 26.1 Datagen 模板。
 * 依据 docs.neoforged.net/docs/resources/（GatherDataEvent.Client / Server、createProvider、Identifier）。
 * 禁止套用 1.21 的 GatherDataEvent + addProvider + ResourceLocation。
 */
import { toPascalCase } from "./common.js";

function gatherClient(ctorRef: string): string {
  return `
    @SubscribeEvent
    public static void gatherData(GatherDataEvent.Client event) {
        event.createProvider(${ctorRef});
    }
`;
}

export function generateRecipe(modId: string, targetName: string, classBase?: string): string {
  const pascalName = classBase || toPascalCase(modId);
  return `// Recipe Provider — NeoForge 26.1 (${modId}:${targetName})
package com.example.${modId}.datagen;

import java.util.concurrent.CompletableFuture;
import net.minecraft.core.HolderLookup;
import net.minecraft.data.PackOutput;
import net.minecraft.data.recipes.RecipeOutput;
import net.minecraft.data.recipes.RecipeProvider;
import net.minecraft.world.item.Items;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.neoforge.data.event.GatherDataEvent;

public class ${pascalName}RecipeProvider extends RecipeProvider {
    public ${pascalName}RecipeProvider(HolderLookup.Provider registries, RecipeOutput output) {
        super(registries, output);
    }

    @Override
    protected void buildRecipes() {
        shapeless(net.minecraft.data.recipes.RecipeCategory.MISC, Items.DIAMOND)
            .requires(Items.EMERALD)
            .unlockedBy("has_emerald", has(Items.EMERALD))
            .save(output, "${modId}:${targetName}");
    }

    public static class Runner extends RecipeProvider.Runner {
        public Runner(PackOutput output, CompletableFuture<HolderLookup.Provider> registries) {
            super(output, registries);
        }

        @Override
        protected RecipeProvider createRecipeProvider(HolderLookup.Provider registries, RecipeOutput output) {
            return new ${pascalName}RecipeProvider(registries, output);
        }
    }
${gatherClient(`${pascalName}RecipeProvider.Runner::new`)}
}
`;
}

export function generateModel(modId: string, targetName: string, classBase?: string): string {
  const pascalName = classBase || toPascalCase(modId);
  return `// ModelProvider — NeoForge 26.1（resources 表：Models / Blockstate / Client Items）
package com.example.${modId}.datagen;

import net.minecraft.client.data.models.ModelProvider;
import net.minecraft.data.PackOutput;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.neoforge.data.event.GatherDataEvent;

public class ${pascalName}ModelProvider extends ModelProvider {
    public ${pascalName}ModelProvider(PackOutput output) {
        super(output);
    }

    @Override
    protected void registerModels() {
        // ${modId}:${targetName}
    }
${gatherClient(`${pascalName}ModelProvider::new`)}
}
`;
}

export function generateLootTable(modId: string, targetName: string, classBase?: string): string {
  const pascalName = classBase || toPascalCase(modId);
  return `// LootTableProvider — NeoForge 26.1
package com.example.${modId}.datagen;

import java.util.concurrent.CompletableFuture;
import net.minecraft.core.HolderLookup;
import net.minecraft.data.PackOutput;
import net.minecraft.data.loot.LootTableProvider;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.neoforge.data.event.GatherDataEvent;

public class ${pascalName}LootTableProvider extends LootTableProvider {
    public ${pascalName}LootTableProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> registries) {
        super(output, java.util.Set.of(), java.util.List.of(), registries);
    }

    @Override
    public void generate() {
        // ${modId}:${targetName} — 子 Provider 见 LootTableProvider 文档
    }
${gatherClient(`${pascalName}LootTableProvider::new`)}
}
`;
}

export function generateTag(modId: string, targetName: string, classBase?: string): string {
  const pascalName = classBase || toPascalCase(modId);
  return `// TagsProvider — NeoForge 26.1（event.createBlockAndItemTags）
package com.example.${modId}.datagen;

import java.util.concurrent.CompletableFuture;
import net.minecraft.core.HolderLookup;
import net.minecraft.data.PackOutput;
import net.minecraft.data.tags.TagsProvider;
import net.minecraft.tags.BlockTags;
import net.minecraft.world.level.block.Block;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.neoforge.data.event.GatherDataEvent;

public class ${pascalName}BlockTagsProvider extends TagsProvider<Block> {
    public ${pascalName}BlockTagsProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> lookup) {
        super(output, net.minecraft.core.registries.Registries.BLOCK, lookup);
    }

    @Override
    protected void addTags(HolderLookup.Provider provider) {
        tag(BlockTags.MINEABLE_WITH_PICKAXE);
    }
${gatherClient(`${pascalName}BlockTagsProvider::new`)}
}
`;
}

export function generateAdvancement(modId: string, targetName: string, classBase?: string): string {
  const pascalName = classBase || toPascalCase(modId);
  return `// AdvancementProvider — NeoForge 26.1
package com.example.${modId}.datagen;

import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;
import net.minecraft.advancements.AdvancementHolder;
import net.minecraft.core.HolderLookup;
import net.minecraft.data.PackOutput;
import net.minecraft.data.advancements.AdvancementProvider;
import net.minecraft.data.advancements.AdvancementSubProvider;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.neoforge.data.event.GatherDataEvent;

public class ${pascalName}AdvancementGenerator implements AdvancementSubProvider {
    @Override
    public void generate(HolderLookup.Provider registries, Consumer<AdvancementHolder> saver) {
        // ${modId}:${targetName}
    }

    @SubscribeEvent
    public static void gatherData(GatherDataEvent.Client event) {
        event.createProvider((PackOutput output, CompletableFuture<HolderLookup.Provider> lookup) ->
            new AdvancementProvider(output, lookup, java.util.List.of(new ${pascalName}AdvancementGenerator())));
    }
}
`;
}

export function generateParticle(modId: string, targetName: string, classBase?: string): string {
  const pascalName = classBase || toPascalCase(modId);
  return `// ParticleDescriptionProvider — NeoForge 26.1
package com.example.${modId}.datagen;

import net.minecraft.data.PackOutput;
import net.minecraft.resources.Identifier;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.neoforge.common.data.ParticleDescriptionProvider;
import net.neoforged.neoforge.data.event.GatherDataEvent;

public class ${pascalName}ParticleDescriptionProvider extends ParticleDescriptionProvider {
    public ${pascalName}ParticleDescriptionProvider(PackOutput output) {
        super(output);
    }

    @Override
    protected void addDescriptions() {
        Identifier id = Identifier.fromNamespaceAndPath("${modId}", "${targetName}");
        sprite(id, id);
    }
${gatherClient(`${pascalName}ParticleDescriptionProvider::new`)}
}
`;
}

export function generateSound(modId: string, targetName: string, classBase?: string): string {
  const pascalName = classBase || toPascalCase(modId);
  return `// SoundDefinitionsProvider — NeoForge 26.1
package com.example.${modId}.datagen;

import net.minecraft.data.PackOutput;
import net.minecraft.resources.Identifier;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.neoforge.common.data.SoundDefinitionsProvider;
import net.neoforged.neoforge.data.event.GatherDataEvent;

public class ${pascalName}SoundDefinitionsProvider extends SoundDefinitionsProvider {
    public ${pascalName}SoundDefinitionsProvider(PackOutput output) {
        super(output, "${modId}");
    }

    @Override
    public void registerSounds() {
        add(Identifier.fromNamespaceAndPath("${modId}", "${targetName}"), definition().with(
            sound(Identifier.fromNamespaceAndPath("${modId}", "${targetName}"))));
    }
${gatherClient(`${pascalName}SoundDefinitionsProvider::new`)}
}
`;
}

export function generateLanguage(modId: string, targetName: string, classBase?: string): string {
  const pascalName = classBase || toPascalCase(modId);
  return `// LanguageProvider — NeoForge 26.1
package com.example.${modId}.datagen;

import net.minecraft.data.PackOutput;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.neoforge.common.data.LanguageProvider;
import net.neoforged.neoforge.data.event.GatherDataEvent;

public class ${pascalName}LanguageProvider extends LanguageProvider {
    public ${pascalName}LanguageProvider(PackOutput output) {
        super(output, "${modId}", "en_us");
    }

    @Override
    protected void addTranslations() {
        add("item.${modId}.${targetName}", "${targetName}");
    }
${gatherClient(`${pascalName}LanguageProvider::new`)}
}
`;
}

export type NeoForge261ProviderType =
  | "recipe"
  | "blockstate"
  | "itemmodel"
  | "loottable"
  | "tag"
  | "advancement"
  | "particle"
  | "sound";

export function generateNeoForge261(
  providerType: NeoForge261ProviderType,
  modId: string,
  targetName: string,
  classBase?: string,
): string {
  switch (providerType) {
    case "recipe":
      return generateRecipe(modId, targetName, classBase);
    case "blockstate":
    case "itemmodel":
      return generateModel(modId, targetName, classBase);
    case "loottable":
      return generateLootTable(modId, targetName, classBase);
    case "tag":
      return generateTag(modId, targetName, classBase);
    case "advancement":
      return generateAdvancement(modId, targetName, classBase);
    case "particle":
      return generateParticle(modId, targetName, classBase);
    case "sound":
      return generateSound(modId, targetName, classBase);
    default:
      throw new Error(`Unknown NeoForge 26.1 provider: ${providerType}`);
  }
}
