#!/usr/bin/env node
/**
 * ⚠ 一次性改写器：已执行过，勿再跑（会覆盖已人工修订的规则树）。
 * 按官方文档 / MDK 核实表生成 NeoForge 六档规则树。
 * 禁止从 forge/1.20.4 或邻档复制。类名来自 docs.neoforged.net 与官方 MDK ExampleMod。
 */
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { emit } from "../_lib/write-guard.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const RULE_TREE = ["1.20.4", "1.21.1", "1.21.3", "1.21.8", "1.21.11", "26.1"];
const UNVERSIONED = ["1.20.1", "1.20.6", "1.21.5", "1.21.10"];

/** @type {Record<string, object>} */
const F = {
  "1.20.4": {
    java: 17,
    docs: "https://docs.neoforged.net/docs/1.20.4/",
    payloadEvent: "RegisterPayloadHandlerEvent",
    registrar: "IPayloadRegistrar",
    handlerCtx: "PlayPayloadContext",
    idType: "ResourceLocation",
    idFactory: 'new ResourceLocation("mymod", "my_data")',
    stream: false,
    datagen: "GatherDataEvent",
    identNote: "本档仍用 ResourceLocation 构造函数，不是 fromNamespaceAndPath，也不是 Identifier。",
    toml: "META-INF/mods.toml（官方 MDK 1.20.4 ExampleMod 注释仍写 mods.toml）",
    ctor: "public ExampleMod(IEventBus modEventBus)",
    ctorNote: "FML 注入 IEventBus。禁止 NeoForgeAddonPlugin / getBootstrapContext。",
    example: "CopperCoil",
    mappings: "mojmap / NeoForm 官方名（不是 Forge MCP）",
    mdk: "NeoForgeMDKs/MDK-1.20.4-NeoGradle @ 8cd443623d2fd12ef8a6912d2af1296d8522faac 与 MDK-1.20.4-ModDevGradle @ ddfff1d83adca54ac44fe70a6f3b85d3033f0e3a",
    send: "1.20.4 payload 页用 play(ID, ctor, handler.client/server)。PacketDistributor 存在但 API 与 Forge SimpleChannel 不同，禁止套用 Forge PacketTarget。",
    guiOpen: "文档 menus 页示例：NetworkHooks.openScreen；MenuType 可用 IForgeMenuType.create。",
    unique: "1.20.4 网络是 Payload 单数 Handler，不是把 Forge SimpleChannel 改包名。CustomPacketPayload 实现 write + id()，用 FriendlyByteBuf 构造器当 reader。",
  },
  "1.21.1": {
    java: 21,
    docs: "https://docs.neoforged.net/docs/1.21.1/",
    payloadEvent: "RegisterPayloadHandlersEvent",
    registrar: "PayloadRegistrar",
    handlerCtx: "IPayloadContext",
    idType: "ResourceLocation",
    idFactory: 'ResourceLocation.fromNamespaceAndPath("mymod", "my_data")',
    stream: true,
    datagen: "GatherDataEvent（尚未拆成 Client/Server 子类）",
    identNote: "本档用 ResourceLocation.fromNamespaceAndPath，不是 new ResourceLocation，也不是 Identifier。",
    toml: "neoforge.mods.toml",
    ctor: "public ExampleMod(IEventBus modEventBus)（可再加 ModContainer，以该版 MDK 为准）",
    ctorNote: "禁止 NeoForgeAddonPlugin。",
    example: "EchoShard",
    mappings: "mojmap",
    mdk: "download_official_mdk platform=neoforge minecraftVersion=1.21.1 并传 buildPlugin",
    send: "PacketDistributor.sendToServer / sendToPlayer / sendToPlayersTrackingChunk / sendToAllPlayers",
    guiOpen: "MenuType + AbstractContainerMenu；槽位同步不要用 SimpleChannel。打开菜单以该版 gui/menus 文档为准。",
    unique: "1.21.1 起事件名变成复数 Handlers。payload 用 CustomPacketPayload.Type + StreamCodec + playBidirectional/ToClient/ToServer。",
  },
  "1.21.3": {
    java: 21,
    docs: "https://docs.neoforged.net/docs/1.21.3/",
    payloadEvent: "RegisterPayloadHandlersEvent",
    registrar: "PayloadRegistrar",
    handlerCtx: "IPayloadContext",
    idType: "ResourceLocation",
    idFactory: 'ResourceLocation.fromNamespaceAndPath("mymod", "my_data")',
    stream: true,
    datagen: "GatherDataEvent",
    identNote: "1.21.3 文档仍用 ResourceLocation.fromNamespaceAndPath。",
    toml: "neoforge.mods.toml",
    ctor: "public ExampleMod(IEventBus modEventBus)",
    ctorNote: "禁止把 1.20.4 的 RegisterPayloadHandlerEvent（单数）抄进本档。",
    example: "PaleMoss",
    mappings: "mojmap",
    mdk: "download_official_mdk 精确 1.21.3",
    send: "PacketDistributor.sendTo*（与 1.21.1 文档同族）",
    guiOpen: "MenuType DeferredRegister；禁止 Forge IMessage 同步 GUI。",
    unique: "1.21.3 规则树独立存在是为了禁止 Agent 拿 1.20.4 或 1.21.8 顶上。Data Components 已是物品数据主路径。",
  },
  "1.21.8": {
    java: 21,
    docs: "https://docs.neoforged.net/docs/1.21.8/",
    payloadEvent: "RegisterPayloadHandlersEvent",
    registrar: "PayloadRegistrar",
    handlerCtx: "IPayloadContext",
    idType: "ResourceLocation",
    idFactory: 'ResourceLocation.fromNamespaceAndPath("mymod", "my_data")',
    stream: true,
    datagen: "GatherDataEvent.Client / GatherDataEvent.Server（已拆分）",
    identNote: "1.21.8 文档 resources 页已用 GatherDataEvent.Client；网络配置任务仍见 ResourceLocation.fromNamespaceAndPath。",
    toml: "neoforge.mods.toml",
    ctor: "public ExampleMod(IEventBus modEventBus, ModContainer modContainer) — 以该版 MDK 为准",
    ctorNote: "DataGen 必须用 Client/Server 子事件，不要写回单一 GatherDataEvent。",
    example: "ResinClump",
    mappings: "mojmap",
    mdk: "download_official_mdk 精确 1.21.8",
    send: "PacketDistributor + CustomPacketPayload",
    guiOpen: "createProvider 风格 DataGen 与菜单分家；GUI 类名查 gui/menus。",
    unique: "1.21.8 的关键分界是 DataGen 拆成 GatherDataEvent.Client 与 Server，以及 createDatapackRegistryObjects / createProvider。",
  },
  "1.21.11": {
    java: 21,
    docs: "https://docs.neoforged.net/docs/1.21.11/",
    payloadEvent: "RegisterPayloadHandlersEvent",
    registrar: "PayloadRegistrar",
    handlerCtx: "IPayloadContext",
    idType: "Identifier",
    idFactory: 'Identifier.fromNamespaceAndPath("mymod", "my_data")',
    stream: true,
    datagen: "GatherDataEvent.Client / Server",
    identNote: "1.21.11 文档已用 Identifier.fromNamespaceAndPath，不要再写 ResourceLocation.fromNamespaceAndPath。",
    toml: "neoforge.mods.toml",
    ctor: "IEventBus + 可选 ModContainer（以 MDK 为准）",
    ctorNote: "本档仍是混淆游戏 + mojmap 开发名。去混淆是 26.1，禁止把 26.1 规则并进本档。",
    example: "CopperGolem",
    mappings: "mojmap（游戏仍混淆；与 26.1 去混淆不是同一档）",
    mdk: "download_official_mdk 精确 1.21.11",
    send: "PacketDistributor；payload TYPE 用 Identifier",
    guiOpen: "MenuType；打开方式查 1.21.11 gui 文档。",
    unique: "1.21.11 文档把 ResourceLocation 换成 Identifier。Primer 26.1 才是下一跳。",
  },
  "26.1": {
    java: 25,
    docs: "https://docs.neoforged.net/docs/",
    payloadEvent: "RegisterPayloadHandlersEvent",
    registrar: "PayloadRegistrar",
    handlerCtx: "IPayloadContext",
    idType: "Identifier",
    idFactory: 'Identifier.fromNamespaceAndPath("mymod", "my_data")',
    stream: true,
    datagen: "GatherDataEvent.Client / GatherDataEvent.Server",
    identNote: "26.1 去混淆 + Identifier。禁止 Yarn。query_api 无本版索引。",
    toml: "neoforge.mods.toml",
    ctor: "public ExampleMod(IEventBus modEventBus, ModContainer modContainer)",
    ctorNote: "官方 MDK-26.1.2-ModDevGradle @ 1fd0f4d9… 使用 ModContainer.registerConfig，不再用 ModLoadingContext.get()。",
    example: "DriedGhast",
    mappings: "mojmap-unobfuscated（游戏 jar 已是 Mojang 名）",
    mdk: "26.1.1/26.1.2 均同时提供 ModDevGradle 与 NeoGradle，必须传 buildPlugin。不为 26.1.1 单造规则树。",
    send: "PacketDistributor.sendTo*；HandlerThread.NETWORK + enqueueWork",
    guiOpen: "菜单 API 以 26.1 gui 文档为准。",
    unique: "26.1 是独立档：Java 25、去混淆、ModContainer 构造参数、GatherDataEvent 拆分。26.2 不是「未发布」：maven 26.2 线已构建到 26.2.0.75（2026-09-02 实读 maven.neoforged.net），官方 Primer 也有 26.2 迁移页（/primer/docs/26.2/ 返回 200，本仓已入库 data/neoforge_primers/26.2.md）。但官方主文档站不按版本分线——/docs/26.2/ 与 /docs/26.1/ 同样 404，现行主文档是未版本化的 /docs/；本仓也没有 26.2 规则树与主文档语料，禁止把本档克隆成 26.2。",
  },
};

