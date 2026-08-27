# Forge 1.18.2 — AI Coding Assistant

This file contains Forge 1.18.2 mod development knowledge for AI coding assistants that support `CLAUDE.md`.
When you detect a Forge 1.18.2 project, read this file first.

---

## Platform Detection

```
IF src/main/resources/META-INF/mods.toml exists AND build.gradle contains "forge"
  → This is a Forge project

IF build.gradle contains "1.18.2"
  → Use Forge 1.18.2 rules

IF build.gradle contains "neoforge" OR "neogradle"
  → Use NeoForge rules instead
```

---

## Core Constraints

### Registry
- **Always use DeferredRegister** — the official Forge 1.18.2+ recommended pattern
- Never use `new Block(...)` — always register through events
- mod ID must match `mods.toml` exactly, all lowercase `[a-z0-9_]`

### Physical Side
- `@OnlyIn(Dist.CLIENT)` for rendering/input code
- `@OnlyIn(Dist.DEDICATED_SERVER)` for server logic
- Prefer `DistExecutor.unsafeRunWhenOn()` over raw `@OnlyIn`

### Mappings
- Always use **Parchment names** (e.g., `LivingEntity#getHealth`, not `func_70024_e`)
- Parchment provides parameter names and javadocs for better code readability

### World Height (Caves & Cliffs)
- 1.18.2 introduced expanded world height: Y=-64 to Y=320
- Total height: 384 blocks (vs 256 in older versions)

---

## Rule Files Reference

| File | Topic |
|------|-------|
| `00-project-setup.mdc` | Java 17, Gradle 7.x, build.gradle structure |
| `01-registry.mdc` | DeferredRegister, RegistryObject (most important) |
| `02-block.mdc` | Block, EntityBlock, BlockEntity |
| `03-item.mdc` | Item, SwordItem, ArmorItem, FoodProperties |
| `04-entity.mdc` | EntityType, LivingEntity, EntityRenderer |
| `05-events.mdc` | @SubscribeEvent, Bus.FORGE vs Bus.MOD |
| `06-networking.mdc` | SimpleChannel, IMessage, DistExecutor |
| `07-datagen.mdc` | GatherDataEvent, RecipeProvider, LootTableProvider |
| `08-client-server.mdc` | @OnlyIn, DistExecutor, KeyBinding |
| `09-anti-patterns.mdc` | Common mistakes and fixes |
| `10-gui.mdc` | MenuType, AbstractContainerMenu, Screen |

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

---

## Version-Specific Notes

### Forge 1.18.2 Key Specs
- Minecraft: 1.18.2
- Forge: 40.1.x
- Java: 17
- Mappings: Parchment (1.18.2-2022.08.02)
- pack_format: 8
- World height: -64 to 320
- Gradle: 7.x
- ForgeGradle: 5.x
<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程（从零建工程 / 完整新方块 / GUI / 崩溃分诊 / 移植 / 真机循环 / 汉化 / 发布 / 反编译研究）才调 `get_workflow_template`；改已有代码、补方法、查文档走规则 + Skill + `search_*_docs`，不要先调工作流。

- 汉化：`localize_mod`（diff / draft_zh / jar extract / pack_draft；无机器翻译）。
- 崩溃分诊：`crash_analyze`。
- 发布：`mc-publish` 工作流 + `check_publish_ready`；不代跑 Gradle、不拷 jar、不上传。
- 写盘 / Gradle / 拷 jar / 上传均须用户确认（人在环）。
