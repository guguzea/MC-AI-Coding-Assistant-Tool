import { normalizeModIdentifier, toPascalCase, toJavaClassName, stripJavaTypeSuffix, type GeneratorResult, noNativeGeneratorError, docsToolForGeneratorPlatform } from "./common.js";

export function generateModel(modId: string, blockName: string, version?: string): GeneratorResult {
  if (!version?.trim()) {
    return { code: null, errors: ["version is required。" + noNativeGeneratorError("search_*_docs", "规则 02 / generate_model")] };
  }
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

  const warnings: string[] = ["骨架不随 pack_format 变"];
  if (mod.warned || block.warned) warnings.push("标识符已归一化");
  return {
    code: `// 见 files：blockstate + cube_all 模型\n// modId=${mod.value} block=${block.value}`,
    files,
    warnings,
  };
}

export function generateLang(modId: string, entries: Record<string, string>, version?: string): GeneratorResult {
  if (!version?.trim()) {
    return { code: null, errors: ["version is required。" + noNativeGeneratorError("search_*_docs", "规则 07 / generate_lang")] };
  }
  const mod = normalizeModIdentifier(modId);
  if (!mod) return { code: null, errors: ["无效 modId"] };
  const en: Record<string, string> = {};
  const zh: Record<string, string> = {};
  const warnings: string[] = ["骨架不随 pack_format 变"];
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
      warnings.push(
        `键 "${k}" 无点号且无法从 item_/block_/entity_ 前缀推断，已跳过（不会写成 block.${mod.value}.${k}）`,
      );
      continue;
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
    warnings,
  };
}