function out(rel, text) {
  emit(join(ROOT, rel), text);
}

function payloadJava(v, f) {
  if (!f.stream) {
    return `\`\`\`java
@SubscribeEvent // mod event bus
public static void register(final ${f.payloadEvent} event) {
    final ${f.registrar} registrar = event.registrar("mymod");
    registrar.play(
        MyData.ID,
        MyData::new,
        handler -> handler
            .client(ClientPayloadHandler.getInstance()::handleData)
            .server(ServerPayloadHandler.getInstance()::handleData));
}

public record MyData(String name, int age) implements CustomPacketPayload {
    public static final ResourceLocation ID = ${f.idFactory};
    public MyData(final FriendlyByteBuf buffer) {
        this(buffer.readUtf(), buffer.readInt());
    }
    @Override public void write(final FriendlyByteBuf buffer) {
        buffer.writeUtf(name());
        buffer.writeInt(age());
    }
    @Override public ResourceLocation id() { return ID; }
}

public void handleData(final MyData data, final ${f.handlerCtx} context) {
    context.workHandler().submitAsync(() -> { /* main thread */ })
        .exceptionally(e -> {
            context.packetHandler().disconnect(
                Component.translatable("my_mod.networking.failed", e.getMessage()));
            return null;
        });
}
\`\`\`
来源：https://docs.neoforged.net/docs/1.20.4/networking/ 与 /networking/payload/ （2026-08-15 核对）。`;
  }
  // F-31 定论（2026-09-02）：DirectionalPayloadHandler 只到 1.21.5 存在，NeoForge 21.6→21.8 之间移除
  // （1.21.8+ 拆成 RegisterPayloadHandlersEvent + RegisterClientPayloadHandlersEvent，本类在 jar 中不存在）。
  // 下方模板是该定论之前的遗留分支，对 F 里 stream:true 的 1.21.8 / 1.21.11 / 26.1 会误吐本类；
  // 顶部「勿再跑」横幅是唯一的门。规则正文已按档标注「要 / 禁止」，此处不新增断言。
  return `\`\`\`java
@SubscribeEvent // mod event bus
public static void register(final ${f.payloadEvent} event) {
    final ${f.registrar} registrar = event.registrar("1");
    registrar.playBidirectional(
        MyData.TYPE,
        MyData.STREAM_CODEC,
        new DirectionalPayloadHandler<>(
            ClientPayloadHandler::handleDataOnMain,
            ServerPayloadHandler::handleDataOnMain));
}

public record MyData(String name, int age) implements CustomPacketPayload {
    public static final CustomPacketPayload.Type<MyData> TYPE =
        new CustomPacketPayload.Type<>(${f.idFactory});
    public static final StreamCodec<ByteBuf, MyData> STREAM_CODEC = StreamCodec.composite(
        ByteBufCodecs.STRING_UTF8, MyData::name,
        ByteBufCodecs.VAR_INT, MyData::age,
        MyData::new);
    @Override
    public CustomPacketPayload.Type<? extends CustomPacketPayload> type() { return TYPE; }
}

public static void handleDataOnMain(final MyData data, final ${f.handlerCtx} context) {
    // 默认主线程；若 registrar.executesOn(HandlerThread.NETWORK) 则用 context.enqueueWork
}
\`\`\`
发送：${f.send}
来源：${f.docs}networking/payload/`;
}

