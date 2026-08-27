import { normalizeModIdentifier, toPascalCase, toJavaClassName, stripJavaTypeSuffix, type GeneratorResult, noNativeGeneratorError, docsToolForGeneratorPlatform, exactMcVersion } from "./common.js";

function usesClientItemsModelPath(version: string): boolean {
  const v = version.trim();
  if (/^26\.1/.test(v)) return true;
  if (v === "1.21.11") return true;
  const m = v.match(/^1\.21(?:\.(\d+))?$/);
  if (!m) return false;
  const patch = m[1] ? Number(m[1]) : 0;
  return patch >= 4;
}


export function generateModel(
  modId: string,
  blockName: string,
  version?: string,
  kind: "block" | "item" = "block",
): GeneratorResult {
  if (!version?.trim()) {
    return { code: null, errors: ["version is required。当前 generate_model 按传入 version 选物品模型路径（1.21.4+ / 1.21.11 / 26.1 走 items/），无独立精确档白名单。" + noNativeGeneratorError("search_*_docs", "规则 02 / generate_model")] };
  }
  if (!exactMcVersion(version)) {
    return { code: null, errors: [`version 必须是精确 MC 版本，收到 ${version}。` + noNativeGeneratorError("search_*_docs", "规则 02 / generate_model")] };
  }
  const mod = normalizeModIdentifier(modId);
  const block = normalizeModIdentifier(blockName);
  if (!mod || !block) return { code: null, errors: ["无效 modId/blockName"] };

  if (kind === "item") {
    const files: Record<string, string> = {};
    if (usesClientItemsModelPath(version)) {
      files[`assets/${mod.value}/items/${block.value}.json`] = JSON.stringify(
        { model: { type: "minecraft:model", model: `${mod.value}:item/${block.value}` } },
        null,
        2,
      );
      files[`assets/${mod.value}/models/item/${block.value}.json`] = JSON.stringify(
        { parent: "minecraft:item/generated", textures: { layer0: `${mod.value}:item/${block.value}` } },
        null,
        2,
      );
    } else {
      files[`assets/${mod.value}/models/item/${block.value}.json`] = JSON.stringify(
        { parent: "minecraft:item/generated", textures: { layer0: `${mod.value}:item/${block.value}` } },
        null,
        2,
      );
    }
    const warnings: string[] = ["骨架不随 pack_format 变"];
    if (mod.warned || block.warned) warnings.push("标识符已归一化");
    return {
      code: `// 见 files：物品 generated 模型\n// modId=${mod.value} item=${block.value}`,
      files,
      warnings,
    };
  }

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
  };
  if (usesClientItemsModelPath(version)) {
    files[`assets/${mod.value}/items/${block.value}.json`] = JSON.stringify(
      { model: { type: "minecraft:model", model: `${mod.value}:block/${block.value}` } },
      null,
      2,
    );
  } else {
    files[`assets/${mod.value}/models/item/${block.value}.json`] = JSON.stringify(
      { parent: `${mod.value}:block/${block.value}` },
      null,
      2,
    );
  }

  const warnings: string[] = usesClientItemsModelPath(version)
    ? ["1.21.4+/1.21.11/26.1 物品走 assets/<mod>/items/（Client Items）；方块 models/block 不变"]
    : ["骨架不随 pack_format 变"];
  if (mod.warned || block.warned) warnings.push("标识符已归一化");
  return {
    code: `// 见 files：blockstate + cube_all 模型\n// modId=${mod.value} block=${block.value}`,
    files,
    warnings,
  };
}

