# LiteLoader 1.12.2 — Agent 总纲

纯客户端加载器。**不要**把 Forge `RegistryEvent` 改名交差。

## 两套入口

| 判定 | 读什么 |
|------|--------|
| 有 litemod.json / LiteMod，**无** javafml / @Mod | 只读本目录 |
| 两边都有，且 `apply plugin: 'net.minecraftforge.gradle.liteloader'` | 先读 [HYBRID.md](HYBRID.md)，再读 `forge/1.12.2` 的 01–03 + 本目录 05/08 |
| 分别 apply 标准 Forge 插件 **和** 另一个 LiteLoader 插件 | **拒绝**生成构建文件 |
| 两边元数据都在但无该专用插件 | **询问用户**，禁止默默当 Forge |

Java 8。映射：混合工程钉 `mappings = 'stable_39'`（社区 1.12.2 常见兼容值，来自当时 FG/LiteLoader 文档，不要臆造 snapshot）。

已核实 API（hempflower 镜像 / LiteMod 源码 + 2026-08-15 GitLab 1.12.2 打开）：

- `LiteMod`: `getVersion()`, `init(File)`, `upgradeSettings(...)`
- `Listener.getName()`
- `Tickable.onTick(Minecraft, float, boolean, boolean)`
- `ChatFilter.onChat` / `ChatListener.onChat`
- `OutboundChatListener.onSendChatMessage(CPacketChatMessage, String)`
- `HUDRenderListener.onPreRenderHUD/onPostRenderHUD(int, int)`
- `RenderListener.onRender / onRenderGui(GuiScreen) / onSetupCameraTransform`
- `PluginChannelListener.onCustomPayload(String, PacketBuffer)` + `getChannels()`（经 CommonPluginChannelListener；不要直接实现 Common*）

完整表：`knowledge/common/verified-api.md`。缺名则拒绝臆造。`query_api` 无 1.12 Parchment 完整树。`diagnose_gradle` 对 liteloader 插件走轻量模式。

### 本规则集的 IDE 加载优先级

| AI 助手 | 读取路径 |
|---------|---------|
| Cursor | `.cursor/rules/*.mdc` + `.cursor/skills/` |
| OpenCode / Codex / ZCode | `AGENTS.md` |
| Pi | `.pi/rules/*.md`（+ `AGENTS.md`） |

当上述路径不存在时，降级读取本文件和 `.cursor/`。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