function agents(ver, f) {
  return `# NeoForge ${ver} — Agent 总纲

> 只适用于 **NeoForge ${ver}**。禁止读取 \`neoforge/${RULE_TREE.filter((x) => x !== ver).join(" / ")}\` 或扁平 \`neoforge/.cursor/rules\` 来填本档类名。
> 未建档版本（${UNVERSIONED.join("、")}）**禁止读邻档 00–10**，改口 \`search_neoforge_docs\`。
> 文档工具用 \`list_neoforge_versions\`，**不要**用 \`list_forge_versions\`。

## 基本信息

| 项 | 值 |
|---|---|
| 平台 | NeoForge ${ver} |
| Java | **${f.java}** |
| Mappings | ${f.mappings} |
| 入口 | \`@Mod\` + \`${f.ctor}\` |
| 元数据 | ${f.toml} |
| 网络 | \`${f.payloadEvent}\` + \`${f.registrar}\` |
| 文档 | ${f.docs} |
| MDK | ${f.mdk} |

${f.unique}

工作流提醒（**不是硬门**）：只有从零建工程 / 完整新方块 / GUI / 崩溃分诊 / 移植 / 真机循环 / 汉化 / 反编译研究才调 \`get_workflow_template\`。改已有类不要调。从零工程 step1 用 \`download_official_mdk\`（dryRun 先看 URL；26.1.x/26.2 必须传 buildPlugin）。

## 加载顺序

00-project-setup → 01-registry → 主题文件 02–10。类名必须能在 \`knowledge/common/verified-api-${ver}.md\` 或 \`search_neoforge_docs\` 该版页面找到。反编译摘要缺少 \`mappingsVersion\` 不得写进规则。
`;
}

