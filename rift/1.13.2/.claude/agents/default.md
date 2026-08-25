# Rift 1.13.2 — Agent 总纲

短命加载器。方法名 **只许** 来自 `knowledge/common/` 与已核实源码，**禁止**用 Fabric `ModInitializer` / `onInitialize` 记忆填写。

- 元数据官方拼写：**`riftmod.json`**（兼容误写 `rift.mod.json`）
- Gradle：`apply plugin: 'net.minecraftforge.gradle.tweaker-client'`
- Java 8；`tweakClass = 'org.dimdev.riftloader.launch.RiftLoaderClientTweaker'`
- dimdev.org maven 可能已死 → scaffold 用 `libs/` 备用，禁止写死失效仓库当唯一源
- `search_docs({platform:"rift"})` **不要**回退 Fabric 文档树
- `port_project` 对 Rift 默认 dryRun；Rift→Fabric 只出笔记

已核实 Listener 方法见 `knowledge/common/listeners.md`。

### 本规则集的 IDE 加载优先级

| AI 助手 | 读取路径 |
|---------|---------|
| Cursor | `.cursor/rules/*.mdc` + `.cursor/skills/` |
| OpenCode / Codex / ZCode | `AGENTS.md` |
| Pi | `.pi/rules/*.md`（+ `AGENTS.md`） |

当上述路径不存在时，降级读取本文件和 `.cursor/`。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

