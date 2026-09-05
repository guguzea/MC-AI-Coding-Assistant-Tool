#!/usr/bin/env node
/**
 * ⚠ 一次性改写器：已执行过，勿再跑（会覆盖已人工修订的 mc-blockentity）。
 * 只写六档 mc-blockentity，不覆盖 00–10。
 *
 * 2026-09-04（§6.1-D）：删掉 `readFileSync(.../02-block.mdc)` + 整份内联。
 * 原写法把**方块**规则正文（`DeferredRegister.createBlocks` / `BlockBehaviour.Properties` /
 * `destroyTime` 等）塞进**方块实体** Skill，主题错配，且落盘的是当时的陈旧副本
 * （现盘上 `02-block.mdc` 已修订，Skill 内那份没有跟着变）。
 * 现在只写 BlockEntity 自己的条目，每条挂本档语料出处；方块侧改为指向同档 `02-block.mdc`。
 *
 * 语料（逐条核实来源，`BE` = 该档 blockentities 页）：
 *   data/neoforge_<ver>/neoforge-docs/<ver>/processed/blockentities.md
 */
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { emit } from "../_lib/write-guard.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * 逐档口径。mappings 与 write-neoforge-six-trees.mjs 的 `F[ver].mappings` 同值
 * （§6.2-17(a)：本档自己的 mappings 值，不写全局字面量）。
 * src* 字段是该档语料的行号，正文里原样印出，便于复核。
 */
const VERS = [
  {
    ver: "1.20.4",
    mappings: "mojmap / NeoForm 官方名（不是 Forge MCP）",
    type: "`BlockEntityType.Builder.of(MyBE::new, validBlocks).build(null)`（Builder + `build(null)`）",
    typeSrc: "BE:26",
    mount: "`EntityBlock` 接口必须在你的 `Block` 上实现",
    mountSrc: "BE:40",
    ticker: "`getTicker(Level, BlockState, BlockEntityType<T>)` + `createTickerHelper`（`BaseEntityBlock` 上有 protected static 版）",
    tickerSrc: "BE:95, BE:81, BE:79",
    storage: "`saveAdditional(CompoundTag tag)` / `load(CompoundTag tag)`",
    storageSrc: "BE:48, BE:50",
    sync: "chunk 加载：`getUpdateTag()`（**无参**）→ `IForgeBlockEntity#handleUpdateTag(CompoundTag)`；方块更新：`getUpdatePacket()` → `ClientboundBlockEntityDataPacket.create(this)`",
    syncSrc: "BE:155, BE:134, BE:167, BE:171",
    dirty: "`BlockEntity#setChanged`（漏调则该 `LevelChunk` 会被跳过）",
    dirtySrc: "BE:60",
    extra: "本档语料的「Custom Network Message」一节仍写 Forge 口径，自定义包按 06 的 Payload 写。",
    extraSrc: "BE:196",
  },
  {
    ver: "1.21.1",
    mappings: "mojmap",
    type: "`BlockEntityType.Builder.of(MyBlockEntity::new, ...blocks).build(null)`",
    typeSrc: "BE:46, BE:62",
    mount: "`extends Block implements EntityBlock` + override `newBlockEntity(BlockPos, BlockState)`",
    mountSrc: "BE:95, BE:109",
    ticker: "`getTicker(Level, BlockState, BlockEntityType<T>)` + `createTickerHelper`",
    tickerSrc: "BE:224, BE:212",
    storage: "`saveAdditional(CompoundTag, HolderLookup.Provider)` / `loadAdditional(CompoundTag, HolderLookup.Provider)`",
    storageSrc: "BE:178, BE:164",
    sync: "chunk 加载：`getUpdateTag(HolderLookup.Provider)` + `handleUpdateTag(CompoundTag, HolderLookup.Provider)`；方块更新：`getUpdatePacket()`",
    syncSrc: "BE:276, BE:292, BE:330",
    dirty: "`setChanged`",
    dirtySrc: "BE:192",
    extra: "`load` 不再是本档覆写点，覆写 `loadAdditional`。",
    extraSrc: "BE:142",
  },
  {
    ver: "1.21.3",
    mappings: "mojmap",
    type: "`new BlockEntityType<>(MyBlockEntity::new, java.util.Set.of(...blocks))`——**Builder 已不再是本档示例**",
    typeSrc: "BE:46",
    mount: "`extends Block implements EntityBlock` + override `newBlockEntity(BlockPos, BlockState)`",
    mountSrc: "BE:96, BE:110",
    ticker: "`getTicker(Level, BlockState, BlockEntityType<T>)` + `createTickerHelper`",
    tickerSrc: "BE:225, BE:213",
    storage: "`saveAdditional(CompoundTag, HolderLookup.Provider)` / `loadAdditional(CompoundTag, HolderLookup.Provider)`",
    storageSrc: "BE:179, BE:165",
    sync: "chunk 加载：`getUpdateTag(HolderLookup.Provider)` + `handleUpdateTag(CompoundTag, HolderLookup.Provider)`；方块更新：`getUpdatePacket()`",
    syncSrc: "BE:277, BE:293, BE:331",
    dirty: "`setChanged`",
    dirtySrc: "BE:193",
    extra: "1.21.3 起语料示例直接用构造器建 `BlockEntityType`，不要抄 1.21.1 的 `Builder.of(...).build(null)`。",
    extraSrc: "BE:46",
  },
  {
    ver: "1.21.8",
    mappings: "mojmap",
    type: "`new BlockEntityType<>(MyBlockEntity::new, java.util.Set.of(...blocks))`",
    typeSrc: "BE:46",
    mount: "`extends Block implements EntityBlock` + override `newBlockEntity(BlockPos, BlockState)`",
    mountSrc: "BE:102, BE:116",
    ticker: "`getTicker(Level, BlockState, BlockEntityType<T>)` + `createTickerHelper`",
    tickerSrc: "BE:278, BE:266",
    storage: "`saveAdditional(ValueOutput)` / `loadAdditional(ValueInput)`——**value I/O，不再是 CompoundTag**",
    storageSrc: "BE:185, BE:171, BE:149",
    sync: "chunk 加载：`getUpdateTag(HolderLookup.Provider)` 仍返回 `CompoundTag`，收包侧 `handleUpdateTag(ValueInput)`；方块更新：`getUpdatePacket()`",
    syncSrc: "BE:330, BE:342, BE:376",
    dirty: "`setChanged`",
    dirtySrc: "BE:199",
    extra: "本档分界是存储换成 value I/O（`ValueInput` / `ValueOutput`）；同步 tag 仍是 `CompoundTag`，别把两侧混成一个签名。",
    extraSrc: "BE:149, BE:330",
  },
  {
    ver: "1.21.11",
    mappings: "mojmap（游戏仍混淆；与 26.1 去混淆不是同一档）",
    type: "`new BlockEntityType<>(MyBlockEntity::new, java.util.Set.of(...blocks))`",
    typeSrc: "BE:46",
    mount: "`extends Block implements EntityBlock` + override `newBlockEntity(BlockPos, BlockState)`",
    mountSrc: "BE:102, BE:116",
    ticker: "`getTicker(Level, BlockState, BlockEntityType<T>)` + `createTickerHelper`",
    tickerSrc: "BE:278, BE:266",
    storage: "`saveAdditional(ValueOutput)` / `loadAdditional(ValueInput)`",
    storageSrc: "BE:185, BE:171, BE:149",
    sync: "chunk 加载：`getUpdateTag(HolderLookup.Provider)` + `handleUpdateTag(ValueInput)`；方块更新：`getUpdatePacket()`",
    syncSrc: "BE:330, BE:342, BE:376",
    dirty: "`setChanged`",
    dirtySrc: "BE:199",
    extra: "本档注册表 id 类型是 `Identifier`（不是 `ResourceLocation`），但 BlockEntity 方法签名与 1.21.8 同族。",
    extraSrc: "BE:13",
  },
  {
    ver: "26.1",
    mappings: "mojmap-unobfuscated（游戏 jar 已是 Mojang 名）",
    type: "`new BlockEntityType<>(MyBlockEntity::new, java.util.Set.of(...blocks))`，经 `DeferredRegister.create(Registries.BLOCK_ENTITY_TYPE, MOD_ID)` 注册",
    typeSrc: "BE:36, BE:40",
    mount: "`extends Block implements EntityBlock` + override `newBlockEntity(BlockPos, BlockState)`",
    mountSrc: "BE:102, BE:116",
    ticker: "`getTicker(Level, BlockState, BlockEntityType<T>)` + `createTickerHelper`",
    tickerSrc: "BE:278, BE:266",
    storage: "`saveAdditional(ValueOutput)` / `loadAdditional(ValueInput)`",
    storageSrc: "BE:185, BE:171, BE:149",
    sync: "chunk 加载：`getUpdateTag(HolderLookup.Provider)` + `handleUpdateTag(ValueInput)`；方块更新：`getUpdatePacket()` → `ClientboundBlockEntityDataPacket.create(this)`",
    syncSrc: "BE:330, BE:342, BE:376, BE:382",
    dirty: "`setChanged`",
    dirtySrc: "BE:199",
    extra: "去混淆档：类名即 Mojang 名，`query_api` 无本版索引；核签名走 `search_neoforge_docs version=26.1`（语料路径无版本前缀）。",
    extraSrc: "BE:13",
  },
];

