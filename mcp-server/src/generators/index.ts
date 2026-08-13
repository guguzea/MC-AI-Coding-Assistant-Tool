import { normalizeModIdentifier, toPascalCase, toJavaClassName, stripJavaTypeSuffix, type GeneratorResult } from "./common.js";

export function generateModel(modId: string, blockName: string): GeneratorResult {
  const mod = normalizeModIdentifier(modId);
  const block = normalizeModIdentifier(blockName);
  if (!mod || !block) return { code: null, errors: ["无效 modId/blockName"] };

  const files: Record<string, string> = {
    [`assets/${mod.value}/blockstates/${block.value}.json`]: JSON.stringify(
      { variants: { "": { model: `${mod.value}:block/${block.value}` } } },
      null,
      2,
    ),
    [`assets/${mod.value}/models/block/${block.value}.json`]: JSON.stringify(
      { parent: "minecraft:block/cube_all", textures: { all: `${mod.value}:block/${block.value}` } },
      null,
      2,
    ),
    [`assets/${mod.value}/models/item/${block.value}.json`]: JSON.stringify(
      { parent: `${mod.value}:block/${block.value}` },
      null,
      2,
    ),
  };

  return {
    code: `// 见 files：blockstate + cube_all 模型\n// modId=${mod.value} block=${block.value}`,
    files,
    warnings: mod.warned || block.warned ? ["标识符已归一化"] : undefined,
  };
}

export function generateLang(modId: string, entries: Record<string, string>): GeneratorResult {
  const mod = normalizeModIdentifier(modId);
  if (!mod) return { code: null, errors: ["无效 modId"] };
  const en: Record<string, string> = {};
  const zh: Record<string, string> = {};
  const warnings: string[] = [];
  if (mod.warned) warnings.push("标识符已归一化");
  for (const [k, v] of Object.entries(entries)) {
    let key: string;
    if (k.includes(".")) {
      key = k;
    } else if (k.startsWith("item_")) {
      key = `item.${mod.value}.${k.slice("item_".length)}`;
    } else if (k.startsWith("block_")) {
      key = `block.${mod.value}.${k.slice("block_".length)}`;
    } else if (k.startsWith("entity_")) {
      key = `entity.${mod.value}.${k.slice("entity_".length)}`;
    } else {
      key = `block.${mod.value}.${k}`;
      warnings.push(`键 "${k}" 无点号且无法从 item_/block_/entity_ 前缀推断，已按 block.${mod.value}.${k} 处理`);
    }
    en[key] = v;
    zh[key] = v;
  }
  return {
    code: null,
    files: {
      [`assets/${mod.value}/lang/en_us.json`]: JSON.stringify(en, null, 2),
      [`assets/${mod.value}/lang/zh_cn.json`]: JSON.stringify(zh, null, 2),
    },
    warnings: warnings.length ? warnings : undefined,
  };
}

export function generateNetworkPacket(
  modId: string,
  packetName: string,
  platform: "forge_1.20.1" | "neoforge_1.21" = "forge_1.20.1",
): GeneratorResult {
  const mod = normalizeModIdentifier(modId);
  const pkt = normalizeModIdentifier(packetName);
  if (!mod || !pkt) return { code: null, errors: ["无效标识符"] };
  const pascal = stripJavaTypeSuffix(toJavaClassName(packetName), "Packet");

  if (platform === "neoforge_1.21") {
    return {
      code: `// NeoForge 1.21 — StreamCodec payload 骨架
package com.example.${mod.value}.network;

import net.minecraft.network.RegistryFriendlyByteBuf;
import net.minecraft.network.codec.StreamCodec;
import net.minecraft.network.protocol.common.custom.CustomPacketPayload;
import net.minecraft.resources.ResourceLocation;

public record ${pascal}Payload(String message) implements CustomPacketPayload {
    public static final Type<${pascal}Payload> TYPE =
        new Type<>(ResourceLocation.fromNamespaceAndPath("${mod.value}", "${pkt.value}"));

    public static final StreamCodec<RegistryFriendlyByteBuf, ${pascal}Payload> STREAM_CODEC =
        StreamCodec.of(
            (buf, payload) -> buf.writeUtf(payload.message()),
            buf -> new ${pascal}Payload(buf.readUtf()));

    @Override
    public Type<? extends CustomPacketPayload> type() {
        return TYPE;
    }
}
`,
      experimental: true,
    };
  }

  return {
    code: `// Forge 1.20.1 — SimpleChannel 消息骨架
package com.example.${mod.value}.network;

import net.minecraft.network.FriendlyByteBuf;
import net.minecraftforge.network.NetworkEvent;
import java.util.function.Supplier;

public class ${pascal}Packet {
    private final String message;

    public ${pascal}Packet(String message) { this.message = message; }

    public static void encode(${pascal}Packet msg, FriendlyByteBuf buf) {
        buf.writeUtf(msg.message);
    }

    public static ${pascal}Packet decode(FriendlyByteBuf buf) {
        return new ${pascal}Packet(buf.readUtf());
    }

    public static void handle(${pascal}Packet msg, Supplier<NetworkEvent.Context> ctx) {
        ctx.get().enqueueWork(() -> { /* server/client logic */ });
        ctx.get().setPacketHandled(true);
    }
}
`,
  };
}