export function generateNetworkPacket(
  modId: string,
  packetName: string,
  platform?: string,
): GeneratorResult {
  const allowed = [
    "forge_1.20.1",
    "neoforge_1.20.4",
    "neoforge_1.21",
    "neoforge_26.1",
    "fabric_1.21",
    "fabric_26.1",
  ] as const;
  if (!platform) {
    return {
      code: null,
      errors: [
        "platform 必填，禁止默认 forge_1.20.1。可选：forge_1.20.1 | neoforge_1.20.4 | neoforge_1.21 | neoforge_26.1 | fabric_1.21 | fabric_26.1。" +
          noNativeGeneratorError("search_*_docs", "规则 06 / mc-networking Skill"),
      ],
    };
  }
  if (!(allowed as readonly string[]).includes(platform)) {
    return {
      code: null,
      errors: [
        `未知 platform=${platform}。可选：${allowed.join(" | ")}。` +
          noNativeGeneratorError("search_*_docs", "规则 06 / mc-networking Skill"),
      ],
    };
  }
  const mod = normalizeModIdentifier(modId);
  const pkt = normalizeModIdentifier(packetName);
  if (!mod || !pkt) return { code: null, errors: ["无效标识符"] };
  const pascal = stripJavaTypeSuffix(toJavaClassName(packetName), "Packet");

  if (platform === "neoforge_1.20.4") {
    return {
      code: `// NeoForge 1.20.4 — CustomPacketPayload（RegisterPayloadHandlerEvent 单数 Handler）
package com.example.${mod.value}.network;

import net.minecraft.network.FriendlyByteBuf;
import net.minecraft.network.protocol.common.custom.CustomPacketPayload;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.neoforge.network.event.RegisterPayloadHandlerEvent;
import net.neoforged.neoforge.network.handling.PlayPayloadContext;
import net.neoforged.neoforge.network.registration.IPayloadRegistrar;

public record ${pascal}Payload(String message) implements CustomPacketPayload {
    public static final ResourceLocation ID =
        new ResourceLocation("${mod.value}", "${pkt.value}");

    public ${pascal}Payload(FriendlyByteBuf buf) {
        this(buf.readUtf());
    }

    @Override
    public void write(FriendlyByteBuf buf) {
        buf.writeUtf(message);
    }

    @Override
    public ResourceLocation id() {
        return ID;
    }

    public static void register(RegisterPayloadHandlerEvent event) {
        final IPayloadRegistrar registrar = event.registrar("${mod.value}");
        registrar.play(
            ID,
            ${pascal}Payload::new,
            handler -> handler
                .client(${pascal}Payload::handleClient)
                .server(${pascal}Payload::handleServer));
    }

    private static void handleClient(${pascal}Payload payload, PlayPayloadContext context) {
        context.workHandler().submitAsync(() -> { /* client main thread */ });
    }

    private static void handleServer(${pascal}Payload payload, PlayPayloadContext context) {
        context.workHandler().submitAsync(() -> { /* server main thread */ });
    }
}
`,
      warnings: [
        "1.20.4 事件名是 RegisterPayloadHandlerEvent（单数 Handler），不是 1.21 的 RegisterPayloadHandlersEvent。",
        "反面：无 SimpleChannel / IMessage / NetworkRegistry.newSimpleChannel。",
      ],
    };
  }

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

  if (platform === "neoforge_26.1") {
    return {
      code: `// NeoForge 26.1 — Identifier + RegisterPayloadHandlersEvent
package com.example.${mod.value}.network;

import net.minecraft.network.codec.StreamCodec;
import net.minecraft.network.protocol.common.custom.CustomPacketPayload;
import net.minecraft.resources.Identifier;

public record ${pascal}Payload(String message) implements CustomPacketPayload {
    public static final CustomPacketPayload.Type<${pascal}Payload> TYPE =
        new CustomPacketPayload.Type<>(Identifier.fromNamespaceAndPath("${mod.value}", "${pkt.value}"));

    public static final StreamCodec<net.minecraft.network.RegistryFriendlyByteBuf, ${pascal}Payload> STREAM_CODEC =
        StreamCodec.of(
            (buf, payload) -> buf.writeUtf(payload.message()),
            buf -> new ${pascal}Payload(buf.readUtf()));

    @Override
    public CustomPacketPayload.Type<? extends CustomPacketPayload> type() {
        return TYPE;
    }
}
`,
      warnings: [
        "26.1 用 Identifier.fromNamespaceAndPath，不要 new ResourceLocation。",
        "事件是 RegisterPayloadHandlersEvent（复数），不是 1.20.4 的单数 Handler。",
        "反面：无 SimpleChannel / IMessage / NetworkRegistry.newSimpleChannel。",
      ],
    };
  }

  if (platform === "fabric_1.21") {
    return {
      code: `// Fabric 1.21.x — CustomPayload + PayloadTypeRegistry（Yarn）
package com.example.${mod.value}.network;

import net.fabricmc.fabric.api.networking.v1.PayloadTypeRegistry;
import net.fabricmc.fabric.api.networking.v1.ServerPlayNetworking;
import net.minecraft.network.RegistryByteBuf;
import net.minecraft.network.codec.PacketCodec;
import net.minecraft.network.codec.PacketCodecs;
import net.minecraft.network.packet.CustomPayload;
import net.minecraft.util.Identifier;

public record ${pascal}Payload(String message) implements CustomPayload {
    public static final CustomPayload.Id<${pascal}Payload> ID =
        new CustomPayload.Id<>(Identifier.of("${mod.value}", "${pkt.value}"));
    public static final PacketCodec<RegistryByteBuf, ${pascal}Payload> CODEC =
        PacketCodec.tuple(PacketCodecs.STRING, ${pascal}Payload::message, ${pascal}Payload::new);

    @Override
    public Id<? extends CustomPayload> getId() {
        return ID;
    }

    public static void register() {
        PayloadTypeRegistry.playC2S().register(ID, CODEC);
        ServerPlayNetworking.registerGlobalReceiver(ID, (payload, context) -> {
            /* validate on server */
        });
    }
}
`,
      warnings: [
        "Yarn 用 playC2S/playS2C、CustomPayload、net.minecraft.util.Identifier.of。",
        "不要抄 26.1 的 clientboundPlay / CustomPacketPayload / resources.Identifier。",
        "客户端接收用 ClientPlayNetworking.registerGlobalReceiver。",
      ],
    };
  }

  if (platform === "fabric_26.1") {
    return {
      code: `// Fabric 26.1 — CustomPacketPayload + PayloadTypeRegistry（Mojmap）
package com.example.${mod.value}.network;

import net.fabricmc.fabric.api.networking.v1.PayloadTypeRegistry;
import net.fabricmc.fabric.api.networking.v1.ServerPlayNetworking;
import net.minecraft.network.RegistryFriendlyByteBuf;
import net.minecraft.network.codec.StreamCodec;
import net.minecraft.network.protocol.common.custom.CustomPacketPayload;
import net.minecraft.resources.Identifier;

public record ${pascal}Payload(String message) implements CustomPacketPayload {
    public static final Identifier ID = Identifier.fromNamespaceAndPath("${mod.value}", "${pkt.value}");
    public static final CustomPacketPayload.Type<${pascal}Payload> TYPE = new CustomPacketPayload.Type<>(ID);
    public static final StreamCodec<RegistryFriendlyByteBuf, ${pascal}Payload> CODEC =
        StreamCodec.of(
            (buf, payload) -> buf.writeUtf(payload.message()),
            buf -> new ${pascal}Payload(buf.readUtf()));

    @Override
    public Type<? extends CustomPacketPayload> type() {
        return TYPE;
    }

    public static void register() {
        PayloadTypeRegistry.serverboundPlay().register(TYPE, CODEC);
        ServerPlayNetworking.registerGlobalReceiver(TYPE, (payload, context) -> {
            /* validate on server */
        });
    }
}
`,
      warnings: [
        "26.1 Mojmap：serverboundPlay/clientboundPlay、CustomPacketPayload、Identifier.fromNamespaceAndPath。",
        "不要把 Yarn 的 playC2S / CustomPayload 抄进 26.1。",
        "客户端接收用 ClientPlayNetworking.registerGlobalReceiver。",
      ],
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

export function generateCapability(
  modId: string,
  capName: string,
  platform?: string,
  version?: string,
): GeneratorResult {
  if (!platform) {
    return { code: null, errors: ["platform 必填（forge | neoforge | fabric | quilt），禁止默认 Forge Capability。" + noNativeGeneratorError("search_*_docs", "规则 05 / mc-capability Skill")] };
  }
  if (!version?.trim()) {
    return { code: null, errors: ["version is required。" + noNativeGeneratorError("search_*_docs", "规则 05 / mc-capability Skill")] };
  }
  const p = platform.trim().toLowerCase();
  if (p === "fabric" || p === "quilt") {
    return {
      code: null,
      errors: [
        "Fabric/Quilt 无内置 Capability。" +
          noNativeGeneratorError("search_fabric_docs", "规则 05 / mc-capability Skill / knowledge/libs/fabric-only/mc-cca") +
          " 不要生成 Forge Capability。",
      ],
    };
  }
  if (p === "neoforge") {
    if (!isNeoForgeAttachmentVersion(version)) {
      return {
        code: null,
        errors: [
          `NeoForge Data Attachment 仅支持 1.20.4+（收到 version=${version}）。` +
            noNativeGeneratorError("search_neoforge_docs", "规则 05 / mc-capability Skill"),
        ],
      };
    }
  } else if (p === "forge") {
    if (!isForgeCapabilityVersion(version)) {
      return {
        code: null,
        errors: [
          `Forge Capability 生成器仅支持 1.20.1（及 1.18.2–1.20.4）（收到 version=${version}）。` +
            noNativeGeneratorError("search_forge_docs", "规则 05 / mc-capability Skill"),
        ],
      };
    }
  } else {
    return { code: null, errors: [`未知 platform=${platform}。可选：forge | neoforge | fabric | quilt。` + noNativeGeneratorError("search_*_docs", "规则 05 / mc-capability Skill")] };
  }

  const mod = normalizeModIdentifier(modId);
  const cap = normalizeModIdentifier(capName);
  if (!mod || !cap) return { code: null, errors: ["无效标识符"] };
  const pascal = stripJavaTypeSuffix(toJavaClassName(capName), "Capability");

  if (p === "neoforge") {
    return {
      code: `// NeoForge DataAttachment 骨架（1.20.4+；不是 Forge Capability）
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

function isForgeCapabilityVersion(version: string): boolean {
  const t = version.trim();
  if (t === "1.20.1") return true;
  const m = t.match(/^1\.(18|19|20)\.(\d+)$/);
  if (!m) return false;
  const minor = Number(m[1]);
  const patch = Number(m[2]);
  if (minor === 18) return patch >= 2;
  if (minor === 19) return true;
  return patch <= 4;
}

function isNeoForgeAttachmentVersion(version: string): boolean {
  const t = version.trim();
  if (t.startsWith("26.1") || t.startsWith("1.21")) return true;
  const m = t.match(/^1\.20\.(\d+)/);
  if (m) return Number(m[1]) >= 4;
  return false;
}

export function generateConfig(
  modId: string,
  loader?: "forge" | "neoforge" | "fabric" | "quilt",
  version?: string,
): GeneratorResult {
  if (!loader) {
    return { code: null, errors: ["loader 必填（forge | neoforge | fabric | quilt），禁止默认 forge。" + noNativeGeneratorError("search_*_docs", "规则 00 / mc-config Skill")] };
  }
  if (!version?.trim()) {
    return { code: null, errors: ["version is required，禁止猜测 1.20.4 或 1.21。" + noNativeGeneratorError("search_*_docs", "规则 00 / mc-config Skill")] };
  }
  const mod = normalizeModIdentifier(modId);
  if (!mod) return { code: null, errors: ["无效 modId"] };

  if (loader === "fabric" || loader === "quilt") {
    return {
      code: `package com.example.${mod.value}.config;

import me.shedaniel.clothconfig2.api.ConfigBuilder;
import me.shedaniel.clothconfig2.api.ConfigCategory;
import me.shedaniel.clothconfig2.api.ConfigEntryBuilder;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.network.chat.Component;

public final class ${toPascalCase(mod.value)}Config {
    public static boolean enableFeature = true;

    private ${toPascalCase(mod.value)}Config() {}

    public static Screen create(Screen parent) {
        ConfigBuilder builder = ConfigBuilder.create()
            .setParentScreen(parent)
            .setTitle(Component.translatable("config.${mod.value}.title"));
        ConfigEntryBuilder entry = builder.entryBuilder();
        ConfigCategory general = builder.getOrCreateCategory(Component.translatable("config.${mod.value}.general"));
        general.addEntry(
            entry.startBooleanToggle(Component.translatable("config.${mod.value}.enable_feature"), enableFeature)
                .setDefaultValue(true)
                .setSaveConsumer(v -> enableFeature = v)
                .build());
        builder.setSavingRunnable(() -> { /* persist */ });
        return builder.build();
    }
}
`,
      warnings: [
        "Cloth Config 最小骨架：请在 build.gradle / fabric.mod.json（或 quilt.mod.json）声明 cloth-config 依赖；未声明则无法编译。",
        "配置屏仅客户端；不要在服务端加载 ConfigBuilder。",
      ],
    };
  }

  if (loader === "neoforge") {
    const v = version.trim();
    const useModConfig = v.startsWith("1.21") || v.startsWith("26.1");
    if (useModConfig) {
      return {
        code: `package com.example.${mod.value}.config;

import net.neoforged.neoforge.common.ModConfigSpec;

public class ${toPascalCase(mod.value)}Config {
    public static final ModConfigSpec.Builder BUILDER = new ModConfigSpec.Builder();
    public static final ModConfigSpec SPEC = BUILDER.build();
}
`,
      };
    }
    if (v.startsWith("1.20.4") || /^1\.20\.[4-9]/.test(v) || /^1\.20\.\d{2}/.test(v)) {
      return {
        code: `package com.example.${mod.value}.config;

import net.neoforged.neoforge.common.ForgeConfigSpec;

public class ${toPascalCase(mod.value)}Config {
    public static final ForgeConfigSpec.Builder BUILDER = new ForgeConfigSpec.Builder();
    public static final ForgeConfigSpec SPEC = BUILDER.build();
}
`,
      };
    }
    return {
      code: null,
      errors: [
        `NeoForge config 当前支持 1.20.4（ForgeConfigSpec + net.neoforged）与 1.21+/26.1（ModConfigSpec）。收到 version=${version}。` +
          noNativeGeneratorError("search_neoforge_docs", "规则 00 / mc-config Skill"),
      ],
    };
  }

  return {
    code: `package com.example.${mod.value}.config;

import net.minecraftforge.common.ForgeConfigSpec;

public class ${toPascalCase(mod.value)}Config {
    public static final ForgeConfigSpec.Builder BUILDER = new ForgeConfigSpec.Builder();
    public static final ForgeConfigSpec SPEC = BUILDER.build();
}
`,
  };
}

const ENTITY_RENDERER_SUPPORTED = "forge 1.20.1 / forge 1.20.4 / neoforge 26.1";

export function generateEntityRenderer(
  modId: string,
  entityName: string,
  platform?: string,
  version?: string,
): GeneratorResult {
  if (!platform) {
    return { code: null, errors: ["platform 必填（forge | neoforge | fabric | quilt）。" + noNativeGeneratorError("search_*_docs", "规则 04 / mc-entity Skill")] };
  }
  if (!version?.trim()) {
    return { code: null, errors: [`version is required。当前支持 ${ENTITY_RENDERER_SUPPORTED}。` + noNativeGeneratorError("search_*_docs", "规则 04 / mc-entity Skill")] };
  }
  const p = platform.trim().toLowerCase();
  const v = version.trim();
  const forgeOk = p === "forge" && (v === "1.20.1" || v === "1.20.4");
  const neo261 = p === "neoforge" && /^26\.1/.test(v);
  if (p === "fabric" || p === "quilt") {
    return {
      code: null,
      errors: [
        `当前支持 ${ENTITY_RENDERER_SUPPORTED}。Fabric/Quilt 禁止生成 @OnlyIn/Dist。` +
          noNativeGeneratorError("search_fabric_docs", "规则 04 / mc-entity Skill"),
      ],
    };
  }
  if (!forgeOk && !neo261) {
    return {
      code: null,
      errors: [
        `当前支持 ${ENTITY_RENDERER_SUPPORTED}（收到 platform=${platform} version=${version}），禁止默默生成。` +
          noNativeGeneratorError(docsToolForGeneratorPlatform(p), "规则 04 / mc-entity Skill"),
      ],
    };
  }
  const mod = normalizeModIdentifier(modId);
  const ent = normalizeModIdentifier(entityName);
  if (!mod || !ent) return { code: null, errors: ["无效标识符"] };
  const pascal = stripJavaTypeSuffix(toJavaClassName(entityName), "Renderer");
  if (neo261) {
    return {
      code: `// NeoForge 26.1 客户端 EntityRenderer。注册放 Dist.CLIENT（@EventBusSubscriber(value = Dist.CLIENT)）。
// 构造与注册事件以 search_neoforge_docs 为准（本档无 EntityRenderersEvent 页）。
package com.example.${mod.value}.client;

import net.minecraft.client.renderer.entity.EntityRenderer;
import net.minecraft.resources.Identifier;
import net.neoforged.api.distmarker.Dist;
import net.neoforged.fml.common.EventBusSubscriber;

@EventBusSubscriber(value = Dist.CLIENT)
public class ${pascal}Renderer extends EntityRenderer<${pascal}> {
    public static final Identifier TEXTURE =
        Identifier.fromNamespaceAndPath("${mod.value}", "textures/entity/${ent.value}.png");
}
`,
      experimental: true,
      warnings: [
        "26.1 用 Identifier，不要 ResourceLocation / @OnlyIn。",
        "注册事件名请 search_neoforge_docs，不要默写 EntityRenderersEvent。",
      ],
    };
  }
  return {
    code: `// 客户端 EntityRenderer 骨架 — GeckoLib 见 mc-geckolib skill
@OnlyIn(Dist.CLIENT)
public class ${pascal}Renderer extends MobRenderer<${pascal}, ${pascal}Model> {
    public ${pascal}Renderer(EntityRendererProvider.Context ctx) {
        super(ctx, new ${pascal}Model(ctx.bakeLayer(${pascal}Model.LAYER)), 0.5f);
    }
    @Override
    public ResourceLocation getTextureLocation(${pascal} entity) {
        return new ResourceLocation("${mod.value}", "textures/entity/${ent.value}.png");
    }
}
`,
    experimental: true,
  };
}

export function generateWorldgen(
  modId: string,
  featureName: string,
  platform?: string,
  version?: string,
): GeneratorResult {
  if (!platform?.trim()) {
    return {
      code: null,
      errors: [
        "platform 必填（forge | neoforge | fabric | quilt）。该版本无原生生成器时不要理解为游戏里做不了：改用 search_*_docs + 手动编写，参考规则 07-datagen / mc-worldgen Skill。",
      ],
    };
  }
  if (!version?.trim()) {
    return {
      code: null,
      errors: [
        "version 必填。该版本无原生生成器时不要理解为游戏里做不了：改用 search_*_docs + 手动编写，参考规则 07-datagen / mc-worldgen Skill。",
      ],
    };
  }
  const p = platform.trim().toLowerCase();
  const allowed = ["forge", "neoforge", "fabric", "quilt"];
  if (!allowed.includes(p)) {
    return {
      code: null,
      errors: [
        `未知 platform=${platform}。可选：${allowed.join(" | ")}。无模板时改用 search_*_docs + 07-datagen / mc-worldgen Skill。`,
      ],
    };
  }
  const mod = normalizeModIdentifier(modId);
  const feat = normalizeModIdentifier(featureName);
  if (!mod || !feat) return { code: null, errors: ["无效标识符"] };
  const id = `${mod.value}:${feat.value}`;
  const featureFiles: Record<string, string> = {
    [`data/${mod.value}/worldgen/configured_feature/${feat.value}.json`]: JSON.stringify(
      {
        type: "minecraft:ore",
        config: {
          size: 4,
          discard_chance_on_air_exposure: 0,
          targets: [
            {
              target: { predicate_type: "minecraft:tag_match", tag: "minecraft:stone_ore_replaceables" },
              state: { Name: "minecraft:iron_ore" },
            },
          ],
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
  };
  if (p === "fabric" || p === "quilt") {
    return {
      code: null,
      files: featureFiles,
      warnings: [
        "仅 configured_feature / placed_feature。注入群系用该档 BiomeModifications / 07-datagen，禁止 forge/biome_modifier。类名核 search_fabric_docs。",
      ],
    };
  }
  if (p === "neoforge") {
    return {
      code: null,
      files: {
        ...featureFiles,
        [`data/${mod.value}/neoforge/biome_modifier/${feat.value}.json`]: JSON.stringify(
          {
            type: "neoforge:add_features",
            biomes: "#minecraft:is_overworld",
            features: id,
            step: "underground_ores",
          },
          null,
          2,
        ),
      },
      warnings: [
        "NeoForge biome_modifier JSON；type/事件名以 search_neoforge_docs 该版页面为准，不要抄 Forge SimpleChannel 或邻档。",
      ],
    };
  }
  return {
    code: null,
    files: {
      ...featureFiles,
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
    warnings: ["Forge biome_modifier JSON（forge:add_features）"],
  };
}