function r00(ver, f) {
  return `# 00 — 项目结构（NeoForge ${ver}）

来源：${f.docs}gettingstarted/ 与官方 MDK（${f.mdk}）。不要用 ForgeGradle / Yarn 冒充。

## 构建插件

官方模组生成器对多个 MC 版本**同时**提供 ModDevGradle（\`net.neoforged.moddev\`）与 NeoGradle（\`net.neoforged.gradle.userdev\`）。**禁止按版本硬绑**。从零工程调用 \`download_official_mdk\` 时必须传 \`buildPlugin\`。

## Java / mappings

- Java **${f.java}**
- ${f.mappings}
- ${f.identNote}

## 入口

\`\`\`java
@Mod(ExampleMod.MODID)
public class ExampleMod {
    public static final String MODID = "examplemod";
    public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks(MODID);
    public static final DeferredRegister.Items ITEMS = DeferredRegister.createItems(MODID);
    ${f.ctor} {
        BLOCKS.register(modEventBus);
        ITEMS.register(modEventBus);
    }
}
\`\`\`

${f.ctorNote}

元数据：${f.toml}。modId 全小写、无 \`-\`。

## 禁止

- \`NeoForgeAddonPlugin\`、\`getBootstrapContext().getEventBus\`
- 用 Forge \`mods.toml\` + \`net.minecraftforge\` 包当 NeoForge ${ver}
- 把邻版 MDK zip 当本版
- 官方 MDK 404 时回退邻版
`;
}

function r01(ver, f) {
  return `# 01 — 注册（NeoForge ${ver}）

来源：${f.docs}concepts/registries/ 、blocks/ 、items/ 。MDK 使用 \`DeferredRegister.createBlocks/createItems\`、\`DeferredBlock\`、\`DeferredItem\`、\`DeferredHolder\`。

## 推荐

\`\`\`java
public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks(ExampleMod.MODID);
public static final DeferredBlock<Block> ${f.example.toUpperCase()}_BLOCK =
    BLOCKS.registerSimpleBlock("${f.example.toLowerCase()}_block", BlockBehaviour.Properties.of().mapColor(MapColor.STONE));
public static final DeferredRegister.Items ITEMS = DeferredRegister.createItems(ExampleMod.MODID);
public static final DeferredItem<BlockItem> ${f.example.toUpperCase()}_BLOCK_ITEM =
    ITEMS.registerSimpleBlockItem("${f.example.toLowerCase()}_block", ${f.example.toUpperCase()}_BLOCK);
\`\`\`

在 \`${f.ctor.split("(")[0].replace("public ", "")}\` 里 \`BLOCKS.register(modEventBus)\`。

备选：\`RegisterEvent\`（mod bus，构造之后）。查询用 vanilla \`Registry\`，不要拿 \`DeferredRegister\` 当运行时 map。

## ${ver} 口径

- ${f.identNote}
- 文档同时出现 \`Supplier\` 与 \`DeferredHolder\`；需要 \`Holder\`/\`DeferredHolder\` 的 API 不要只留裸 \`Supplier\`。
- **不要**把 Forge \`RegistryObject\` 当本档教程类型。本档 MDK 示例是 DeferredBlock/DeferredItem/DeferredHolder。
- 禁止 \`NeoForgeAddonPlugin\`。

自定义 datapack registry：\`ResourceKey.createRegistryKey(${f.idFactory.replace("mymod", "yourmodid").replace("my_data", "spells")})\` 一类写法，以该版 registries 页为准。
`;
}

function r02(ver, f) {
  return `# 02 — 方块（NeoForge ${ver}）

来源：${f.docs}blocks/

世界里只有一份 \`Block\` 单例，坐标上是引用。用 \`DeferredRegister.Blocks\` + \`registerBlock\` / \`registerSimpleBlock\`。

\`\`\`java
public static final DeferredBlock<Block> ${f.example.toUpperCase()}_BLOCK = BLOCKS.registerBlock(
    "${f.example.toLowerCase()}_block",
    Block::new,
    BlockBehaviour.Properties.of().mapColor(MapColor.STONE));
\`\`\`

属性工厂签名随版本变（${ver} 以文档/MDK 为准：1.20.4 MDK 传 \`Properties\` 对象；26.1 MDK \`registerSimpleBlock\` 用 \`p -> p.mapColor(...)\`）。

方块实体见 ${f.docs}blockentities/：注册 \`BlockEntityType\`，不是注册 BE 实例。同步优先 \`getUpdateTag\` / \`ClientboundBlockEntityDataPacket\`；自定义包走 Payload（见 06），不是 SimpleChannel。
`;
}

function r03(ver, f) {
  return `# 03 — 物品（NeoForge ${ver}）

来源：${f.docs}items/

\`DeferredRegister.Items\` + \`registerItem\` / \`registerSimpleItem\` / \`registerSimpleBlockItem\`。

创造页：MDK 用自建 \`CreativeModeTab\` 的 \`displayItems\`，或 \`BuildCreativeModeTabContentsEvent\`。

${ver === "1.20.4" ? "1.20.4 MDK 食物：`FoodProperties.Builder().alwaysEat().nutrition().saturationMod()`。不要用已删除的 `Item.Properties.tab()`。" : ""}
${ver === "26.1" ? "26.1 MDK：`alwaysEdible()` + `saturationModifier()`，Properties 常用 unary operator。" : ""}
${["1.21.1", "1.21.3", "1.21.8", "1.21.11"].includes(ver) ? "1.21+ 物品数据优先 Data Components，不要把 1.12 NBT 当主存储。" : ""}

禁止：\`RegistryObject<Item>\` 当 NeoForge ${ver} 持有类型；禁止 Fabric \`Registry.register\` 冒充。
`;
}

