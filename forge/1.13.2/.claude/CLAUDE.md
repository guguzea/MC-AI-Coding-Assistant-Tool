# Forge 1.13.2 — AI Coding Assistant

This file contains Forge 1.13.2 mod development knowledge for AI coding assistants that support `CLAUDE.md`.
When you detect a Forge 1.13.2 project, read this file first.

---

## Platform Detection

```
IF src/main/resources/META-INF/mods.toml exists AND build.gradle contains "forge"
  → This is a Forge project

IF build.gradle contains "1.13.2"
  → Use Forge 1.13.2 rules

IF build.gradle contains "neoforge" OR "neogradle"
  → Use NeoForge rules instead
```

---

## Core Constraints

### Registry
- **Always use @EventBusSubscriber + RegistryEvent.Register<T>** — the standard Forge 1.13.2 pattern
- Never use `new Block(...)` without `setRegistryName()` — always register through events
- mod ID must match `mods.toml` exactly, all lowercase `[a-z0-9_]`

### Physical Side
- `@OnlyIn(Dist.CLIENT)` for rendering/input code
- `@OnlyIn(Dist.DEDICATED_SERVER)` for server logic
- Prefer `DistExecutor.runWhenOn()` over raw `@OnlyIn`

### Mappings
- Always use **MCP SRG names** for Forge 1.13.2

---

## Rule Files Reference

| File | Topic |
|------|-------|
| `00-project-setup.mdc` | Java 11, Gradle 6.9, build.gradle structure |
| `01-registry.mdc` | @EventBusSubscriber + RegistryEvent (most important) |
| `02-block.mdc` | Block, Block.Properties, setRegistryName |
| `03-item.mdc` | Item, Item.Properties, ItemGroup |
| `04-entity.mdc` | EntityType, LivingEntity, EntityRenderer |
| `05-events.mdc` | @SubscribeEvent, RegistryEvent, Dist checks |
| `06-networking.mdc` | SimpleNetworkWrapper, IMessage, DistExecutor |
| `07-datagen.mdc` | DataGen for 1.13.2 (limited) |
| `08-client-server.mdc` | @OnlyIn, DistExecutor, KeyBinding |
| `09-anti-patterns.mdc` | Common mistakes and fixes |
| `10-gui.mdc` | Container, IGuiHandler, Slot |

---

## Common Errors Checklist

1. `NullPointerException` on entity attribute → attributes registered too early
2. Block displays as missing (purple/black) → registered but missing resource files
3. "Resource location is invalid" → registry name has uppercase or `-`
4. Game crash in Mixin → trying to modify final fields in constructor
5. Not using `setRegistryName()` → content not registered

---

## Project Structure

```
src/main/java/com/example/mod/
├── ExampleMod.java         # @Mod entry point
├── registry/              # Registry event handlers
├── blocks/               # Block subclasses
├── items/                # Item subclasses
├── entities/             # Entity subclasses
├── init/                 # @SubscribeEvent classes
└── client/               # CLIENT ONLY: renderers, KeyBindings, Screens
```
