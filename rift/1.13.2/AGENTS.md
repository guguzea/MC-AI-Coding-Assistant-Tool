# Rift 1.13.2 — Agent 总纲

短命加载器。方法名 **只许** 来自 `knowledge/common/` 与已核实源码，**禁止**用 Fabric `ModInitializer` / `onInitialize` 记忆填写。

- 元数据官方拼写：**`riftmod.json`**（兼容误写 `rift.mod.json`）
- 版本支持（2026-10-06 用户裁定 + GitHub API 同日核）：**原生线只到 MC 1.13**（最终原生版 `1.0.4-105`；tag `v1.0.4-86/87/105/106` 同指 master `dfc75ff725`，`build.gradle` 自标 `1.13`）；**1.13.1/1.13.2 = Chocohead 社区分支** `newerer`（自标 `1.13.1`）/ `newerest`（自标 `1.13.2`）支持，JitPack 上无已取到的成品 ⇒ 本档 scaffold 用原生件 `1.0.4-106`（非 dev），2026-10-05 真机实测 1.13.2「能启动但 listener 不派发」（hook mixin 目标是 1.13 notch 名）。详 `knowledge/common/bridge-api.md` §3.3 第 3 条
- Gradle：`apply plugin: 'net.minecraftforge.gradle.tweaker-client'`
- Java 8；`tweakClass = 'org.dimdev.riftloader.launch.RiftLoaderClientTweaker'`
- dimdev.org maven **已死**（2026-10-05 实测 DNS ENOTFOUND，非 404）→ scaffold 用 `libs/` 自备件（JitPack `com.github.DimensionalDevelopment:Rift:1.0.4-106`，**非 dev**；取法见 `scaffold/libs/README.md`），禁止写死失效仓库当唯一源
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

不要为本档新写 `mc-config` Skill。配置**原则**走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md`（工作流 `mc-config`）；**不要**对本档调用 `generate_config`——该工具当前平台面不含 LiteLoader / Rift / ModLoader（A-43 更正：原稿把它写成可用路径）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程（从零建工程 / 完整新内容 / 分诊 / 发布）才调 `get_workflow_template`；改已有代码、补方法、查文档走规则 + Skill，不要先调工作流。
- 写盘 / 拷贝文件 / Gradle 均须用户确认（人在环）。
