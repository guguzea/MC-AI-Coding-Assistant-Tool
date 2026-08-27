# Forge 1.12.2 — AI Coding Assistant

This file contains Forge 1.12.2 mod development knowledge for AI coding assistants that support `CLAUDE.md`.
When you detect a Forge 1.12.2 project, read this file first.

---

## Platform Detection

```
IF build.gradle contains "net.minecraftforge.gradle"
  → This is a Forge project

IF build.gradle contains "minecraft_version = '1.12.2'"
  → Use Forge 1.12.2 rules

IF build.gradle contains "neoforge" OR "neogradle"
  → Use NeoForge rules instead
```

---

## Core Constraints

### Registry (IMPORTANT: No DeferredRegister!)
- **Always use @EventBusSubscriber + RegistryEvent.Register<T>** — Forge 1.12.2 does NOT have DeferredRegister
- Use `@Mod.EventBusSubscriber(modid=...)` for registry events
- mod ID must match `mcmod.info` exactly, all lowercase `[a-z0-9_]`

### Initialization
- Use `@EventHandler` method with `FMLPreInitializationEvent` in `@Mod` class for initialization
- Initialize phases: `LOADING`, `CONSTRUCTING`, `PREINITIALIZATION`, `INITIALIZATION`, `POSTINITIALIZATION`

### Physical Side
- Use **Proxy pattern**: `ClientProxy` and `CommonProxy`
- `@SideOnly(Side.CLIENT)` for client-only code
- `@SideOnly(Side.SERVER)` for server-only code (rarely used)

### Mappings
- Always use **MCP SRG names** (e.g., `LivingEntity#getHealth`, `func_70024_e`)
- 1.12.2 uses SRG format mappings

---

## Rule Files Reference

| File | Topic |
|------|-------|
| `00-project-setup.mdc` | Java 8, Gradle 4.9, build.gradle structure |
| `01-registry.mdc` | @EventBusSubscriber, RegistryEvent.Register (NO DeferredRegister!) |
| `02-block.mdc` | Block, BlockContainer, IBlockState |
| `03-item.mdc` | Item, ItemStack, ToolMaterial |
| `04-entity.mdc` | Entity, EntityLiving, IEntityAdditionalSpawnData |
| `05-events.mdc` | @SubscribeEvent, EventBusSubscriber, FML lifecycle events |
| `06-networking.mdc` | SimpleNetworkWrapper, PacketBuffer, MessageHandler |
| `07-datagen.mdc` | JSON manual writing (no DataGenerator in 1.12.2) |
| `08-client-server.mdc` | Proxy pattern, SideOnly, ClientProxy |
| `09-anti-patterns.mdc` | Common mistakes and fixes |
| `10-gui.mdc` | Container, IGuiHandler, GuiScreen |

---

## Common Errors Checklist

1. `NullPointerException` on entity → attributes registered too early
2. Block displays as missing (purple/black) → registered but missing resource files
3. "Resource location is invalid" → registry name has uppercase or `-`
4. Crash on world load → BlockContainer/BlockEntity registration issue
5. Game crash in Mixin → trying to modify final fields in constructor

---

## Project Structure

```
src/main/java/com/example/mod/
├── ExampleMod.java         # @Mod entry point with @EventHandler
├── CommonProxy.java        # Common proxy (both sides)
├── client/
│   └── ClientProxy.java   # Client-only proxy (@SideOnly(Side.CLIENT))
├── registry/              # Registry event subscribers
├── blocks/               # Block subclasses
├── items/                # Item subclasses
├── entities/             # Entity subclasses
└── init/                 # Event subscribers
```

---

## Key API Differences from 1.20.1

| 1.12.2 | 1.20.1 Equivalent |
|--------|-------------------|
| `RegistryEvent.Register<T>` | `DeferredRegister.register()` |
| `@EventHandler` + `FMLPreInitializationEvent` | Constructor with `FMLJavaModLoadingContext` |
| `SimpleNetworkWrapper` | `SimpleChannel` |
| `PacketBuffer` | `FriendlyByteBuf` |
| `IBlockState` | `BlockState` |
| `BlockContainer` | `EntityBlock` |
| `ItemStack` (damage int) | `ItemStack` (ItemStack) |
| `ToolMaterial` | `Tier` |
| `EnumCreatureAttribute` | (removed, use LivingEntity subclasses) |
<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程（从零建工程 / 完整新方块 / GUI / 崩溃分诊 / 移植 / 真机循环 / 汉化 / 发布 / 反编译研究）才调 `get_workflow_template`；改已有代码、补方法、查文档走规则 + Skill + `search_*_docs`，不要先调工作流。

- 汉化：`localize_mod`（diff / draft_zh / jar extract / pack_draft；无机器翻译）。
- 崩溃分诊：`crash_analyze`。
- 发布：`mc-publish` 工作流 + `check_publish_ready`；不代跑 Gradle、不拷 jar、不上传。
- 写盘 / Gradle / 拷 jar / 上传均须用户确认（人在环）。