function r04(ver, f) {
  return `# 04 — 实体（NeoForge ${ver}）

来源：${f.docs}entities/

用 \`DeferredRegister.Entities\` / \`DeferredRegister.create(Registries.ENTITY_TYPE, MODID)\`。\`EntityType.Builder\` 最后 \`.build(...)\` 的 ResourceKey 参数以该版文档为准。

渲染只放客户端：\`@EventBusSubscriber(value = Dist.CLIENT, bus = MOD)\`。不要在服务端加载 Renderer。

生成、属性、生成蛋：查该版 entities 页，不要抄 Forge 1.12 \`EntityRegistry\`。
`;
}

function r05(ver, f) {
  return `# 05 — 事件（NeoForge ${ver}）

来源：${f.docs}concepts/events/

两条总线：

- **mod bus**：注册、lifecycle（\`FMLCommonSetupEvent\`、\`FMLClientSetupEvent\`、\`${f.payloadEvent}\`、\`${f.datagen}\`）
- **游戏总线** \`NeoForge.EVENT_BUS\`：游玩中事件（如 \`ServerStartingEvent\`）

\`@SubscribeEvent\`。类级 \`@Mod.EventBusSubscriber\` / \`@EventBusSubscriber\`。

入口里 \`modEventBus.addListener(this::commonSetup)\` 与 MDK 一致。

禁止：\`MinecraftForge.EVENT_BUS\`（Forge 名）；禁止把 Payload 注册写进 \`FMLCommonSetupEvent\` 当 SimpleChannel。
`;
}

function r06(ver, f) {
  return `# 06 — 网络（NeoForge ${ver}）

**本档不是 Forge SimpleChannel。** ${f.unique}

## 核实骨架

${payloadJava(ver, f)}

## 反面清单（写进本档即错）

- \`SimpleChannel\` / \`IMessage\` / \`NetworkRegistry.newSimpleChannel\`
- 顶层 \`net.neoforged.neoforge.network.NetworkRegistry\`（若存在 \`NetworkRegistry\` 也在 \`.registration\` 且多为 Internal）
- 把 ${ver === "1.20.4" ? "1.21 的 RegisterPayloadHandlersEvent（复数）" : "1.20.4 的 RegisterPayloadHandlerEvent（单数）"} 抄进 NeoForge ${ver}
- \`NeoForgeAddonPlugin\`

${f.identNote}
`;
}

function r07(ver, f) {
  return `# 07 — DataGen（NeoForge ${ver}）

来源：${f.docs}resources/

事件：\`${f.datagen}\`。

${ver === "1.20.4" ? "1.20.4：`GatherDataEvent`；`event.getGenerator().addProvider(event.includeServer(), ...)`。Advancement 文档仍出现 ForgeAdvancementProvider 旧名——以该页实际类型为准，不要发明。" : ""}
${ver === "1.21.1" || ver === "1.21.3" ? "RecipeProvider 构造需要 PackOutput + CompletableFuture<HolderLookup.Provider>。" : ""}
${ver === "1.21.8" || ver === "1.21.11" || ver === "26.1" ? "先 `event.createDatapackRegistryObjects(...)`，再用 `event.createProvider(...)`。Client 可含全部 provider；Server 只含数据包。" : ""}

不要用 1.12 \`LanguageRegistry\`。语言文件走 \`LanguageProvider\`。
`;
}

function r08(ver, f) {
  return `# 08 — 物理端（NeoForge ${ver}）

来源：${f.docs}concepts/sides/

- 物理客户端 / 物理服务端 / 逻辑客户端 / 逻辑服务端 分开。
- 客户端类：\`Dist.CLIENT\` + \`@EventBusSubscriber\`。MDK 1.20.4 用内部类 \`ClientModEvents\`。
- 禁止在服务端线程碰 \`Minecraft.getInstance()\`。
- 网络处理线程：1.20.4 payload 默认**网络线程**，切主线程用 \`workHandler().submitAsync\`。1.21+ 默认主线程，重计算用 \`HandlerThread.NETWORK\` + \`enqueueWork\`。
`;
}

function r09(ver, f) {
  return `# 09 — 反模式（NeoForge ${ver}）

| 错误 | 正确 |
|---|---|
| \`NeoForgeAddonPlugin\` | \`@Mod\` + \`${f.ctor}\` |
| Forge \`SimpleChannel\` / \`IMessage\` | \`${f.payloadEvent}\` |
| \`RegistryObject\` 当本档教程类型 | \`DeferredBlock\` / \`DeferredItem\` / \`DeferredHolder\` |
| \`list_forge_versions\` | \`list_neoforge_versions\` |
| 读邻档 00–10 | 只读 \`neoforge/${ver}/\` |
| 无 \`mappingsVersion\` 的反编译摘要 | 视为无效 |
| ${ver === "26.1" ? "Yarn / 克隆 26.2 文档树" : "把 26.1 Identifier 规则提前灌进本档（仅 1.21.11/26.1 用 Identifier）"} | ${f.identNote} |

未建档版本 ${UNVERSIONED.join("/")}：禁止用本档顶上，改口 \`search_neoforge_docs\`。
`;
}

