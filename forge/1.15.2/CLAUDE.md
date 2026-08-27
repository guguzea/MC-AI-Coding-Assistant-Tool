# Forge 1.15.2 — AI Coding Assistant

This file contains Forge 1.15.2 mod development knowledge for AI coding assistants that support `CLAUDE.md`.
When you detect a Forge 1.15.2 project, read this file first.

---

## Platform Detection

```
IF src/main/resources/META-INF/mods.toml exists AND build.gradle contains "forge"
  → This is a Forge project

IF build.gradle contains "1.15.2"
  → Use Forge 1.15.2 rules

IF build.gradle contains "neoforge" OR "neogradle"
  → Use NeoForge rules instead
```

---

## Core Constraints

### Registry
- **Always use DeferredRegister** — the official Forge 1.15.2 recommended pattern
- Never use `new Block(...)` — always register through events
- mod ID must match `mods.toml` exactly, all lowercase `[a-z0-9_]`

### Physical Side
- `@OnlyIn(Dist.CLIENT)` for rendering/input code
- `@OnlyIn(Dist.DEDICATED_SERVER)` for server logic
- Prefer `DistExecutor.unsafeRunWhenOn()` over raw `@OnlyIn`

### Mappings
- Always use **MCP names** (Forge 1.15.2 uses MCP mappings)

---

## Rule Files Reference

| File | Topic |
|------|-------|
| `00-project-setup.mdc` | Java 11, Gradle 7.x, build.gradle structure |
| `01-registry.mdc` | DeferredRegister, RegistryObject (most important) |
| `02-block.mdc` | Block, ITileEntityProvider, TileEntity |
| `03-item.mdc` | Item, SwordItem, ArmorItem, Food |
| `04-entity.mdc` | EntityType, LivingEntity, EntityRenderer |
| `05-events.mdc` | @SubscribeEvent, Bus.FORGE vs Bus.MOD |
| `06-networking.mdc` | SimpleChannel, IMessage, DistExecutor |
| `07-datagen.mdc` | GatherDataEvent, RecipeProvider, LootTableProvider |
| `08-client-server.mdc` | @OnlyIn, DistExecutor, KeyBinding |
| `09-anti-patterns.mdc` | Common mistakes and fixes |
| `10-gui.mdc` | ContainerType, Container, Screen |

---

## Common Errors Checklist

1. `NullPointerException` on entity attribute → attributes registered too early
2. Block displays as missing (purple/black) → registered but missing resource files
3. "Resource location is invalid" → registry name has uppercase or `-`
4. NPE in TileEntity.readFromNBT() → world accessed before fully loaded
5. Mixin errors → trying to modify final fields in constructor

---

## Project Structure

```
src/main/java/com/example/mod/
├── ExampleMod.java         # @Mod entry point
├── registry/              # DeferredRegister classes
├── blocks/               # Block subclasses
├── items/                # Item subclasses
├── entities/             # Entity subclasses, TileEntity
├── init/                 # @SubscribeEvent classes
└── client/               # CLIENT ONLY: renderers, KeyBindings, Screens
```

---

## Forge 1.15.2 API Notes

| 1.15.2 | 1.20.x |
|---------|---------|
| `Block.Properties.create(Material)` | `Block.Properties.of(Material)` |
| `TileEntity` | `BlockEntity` |
| `IItemTier` | `Tier` |
| `Food.Builder()` | `FoodProperties.Builder()` |
| `ItemGroup` | `CreativeModeTab` |
| `SharedMonsterAttributes` | `Attributes` |
| `EntityClassification` | `MobCategory` |
