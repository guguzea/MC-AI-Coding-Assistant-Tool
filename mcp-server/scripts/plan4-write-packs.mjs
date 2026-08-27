#!/usr/bin/env node
/**
 * ⚠ 一次性改写器：已执行过，勿再跑（会覆盖已人工修订的规则树/Skill）。
 * Plan 4 one-shot writer: Neo thin Skills, Quilt QSL Skills, old-loader Skills,
 * Neo 1.20.1 tree, Forge 1.7.10 verified-api, fabric 26.1.2 scaffold, lint file list.
 */
import { mkdirSync, writeFileSync, appendFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const lintList = [];

function writeRel(rel, text) {
  const abs = join(repo, rel);
  mkdirSync(dirname(abs), { recursive: true });
  const body = text.endsWith("\n") ? text : `${text}\n`;
  writeFileSync(abs, body, "utf8");
  if (/SKILL\.md$/i.test(rel.replace(/\\/g, "/"))) lintList.push(rel.replace(/\\/g, "/"));
}

const NEO_SKILLS = [
  ["mc-registry", "registries", "DeferredRegister / createItems / createBlocks。挂 IEventBus。禁止 RegistryObject。"],
  ["mc-block", "blocks", "DeferredRegister.Blocks / DeferredBlock / registerBlock。世界里只有一份 Block 单例。"],
  ["mc-item", "items", "DeferredRegister.Items / registerItem / registerSimpleItem。"],
  ["mc-events", "concepts/events", "@SubscribeEvent、IEventBus、@EventBusSubscriber。生命周期以 concepts/events 页为准。"],
  ["mc-networking", "networking", "Payload。禁止 SimpleChannel / IMessage。"],
  ["mc-gui", "gui/menus", "MenuType + AbstractContainerMenu。IMenuTypeExtension 以 gui/menus 页为准。"],
  ["mc-entity", "entities", "实体注册。无独立 entities 页时禁止默写 EntityType.Builder 签名，改核 registries / blockentities。"],
  ["mc-blockentity", "blockentities", "注册 BlockEntityType 不是 BE 实例。EntityBlock#newBlockEntity。同步优先 getUpdateTag。"],
  ["mc-datagen", "resources", "GatherDataEvent（是否拆 Client/Server 以 resources 页为准）。LanguageProvider / RecipeProvider。"],
  ["mc-capability", "datastorage/attachments", "本档不是 Forge Capability。AttachmentType。禁止 CapabilityToken。"],
  ["mc-particle", "resources", "粒子 JSON/资源路径以 resources 页为准，禁止默写 ParticleType 工厂。"],
  ["mc-fluid", "blocks", "流体以该版文档为准，禁止默写 FluidType 签名。"],
  ["mc-recipe", "resources", "RecipeProvider / 数据包 recipes。禁止 1.12 LanguageRegistry。"],
  ["mc-loottable", "resources", "LootTableProvider。禁止默写 LootPool 链式签名。"],
  ["mc-advancement", "datagen/advancements", "AdvancementProvider。触发器类名以该页为准。"],
  ["mc-mixin", "gettingstarted/modfiles", "Mixin JSON 与客户端分离。字节码用 mixin_analyze，不要编 Mixin 目标。"],
  ["mc-sound", "resources", "SoundEvent 注册以 registries 页为准，禁止默写 playSound 重载。"],
  ["mc-worldgen", "worldgen/biomemodifier", "BiomeModifier JSON。无该页则禁止默写 biome_modifier 类型名。"],
  ["mc-structure", "resources", "structure set / template 以 datapack 资源页为准。"],
  ["mc-command", "concepts/events", "Brigadier 命令注册事件名以该版文档为准，禁止默写。"],
  ["mc-enchantment", "resources/client/i18n", "附魔翻译 LanguageProvider#addEnchantment。注册以 registries 为准。"],
  ["mc-effect", "resources/client/i18n", "MobEffect 注册以 registries 为准，禁止默写 attribute 修饰符签名。"],
  ["mc-potion", "items", "药水以 items / registries 页为准，禁止默写 BrewingRecipe 邻档名。"],
  ["mc-energy", "datastorage/attachments", "能量不是 Forge Capability。用 Attachment 或该版文档能量 API，禁止默写 IEnergyStorage。"],
  ["mc-multiblock", "blockentities", "多方块用 BlockEntity + 该版同步，禁止默写内部 master/slave API。"],
  ["mc-gametest", "resources", "GameTest 以该版文档为准，禁止默写 @GameTest 包名。"],
  ["mc-model", "blocks", "blockstates / models JSON。generate_model 须传 version。"],
  ["mc-renderer", "blockentities", "渲染只放 Dist.CLIENT。禁止服务端加载 Renderer。"],
  ["mc-datapack", "resources", "data/ 布局。validate_datapack_json 不是全 pack_format schema。"],
  ["mc-resourcepack", "resources", "assets/ 与 pack.mcmeta。禁止把 Yarn Identifier 当本档资源 id。"],
  ["mc-dimension", "resources", "维度 JSON 以 datapack 页为准，禁止默写 DimensionType 构造。"],
  ["mc-ai", "entities", "Goal/Brain 以 entities 页为准；无页则禁止默写。"],
  ["mc-villager", "entities", "村民交易以该版文档为准，禁止默写 VillagerTrades 邻档字段。"],
  ["mc-weather", "worldgen/biomemodifier", "天气/气候以 biome 文档为准，禁止默写。"],
  ["mc-compat-jei", "gettingstarted/modfiles", "JEI/REI 为软依赖。库 Skill 走 knowledge/libs，不要把 Fabric REI 当 Neo API。"],
];

function neoNetNote(ver) {
  if (ver === "1.20.6") {
    return "网络：search_neoforge_docs query=networking version=1.20.6。Payload 以 networking 页为准，禁止把 1.21.1 的 RegisterPayloadHandlersEvent（复数 Handlers）抄进本档，除非该页写明。";
  }
  return `网络：search_neoforge_docs query=networking version=${ver}。本档核实 RegisterPayloadHandlersEvent + PayloadRegistrar（networking/payload）。禁止 SimpleChannel。禁止把 1.20.4 单数 RegisterPayloadHandlerEvent 当本档。`;
}

function neoEntityNote(ver) {
  if (ver === "1.20.6") {
    return "实体：本档文档无独立 entities 页（04-entity 已记 DOC_NOT_FOUND）。search_neoforge_docs query=entities version=1.20.6 若仍无页，禁止默写 EntityType.Builder。方块实体见 blockentities：BlockEntityType.Builder.of(...).build(null)。";
  }
  return `实体：search_neoforge_docs query=entities version=${ver}。核实 DeferredRegister.Entities / createEntities。EntityType.Builder 最后 .build(...) 参数以该页为准，禁止默写。`;
}

function neoDatagenNote(ver) {
  if (ver === "1.20.6") {
    return "DataGen：resources 页 GatherDataEvent（尚未核到 Client/Server 子类）。不要把 1.21.5 GatherDataEvent.Client 抄进 1.20.6。";
  }
  return `DataGen：search_neoforge_docs query=datagen version=${ver}。1.21.5+ 文档出现 GatherDataEvent.Client / GatherDataEvent.Server，以 resources 页为准。`;
}

function writeNeoThin(ver) {
  const table = `# NeoForge ${ver} 已核实 API

来源：search_neoforge_docs（version=${ver}）。每条可追溯文档 id。禁止把 Forge RegistryObject / SimpleChannel 当本档正解。

| 名称 | 出处文档 id |
|------|-------------|
| DeferredRegister.Items / createItems | items |
| DeferredRegister.Blocks / createBlocks / DeferredBlock | blocks |
| @Mod + IEventBus | gettingstarted/modfiles |
| Payload（networking 页；事件类名以该页为准） | networking |
| ModConfigSpec | misc/config |
| AttachmentType / Data Attachments | datastorage/attachments |
| BlockEntity / BlockEntityType.Builder | blockentities |
| MenuType | gui/menus |
| GatherDataEvent / RecipeProvider / LanguageProvider | resources |
| DataMapType / RegisterDataMapTypesEvent | datamaps |
| @SubscribeEvent / LivingJumpEvent | concepts/events |
${ver === "1.20.6" ? "| 无独立 entities 页；禁止默写 EntityType.Builder | concepts/registries |\n" : `| DeferredRegister.Entities / createEntities | entities |\n| RegisterPayloadHandlersEvent + PayloadRegistrar | networking/payload |\n`}
`;
  writeRel(`neoforge/${ver}/knowledge/common/verified-api-${ver}.md`, table);

  for (const [name, query, blurb] of NEO_SKILLS) {
    let extra = blurb;
    if (name === "mc-networking") extra = neoNetNote(ver);
    if (name === "mc-entity") extra = neoEntityNote(ver);
    if (name === "mc-datagen") extra = neoDatagenNote(ver);
    if (name === "mc-blockentity") extra = `方块实体：search_neoforge_docs query=blockentities version=${ver}。${ver === "1.21.10" ? "1.21.10 页提到 value I/O；禁止把邻档 CompoundTag 路径当已核签名。" : "同步优先 getUpdateTag / ClientboundBlockEntityDataPacket。"}`;
    const md = `---
name: ${name}
description: NeoForge ${ver} ${name}。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "${ver}"
dependencies: []
mappings: mojmap
docsTool: search_neoforge_docs
---

# ${name}（NeoForge ${ver}）

Java 21。核实表：knowledge/common/verified-api-${ver}.md。

必须 search_neoforge_docs query=${query} version=${ver}。核不到的类名写成「以该版文档为准，禁止默写」，不填伪造签名。

${extra}

文档：https://docs.neoforged.net/docs/${ver}/

反面：RegistryObject、SimpleChannel、邻档类名、NeoForgeAddonPlugin。本档 Skill 不得带 donor 横幅。
`;
    writeRel(`neoforge/${ver}/.cursor/skills/${name}/SKILL.md`, md);
  }
}

function writeQuilt(ver, registryNote) {
  const qslPath = `quilt/${ver}/knowledge/common/qsl-verified.md`;
  if (ver === "1.21.11") {
    writeRel(
      qslPath,
      `# Quilt / QSL 已核实表（差异层）

- search_docs({platform:"quilt"}) 当前无独立 1.21.11 文档树（已入库 1.18.2 / 1.19.4 / 1.20.1 / 1.20.4 / 1.21.1）。
- **禁止**编 \`QuiltRegistry.register()\`。
- **02–10 仍读** \`fabric/1.21.11\`。

## 入口（与其它 Quilt 档一致的 Loader 口径）

| API | 说明 |
|-----|------|
| \`org.quiltmc.loader.api.entrypoint.ModInitializer#onInitialize(ModContainer)\` | \`quilt.mod.json\` → \`entrypoints.init\`。禁止 Fabric 无参 \`onInitialize()\` 冒充 QSL |

## 注册

| 做法 | 说明 |
|------|------|
| Vanilla \`Registry.register\` | 简单 Item/Block **可用** |
| QSL RegistryEvents | **未在本档打开源码。禁止把 1.21.1 RegistryEvents#getEntryAddEvent 冒充本档。** |
| 禁止 | \`QuiltRegistry.register()\`；\`net.fabricmc.fabric.api.event.registry\` 当 QSL |
`,
    );
  }

  const skills = [
    [
      "mc-registry",
      `${registryNote}

入口：org.quiltmc.loader.api.entrypoint.ModInitializer#onInitialize(ModContainer)。quilt.mod.json entrypoints.init。

禁止 QuiltRegistry.register()。禁止把 net.fabricmc.fabric.api.event.registry 当 QSL。
简单物品/方块可用 Vanilla Registry.register（不是 FAPI 专属）。`,
    ],
    [
      "mc-events",
      `QSL Event API / Lifecycle 以该档 qsl-verified.md 为准。search_docs({platform:"quilt"}) version=${ver}。

无方法签名则只作方向，禁止默写 FAPI AttackBlockCallback 当 QSL。
1.21.1 已核实 ServerLifecycleEvents / ClientLifecycleEvents 的，只允许写进 1.21.1 档。`,
    ],
    [
      "mc-networking",
      `QSL Networking API 以 README / qsl-verified 为准。search_docs({platform:"quilt"}) version=${ver}。

禁止 ServerPlayNetworking / Fabric PayloadTypeRegistry 当 QSL。核不到通道 API 则禁止输出。`,
    ],
  ];
  for (const [name, body] of skills) {
    writeRel(
      `quilt/${ver}/.cursor/skills/${name}/SKILL.md`,
      `---
name: ${name}
description: Quilt ${ver} ${name}（QSL 差异）。名字只来自本档 qsl-verified.md。
platform: quilt
version: "${ver}"
dependencies: []
docsTool: search_docs
---

# ${name}（Quilt ${ver}）

核实表：knowledge/common/qsl-verified.md。
必须 search_docs({platform:"quilt"}) 且 version=${ver}。02–10 仍读 fabric/${ver} overlay。

${body}
`,
    );
  }
}

function writeOldLoader() {
  writeRel(
    "liteloader/1.12.2/.cursor/skills/mc-events/SKILL.md",
    `---
name: mc-events
description: LiteLoader 1.12.2 生命周期 Listener。只使用核实表。
platform: liteloader
version: "1.12.2"
docsTool: search_docs
---

# mc-events（LiteLoader 1.12.2）

核实表：knowledge/common/verified-api.md。
必须 search_docs({platform:"liteloader"}) version=1.12.2。表外禁止输出。

表内：LiteMod#init(File)、Tickable#onTick(Minecraft, float, boolean, boolean)、ChatListener。
不在核实表内，禁止输出。禁止 DeferredRegister / FabricLoader / net.fabricmc。
`,
  );
  writeRel(
    "liteloader/1.12.2/.cursor/skills/mc-gui/SKILL.md",
    `---
name: mc-gui
description: LiteLoader 1.12.2 HUD/Render。只使用核实表。
platform: liteloader
version: "1.12.2"
docsTool: search_docs
---

# mc-gui（LiteLoader 1.12.2）

核实表：knowledge/common/verified-api.md。
必须 search_docs({platform:"liteloader"}) version=1.12.2。

表内：HUDRenderListener#onPreRenderHUD / onPostRenderHUD；RenderListener#onRender；ViewportListener。
禁止 MenuType。不在核实表内，禁止输出。
`,
  );
  writeRel(
    "liteloader/1.12.2/.cursor/skills/mc-networking/SKILL.md",
    `---
name: mc-networking
description: LiteLoader 1.12.2 PluginChannelListener。
platform: liteloader
version: "1.12.2"
docsTool: search_docs
---

# mc-networking（LiteLoader 1.12.2）

核实表：knowledge/common/verified-api.md。
必须 search_docs({platform:"liteloader"}) version=1.12.2。

表内：PluginChannelListener#onCustomPayload(String channel, PacketBuffer data)。不要直接实现 CommonPluginChannelListener。
禁止 ServerPlayNetworking / 1.20 Payload。不在核实表内，禁止输出。
`,
  );

  for (const ver of ["1.8.9", "1.10.2"]) {
    writeRel(
      `liteloader/${ver}/.cursor/skills/mc-gui/SKILL.md`,
      `---
name: mc-gui
description: LiteLoader ${ver} 仅 HUDRenderListener 已核实。
platform: liteloader
version: "${ver}"
docsTool: search_docs
---

# mc-gui（LiteLoader ${ver}）

核实表：knowledge/common/verified-api.md。
必须 search_docs({platform:"liteloader"}) version=${ver}。

表内仅 HUDRenderListener#onPreRenderHUD(int,int) / onPostRenderHUD(int,int)。
Tickable / PluginChannelListener **不在本档核实表内，禁止输出**。禁止把 1.12.2 整表抄来。禁止 ModInitializer。
`,
    );
    writeRel(
      `liteloader/${ver}/.cursor/skills/mc-events/SKILL.md`,
      `---
name: mc-events
description: LiteLoader ${ver} 事件。表外停。
platform: liteloader
version: "${ver}"
docsTool: search_docs
---

# mc-events（LiteLoader ${ver}）

核实表：knowledge/common/verified-api.md。
必须 search_docs({platform:"liteloader"}) version=${ver}。

除 HUD 外接口未打开。不在核实表内，禁止输出。禁止 DeferredRegister / net.fabricmc。
`,
    );
    writeRel(
      `liteloader/${ver}/.cursor/skills/mc-networking/SKILL.md`,
      `---
name: mc-networking
description: LiteLoader ${ver} 网络。本档未核实通道 API。
platform: liteloader
version: "${ver}"
docsTool: search_docs
---

# mc-networking（LiteLoader ${ver}）

必须 search_docs({platform:"liteloader"}) version=${ver}。
PluginChannelListener **不在本档核实表内，禁止输出**。禁止抄 1.12.2 或 Fabric。
`,
    );
  }

  writeRel(
    "rift/1.13.2/.cursor/skills/mc-events/SKILL.md",
    `---
name: mc-events
description: Rift 1.13.2 InitializationListener / tick。禁止 Fabric ModInitializer。
platform: rift
version: "1.13.2"
docsTool: search_docs
---

# mc-events（Rift 1.13.2）

核实表：knowledge/common/listeners.md。
必须 search_docs({platform:"rift"}) version=1.13.2。

表内：org.dimdev.riftloader.listener.InitializationListener#onInitialization()（注意是 onInitialization，不是 ModInitializer）。
ServerTickable#serverTick；client.ClientTickable#clientTick。
Listener 须 public 无参构造，在 riftmod.json listeners 列出。禁止 ModInitializer / DeferredRegister / net.fabricmc。
`,
  );
  writeRel(
    "rift/1.13.2/.cursor/skills/mc-gui/SKILL.md",
    `---
name: mc-gui
description: Rift 1.13.2 GameGuiAdder / OverlayRenderer。
platform: rift
version: "1.13.2"
docsTool: search_docs
---

# mc-gui（Rift 1.13.2）

核实表：knowledge/common/listeners.md。
必须 search_docs({platform:"rift"}) version=1.13.2。

表内：GameGuiAdder#displayGui；OverlayRenderer#renderOverlay。禁止 MenuType。不在核实表内，禁止输出。
`,
  );
  writeRel(
    "rift/1.13.2/.cursor/skills/mc-networking/SKILL.md",
    `---
name: mc-networking
description: Rift 1.13.2 MessageAdder。CustomPayloadHandler 已 Deprecated。
platform: rift
version: "1.13.2"
docsTool: search_docs
---

# mc-networking（Rift 1.13.2）

核实表：knowledge/common/listeners.md。
必须 search_docs({platform:"rift"}) version=1.13.2。

表内：MessageAdder#registerMessages。CustomPayloadHandler 已 Deprecated，改用 MessageAdder。
禁止 ServerPlayNetworking。不在核实表内，禁止输出。
`,
  );

  writeRel(
    "modloader/1.6.4/.cursor/skills/mc-registry/SKILL.md",
    `---
name: mc-registry
description: ModLoader 1.6.4 BaseMod / ModLoader.registerBlock。表外停。
platform: modloader
version: "1.6.4"
docsTool: search_docs
---

# mc-registry（ModLoader 1.6.4）

核实表：knowledge/common/safe-api.md。
必须 search_docs({platform:"modloader"}) version=1.6.4。

表内：mod_<Name> extends BaseMod；getVersion()；load()；ModLoader.registerBlock(Block)；ModLoader.registerTileEntity(Class, String)。
禁止 DeferredRegister / RegistryEvent / net.fabricmc。不在核实表内，禁止输出。
`,
  );
  writeRel(
    "modloader/1.6.4/.cursor/skills/mc-item/SKILL.md",
    `---
name: mc-item
description: ModLoader 1.6.4 ItemStack / addRecipe。表外停。
platform: modloader
version: "1.6.4"
docsTool: search_docs
---

# mc-item（ModLoader 1.6.4）

核实表：knowledge/common/safe-api.md。
必须 search_docs({platform:"modloader"}) version=1.6.4。

表内：ItemStack；ModLoader.addRecipe；ModLoader.addShapelessRecipe；ModLoader.addName。
不在核实表内，禁止输出。禁止 Fabric Item。
`,
  );

  for (const ver of ["1.2.5", "1.5.2"]) {
    writeRel(
      `modloader/${ver}/.cursor/skills/mc-registry/SKILL.md`,
      `---
name: mc-registry
description: ModLoader ${ver} 安全表为空。禁止输出 API。
platform: modloader
version: "${ver}"
docsTool: search_docs
---

# mc-registry（ModLoader ${ver}）

核实表：knowledge/common/safe-api.md（空表）。
必须 search_docs({platform:"modloader"}) version=${ver}。
不在核实表内，禁止输出。禁止把 1.6.4 BaseMod 表抄来。禁止 ModInitializer。
`,
    );
  }
}

function writeNeo1201() {
  writeRel(
    "neoforge/1.20.1/pack.meta.json",
    JSON.stringify(
      { status: "ready", "pack-status": "ready", platform: "neoforge", minecraftVersion: "1.20.1" },
      null,
      2,
    ),
  );
  writeRel(
    "neoforge/1.20.1/AGENTS.md",
    `# NeoForge 1.20.1 — Agent 总纲

> 只适用于 **NeoForge 1.20.1**。文档数据为 Forge 1.20.1 兼容（search_neoforge_docs version=1.20.1，forgeCompatible）。
> **禁止**读取 \`neoforge/1.20.4/.cursor/rules\` 或其它邻档 00–10。

| 项 | 值 |
|---|---|
| 平台 | NeoForge 1.20.1 |
| 文档 | search_neoforge_docs version=1.20.1 |
| 注册 | DeferredRegister 与 RegisterEvent（1.20.1/concepts_registries） |
| 禁止 | 把 1.20.4+ DeferredBlock / RegisterPayloadHandlersEvent / AttachmentType 当本档已核 |

核实表：knowledge/common/verified-api-1.20.1.md。核不到禁止默写。
`,
  );
  writeRel(
    "neoforge/1.20.1/knowledge/common/verified-api-1.20.1.md",
    `# NeoForge 1.20.1 已核实 API

来源：search_neoforge_docs version=1.20.1（Forge 兼容数据）。每条追溯页面 id。

| 名称 | 出处文档 id |
|------|-------------|
| DeferredRegister（推荐注册） | 1.20.1/concepts_registries |
| RegisterEvent | 1.20.1/concepts_registries |
| Items | 1.20.1/items |
| Blocks | 1.20.1/blocks |
| Events | 1.20.1/concepts_events |
| Mod Lifecycle | 1.20.1/concepts_lifecycle |
| Sounds | 1.20.1/gameeffects_sounds |
| Configuration | 1.20.1/misc_config |
| Block States | 1.20.1/blocks_states |
| BlockEntityWithoutLevelRenderer | 1.20.1/items_bewlr |

禁止把 Neo 1.20.4 Payload / Data Attachment 当本档。元数据文件名以该版 gettingstarted 为准，禁止默写。
`,
  );

  const rules = {
    "00-project-setup.mdc": `# 00 — 工程（NeoForge 1.20.1）\n\n来源：search_neoforge_docs version=1.20.1。Java 17。不要用 Yarn。download_official_mdk 若无 Neo 1.20.1 pin 则 MDK_NOT_PINNED，禁止伪造 SHA。\n`,
    "01-registry.mdc": `# 01 — 注册（NeoForge 1.20.1）\n\n来源：1.20.1/concepts_registries。DeferredRegister 推荐；备选 RegisterEvent。禁止 RegistryObject 当 1.20.4+ Neo 教程类型，也禁止把 DeferredBlock 抄自 1.20.4。\n`,
    "02-block.mdc": `# 02 — 方块\n\n来源：1.20.1/blocks。以该页为准，禁止默写 DeferredRegister.Blocks 助手是否存在。\n`,
    "03-item.mdc": `# 03 — 物品\n\n来源：1.20.1/items。以该页为准，禁止默写。\n`,
    "04-entity.mdc": `# 04 — 实体\n\nsearch_neoforge_docs query=entities version=1.20.1。核不到独立页则禁止默写 EntityType 工厂。\n`,
    "05-events.mdc": `# 05 — 事件\n\n来源：1.20.1/concepts_events。@SubscribeEvent。禁止把 1.21 复数 Handlers 当本档。\n`,
    "06-networking.mdc": `# 06 — 网络\n\nsearch_neoforge_docs query=networking version=1.20.1。以该版文档为准，禁止默写 SimpleChannel 是否仍是本档正解，也禁止抄 Neo 1.21 PayloadHandlers。\n`,
    "07-datagen.mdc": `# 07 — DataGen\n\n来源：1.20.1/datagen_server_datapackregistries。generate_datagen 对本档无模板则改口文档，不要抄 1.21 GatherDataEvent.Client。\n`,
    "08-client-server.mdc": `# 08 — 物理端\n\n来源：生命周期/事件页。禁止在服务端加载客户端类。\n`,
    "09-anti-patterns.mdc": `# 09 — 反模式\n\n禁止读 neoforge/1.20.4 00–10。禁止 RegistryObject 冒充后续 Neo。禁止 SimpleChannel 冒充 1.21 Payload。\n`,
    "10-gui.mdc": `# 10 — GUI\n\nsearch_neoforge_docs query=gui version=1.20.1。Menu 类名以该页为准，禁止默写。\n`,
  };
  for (const [file, body] of Object.entries(rules)) {
    writeRel(
      `neoforge/1.20.1/.cursor/rules/${file}`,
      `---\ndescription: ${file.replace(".mdc", "")} NeoForge 1.20.1\nglobs:\nalwaysApply: ${file.startsWith("00") || file.startsWith("01") || file.startsWith("09") ? "true" : "false"}\n---\n\n${body}`,
    );
  }

  writeRel(
    "neoforge/1.20.1/.cursor/skills/mc-registry/SKILL.md",
    `---
name: mc-registry
description: NeoForge 1.20.1 注册。Forge 兼容 DeferredRegister。
platform: neoforge
version: "1.20.1"
docsTool: search_neoforge_docs
---

# mc-registry（NeoForge 1.20.1）

核实表：knowledge/common/verified-api-1.20.1.md。
必须 search_neoforge_docs query=registries version=1.20.1。
DeferredRegister 与 RegisterEvent。禁止把 1.20.4 DeferredBlock 当本档。
`,
  );
  writeRel(
    "neoforge/1.20.1/scaffold/README_AI.md",
    `# NeoForge 1.20.1 scaffold

最小入口：@Mod + DeferredRegister（见 1.20.1/concepts_registries）。
元数据以该版文档为准。不要抄 neoforge/1.20.4 scaffold。
MDK：无官方 pin 则 MDK_NOT_PINNED，禁止编 SHA。
`,
  );
  writeRel(
    "neoforge/1.20.1/scaffold/src/main/resources/META-INF/mods.toml",
    `modLoader="javafml"\nloaderVersion="[47,)"\nlicense="MIT"\n\n[[mods]]\nmodId="examplemod"\nversion="1.0.0"\ndisplayName="Example"\ndescription='''NeoForge 1.20.1 scaffold'''\n`,
  );
}

function writeForge1710() {
  writeRel(
    "forge/1.7.10/knowledge/common/verified-api.md",
    `# Forge 1.7.10 javadoc 核实表

来源：search_forge_docs version=1.7.10（skmedix ForgeJavaDocs）。仅类名索引，不是 1.12 教程树。禁止 DeferredRegister。

| 名称 | 出处文档 id |
|------|-------------|
| ItemBlock | 1.7.10/net/minecraft/item/ItemBlock |
| ItemBlockWithMetadata | 1.7.10/net/minecraft/item/ItemBlockWithMetadata |
| ItemAnvilBlock | 1.7.10/net/minecraft/item/ItemAnvilBlock |
| EntityFallingBlock | 1.7.10/net/minecraft/entity/item/EntityFallingBlock |
| cpw.mods.fml.common.Loader | 1.7.10/cpw/mods/fml/common/Loader |
| ISimpleBlockRenderingHandler | 1.7.10/cpw/mods/fml/client/registry/ISimpleBlockRenderingHandler |
| GameRegistry | 1.7.10/cpw/mods/fml/common/registry/GameRegistry |
| GameRegistry.UniqueIdentifier | 1.7.10/cpw/mods/fml/common/registry/GameRegistry.UniqueIdentifier |
| FMLCommonHandler | 1.7.10/cpw/mods/fml/common/FMLCommonHandler |
| GameData | 1.7.10/cpw/mods/fml/common/registry/GameData |

方法签名以 javadoc 页为准，禁止默写。download_official_mdk 对本版 **MDK_NOT_PINNED**。
`,
  );
  writeRel(
    "forge/1.7.10/pack.meta.json",
    JSON.stringify(
      { status: "ready", "pack-status": "ready", platform: "forge", minecraftVersion: "1.7.10", note: "javadoc 核实表；无完整 MkDocs 教程" },
      null,
      2,
    ),
  );
  writeRel(
    "forge/1.7.10/AGENTS.md",
    `# Forge 1.7.10

核实表：knowledge/common/verified-api.md（search_forge_docs version=1.7.10 javadoc）。
改口：search_docs({platform:"forge", version:"1.7.10"})。
download_official_mdk 对本版 **永远 MDK_NOT_PINNED**（maven mdk zip 404），禁止写入 mdk-checksums 假 pin。
不要把 1.12.2/1.16+ Capability、DeferredRegister、DataGen 当本版教程。
`,
  );
  for (const [id, title] of [
    ["00-project-setup", "工程"],
    ["01-registry", "注册"],
    ["09-anti-patterns", "反模式"],
  ]) {
    writeRel(
      `forge/1.7.10/.cursor/rules/${id}.mdc`,
      `---\ndescription: ${id} Forge 1.7.10\nalwaysApply: true\n---\n\n# ${title}（Forge 1.7.10）\n\n来源：search_forge_docs version=1.7.10。核实表 knowledge/common/verified-api.md。\n注册用 GameRegistry（javadoc），禁止 DeferredRegister。MDK_NOT_PINNED。\n`,
    );
  }
  writeRel(
    "forge/1.7.10/.cursor/skills/mc-registry/SKILL.md",
    `---
name: mc-registry
description: Forge 1.7.10 GameRegistry（javadoc）。
platform: forge
version: "1.7.10"
docsTool: search_forge_docs
---

# mc-registry（Forge 1.7.10）

核实表：knowledge/common/verified-api.md。
必须 search_forge_docs query=GameRegistry version=1.7.10。
表内：GameRegistry、Loader、FMLCommonHandler。禁止 DeferredRegister。方法签名以 javadoc 为准，禁止默写。
`,
  );
  writeRel(
    "forge/1.7.10/.cursor/skills/mc-item/SKILL.md",
    `---
name: mc-item
description: Forge 1.7.10 ItemBlock（javadoc）。
platform: forge
version: "1.7.10"
docsTool: search_forge_docs
---

# mc-item（Forge 1.7.10）

核实表：knowledge/common/verified-api.md。
必须 search_forge_docs query=ItemBlock version=1.7.10。
表内：ItemBlock、ItemBlockWithMetadata。禁止 1.12 GameRegistry.registerItem 记忆顶上，以 javadoc 为准。
`,
  );
}

function writeForge1211Agents() {
  writeRel(
    "forge/1.21.1/AGENTS.md",
    `# Forge 1.21.1 — 无教程树（draft）

本目录 **不是** 完整 00–10。\`list_forge_versions\` **不含** 1.21.1；\`search_forge_docs version=1.21.1\` 返回 VERSION_NOT_FOUND（当前仅到 1.20.4）。

改口：\`list_forge_versions\` 后再 \`search_forge_docs\`（不要假定 1.21.1 页）。**禁止**把 NeoForge 1.21.1 的 00–10 / DeferredHolder / PayloadHandlers 当 Forge 教程。
\`detect_mod_project\` / session 对本版规则树返回 \`PACK_NOT_FOUND\`。
不要用 1.20.4 规则改版本号冒充本档。
`,
  );
}

function writeFabric2612Scaffold() {
  writeRel(
    "fabric/26.1.2/scaffold/README_AI.md",
    `# Fabric 26.1.2 scaffold

口径只引用 data/fabric_26.1.2（Java **25**、\`implementation\` 非 modImplementation、\`id "net.fabricmc.fabric-loom"\`）。
禁止抄 fabric/1.21.11/scaffold 的 Yarn / modImplementation / remapJar。
游戏已去混淆：不要 mappings Yarn。search_fabric_docs version=26.1.2。
`,
  );
  writeRel(
    "fabric/26.1.2/scaffold/gradle.properties",
    `mod_version=1.0.0
mod_id=examplemod
maven_group=com.example
minecraft_version=26.1.2
org.gradle.jvmargs=-Xmx2G
`,
  );
  writeRel(
    "fabric/26.1.2/scaffold/settings.gradle",
    `pluginManagement {
    repositories {
        maven { url "https://maven.fabricmc.net/" }
        gradlePluginPortal()
        mavenCentral()
    }
}
rootProject.name = "examplemod"
`,
  );
  writeRel(
    "fabric/26.1.2/scaffold/build.gradle",
    `plugins {
    id "net.fabricmc.fabric-loom" version "1.11-SNAPSHOT"
}

version = project.mod_version
group = project.maven_group

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(25)
    }
}

dependencies {
    minecraft "com.mojang:minecraft:\${project.minecraft_version}"
    implementation "net.fabricmc:fabric-loader:0.17.0"
}

processResources {
    filesMatching("fabric.mod.json") {
        expand "version": project.version
    }
}
`,
  );
  writeRel(
    "fabric/26.1.2/scaffold/src/main/resources/fabric.mod.json",
    `{
  "schemaVersion": 1,
  "id": "examplemod",
  "version": "\${version}",
  "name": "Example Mod",
  "environment": "*",
  "entrypoints": { "main": ["com.example.examplemod.ExampleMod"] },
  "depends": { "fabricloader": "*", "minecraft": "26.1.2" }
}
`,
  );
  writeRel(
    "fabric/26.1.2/scaffold/src/main/java/com/example/examplemod/ExampleMod.java",
    `package com.example.examplemod;

import net.fabricmc.api.ModInitializer;

public class ExampleMod implements ModInitializer {
    @Override
    public void onInitialize() {
    }
}
`,
  );
}

// --- run ---
for (const ver of ["1.20.6", "1.21.5", "1.21.10"]) writeNeoThin(ver);

writeQuilt("1.18.2", "1.18.2 用 Registry.ITEM/BLOCK，没有 Registries。QSL RegistryEvents 未打开，禁止把 1.21 getEntryAddEvent 冒充本档。");
writeQuilt("1.19.4", "Vanilla Registry.register。QSL RegistryEvents 未打开，禁止把 1.21 分支方法名冒充本档。");
writeQuilt("1.20.1", "Vanilla Registry.register(Registries.*, id, value)。QSL RegistryEvents 未打开。");
writeQuilt("1.20.4", "Vanilla Registry.register(Registries.*, id, value)。QSL RegistryEvents 未打开。");
writeQuilt(
  "1.21.1",
  "已核实 org.quiltmc.qsl.registry.api.event.RegistryEvents#getEntryAddEvent(Registry) 与 RegistryMonitor#create(Registry)。禁止 QuiltRegistry.register()。",
);
writeQuilt("1.21.11", "本档无独立 QSL 文档树。禁止把 1.21.1 RegistryEvents 冒充本档。Loader 入口仍是 ModInitializer#onInitialize(ModContainer)。");

writeOldLoader();
writeNeo1201();
writeForge1710();
writeForge1211Agents();
writeFabric2612Scaffold();

writeRel(
  "mcp-server/scripts/lint-skill-verified-api.files.txt",
  [...new Set(lintList)].sort().join("\n") + "\n",
);

console.log(`wrote ${lintList.length} SKILL.md + supporting files`);