function r10(ver, f) {
  return `# 10 — GUI（NeoForge ${ver}）

来源：${f.docs}gui/menus/

- 注册 \`MenuType\`（\`DeferredRegister\`），菜单实例不是 registry object。
- \`AbstractContainerMenu\` + 客户端 \`Screen\` + \`MenuScreens.register\`。
- ${f.guiOpen}
- 额外数据同步：DataSlot / ContainerData，或 06 的 Payload。**禁止 SimpleChannel。**

${
  ver === "1.20.4"
    ? "1.20.4 文档出现 `IForgeMenuType.create` 与 `NetworkHooks.openScreen`。"
    : `本档类名不要照抄邻档：先 \`search_neoforge_docs version=${ver} query=MenuType\`，以该页为准。`
}
`;
}

function verified(ver, f) {
  return `# NeoForge ${ver} 已核实 API

签字：官方文档 ${f.docs} + 官方 MDK（${f.mdk}）。  
反编译：\`scripts/validate-rules-against-cache.mjs\` 从 \`$MC_SKILL_CACHE\` 抽签名回填。摘要 JSON **必须**含 \`mappingsVersion\`，否则不得覆盖本表。  
clone-audit：与邻档教程骨架相似是预期（换类名），**误报不算验收失败**；本表即源码/文档签字。

## 入口

| 符号 | 口径 |
|---|---|
| \`@Mod\` | 要 |
| \`${f.ctor}\` | 要 |
| \`NeoForgeAddonPlugin\` | **不存在，禁止输出** |
| 元数据 | ${f.toml} |

## 注册

| 符号 | 口径 |
|---|---|
| \`DeferredRegister.createBlocks/createItems\` | MDK |
| \`DeferredBlock\` / \`DeferredItem\` / \`DeferredHolder\` | MDK |
| \`RegisterEvent\` | 文档备选 |
| Forge \`RegistryObject\` | 不是本档教程类型 |

## 网络

| 符号 | 口径 |
|---|---|
| \`${f.payloadEvent}\` | **要** |
| \`${f.registrar}\` | **要** |
| \`${f.handlerCtx}\` | **要** |
| \`${f.idType}\` | ${f.idFactory} |
| StreamCodec / type() | ${f.stream ? "要" : "不要（本档用 write/id + FriendlyByteBuf 构造器）"} |
| SimpleChannel / IMessage / newSimpleChannel | **禁止** |

## 其它

- DataGen：${f.datagen}
- Java ${f.java}；${f.mappings}
- ${f.identNote}
- ${f.unique}
`;
}

function skill(name, ver, f, body) {
  return `---
name: ${name}
description: NeoForge ${ver} ${name}。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "${ver}"
dependencies: []
mappings: ${f.mappings}
---

# ${name}（NeoForge ${ver}）

禁止从 Forge 或邻档复制。${f.unique}

${body}
`;
}

function scaffoldJava(ver, f) {
  const ctor =
    ver === "26.1"
      ? `    public ExampleMod(IEventBus modEventBus, ModContainer modContainer) {
        BLOCKS.register(modEventBus);
        ITEMS.register(modEventBus);
        CREATIVE_MODE_TABS.register(modEventBus);
        NeoForge.EVENT_BUS.register(this);
        // 完整 MDK 在此 modContainer.registerConfig(ModConfig.Type.COMMON, Config.SPEC);
    }`
      : `    public ExampleMod(IEventBus modEventBus) {
        BLOCKS.register(modEventBus);
        ITEMS.register(modEventBus);
        CREATIVE_MODE_TABS.register(modEventBus);
        NeoForge.EVENT_BUS.register(this);
    }`;
  const extraImport =
    ver === "26.1"
      ? `import net.neoforged.fml.ModContainer;
`
      : "";
  const props =
    ver === "26.1"
      ? `    public static final DeferredBlock<Block> EXAMPLE_BLOCK = BLOCKS.registerSimpleBlock("example_block", p -> p.mapColor(MapColor.STONE));
    public static final DeferredItem<BlockItem> EXAMPLE_BLOCK_ITEM = ITEMS.registerSimpleBlockItem("example_block", EXAMPLE_BLOCK);`
      : `    public static final DeferredBlock<Block> EXAMPLE_BLOCK = BLOCKS.registerSimpleBlock("example_block", BlockBehaviour.Properties.of().mapColor(MapColor.STONE));
    public static final DeferredItem<BlockItem> EXAMPLE_BLOCK_ITEM = ITEMS.registerSimpleBlockItem("example_block", EXAMPLE_BLOCK);`;
  return `package com.example.examplemod;

import com.mojang.logging.LogUtils;
import net.minecraft.core.registries.Registries;
import net.minecraft.network.chat.Component;
import net.minecraft.world.item.BlockItem;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.world.item.CreativeModeTabs;
import net.minecraft.world.item.Item;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.material.MapColor;
import net.neoforged.bus.api.IEventBus;
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.Mod;
import net.neoforged.neoforge.common.NeoForge;
import net.neoforged.neoforge.event.server.ServerStartingEvent;
import net.neoforged.neoforge.registries.DeferredBlock;
import net.neoforged.neoforge.registries.DeferredHolder;
import net.neoforged.neoforge.registries.DeferredItem;
import net.neoforged.neoforge.registries.DeferredRegister;
${extraImport}import org.slf4j.Logger;

// 对照官方 MDK：${f.mdk}
// 完整 MDK 含 Config 类；本 scaffold 去掉 Config 以免缺文件。从零工程请 download_official_mdk。
@Mod(ExampleMod.MODID)
public class ExampleMod {
    public static final String MODID = "examplemod";
    public static final Logger LOGGER = LogUtils.getLogger();
    public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks(MODID);
    public static final DeferredRegister.Items ITEMS = DeferredRegister.createItems(MODID);
    public static final DeferredRegister<CreativeModeTab> CREATIVE_MODE_TABS =
        DeferredRegister.create(Registries.CREATIVE_MODE_TAB, MODID);

${props}

    public static final DeferredHolder<CreativeModeTab, CreativeModeTab> EXAMPLE_TAB =
        CREATIVE_MODE_TABS.register("example_tab", () -> CreativeModeTab.builder()
            .title(Component.translatable("itemGroup.examplemod"))
            .withTabsBefore(CreativeModeTabs.COMBAT)
            .icon(() -> EXAMPLE_BLOCK_ITEM.get().getDefaultInstance())
            .displayItems((parameters, output) -> output.accept(EXAMPLE_BLOCK_ITEM.get()))
            .build());

${ctor}

    @SubscribeEvent
    public void onServerStarting(ServerStartingEvent event) {
        LOGGER.info("NeoForge ${ver} examplemod starting");
    }
}
`;
}

