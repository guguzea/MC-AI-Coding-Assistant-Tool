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
- Use `@Mod.EventBusSubscriber(bus = EventBusSubscriber.Bus.FORGE)` for registry events
- mod ID must match `mcmod.info` exactly, all lowercase `[a-z0-9_]`

### Initialization
- Use `@Init` method in `@Mod` class for initialization
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
| `00-project-setup.md` | Java 8, Gradle 4.9, build.gradle structure |
| `01-registry.md` | @EventBusSubscriber, RegistryEvent.Register (NO DeferredRegister!) |
| `02-block.md` | Block, BlockContainer, IBlockState |
| `03-item.md` | Item, ItemStack, ToolMaterial |
| `04-entity.md` | Entity, EntityLiving, IEntityAdditionalSpawnData |
| `05-events.md` | @SubscribeEvent, EventBusSubscriber, FML lifecycle events |
| `06-networking.md` | SimpleNetworkWrapper, PacketBuffer, MessageHandler |
| `07-datagen.md` | JSON manual writing (no DataGenerator in 1.12.2) |
| `08-client-server.md` | Proxy pattern, SideOnly, ClientProxy |
| `09-anti-patterns.md` | Common mistakes and fixes |
| `10-gui.md` | Container, IGuiHandler, GuiScreen |

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
├── ExampleMod.java         # @Mod entry point with @Init
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
| `@Init` method | Constructor with `FMLJavaModLoadingContext` |
| `SimpleNetworkWrapper` | `SimpleChannel` |
| `PacketBuffer` | `FriendlyByteBuf` |
| `IBlockState` | `BlockState` |
| `BlockContainer` | `EntityBlock` |
| `ItemStack` (damage int) | `ItemStack` (ItemStack) |
| `ToolMaterial` | `Tier` |
| `EnumCreatureAttribute` | (removed, use LivingEntity subclasses) |
