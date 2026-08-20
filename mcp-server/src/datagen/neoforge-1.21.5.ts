/**
 * NeoForge 1.21.5–1.21.10 Datagen（GatherDataEvent.Client + createProvider + RecipeProvider.Runner）。
 * 1.21.11 走 Identifier 变体（idStyle=Identifier）。
 */
import { toPascalCase, toUpperSnake } from "./common.js";

export type NeoForgeIdStyle = "ResourceLocation" | "Identifier";

function idImport(style: NeoForgeIdStyle): string {
  return style === "Identifier" ? "net.minecraft.resources.Identifier" : "net.minecraft.resources.ResourceLocation";
}

function idFactory(style: NeoForgeIdStyle, modId: string, path: string): string {
  const args = `"${modId}", "${path}"`;
  return style === "Identifier"
    ? `Identifier.fromNamespaceAndPath(${args})`
    : `ResourceLocation.fromNamespaceAndPath(${args})`;
}

function gatherClient(ctorRef: string): string {
  return `
    @SubscribeEvent
    public static void gatherData(GatherDataEvent.Client event) {
        event.createProvider(${ctorRef});
    }
`;
}

export function generateRecipe(
  modId: string,
  targetName: string,
  classBase?: string,
  _idStyle: NeoForgeIdStyle = "ResourceLocation",
): string {
  const pascalName = classBase || toPascalCase(modId);
  return `// Recipe Provider — NeoForge 1.21.5+ (${modId}:${targetName})
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

export function generateModel(
  modId: string,
  targetName: string,
  classBase?: string,
  _idStyle: NeoForgeIdStyle = "ResourceLocation",
): string {
  const pascalName = classBase || toPascalCase(modId);
  return `// ModelProvider — NeoForge 1.21.5+（Client Items / blockstate）
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

export function generateLootTable(
  modId: string,
  targetName: string,
  classBase?: string,
  _idStyle: NeoForgeIdStyle = "ResourceLocation",
): string {
  const pascalName = classBase || toPascalCase(modId);
  return `// LootTableProvider — NeoForge 1.21.5+
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
        // ${modId}:${targetName}
    }
${gatherClient(`${pascalName}LootTableProvider::new`)}
}
`;
}

export function generateTag(
  modId: string,
  targetName: string,
  classBase?: string,
  _idStyle: NeoForgeIdStyle = "ResourceLocation",
): string {
  const pascalName = classBase || toPascalCase(modId);
  return `// TagsProvider — NeoForge 1.21.5+
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

export function generateAdvancement(
  modId: string,
  targetName: string,
  classBase?: string,
  _idStyle: NeoForgeIdStyle = "ResourceLocation",
): string {
  const pascalName = classBase || toPascalCase(modId);
  const idImp = idImport(_idStyle);
  const idExpr = idFactory(_idStyle, modId, targetName);
  return `// AdvancementProvider — NeoForge 1.21.5+
package com.example.${modId}.datagen;

import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;
import net.minecraft.advancements.AdvancementHolder;
import net.minecraft.core.HolderLookup;
import net.minecraft.data.PackOutput;
import net.minecraft.data.advancements.AdvancementProvider;
import net.minecraft.data.advancements.AdvancementSubProvider;
import ${idImp};
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.neoforge.data.event.GatherDataEvent;

public class ${pascalName}AdvancementGenerator implements AdvancementSubProvider {
    @Override
    public void generate(HolderLookup.Provider registries, Consumer<AdvancementHolder> saver) {
        // ${idExpr}
    }

    @SubscribeEvent
    public static void gatherData(GatherDataEvent.Client event) {
        event.createProvider((PackOutput output, CompletableFuture<HolderLookup.Provider> lookup) ->
            new AdvancementProvider(output, lookup, java.util.List.of(new ${pascalName}AdvancementGenerator())));
    }
}
`;
}

export function generateParticle(
  modId: string,
  targetName: string,
  classBase?: string,
  idStyle: NeoForgeIdStyle = "ResourceLocation",
): string {
  const pascalName = classBase || toPascalCase(modId);
  const upper = toUpperSnake(targetName);
  const idImp = idImport(idStyle);
  const texId = idFactory(idStyle, modId, `particle/${targetName}`);
  return `// ParticleDescriptionProvider — NeoForge 1.21.5+
package com.example.${modId}.datagen;

import net.minecraft.core.particles.ParticleType;
import net.minecraft.core.particles.SimpleParticleType;
import net.minecraft.core.registries.Registries;
import net.minecraft.data.PackOutput;
import ${idImp};
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.neoforge.common.data.ExistingFileHelper;
import net.neoforged.neoforge.common.data.ParticleDescriptionProvider;
import net.neoforged.neoforge.data.event.GatherDataEvent;
import net.neoforged.neoforge.registries.DeferredHolder;
import net.neoforged.neoforge.registries.DeferredRegister;

public class ${pascalName}ParticleDescriptionProvider extends ParticleDescriptionProvider {
    public static final DeferredRegister<ParticleType<?>> PARTICLE_TYPES =
        DeferredRegister.create(Registries.PARTICLE_TYPE, "${modId}");

    public static final DeferredHolder<ParticleType<?>, SimpleParticleType> ${upper} =
        PARTICLE_TYPES.register("${targetName}", () -> new SimpleParticleType(false));

    public ${pascalName}ParticleDescriptionProvider(PackOutput output, ExistingFileHelper existingFileHelper) {
        super(output, existingFileHelper);
    }

    @Override
    protected void addDescriptions() {
        spriteSet(${upper}.get(), ${texId});
    }

    @SubscribeEvent
    public static void gatherData(GatherDataEvent.Client event) {
        event.createProvider(
            output -> new ${pascalName}ParticleDescriptionProvider(output, event.getExistingFileHelper()));
    }
}
`;
}

export function generateSound(
  modId: string,
  targetName: string,
  classBase?: string,
  idStyle: NeoForgeIdStyle = "ResourceLocation",
): string {
  const pascalName = classBase || toPascalCase(modId);
  const upper = toUpperSnake(targetName);
  const idImp = idImport(idStyle);
  const soundId = idFactory(idStyle, modId, targetName);
  return `// SoundDefinitionsProvider — NeoForge 1.21.5+
package com.example.${modId}.datagen;

import net.minecraft.core.registries.Registries;
import net.minecraft.data.PackOutput;
import ${idImp};
import net.minecraft.sounds.SoundEvent;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.neoforge.common.data.ExistingFileHelper;
import net.neoforged.neoforge.common.data.SoundDefinitionsProvider;
import net.neoforged.neoforge.data.event.GatherDataEvent;
import net.neoforged.neoforge.registries.DeferredHolder;
import net.neoforged.neoforge.registries.DeferredRegister;

public class ${pascalName}SoundDefinitionsProvider extends SoundDefinitionsProvider {
    public static final DeferredRegister<SoundEvent> SOUND_EVENTS =
        DeferredRegister.create(Registries.SOUND_EVENT, "${modId}");

    public static final DeferredHolder<SoundEvent, SoundEvent> ${upper} = SOUND_EVENTS.register(
        "${targetName}",
        () -> SoundEvent.createVariableRangeEvent(${soundId}));

    public ${pascalName}SoundDefinitionsProvider(PackOutput output, ExistingFileHelper existingFileHelper) {
        super(output, "${modId}", existingFileHelper);
    }

    @Override
    public void registerSounds() {
        add(
            ${upper}.get(),
            definition()
                .subtitle("subtitles.${modId}.${targetName}")
                .with(sound(${soundId})));
    }

    @SubscribeEvent
    public static void gatherData(GatherDataEvent.Client event) {
        event.createProvider(
            output -> new ${pascalName}SoundDefinitionsProvider(output, event.getExistingFileHelper()));
    }
}
`;
}

export type NeoForge215ProviderType =
  | "recipe"
  | "blockstate"
  | "itemmodel"
  | "loottable"
  | "tag"
  | "advancement"
  | "particle"
  | "sound";

export function generateNeoForge215(
  providerType: NeoForge215ProviderType,
  modId: string,
  targetName: string,
  classBase?: string,
  idStyle: NeoForgeIdStyle = "ResourceLocation",
): string {
  switch (providerType) {
    case "recipe":
      return generateRecipe(modId, targetName, classBase, idStyle);
    case "blockstate":
    case "itemmodel":
      return generateModel(modId, targetName, classBase, idStyle);
    case "loottable":
      return generateLootTable(modId, targetName, classBase, idStyle);
    case "tag":
      return generateTag(modId, targetName, classBase, idStyle);
    case "advancement":
      return generateAdvancement(modId, targetName, classBase, idStyle);
    case "particle":
      return generateParticle(modId, targetName, classBase, idStyle);
    case "sound":
      return generateSound(modId, targetName, classBase, idStyle);
    default:
      throw new Error(`Unknown NeoForge 1.21.5+ provider: ${providerType}`);
  }
}