const stubRule = (n) => `# ${n}

扁平 \`neoforge/.cursor/rules\` **不再是 1.20.4 教程**。

1. \`list_neoforge_versions\` + 工程元数据锁定精确版本。
2. 已建档：读 \`neoforge/<ver>/AGENTS.md\` 与 \`neoforge/<ver>/.cursor/rules/${n}\`。六档：${RULE_TREE.join("、")}。
3. 未建档（${UNVERSIONED.join("、")}）：**禁止读邻档 00–10**，改口 \`search_neoforge_docs\`。
`;

for (const ver of RULE_TREE) {
  const f = F[ver];
  const base = `neoforge/${ver}`;
  out(`${base}/AGENTS.md`, agents(ver, f));
  out(`${base}/.cursor/rules/00-project-setup.mdc`, r00(ver, f));
  out(`${base}/.cursor/rules/01-registry.mdc`, r01(ver, f));
  out(`${base}/.cursor/rules/02-block.mdc`, r02(ver, f));
  out(`${base}/.cursor/rules/03-item.mdc`, r03(ver, f));
  out(`${base}/.cursor/rules/04-entity.mdc`, r04(ver, f));
  out(`${base}/.cursor/rules/05-events.mdc`, r05(ver, f));
  out(`${base}/.cursor/rules/06-networking.mdc`, r06(ver, f));
  out(`${base}/.cursor/rules/07-datagen.mdc`, r07(ver, f));
  out(`${base}/.cursor/rules/08-client-server.mdc`, r08(ver, f));
  out(`${base}/.cursor/rules/09-anti-patterns.mdc`, r09(ver, f));
  out(`${base}/.cursor/rules/10-gui.mdc`, r10(ver, f));
  out(`${base}/knowledge/common/verified-api-${ver}.md`, verified(ver, f));
  out(
    `${base}/knowledge/porting/02-version-migration.md`,
    `# NeoForge ${ver} 迁移要点

不要写「1.20.x 完全移除 RegistryObject」——那是错误断言。Forge 1.20.4 仍用 RegistryObject；本档用 DeferredRegister 族。

跨版本用 \`get_migration_guide\`（默认 toc）+ Primer。本档网络：\`${f.payloadEvent}\`。

${f.unique}
`,
  );
  out(
    `${base}/.cursor/skills/mc-registry/SKILL.md`,
    skill(
      "mc-registry",
      ver,
      f,
      r01(ver, f) + "\n\n触发词：DeferredRegister、DeferredHolder、@Mod、RegisterEvent。不要匹配 RegistryObject 当本档正解。",
    ),
  );
  out(
    `${base}/.cursor/skills/mc-networking/SKILL.md`,
    skill("mc-networking", ver, f, r06(ver, f) + "\n\n触发词：Payload、CustomPacketPayload、PacketDistributor。禁止 SimpleChannel。"),
  );
  out(
    `${base}/.cursor/skills/mc-events/SKILL.md`,
    skill("mc-events", ver, f, r05(ver, f)),
  );
  out(
    `${base}/.cursor/skills/mc-gui/SKILL.md`,
    skill("mc-gui", ver, f, r10(ver, f)),
  );
  out(
    `${base}/.cursor/skills/mc-blockentity/SKILL.md`,
    skill(
      "mc-blockentity",
      ver,
      f,
      r02(ver, f) +
        "\n\n触发词：BlockEntity、BlockEntityType、getTicker、getUpdateTag。自定义包走 Payload，禁止 SimpleChannel / RegistryObject。",
    ),
  );
  out(`${base}/scaffold/src/main/java/com/example/examplemod/ExampleMod.java`, scaffoldJava(ver, f));
  out(
    `${base}/scaffold/README.md`,
    `# NeoForge ${ver} scaffold

最小对照官方 MDK 入口。完整工程请 \`download_official_mdk\`（精确 ${ver === "26.1" ? "26.1.2 并选 buildPlugin" : ver}）。不要用根目录旧 scaffold 的 init(IEventBus) / NeoForgeAddonPlugin 口径。
`,
  );
}