function corpusPath(ver) {
  return `data/neoforge_${ver}/neoforge-docs/${ver}/processed/blockentities.md`;
}

function body(v) {
  return `# mc-blockentity（NeoForge ${v.ver}）

本 Skill 只管方块实体。方块侧（\`Block\` 注册、\`BlockBehaviour.Properties\`、blockstate）**见同档 \`02-block.mdc\`**，不在此内联，也不要把方块正文当 BE 正文。

禁止从 Forge 或邻档复制。自定义包走 Payload，禁止 SimpleChannel / RegistryObject / NeoForgeAddonPlugin。

## 本档条目

出处 \`BE\` = \`${corpusPath(v.ver)}\`。

| 项 | NeoForge ${v.ver} 口径 | 出处 |
|---|---|---|
| 类型注册 | ${v.type} | ${v.typeSrc} |
| 方块挂载 | ${v.mount} | ${v.mountSrc} |
| Ticker | ${v.ticker} | ${v.tickerSrc} |
| 存档 | ${v.storage} | ${v.storageSrc} |
| 客户端同步 | ${v.sync} | ${v.syncSrc} |
| 脏标记 | ${v.dirty} | ${v.dirtySrc} |

${v.extra}（${v.extraSrc}）

核不到的签名改口 \`search_neoforge_docs version=${v.ver} query=BlockEntity\`，禁止用邻档方法名补全。

触发词：BlockEntity、BlockEntityType、getTicker、getUpdateTag。
`;
}

for (const v of VERS) {
  const fm = `---
name: mc-blockentity
description: NeoForge ${v.ver} mc-blockentity。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "${v.ver}"
dependencies: []
mappings: ${v.mappings}
---

`;
  const dir = join(ROOT, "neoforge", v.ver, ".cursor", "skills", "mc-blockentity");
  emit(join(dir, "SKILL.md"), `${fm}${body(v)}`.trimStart());
}
