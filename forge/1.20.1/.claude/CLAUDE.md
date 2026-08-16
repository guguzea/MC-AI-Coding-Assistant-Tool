# Forge 1.20.1 — AI Coding Assistant

This file contains Forge 1.20.1 mod development knowledge for AI coding assistants that support `CLAUDE.md`.
When you detect a Forge 1.20.1 project, read this file first.

---

## Platform Detection

```
IF src/main/resources/META-INF/mods.toml exists AND build.gradle contains "forge"
  → This is a Forge project

IF build.gradle contains "1.20.1"
  → Use Forge 1.20.1 rules

IF build.gradle contains "neoforge" OR "neogradle"
  → Use NeoForge rules instead
```

---

## Core Constraints

### Registry
- **Always use DeferredRegister** — the official Forge 1.20.1 recommended pattern
- Never use `new Block(...)` — always register through events
- mod ID must match `mods.toml` exactly, all lowercase `[a-z0-9_]`

### Physical Side
- `@OnlyIn(Dist.CLIENT)` for rendering/input code
- `@OnlyIn(Dist.DEDICATED_SERVER)` for server logic
- Prefer `DistExecutor.unsafeRunWhenOn()` over raw `@OnlyIn`

### Mappings
- Always use **MCP names** (e.g., `LivingEntity#getHealth`, not `func_70024_e`)

---

## Rule Files Reference

| File | Topic |
|------|-------|
| `00-project-setup.md` | Java 17, Gradle 8.4, build.gradle structure |
| `01-registry.md` | DeferredRegister, RegistryObject (most important) |
| `02-block.md` | Block, EntityBlock, BlockEntity |
| `03-item.md` | Item, SwordItem, ArmorItem, FoodProperties |
| `04-entity.md` | EntityType, LivingEntity, EntityRenderer |
| `05-events.md` | @SubscribeEvent, Bus.FORGE vs Bus.MOD |
| `06-networking.md` | SimpleChannel, IMessage, DistExecutor |
| `07-datagen.md` | GatherDataEvent, RecipeProvider, LootTableProvider |
| `08-client-server.md` | @OnlyIn, DistExecutor, KeyBinding |
| `09-anti-patterns.md` | Common mistakes and fixes |
| `10-gui.md` | MenuType, AbstractContainerMenu, Screen |

---

## Common Errors Checklist

1. `NullPointerException` on entity attribute → attributes registered too early
2. Block displays as missing (purple/black) → registered but missing resource files
3. "Resource location is invalid" → registry name has uppercase or `-`
4. NPE in BlockEntity.load() → world accessed before fully loaded
5. Game crash in Mixin → trying to modify final fields in constructor

---

## Project Structure

```
src/main/java/com/example/mod/
├── ExampleMod.java         # @Mod entry point
├── registry/              # DeferredRegister classes
├── blocks/               # Block subclasses
├── items/                # Item subclasses
├── entities/             # Entity subclasses
├── init/                 # @SubscribeEvent classes
└── client/               # CLIENT ONLY: renderers, KeyBindings, Screens
```