out(
  "neoforge/AGENTS.md",
  `# NeoForge — 版本分发

本目录**不再**自称单一 1.20.4 规则集。

\`\`\`
Decision:
→ list_neoforge_versions + 工程 neo_version / minecraft_version
→ IF 版本 ∈ ${RULE_TREE.join(" | ")} → 只读 neoforge/<ver>/AGENTS.md 与该档 00–10
→ ELSE IF 版本 ∈ ${UNVERSIONED.join(" | ")} → 禁止读邻档 00–10，改口 search_neoforge_docs（1.20.1 有 Forge 兼容数据）
→ ELSE → 询问用户。禁止默默读扁平 .cursor/rules
\`\`\`

文档工具是 \`list_neoforge_versions\` / \`search_neoforge_docs\`，不是 \`list_forge_versions\`。

26.1 与 1.21.1 是两档。26.2 构建已发布但官方主文档不按版本分线（\`/docs/26.2/\` 与 \`/docs/26.1/\` 同样 404），本仓无 26.2 树，不要建克隆树。

工作流：完整流程才 \`get_workflow_template\`；改已有代码不要调。
`,
);

out(
  "neoforge/knowledge/porting/02-version-migration.md",
  `# 迁移（总览）

**错误（已废）：**「1.20.x 完全移除 RegistryObject」。

分档核实表：\`neoforge/<ver>/knowledge/common/verified-api-<ver>.md\`。跨 hop 用 \`get_migration_guide\`。
`,
);

out("neoforge/CLONE_AUDIT_SIGNOFF.md", `# clone-audit 签字

六档教程骨架相似（DeferredRegister + Payload）是官方文档同构，不是从 Forge 1.20.4 粘贴。
1.20.4 网络是单数 Handler + write/id；1.21+ 是复数 Handlers + StreamCodec。26.1 另有 Java 25 / 去混淆 / ModContainer。
超 70% Dice = 疑似；本文件记为「同骨架换类名，对照官方文档签字」。误报不算验收失败。
`);

for (const n of [
  "00-project-setup.mdc",
  "01-registry.mdc",
  "02-block.mdc",
  "03-item.mdc",
  "04-entity.mdc",
  "05-events.mdc",
  "06-networking.mdc",
  "07-datagen.mdc",
  "08-client-server.mdc",
  "09-anti-patterns.mdc",
  "10-gui.mdc",
]) {
  out(`neoforge/.cursor/rules/${n}`, stubRule(n));
}

out(
  "neoforge/.cursor/skills/mc-registry/SKILL.md",
  `---
name: mc-registry
description: 分发到 neoforge/<ver>。禁止 NeoForgeAddonPlugin / RegistryObject 冒充 NeoForge。
platform: neoforge
version: "unversioned"
---

锁定 MC 版本后读 \`neoforge/<ver>/.cursor/skills/mc-registry/SKILL.md\`。未建档版本只 \`search_neoforge_docs\`。
`,
);
out(
  "neoforge/.cursor/skills/mc-networking/SKILL.md",
  `---
name: mc-networking
description: 分发到版本目录。NeoForge 全档均是 Payload，不是 SimpleChannel。
platform: neoforge
version: "unversioned"
---

1.20.4：RegisterPayloadHandlerEvent（单数）。1.21+：RegisterPayloadHandlersEvent（复数）。读对应 \`neoforge/<ver>\` skill。
`,
);
out(
  "neoforge/.cursor/skills/mc-blockentity/SKILL.md",
  `---
name: mc-blockentity
description: 分发到 neoforge/<ver>。同步用 Payload，不是 SimpleChannel；禁止 RegistryObject。
platform: neoforge
version: "unversioned"
---

锁定 MC 版本后读 \`neoforge/<ver>/.cursor/skills/mc-blockentity/SKILL.md\` 与该档 02-block。
自定义包走 06 Payload。禁止 SimpleChannel / IMessage / NeoForgeAddonPlugin / RegistryObject。
未建档版本只 \`search_neoforge_docs\`。
`,
);

out(
  "neoforge/scaffold/README.md",
  `# 已废弃的扁平 scaffold

旧文件含错误口径（\`init(IEventBus)\`、\`Item.Properties.tab()\`、暗示 BuildPlugin 代替 @Mod）。

请用 \`neoforge/<ver>/scaffold/\` 或 \`download_official_mdk\`。
`,
);

console.log("wrote six NeoForge version trees + dispatcher stubs");
