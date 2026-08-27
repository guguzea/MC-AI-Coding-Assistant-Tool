# Forge 1.16.5 — AI Coding Assistant

This file contains Forge 1.16.5 mod development knowledge for AI coding assistants that support `CLAUDE.md`.
When you detect a Forge 1.16.5 project, read this file first.

---

## Platform Detection

```
IF src/main/resources/META-INF/mods.toml exists AND build.gradle contains "forge"
  → This is a Forge project

IF build.gradle contains "1.16.5"
  → Use Forge 1.16.5 rules

IF build.gradle contains "neoforge" OR "neogradle"
  → Use NeoForge rules instead
```

---

## Core Constraints

### Registry
- **Always use DeferredRegister** — the official Forge 1.16.5 recommended pattern
- Never use `new Block(...)` — always register through events
- mod ID must match `mods.toml` exactly, all lowercase `[a-z0-9_]`

### Physical Side
- `@OnlyIn(Dist.CLIENT)` for rendering/input code
- `@OnlyIn(Dist.DEDICATED_SERVER)` for server logic
- Prefer `DistExecutor.unsafeRunWhenOn()` over raw `@OnlyIn`

### Mappings
- Always use **Parchment names** (e.g., `LivingEntity#getHealth`, not `func_70024_e`)

---

## Rule Files Reference

| File | Topic |
|------|-------|
| `00-project-setup.mdc` | Java 11, Gradle 7.x, build.gradle structure |
| `01-registry.mdc` | DeferredRegister, RegistryObject (most important) |
| `02-block.mdc` | Block, ITileEntityProvider, TileEntity |
| `03-item.mdc` | Item, SwordItem, ArmorItem, Food |
| `04-entity.mdc` | EntityType, CreatureEntity, EntityRenderer |
| `05-events.mdc` | @SubscribeEvent, Bus.FORGE vs Bus.MOD |
| `06-networking.mdc` | NetworkInstance, IMessage, DistExecutor |
| `07-datagen.mdc` | GatherDataEvent, RecipeProvider, LootTableProvider |
| `08-client-server.mdc` | @OnlyIn, DistExecutor, KeyBinding |
| `09-anti-patterns.mdc` | Common mistakes and fixes |
| `10-gui.mdc` | ContainerType, AbstractContainerMenu, Screen |

---

## Common Errors Checklist

1. `NullPointerException` on entity attribute → attributes registered too early
2. Block displays as missing (purple/black) → registered but missing resource files
3. "Resource location is invalid" → registry name has uppercase or `-`
4. NPE in TileEntity.load() → world accessed before fully loaded
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
<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程（从零建工程 / 完整新方块 / GUI / 崩溃分诊 / 移植 / 真机循环 / 汉化 / 发布 / 反编译研究）才调 `get_workflow_template`；改已有代码、补方法、查文档走规则 + Skill + `search_*_docs`，不要先调工作流。

- 汉化：`localize_mod`（diff / draft_zh / jar extract / pack_draft；无机器翻译）。
- 崩溃分诊：`crash_analyze`。
- 发布：`mc-publish` 工作流 + `check_publish_ready`；不代跑 Gradle、不拷 jar、不上传。
- 写盘 / Gradle / 拷 jar / 上传均须用户确认（人在环）。