export function generateCapability(modId: string, capName: string, neoforge = false): GeneratorResult {
  const mod = normalizeModIdentifier(modId);
  const cap = normalizeModIdentifier(capName);
  if (!mod || !cap) return { code: null, errors: ["无效标识符"] };
  const pascal = stripJavaTypeSuffix(toJavaClassName(capName), "Capability");

  if (neoforge) {
    return {
      code: `// NeoForge DataAttachment 骨架
package com.example.${mod.value}.attachment;

import net.neoforged.neoforge.attachment.AttachmentType;
import net.neoforged.neoforge.registries.DeferredRegister;
import net.neoforged.neoforge.registries.NeoForgeRegistries;

public class ModAttachments {
    public static final DeferredRegister<AttachmentType<?>> ATTACHMENTS =
        DeferredRegister.create(NeoForgeRegistries.ATTACHMENT_TYPES, "${mod.value}");

    public static final net.neoforged.neoforge.registries.DeferredHolder<AttachmentType<?>, AttachmentType<${pascal}Data>> ${cap.value.toUpperCase()} =
        ATTACHMENTS.register("${cap.value}", () -> AttachmentType.builder(() -> new ${pascal}Data()).build());
}
`,
      experimental: true,
    };
  }

  return {
    code: `// Forge Capability 骨架
package com.example.${mod.value}.capability;

import net.minecraftforge.common.capabilities.Capability;
import net.minecraftforge.common.capabilities.CapabilityManager;
import net.minecraftforge.common.capabilities.CapabilityToken;

public class ${pascal}Capability {
    public static final Capability<I${pascal}> INSTANCE =
        CapabilityManager.get(new CapabilityToken<>() {});
}
`,
  };
}

export function generateConfig(modId: string, loader: "forge" | "neoforge" | "fabric" = "forge"): GeneratorResult {
  const mod = normalizeModIdentifier(modId);
  if (!mod) return { code: null, errors: ["无效 modId"] };

  if (loader === "fabric") {
    return {
      code: `// Cloth Config 占位 — 见 mc-config skill
// modId: ${mod.value}
`,
      warnings: ["Cloth Config 需添加 fabric.mod.json 依赖"],
    };
  }

  const spec = loader === "neoforge" ? "NeoForgeConfigSpec" : "ForgeConfigSpec";
  return {
    code: `package com.example.${mod.value}.config;

import ${loader === "neoforge" ? "net.neoforged" : "net.minecraftforge"}.common.ForgeConfigSpec;

public class ${toPascalCase(mod.value)}Config {
    public static final ForgeConfigSpec.Builder BUILDER = new ForgeConfigSpec.Builder();
    public static final ForgeConfigSpec SPEC = BUILDER.build();
}
`,
    warnings: [`模板使用 ${spec}，请按平台调整 import`],
  };
}

export function generateEntityRenderer(modId: string, entityName: string): GeneratorResult {
  const mod = normalizeModIdentifier(modId);
  const ent = normalizeModIdentifier(entityName);
  if (!mod || !ent) return { code: null, errors: ["无效标识符"] };
  const pascal = stripJavaTypeSuffix(toJavaClassName(entityName), "Renderer");
  return {
    code: `// 客户端 EntityRenderer 骨架 — GeckoLib 见 mc-geckolib skill
@OnlyIn(Dist.CLIENT)
public class ${pascal}Renderer extends MobRenderer<${pascal}, ${pascal}Model> {
    public ${pascal}Renderer(EntityRendererProvider.Context ctx) {
        super(ctx, new ${pascal}Model(ctx.bakeLayer(${pascal}Model.LAYER)), 0.5f);
    }
    @Override
    public ResourceLocation getTextureLocation(${pascal} entity) {
        return ResourceLocation.fromNamespaceAndPath("${mod.value}", "textures/entity/${ent.value}.png");
    }
}
`,
    experimental: true,
  };
}

export function generateWorldgen(modId: string, featureName: string): GeneratorResult {
  const mod = normalizeModIdentifier(modId);
  const feat = normalizeModIdentifier(featureName);
  if (!mod || !feat) return { code: null, errors: ["无效标识符"] };
  const id = `${mod.value}:${feat.value}`;
  return {
    code: null,
    files: {
      [`data/${mod.value}/worldgen/configured_feature/${feat.value}.json`]: JSON.stringify(
        {
          type: "minecraft:ore",
          config: {
            size: 4,
            discard_chance_on_air_exposure: 0,
            targets: [{ target: { predicate_type: "minecraft:tag_match", tag: "minecraft:stone_ore_replaceables" }, state: { Name: "minecraft:iron_ore" } }],
          },
        },
        null,
        2,
      ),
      [`data/${mod.value}/worldgen/placed_feature/${feat.value}.json`]: JSON.stringify(
        {
          feature: id,
          placement: [{ type: "minecraft:count_on_every_layer", count: 1 }],
        },
        null,
        2,
      ),
      [`data/${mod.value}/forge/biome_modifier/${feat.value}.json`]: JSON.stringify(
        {
          type: "forge:add_features",
          biomes: "#minecraft:is_overworld",
          features: id,
          step: "underground_ores",
        },
        null,
        2,
      ),
    },
    warnings: ["Forge biome_modifier JSON；Fabric/NeoForge 路径不同"],
  };
}
