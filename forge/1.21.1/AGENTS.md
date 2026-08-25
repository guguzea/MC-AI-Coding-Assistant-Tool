# Forge 1.21.1 — 无教程树（draft）

本目录 **不是** 完整 00–10。`list_forge_versions` **不含** 1.21.1；`search_forge_docs version=1.21.1` 返回 VERSION_NOT_FOUND（当前仅到 1.20.4）。

改口：`list_forge_versions` 后再 `search_forge_docs`（不要假定 1.21.1 页）。**禁止**把 NeoForge 1.21.1 的 00–10 / DeferredHolder / PayloadHandlers 当 Forge 教程。
`detect_mod_project` / session 对本版规则树返回 `PACK_NOT_FOUND`。
不要用 1.20.4 规则改版本号冒充本档。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