export function generateLang(modId: string, entries: Record<string, string>, version?: string): GeneratorResult {
  if (!version?.trim()) {
    return { code: null, errors: ["version is required。lang 骨架不随 pack_format 变。" + noNativeGeneratorError("search_*_docs", "规则 07 / generate_lang")] };
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
    } else if (k.startsWith("sound_")) {
      key = `sounds.${mod.value}.${k.slice("sound_".length)}`;
    } else if (k.startsWith("effect_")) {
      key = `effect.${mod.value}.${k.slice("effect_".length)}`;
    } else {
      warnings.push(
        `键 "${k}" 无点号且无法从 item_/block_/entity_/sound_/effect_ 前缀推断，已跳过（不会写成 block.${mod.value}.${k}）`,
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

function neoforgeSplitPayloadSkeleton(
  mod: string,
  pkt: string,
  pascal: string,
  versionNote: string,
  idStyle: "ResourceLocation" | "Identifier",
): GeneratorResult {
  const idImport =
    idStyle === "Identifier" ? "net.minecraft.resources.Identifier" : "net.minecraft.resources.ResourceLocation";
  const idExpr =
    idStyle === "Identifier"
      ? `Identifier.fromNamespaceAndPath("${mod}", "${pkt}")`
      : `ResourceLocation.fromNamespaceAndPath("${mod}", "${pkt}")`;
  const extraImports =
    idStyle === "Identifier"
      ? "import net.minecraft.network.RegistryFriendlyByteBuf;"
      : `import io.netty.buffer.ByteBuf;
import net.minecraft.network.codec.ByteBufCodecs;`;
  const streamCodecType =
    idStyle === "Identifier"
      ? `StreamCodec<RegistryFriendlyByteBuf, ${pascal}Payload>`
      : `StreamCodec<ByteBuf, ${pascal}Payload>`;
  const streamCodecInit =
    idStyle === "Identifier"
      ? `StreamCodec.of(
            (buf, payload) -> buf.writeUtf(payload.message()),
            buf -> new ${pascal}Payload(buf.readUtf()));`
      : `StreamCodec.composite(
        ByteBufCodecs.STRING_UTF8,
        ${pascal}Payload::message,
        ${pascal}Payload::new);`;

  return {
    code: `// NeoForge ${versionNote} — RegisterClientPayloadHandlersEvent + ClientPacketDistributor
package com.example.${mod}.network;

${extraImports}
import net.minecraft.network.codec.StreamCodec;
import net.minecraft.network.protocol.common.custom.CustomPacketPayload;
import ${idImport};
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.neoforge.client.network.ClientPacketDistributor;
import net.neoforged.neoforge.network.event.RegisterClientPayloadHandlersEvent;
import net.neoforged.neoforge.network.event.RegisterPayloadHandlersEvent;
import net.neoforged.neoforge.network.handling.IPayloadContext;
import net.neoforged.neoforge.network.registration.PayloadRegistrar;

public record ${pascal}Payload(String message) implements CustomPacketPayload {
    public static final CustomPacketPayload.Type<${pascal}Payload> TYPE =
        new CustomPacketPayload.Type<>(${idExpr});

    public static final ${streamCodecType} STREAM_CODEC = ${streamCodecInit}

    @Override
    public CustomPacketPayload.Type<? extends CustomPacketPayload> type() {
        return TYPE;
    }

    @SubscribeEvent
    public static void register(RegisterPayloadHandlersEvent event) {
        final PayloadRegistrar registrar = event.registrar("1");
        registrar.playBidirectional(TYPE, STREAM_CODEC, ${pascal}Payload::handleServer);
    }

    @SubscribeEvent
    public static void registerClient(RegisterClientPayloadHandlersEvent event) {
        event.register(TYPE, ${pascal}Payload::handleClient);
    }

    public static void sendToServer(${pascal}Payload payload) {
        ClientPacketDistributor.sendToServer(payload);
    }

    private static void handleClient(final ${pascal}Payload data, final IPayloadContext context) {
        /* physical client */
    }

    private static void handleServer(final ${pascal}Payload data, final IPayloadContext context) {
        /* logical server */
    }
}
`,
    warnings: [
      `${versionNote} 客户端处理走 RegisterClientPayloadHandlersEvent#register，服务端走 RegisterPayloadHandlersEvent。`,
      "发往服务端用 ClientPacketDistributor.sendToServer，不要 DirectionalPayloadHandler / PacketDistributor.sendToServer。",
      idStyle === "Identifier" ? "26.1/1.21.11 用 Identifier.fromNamespaceAndPath。" : "本档用 ResourceLocation.fromNamespaceAndPath。",
      "反面：SimpleChannel。",
    ],
  };
}

export const NETWORK_PACKET_PLATFORMS = [
  // B23 证据：fabric_1.21.3 → fabric/1.21.3/.cursor/rules/06-networking.mdc + 07-datagen.mdc
  // 已核实 CustomPayload / PayloadTypeRegistry.playC2S / FabricRecipeProvider.generate。
  // neoforge_1.20.6 有规则无 verified payload 页 → 不加模板。
  "forge_1.20.1",
  "forge_1.20.4",
  "forge_1.19.4",
  "forge_1.18.2",
  "forge_1.17.1",
  "forge_1.16.5",
  "forge_1.15.2",
  "forge_1.14.4",
  "forge_1.12.2",
  "neoforge_1.20.1",
  "neoforge_1.20.4",
  "neoforge_1.21",
  "neoforge_1.21.1",
  "neoforge_1.21.3",
  "neoforge_1.21.5",
  "neoforge_1.21.8",
  "neoforge_1.21.10",
  "neoforge_1.21.11",
  "neoforge_26.1",
  "fabric_1.21",
  "fabric_1.21.3",
  "fabric_1.21.4",
  "fabric_1.21.8",
  "fabric_1.21.10",
  "fabric_1.21.11",
  "fabric_26.1",
  "fabric_26.1.2",
  // D-2：Quilt 走 FAPI 通道（QSL 无网络模块）。仅同版本存在已核 Fabric donor 的档给骨架；
  // ≤1.20.4 / 1.21.1 无 donor，保持 error + actionable 改口（见 generateNetworkPacket 的 quilt 分支说明）。
  "quilt_1.21.3",
  "quilt_1.21.4",
  "quilt_1.21.8",
  "quilt_1.21.10",
  "quilt_1.21.11",
] as const;

export type NetworkPacketPlatform = (typeof NETWORK_PACKET_PLATFORMS)[number];

export function networkPacketPlatformList(): string {
  return NETWORK_PACKET_PLATFORMS.join(" / ");
}

/** 模糊 token 保留时必须列出的精确档（文档版本与 token 后缀一致）。 */
export const FABRIC_NETWORK_EXACT_TOKENS =
  "fabric_1.21.3 / fabric_1.21.4 / fabric_1.21.8 / fabric_1.21.10 / fabric_1.21.11 / fabric_26.1.2";
export const NEOFORGE_NETWORK_EXACT_TOKENS =
  "neoforge_1.21.1 / neoforge_1.21.3 / neoforge_1.21.5 / neoforge_1.21.8 / neoforge_1.21.10 / neoforge_1.21.11 / neoforge_26.1";

export function generateNetworkPacketDescription(): string {
  return (
    "Generate network packet skeleton。platform 必填且须带版本后缀（" +
    networkPacketPlatformList() +
    "）。模糊 token fabric_1.21 / neoforge_1.21 仍出骨架但 warnings 列出精确 token（fabric：" +
    FABRIC_NETWORK_EXACT_TOKENS +
    "；neo：" +
    NEOFORGE_NETWORK_EXACT_TOKENS +
    "）。未列出的 platform 拒绝（含 fabric_1.20.1 / fabric_1.21.1 / neoforge_1.20.6）；只传 fabric 会 error。返回 Java 骨架文本，不写盘。"
  );
}

/** D-2：无已核 Fabric donor 的 quilt 档不给成功路径，给 actionable 改口。 */
function quiltNetworkNoDonorHint(ver: string): string {
  const qslEra = ["1.18.2", "1.19.4", "1.20.1"].includes(ver)
    ? `QFAPI ${ver} 线有历史构件（终版 QFAPI 7.7.0/QSL 6.3.0 仅 1.20.1），但其网络 API 形态与现行 FAPI 不同，本工具未核实该代签名，不生成骨架。`
    : `QSL/QFAPI 在 ${ver} 无任何已发布构件（QSL 已于 2025-12 停更）。`;
  return (
    ` Quilt ${ver} 无同版本已核 donor：${qslEra}` +
    ` 改口 search_fabric_docs version=${ver} + 本档 mc-networking Skill；工程声明 fabric-api 时可参考 quilt_1.21.4 骨架仅作结构参考，禁止当 ${ver} 官方 API。`
  );
}

function docsReviewHeader(tool: string, version: string): string {
  return `// 修改此骨架前必须用 ${tool}(version=${version}) 复核；禁止邻档 API。\n`;
}

function withDocsReviewHeader(code: string, tool: string, version: string): string {
  const header = docsReviewHeader(tool, version);
  return code.startsWith(header) ? code : header + code;
}

function forgeSimpleChannelSkeleton(
  mod: string,
  pascal: string,
  mcVersion: string,
  watermark: boolean,
): GeneratorResult {
  const body = `// Forge ${mcVersion} — SimpleChannel 消息骨架
package com.example.${mod}.network;

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
`;
  return {
    code: watermark ? withDocsReviewHeader(body, "search_forge_docs", mcVersion) : body,
    warnings: watermark
      ? [
          `Forge ${mcVersion} 用 SimpleChannel / NetworkRegistry.newSimpleChannel / FriendlyByteBuf（search_forge_docs version=${mcVersion}）。`,
          "反面：PayloadTypeRegistry / RegisterPayloadHandlersEvent / RecipeOutput。",
        ]
      : undefined,
  };
}

/** D-3：1.13–1.16 MCP 时代 SimpleChannel（PacketBuffer + net.minecraft.util.ResourceLocation）。
 * 内容对照各档 06-networking.mdc 的已核示例（如 forge/1.16.5 L95–160、forge/1.14.4 L96–120 用 PacketBuffer/EntityPlayerMP）。 */
function forgeSimpleChannelMcpSkeleton(
  mod: string,
  pascal: string,
  mcVersion: string,
): GeneratorResult {
  const body = `// Forge ${mcVersion} — SimpleChannel（MCP 名：PacketBuffer；注册放 FMLCommonSetupEvent）
package com.example.${mod}.network;

import java.util.function.Supplier;
import net.minecraft.network.PacketBuffer;
import net.minecraft.util.ResourceLocation;
import net.minecraftforge.fml.network.NetworkEvent;
import net.minecraftforge.fml.network.NetworkRegistry;
import net.minecraftforge.fml.network.simple.SimpleChannel;

public class NetworkHandler {
    private static final String PROTOCOL_VERSION = "1";
    public static final SimpleChannel INSTANCE = NetworkRegistry.newSimpleChannel(
            new ResourceLocation("${mod}", "main"),
            () -> PROTOCOL_VERSION,
            PROTOCOL_VERSION::equals,
            PROTOCOL_VERSION::equals);
    private static int id = 0;

    // 在 FMLCommonSetupEvent 里调用 register()
    public static void register() {
        INSTANCE.registerMessage(
                id++,
                ${pascal}Packet.class,
                ${pascal}Packet::encode,
                ${pascal}Packet::new,
                (msg, ctx) -> msg.handle(ctx));
    }

    public static void sendToServer(${pascal}Packet msg) {
        INSTANCE.sendToServer(msg);
    }
}

public class ${pascal}Packet {
    private final String message;

    public ${pascal}Packet(String message) { this.message = message; }

    public ${pascal}Packet(PacketBuffer buf) {
        this(buf.readUtf());
    }

    public void encode(PacketBuffer buf) {
        buf.writeUtf(message);
    }

    public void handle(Supplier<NetworkEvent.Context> ctx) {
        ctx.get().enqueueWork(() -> { /* server/client logic */ });
        ctx.get().setPacketHandled(true);
    }
}
`;
  return {
    code: withDocsReviewHeader(body, "search_forge_docs", mcVersion),
    warnings: [
      `Forge ${mcVersion} MCP 名：PacketBuffer / ResourceLocation / SimpleChannel（NetworkRegistry.newSimpleChannel），registerMessage 放 FMLCommonSetupEvent。`,
      "反面：SimpleNetworkWrapper / IMessage / IMessageHandler（那是 1.12）；发送用 PacketDistributor，不要 sendTo(player,msg)/sendToAll(msg)。",
      `${mcVersion} 是 MCP 映射时代；不要抄 1.17+ 的 FriendlyByteBuf 写法。`,
      "import 包路径以工程现有 import 与 search_forge_docs(version=" + mcVersion + ") 为准，禁止默写全限定名。",
    ],
  };
}

/** D-3：1.17 SimpleChannel（官方 Mojang 映射：FriendlyByteBuf + net.minecraft.resources.ResourceLocation）。
 * 对照 forge/1.17.1 06-networking.mdc L113–160 已核示例。 */
function forgeSimpleChannelOfficialSkeleton(
  mod: string,
  pascal: string,
  mcVersion: string,
): GeneratorResult {
  const body = `// Forge ${mcVersion} — SimpleChannel（官方映射：FriendlyByteBuf；注册放 FMLCommonSetupEvent）
package com.example.${mod}.network;

import java.util.function.Supplier;
import net.minecraft.network.FriendlyByteBuf;
import net.minecraft.resources.ResourceLocation;
import net.minecraftforge.fml.network.NetworkEvent;
import net.minecraftforge.fml.network.NetworkRegistry;
import net.minecraftforge.fml.network.simple.SimpleChannel;

public class NetworkHandler {
    private static final String PROTOCOL_VERSION = "1";
    public static final SimpleChannel INSTANCE = NetworkRegistry.newSimpleChannel(
            new ResourceLocation("${mod}", "main"),
            () -> PROTOCOL_VERSION,
            PROTOCOL_VERSION::equals,
            PROTOCOL_VERSION::equals);
    private static int id = 0;

    // 在 FMLCommonSetupEvent 里调用 register()
    public static void register() {
        INSTANCE.registerMessage(
                id++,
                ${pascal}Packet.class,
                ${pascal}Packet::toBytes,
                ${pascal}Packet::new,
                (msg, ctx) -> msg.handle(ctx));
    }

    public static void sendToServer(${pascal}Packet msg) {
        INSTANCE.sendToServer(msg);
    }
}

public class ${pascal}Packet {
    private final String message;

    public ${pascal}Packet(String message) { this.message = message; }

    public ${pascal}Packet(FriendlyByteBuf buf) {
        this(buf.readUtf());
    }

    public void toBytes(FriendlyByteBuf buf) {
        buf.writeUtf(message);
    }

    public void handle(Supplier<NetworkEvent.Context> ctx) {
        ctx.get().enqueueWork(() -> { /* server/client logic */ });
        ctx.get().setPacketHandled(true);
    }
}
`;
  return {
    code: withDocsReviewHeader(body, "search_forge_docs", mcVersion),
    warnings: [
      `Forge ${mcVersion} 用官方映射名：FriendlyByteBuf / net.minecraft.resources.ResourceLocation / SimpleChannel（NetworkRegistry.newSimpleChannel），registerMessage 放 FMLCommonSetupEvent。`,
      "反面：SimpleNetworkWrapper / IMessage（那是 1.12）、PacketBuffer（那是 ≤1.16 的 MCP 名）。",
      "发送用 PacketDistributor，不要 sendTo(player,msg)/sendToAll(msg)。",
      "import 包路径以工程现有 import 与 search_forge_docs(version=" + mcVersion + ") 为准，禁止默写全限定名。",
    ],
  };
}

function neoforgeDirectionalPayloadSkeleton(
  mod: string,
  pkt: string,
  pascal: string,
  mcVersion: string,
  watermark: boolean,
): GeneratorResult {
  const body = `// NeoForge ${mcVersion} — networking/payload（search_neoforge_docs version=${mcVersion}）
package com.example.${mod}.network;

import io.netty.buffer.ByteBuf;
import net.minecraft.network.codec.ByteBufCodecs;
import net.minecraft.network.codec.StreamCodec;
import net.minecraft.network.protocol.common.custom.CustomPacketPayload;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.neoforge.network.event.RegisterPayloadHandlersEvent;
import net.neoforged.neoforge.network.handling.DirectionalPayloadHandler;
import net.neoforged.neoforge.network.handling.IPayloadContext;
import net.neoforged.neoforge.network.registration.PayloadRegistrar;

public record ${pascal}Payload(String message) implements CustomPacketPayload {
    public static final CustomPacketPayload.Type<${pascal}Payload> TYPE =
        new CustomPacketPayload.Type<>(ResourceLocation.fromNamespaceAndPath("${mod}", "${pkt}"));

    public static final StreamCodec<ByteBuf, ${pascal}Payload> STREAM_CODEC = StreamCodec.composite(
        ByteBufCodecs.STRING_UTF8,
        ${pascal}Payload::message,
        ${pascal}Payload::new);

    @Override
    public CustomPacketPayload.Type<? extends CustomPacketPayload> type() {
        return TYPE;
    }

    @SubscribeEvent
    public static void register(final RegisterPayloadHandlersEvent event) {
        final PayloadRegistrar registrar = event.registrar("1");
        registrar.playBidirectional(
            TYPE,
            STREAM_CODEC,
            new DirectionalPayloadHandler<>(
                ${pascal}Payload::handleClient,
                ${pascal}Payload::handleServer));
    }

    private static void handleClient(final ${pascal}Payload data, final IPayloadContext context) {
        /* main thread by default */
    }

    private static void handleServer(final ${pascal}Payload data, final IPayloadContext context) {
        /* main thread by default */
    }
}
`;
  return {
    code: watermark ? withDocsReviewHeader(body, "search_neoforge_docs", mcVersion) : body,
    warnings: [
      `${mcVersion} 用 RegisterPayloadHandlersEvent + PayloadRegistrar.playBidirectional + DirectionalPayloadHandler。`,
      "不要把 1.21.10 的 RegisterClientPayloadHandlersEvent / ClientPacketDistributor 抄进本档。",
      "反面：SimpleChannel / RegisterPayloadHandlerEvent（单数 Handler）。",
    ],
  };
}

function fabricYarnPayloadSkeleton(
  mod: string,
  pkt: string,
  pascal: string,
  mcVersion: string,
  extraWarnings: string[],
): GeneratorResult {
  const body = `// Fabric ${mcVersion} — CustomPayload + PayloadTypeRegistry（Yarn）
package com.example.${mod}.network;

import net.fabricmc.fabric.api.networking.v1.PayloadTypeRegistry;
import net.fabricmc.fabric.api.networking.v1.ServerPlayNetworking;
import net.minecraft.network.RegistryByteBuf;
import net.minecraft.network.codec.PacketCodec;
import net.minecraft.network.codec.PacketCodecs;
import net.minecraft.network.packet.CustomPayload;
import net.minecraft.util.Identifier;

public record ${pascal}Payload(String message) implements CustomPayload {
    public static final CustomPayload.Id<${pascal}Payload> ID =
        new CustomPayload.Id<>(Identifier.of("${mod}", "${pkt}"));
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
`;
  return {
    code: withDocsReviewHeader(body, "search_fabric_docs", mcVersion),
    warnings: extraWarnings,
  };
}

function fabricMojmap26PayloadSkeleton(
  mod: string,
  pkt: string,
  pascal: string,
  mcVersion: string,
  watermark: boolean,
): GeneratorResult {
  const body = `// Fabric ${mcVersion} — CustomPacketPayload + PayloadTypeRegistry（Mojmap）
package com.example.${mod}.network;

import net.fabricmc.fabric.api.networking.v1.PayloadTypeRegistry;
import net.fabricmc.fabric.api.networking.v1.ServerPlayNetworking;
import net.minecraft.network.RegistryFriendlyByteBuf;
import net.minecraft.network.codec.StreamCodec;
import net.minecraft.network.protocol.common.custom.CustomPacketPayload;
import net.minecraft.resources.Identifier;

public record ${pascal}Payload(String message) implements CustomPacketPayload {
    public static final Identifier ID = Identifier.fromNamespaceAndPath("${mod}", "${pkt}");
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
`;
  return {
    code: watermark ? withDocsReviewHeader(body, "search_fabric_docs", mcVersion) : body,
    warnings: [
      `${mcVersion} Mojmap：serverboundPlay/clientboundPlay、CustomPacketPayload、Identifier.fromNamespaceAndPath。`,
      "不要把 Yarn 的 playC2S / CustomPayload 抄进 26.1。",
      "客户端接收用 ClientPlayNetworking.registerGlobalReceiver。",
    ],
  };
}

export function generateNetworkPacket(
  modId: string,
  packetName: string,
  platform?: string,
): GeneratorResult {
  const allowed = NETWORK_PACKET_PLATFORMS;
  if (!platform) {
    return {
      code: null,
      errors: [
        "platform 必填，禁止默认 forge_1.20.1。可选：" +
          allowed.join(" | ") +
          "。" +
          noNativeGeneratorError("search_*_docs", "规则 06 / mc-networking Skill"),
      ],
    };
  }
  if (!(allowed as readonly string[]).includes(platform)) {
    return {
      code: null,
      errors: [
        `未知 platform=${platform}。可选：${allowed.join(" | ")}。` +
          (platform === "neoforge_1.20.6"
            ? " NeoForge 1.20.6 仅有 networking 概述（RegisterPayloadHandlersEvent），无 payload 页故不写骨架。"
            : platform === "fabric_1.21.1"
              ? " Fabric 1.21.1 无入库 networking 专页（failures.json）。请 search_fabric_docs version=1.21.4 + 本档 mc-networking Skill；可选 fabric_1.21.4 骨架仅作结构参考，禁止当 1.21.1 官方 API。禁止把 fabric_1.21 当 1.21.1。"
              : platform === "fabric_1.20.4" || platform === "fabric_1.20.1"
                ? " 该档无官方 networking 页。"
                : platform.startsWith("quilt_")
                  ? quiltNetworkNoDonorHint(platform.slice("quilt_".length))
                  : "") +
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
    public static final CustomPacketPayload.Type<${pascal}Payload> TYPE =
        new CustomPacketPayload.Type<>(ResourceLocation.fromNamespaceAndPath("${mod.value}", "${pkt.value}"));

    public static final StreamCodec<RegistryFriendlyByteBuf, ${pascal}Payload> STREAM_CODEC =
        StreamCodec.of(
            (buf, payload) -> buf.writeUtf(payload.message()),
            buf -> new ${pascal}Payload(buf.readUtf()));

    @Override
    public CustomPacketPayload.Type<? extends CustomPacketPayload> type() {
        return TYPE;
    }
}
`,
      experimental: true,
      warnings: [
        `模糊 token neoforge_1.21：请改用已核实的 ${NEOFORGE_NETWORK_EXACT_TOKENS}。本骨架仅作结构提示，禁止当精确档 API。`,
      ],
    };
  }

  if (platform === "neoforge_1.21.5") {
    return {
      code: `// NeoForge 1.21.5 — networking/payload（search_neoforge_docs version=1.21.5）
package com.example.${mod.value}.network;

import io.netty.buffer.ByteBuf;
import net.minecraft.network.codec.ByteBufCodecs;
import net.minecraft.network.codec.StreamCodec;
import net.minecraft.network.protocol.common.custom.CustomPacketPayload;
import net.minecraft.resources.ResourceLocation;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.neoforge.network.event.RegisterPayloadHandlersEvent;
import net.neoforged.neoforge.network.handling.DirectionalPayloadHandler;
import net.neoforged.neoforge.network.handling.IPayloadContext;
import net.neoforged.neoforge.network.registration.PayloadRegistrar;

public record ${pascal}Payload(String message) implements CustomPacketPayload {
    public static final CustomPacketPayload.Type<${pascal}Payload> TYPE =
        new CustomPacketPayload.Type<>(ResourceLocation.fromNamespaceAndPath("${mod.value}", "${pkt.value}"));

    public static final StreamCodec<ByteBuf, ${pascal}Payload> STREAM_CODEC = StreamCodec.composite(
        ByteBufCodecs.STRING_UTF8,
        ${pascal}Payload::message,
        ${pascal}Payload::new);

    @Override
    public CustomPacketPayload.Type<? extends CustomPacketPayload> type() {
        return TYPE;
    }

    @SubscribeEvent
    public static void register(final RegisterPayloadHandlersEvent event) {
        final PayloadRegistrar registrar = event.registrar("1");
        registrar.playBidirectional(
            TYPE,
            STREAM_CODEC,
            new DirectionalPayloadHandler<>(
                ${pascal}Payload::handleClient,
                ${pascal}Payload::handleServer));
    }

    private static void handleClient(final ${pascal}Payload data, final IPayloadContext context) {
        /* main thread by default */
    }

    private static void handleServer(final ${pascal}Payload data, final IPayloadContext context) {
        /* main thread by default */
    }
}
`,
      warnings: [
        "1.21.5 用 RegisterPayloadHandlersEvent + PayloadRegistrar.playBidirectional + DirectionalPayloadHandler。",
        "不要把 1.21.10 的 RegisterClientPayloadHandlersEvent / ClientPacketDistributor 抄进本档。",
        "反面：SimpleChannel / RegisterPayloadHandlerEvent（单数 Handler）。",
      ],
    };
  }

  if (platform === "neoforge_1.21.1") {
    return neoforgeDirectionalPayloadSkeleton(mod.value, pkt.value, pascal, "1.21.1", true);
  }

  if (platform === "neoforge_1.21.3") {
    return neoforgeDirectionalPayloadSkeleton(mod.value, pkt.value, pascal, "1.21.3", true);
  }

  if (platform === "neoforge_1.21.8") {
    return neoforgeSplitPayloadSkeleton(mod.value, pkt.value, pascal, "1.21.8", "ResourceLocation");
  }

  if (platform === "neoforge_1.21.10") {
    return neoforgeSplitPayloadSkeleton(mod.value, pkt.value, pascal, "1.21.10", "ResourceLocation");
  }

  if (platform === "neoforge_1.21.11") {
    return neoforgeSplitPayloadSkeleton(mod.value, pkt.value, pascal, "1.21.11", "Identifier");
  }

  if (platform === "neoforge_26.1") {
    return neoforgeSplitPayloadSkeleton(mod.value, pkt.value, pascal, "26.1", "Identifier");
  }

  if (platform === "fabric_1.21") {
    return fabricYarnPayloadSkeleton(mod.value, pkt.value, pascal, "1.21", [
      `模糊 token fabric_1.21：请改用已核实的 ${FABRIC_NETWORK_EXACT_TOKENS}。禁止把本骨架当 1.21.1（该档无入库 networking 专页，见 failures.json）。`,
      "Yarn 用 playC2S/playS2C、CustomPayload、net.minecraft.util.Identifier.of。",
      "不要抄 26.1 的 clientboundPlay / CustomPacketPayload / resources.Identifier。",
      "客户端接收用 ClientPlayNetworking.registerGlobalReceiver。",
    ]);
  }

  if (
    platform === "fabric_1.21.3" ||
    platform === "fabric_1.21.4" ||
    platform === "fabric_1.21.8" ||
    platform === "fabric_1.21.10" ||
    platform === "fabric_1.21.11"
  ) {
    const ver = platform.slice("fabric_".length);
    return fabricYarnPayloadSkeleton(mod.value, pkt.value, pascal, ver, [
      `Yarn ${ver}：PayloadTypeRegistry.playC2S / CustomPayload（search_fabric_docs version=${ver}）。`,
      "不要抄 26.1 的 serverboundPlay / CustomPacketPayload。",
      "客户端接收用 ClientPlayNetworking.registerGlobalReceiver。",
    ]);
  }

  if (platform === "fabric_26.1") {
    return fabricMojmap26PayloadSkeleton(mod.value, pkt.value, pascal, "26.1", false);
  }

  if (platform === "fabric_26.1.2") {
    return fabricMojmap26PayloadSkeleton(mod.value, pkt.value, pascal, "26.1.2", true);
  }

  // D-2：Quilt 网络 = 同版本已核 Fabric donor 骨架 + QSL 无网络模块横幅（QSL 2025-12 停更）
  if (platform.startsWith("quilt_")) {
    const ver = platform.slice("quilt_".length);
    const donorWarnings = [
      `Quilt ${ver}：QSL 无网络模块；本骨架为同版本 Fabric API donor（FAPI 通道）。工程须声明 fabric-api 或 QFAPI 依赖。`,
      "QSL 已于 2025-12 停更；不要把本骨架改写成 org.quiltmc.qsl.* 网络类名（不存在该模块）。",
      "客户端接收用 ClientPlayNetworking.registerGlobalReceiver；签名核 search_fabric_docs version=" + ver + "。",
    ];
    return fabricYarnPayloadSkeleton(mod.value, pkt.value, pascal, ver, donorWarnings);
  }

  if (platform === "neoforge_1.20.1") {
    return {
      code: `// NeoForge 1.20.1 — SimpleChannel 形态（与 Forge 1.20.1 API 兼容）
package com.example.${mod.value}.network;

import net.minecraft.network.FriendlyByteBuf;
import java.util.function.Supplier;
// NetworkEvent / SimpleChannel / registerMessage 的 import 跟工程现有包名与 search_neoforge_docs(version=1.20.1)，禁止默写。

public class ${pascal}Packet {
    private final String message;

    public ${pascal}Packet(String message) { this.message = message; }

    public static void encode(${pascal}Packet msg, FriendlyByteBuf buf) {
        buf.writeUtf(msg.message);
    }

    public static ${pascal}Packet decode(FriendlyByteBuf buf) {
        return new ${pascal}Packet(buf.readUtf());
    }

    public static void handle(${pascal}Packet msg, Supplier<?> ctx) {
        // ctx 类型跟工程 NetworkEvent.Context；enqueueWork + setPacketHandled
    }
}
`,
      warnings: [
        "NeoForge 1.20.1 网络是 SimpleChannel 形态，不是 1.20.4+ Payload。",
        "包名以工程 import 与 search_neoforge_docs(version=1.20.1) 为准，禁止默写。",
      ],
    };
  }

  if (platform === "forge_1.12.2") {
    const body = `// Forge 1.12.2 — SimpleNetworkWrapper + IMessage
package com.example.${mod.value}.network;

import io.netty.buffer.ByteBuf;
import net.minecraftforge.fml.common.network.NetworkRegistry;
import net.minecraftforge.fml.common.network.simpleimpl.IMessage;
import net.minecraftforge.fml.common.network.simpleimpl.IMessageHandler;
import net.minecraftforge.fml.common.network.simpleimpl.MessageContext;
import net.minecraftforge.fml.common.network.simpleimpl.SimpleNetworkWrapper;

public class ${pascal}Packet implements IMessage {
    public static final SimpleNetworkWrapper CHANNEL =
        NetworkRegistry.INSTANCE.newSimpleChannel("${mod.value}");

    private String message = "";

    public ${pascal}Packet() {}

    public ${pascal}Packet(String message) { this.message = message; }

    @Override
    public void toBytes(ByteBuf buf) {
        byte[] data = message.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        buf.writeInt(data.length);
        buf.writeBytes(data);
    }

    @Override
    public void fromBytes(ByteBuf buf) {
        int len = buf.readInt();
        byte[] data = new byte[len];
        buf.readBytes(data);
        message = new String(data, java.nio.charset.StandardCharsets.UTF_8);
    }

    public static class Handler implements IMessageHandler<${pascal}Packet, IMessage> {
        @Override
        public IMessage onMessage(${pascal}Packet message, MessageContext ctx) {
            return null;
        }
    }
}
`;
    return {
      code: withDocsReviewHeader(body, "search_forge_docs", "1.12.2"),
      warnings: [
        "1.12.2 是 SimpleNetworkWrapper + IMessage / IMessageHandler / ByteBuf，不是 SimpleChannel / FriendlyByteBuf。",
        "反面：PayloadTypeRegistry / RecipeOutput。",
      ],
    };
  }

  if (platform === "forge_1.20.4") {
    return forgeSimpleChannelSkeleton(mod.value, pascal, "1.20.4", true);
  }
  if (platform === "forge_1.19.4") {
    return forgeSimpleChannelSkeleton(mod.value, pascal, "1.19.4", true);
  }
  if (platform === "forge_1.18.2") {
    return forgeSimpleChannelSkeleton(mod.value, pascal, "1.18.2", true);
  }
  // D-3：1.14.4–1.16.5 为 MCP 映射时代（PacketBuffer）；1.17 起默认官方映射（FriendlyByteBuf）——
  // 两个时代不共用骨架（各档 06 规则已核示例派生）
  if (platform === "forge_1.14.4" || platform === "forge_1.15.2" || platform === "forge_1.16.5") {
    const ver = platform.slice("forge_".length);
    return forgeSimpleChannelMcpSkeleton(mod.value, pascal, ver);
  }
  if (platform === "forge_1.17.1") {
    return forgeSimpleChannelOfficialSkeleton(mod.value, pascal, "1.17.1");
  }

  // 未知 platform token 目前落入 Forge 1.20.1 SimpleChannel；新增枚举必须在此之前接分支，禁止默默吃掉。
  return forgeSimpleChannelSkeleton(mod.value, pascal, "1.20.1", false);
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
    if (version.trim() === "1.20.1") {
      // Capability 形态，见下方骨架
    } else if (!isNeoForgeAttachmentVersion(version)) {
      return {
        code: null,
        errors: [
          `NeoForge Data Attachment 仅支持 1.20.4+（收到 version=${version}）。1.20.1 请走 Capability 形态。` +
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

  if (p === "neoforge" && version.trim() === "1.20.1") {
    return {
      code: `// NeoForge 1.20.1 — Capability 形态（与 Forge 1.20.1 API 兼容；不是 Attachment）
package com.example.${mod.value}.capability;

// Capability / CapabilityManager / CapabilityToken 的 import 跟工程现有包名与 search_neoforge_docs(version=1.20.1)，禁止默写。

public class ${pascal}Capability {
    // public static final Capability<I${pascal}> INSTANCE = CapabilityManager.get(new CapabilityToken<>() {});
}
`,
      warnings: [
        "NeoForge 1.20.1 数据附件是 Capability，不是 1.20.4+ Attachment。",
        "包名以工程 import 与 search_neoforge_docs(version=1.20.1) 为准，禁止默写。",
      ],
    };
  }

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
    code: withDocsReviewHeader(
      `// Forge Capability 骨架
package com.example.${mod.value}.capability;

import net.minecraftforge.common.capabilities.Capability;
import net.minecraftforge.common.capabilities.CapabilityManager;
import net.minecraftforge.common.capabilities.CapabilityToken;

public class ${pascal}Capability {
    public static final Capability<I${pascal}> INSTANCE =
        CapabilityManager.get(new CapabilityToken<>() {});
}
`,
      "search_forge_docs",
      version.trim(),
    ),
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
  if (!exactMcVersion(t)) return false;
  if (/^26\.\d/.test(t) || /^1\.21(\.|$)/.test(t)) return true;
  const m = t.match(/^1\.20\.(\d+)$/);
  if (m) return Number(m[1]) >= 4;
  return false;
}

/** ForgeConfigSpec 可用版本（1.13+ 重构时代；锚定正则防 "1.21beta"/"1.2100" 类垃圾输入混入）。 */
function isForgeConfigSpecVersion(version: string): boolean {
  const t = version.trim();
  if (!exactMcVersion(t)) return false;
  if (/^26\./.test(t)) return false; // 26.x 无 Forge
  const m = t.match(/^1\.(\d{1,2})(?:\.(\d+))?$/);
  if (!m) return false;
  const minor = Number(m[1]);
  return minor >= 13 && minor <= 21;
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
  if (!exactMcVersion(version)) {
    return { code: null, errors: [`version 必须是精确 MC 版本（1.x / 26.x），收到 ${version}。` + noNativeGeneratorError("search_*_docs", "规则 00 / mc-config Skill")] };
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
        "Cloth Config 不是官方 loader API。",
        ...(loader === "quilt" ? ["Quilt 不要把 Cloth Config 当成 QSL。"] : []),
      ],
    };
  }

  if (loader === "neoforge") {
    const v = version.trim();
    const useModConfig = /^1\.21(\.|$)/.test(v) || /^26\.1(\.|$)/.test(v) || /^1\.20\.(4|6)$/.test(v);
    if (useModConfig) {
      const reviewed = /^1\.20\.(4|6)$/.test(v);
      const body = `package com.example.${mod.value}.config;

import net.neoforged.neoforge.common.ModConfigSpec;

public class ${toPascalCase(mod.value)}Config {
    public static final ModConfigSpec.Builder BUILDER = new ModConfigSpec.Builder();
    public static final ModConfigSpec SPEC = BUILDER.build();
}
`;
      return {
        code: reviewed ? withDocsReviewHeader(body, "search_neoforge_docs", /^1\.20\.4$/.test(v) ? "1.20.4" : "1.20.6") : body,
        warnings: reviewed
          ? [
              `NeoForge ${/^1\.20\.4$/.test(v) ? "1.20.4" : "1.20.6"} 官方配置 API 是 ModConfigSpec，不是 ForgeConfigSpec。`,
            ]
          : undefined,
      };
    }
    if (v === "1.20.1") {
      const body = `package com.example.${mod.value}.config;

import net.minecraftforge.common.ForgeConfigSpec;

public class ${toPascalCase(mod.value)}Config {
    public static final ForgeConfigSpec.Builder BUILDER = new ForgeConfigSpec.Builder();
    public static final ForgeConfigSpec SPEC = BUILDER.build();
}
`;
      return {
        code: withDocsReviewHeader(body, "search_neoforge_docs", "1.20.1"),
        warnings: [
          "NeoForge 1.20.1 配置走 Forge 1.20.1 ForgeConfigSpec（forgeCompatible）；不要抄 1.20.4+ ModConfigSpec 当本档独有 API。",
        ],
      };
    }
    return {
      code: null,
      errors: [
        `NeoForge config 当前支持 1.20.1（ForgeConfigSpec）与 1.20.4 / 1.20.6 / 1.21.x / 26.1（ModConfigSpec）。收到 version=${version}。` +
          noNativeGeneratorError("search_neoforge_docs", "规则 00 / mc-config Skill"),
      ],
    };
  }

  // ForgeConfigSpec 是 1.13+（重注册/重新加载时代的 Forge）API；更早版本（1.12.2 Configuration 等）禁止套用
  if (loader === "forge" && !isForgeConfigSpecVersion(version.trim())) {
    return {
      code: null,
      errors: [
        `Forge config 骨架仅覆盖 ForgeConfigSpec 可用版本（1.13+，已核实 1.20.1）；version=${version} 属更早时代（如 1.12.2 用 net.minecraftforge.common.config.Configuration）。` +
          noNativeGeneratorError("search_forge_docs", "规则 00 / mc-config Skill"),
      ],
    };
  }

  if (loader === "forge") {
    const body = `package com.example.${mod.value}.config;

import net.minecraftforge.common.ForgeConfigSpec;

public class ${toPascalCase(mod.value)}Config {
    public static final ForgeConfigSpec.Builder BUILDER = new ForgeConfigSpec.Builder();
    public static final ForgeConfigSpec SPEC = BUILDER.build();
}
`;
    return {
      code: withDocsReviewHeader(body, "search_forge_docs", version.trim()),
      warnings: [
        `Forge ${version.trim()} 配置 API 为 ForgeConfigSpec；修改前用 search_forge_docs(version=${version.trim()}) 复核。`,
      ],
    };
  }

  return {
    code: null,
    errors: [
      `未知 loader=${String(loader)}。` + noNativeGeneratorError("search_*_docs", "规则 00 / mc-config Skill"),
    ],
  };
}

const ENTITY_RENDERER_SUPPORTED =
  "forge 1.18.2 / forge 1.19.4 / forge 1.20.1 / forge 1.20.4 / neoforge 26.1";

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
  if (!exactMcVersion(v)) {
    return { code: null, errors: [`version 必须是精确 MC 版本，收到 ${version}。` + noNativeGeneratorError("search_*_docs", "规则 04 / mc-entity Skill")] };
  }
  // D-3 门闩：forge 1.18.2/1.19.4 的 04 规则已核 EntityRenderersEvent.RegisterRenderers +
  // EntityRendererProvider.Context（与 1.20.x 同族）→ 过门；neoforge 1.21.x / fabric 未核 → 保持拒绝。
  const forgeOk = p === "forge" && ["1.18.2", "1.19.4", "1.20.1", "1.20.4"].includes(v);
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
        "version 必填。当前成功路径：forge / neoforge feature JSON；fabric / quilt 仅 configured_feature / placed_feature。该版本无原生生成器时不要理解为游戏里做不了：改用 search_*_docs + 手动编写，参考规则 07-datagen / mc-worldgen Skill。",
      ],
    };
  }
  const ver = version.trim();
  if (!exactMcVersion(ver)) {
    return {
      code: null,
      errors: [
        `version 必须是精确 MC 版本（1.x / 26.x），收到 ${version}。无白名单时不要生成 worldgen JSON。` +
          noNativeGeneratorError("search_*_docs", "规则 07 / mc-worldgen Skill"),
      ],
    };
  }
  if (/^1\./.test(ver)) {
    const mm = ver.match(/^1\.(\d+)(?:\.(\d+))?$/);
    const minor = mm ? Number(mm[1]) : 0;
    const patch = mm && mm[2] !== undefined ? Number(mm[2]) : 0;
    if (minor < 18 || (minor === 18 && patch < 2)) {
      return {
        code: null,
        errors: [
          `generate_worldgen 仅覆盖 1.18.2+ 数据包 feature JSON，收到 ${version}。` +
            noNativeGeneratorError("search_*_docs", "规则 07 / mc-worldgen Skill"),
        ],
      };
    }
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
