---
id: authored/lib-modern-ui
title: Modern UI 现代文本排版与 GUI 库要点
tags: [modern-ui, modernui, gui, text-rendering, unicode, fabric, forge, neoforge]
summary: 现代文本排版引擎（中文/Unicode 渲染友好：SDF 抗锯齿、字体回退、HarfBuzz 整形）+ GUI API，F/Forge/Neo，中文模组圈使用率高。官方仓库 BloCamLimb/ModernUI-MC。
mcHint: 1.18.2+（以官方 Releases 为准）
minecraftVersions: "1.18.2+（以官方 Releases 为准）"
sourceKind: authored
modIds: [modernui]
loaders: [fabric, forge, neoforge]
modrinthSlug: modern-ui
role: api
skillId: mc-modern-ui
---

# Modern UI 现代文本排版与 GUI 库要点

自写短文。版本与 API 细节以 [ModernUI-MC](https://github.com/BloCamLimb/ModernUI-MC) 当前 README 与 Releases 为准（注意：仓库地址为 BloCamLimb/ModernUI-MC，旧地址 Block-Network/ModernUI 已失效）。

## 何时用 / 何时不用

用：对文本渲染质量有硬需求的模组，尤其是中文/Unicode/emoji 场景。Modern UI 内置现代文本布局与渲染引擎（SDF 抗锯齿、FreeType 字体微调、更完善的字体回退、HarfBuzz 整形、Unicode 断行/BiDi、Noto Color Emoji），并附带 GUI 控件 API。中文模组圈使用率高（全览 §二.6）。

不用（重要）：

- 纯服务端模组 → 渲染无关，别引
- 原版文本渲染够用 → 不必引，引了会接管/优化原版文本管线，影响面大
- 只想做配置屏 → Cloth / YACL 更对口（`lib-cloth-config`）
- 与渲染管线（Sodium/Iris 等）的兼容要逐个版本确认，不能想当然

## Decision Flow

```
Decision: 用不用 Modern UI
→ 纯服务端 / 无界面需求 → 不用
→ 只要配置屏 → Cloth / YACL
→ 中文/Unicode/emoji 文本渲染质量是硬需求 → 用
→ 要现成 GUI 控件 + 现代排版 → 用（GUI API + 文本引擎一体）
→ 已选 Modern UI：
   ├─ 版本：以官方 Releases 为准（1.18.2+；26.x 是否跟进看 Releases，官方侧重 LTS）
   ├─ 依赖：按 README 声明（Fabric / Forge / NeoForge 分支各自安装）
   ├─ 客户端专用：渲染与 GUI 全部 client 侧
   └─ 兼容：与 Sodium / Iris / OptiFine 组合逐个版本验证（Releases 有对应兼容说明）
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：按官方 README 的仓库与坐标（Fabric 用 `modImplementation`，Forge/Neo 对应平台坐标；以 README 为准）
2. `fabric.mod.json` / `mods.toml`：依赖声明写 modernui；Modrinth slug 为 `modern-ui`（下载页仍在，勿与仓库名混淆）
3. 版本核对：Modern UI 版本号独立于 MC 版本（如 3.9.x），以 Releases 上的「对应 MC 版本」为准

## 集成要点（伪代码级）

```java
// 文本引擎：装上后原版/模组文本即受益，无需改代码（对 Unicode 渲染友好）
// GUI API：用其控件与布局构建界面（类名/包名以官方 Javadoc/README 为准）
// 客户端专用：所有调用放 client 侧，公共代码只留客户端门闩
// 自定义字体/回退：按官方 API 注册字体家族与回退顺序
```

- 文本配置（字体回退、阴影、原始字号）用户可调，别在模组里写死
- 用 GUI API 时先读官方示例，控件体系与原版 Screen 不同

## 常见坑

- 只 `compileOnly` 却当硬依赖用 → 未装 Modern UI 时 `NoClassDefFoundError`
- 期待 26.x 自动跟进 → 以 Releases 为准，官方侧重 LTS，必要时评估社区维护分支（如 mVUS）
- 忽略与 Sodium/Iris 的兼容性 → 渲染异常/黑屏，逐版本验证
- 把文本引擎当"模组内功能"写死配置 → 引擎是全局的，尊重用户配置

## 自检清单

- 只装 Modern UI（不装依赖它的模组）时游戏正常，中文/emoji 渲染明显改善
- 装了你的模组后，中文界面无乱码/错位，字体回退正常
- `runServer` 无 Modern UI 类加载
- 目标 MC 版本在 Releases 上有对应构建，构建无 API 报错

## 交叉引用

- MCP：`check_dependencies`、`search_community_docs`
- Skill：`mc-modern-ui`；相关：`mc-gui`、`mc-renderer`
- 全览：§二.6 GUI/UI 库；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://github.com/BloCamLimb/ModernUI-MC ；Modrinth：https://modrinth.com/mod/modern-ui
- 不清楚时：打开 ModernUI-MC README + Releases；`search_fabric_docs` / `search_forge_docs` 查渲染/GUI 相关页；AGENT_USAGE.md 规则先行
