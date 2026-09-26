---
name: mc-modern-ui
description: Modern UI 现代文本排版与 GUI 库。中文/Unicode/emoji 渲染（SDF 抗锯齿、字体回退、HarfBuzz）+ GUI 控件 API。触发词：Modern UI、modernui、modern-ui、排版、Unicode、字体渲染、中文渲染
platforms: [fabric, forge, neoforge, quilt]
mcVersions: ["1.18.1-26.1.2"]
mcVersionsByPlatform: "fabric=1.20-26.1.2; neoforge=1.20-26.1.2; quilt=1.20-1.21.3"
communityDocId: authored/lib-modern-ui
modrinthSlug: modern-ui
mappings: "库按各 loader 预重映射；GUI/渲染全部客户端侧，与项目 mappings 无直接交互"
---

> 数据读取日期：2026-09-14（源：Modrinth project/modern-ui 版本表 limit=100；本轮 release 上界 fabric=26.1.2 / forge=26.1.2 / neoforge=26.1.2）
> 复核：curl.exe --ssl-no-revoke -sS "https://api.modrinth.com/v2/project/modern-ui/version?limit=100" 后按 game_versions + loaders + version_type 取上界

# Modern UI 文本排版与 GUI（操作指引）

给 AI 的操作指引：对文本渲染质量有硬需求（尤其中文/Unicode/emoji）时引入 Modern UI，或直接用其 GUI 控件 API。详细信息用 `search_community_docs` 查 `authored/lib-modern-ui`，版本与 API 细节以 [官方仓库 ModernUI-MC](https://github.com/BloCamLimb/ModernUI-MC) 当前 README 与 Releases 为准（**注意仓库是 BloCamLimb/ModernUI-MC，旧地址 Block-Network/ModernUI 已失效**）。

## 何时用 / 何时不用

- 用：中文/Unicode/emoji 文本渲染质量是硬需求；要现成 GUI 控件 + 现代排版一体
- 不用：纯服务端模组（渲染无关）；原版文本渲染够用（引了会接管/优化原版文本管线，影响面大）；只想做配置屏（Cloth / YACL 更对口）

## Decision Flow

```
Decision: 用不用 Modern UI
→ 纯服务端 / 无界面需求 → 不用
→ 只要配置屏 → Cloth / YACL（mc-config）
→ 中文/Unicode/emoji 渲染质量是硬需求 → 用
→ 要现成 GUI 控件 + 现代排版 → 用（GUI API + 文本引擎一体）
→ 已选：
   ├─ 平台分支：fabric / forge / neoforge 各按 README 声明依赖（Modrinth slug 为 modern-ui，勿与仓库名混淆）
   ├─ 版本：以官方 Releases 为准（实测窗口 1.18.1–26.1.2，截至 2026-09-04；26.2 无构建；**1.18.1 / 1.18.2 命中的构建 loaders 只有 forge**）
   ├─ 客户端专用：渲染与 GUI 全部 client 侧
   └─ 兼容：与 Sodium / Iris / OptiFine 组合逐个版本验证（Releases 有对应兼容说明）
```

## 操作步骤

1. 依赖声明：`build.gradle` 照官方 README 的仓库与坐标（Fabric 用 `modImplementation`，Forge/Neo 用对应平台坐标）
2. 声明依赖：`fabric.mod.json` / `mods.toml` 的 `depends` 写 `modernui`；软依赖门闩见 `authored/soft-deps-modlist`
3. 版本核对：Modern UI 版本号独立于 MC 版本（如 3.9.x），以 Releases 上的「对应 MC 版本」为准，别拿版本号猜
4. 文本引擎：装上后原版/模组文本即受益，无需改代码；自定义字体/回退按官方 API 注册字体家族与回退顺序
5. GUI：用其控件与布局构建界面（类名/包名以官方 Javadoc/README 为准；控件体系与原版 Screen 不同，先读官方示例）
6. 客户端隔离：所有调用放 client 侧，公共代码只留客户端门闩；`runServer` 不得加载 Modern UI 类

## 软 / 硬依赖

- 硬依赖：`depends` 写 modernui；只 `compileOnly` 却当硬依赖用 → 未装时 `NoClassDefFoundError`
- 文本配置（字体回退、阴影、原始字号）用户可调，别在模组里写死，引擎是全局的
- 与渲染管线（Sodium/Iris/OptiFine）的兼容要逐个版本确认，不能想当然

> **Quilt 侧安装口径（2026-09-24 补）**：本 Skill 的 `platforms` 含 `quilt`，依据是本仓构件快照 `mcp-server/data/lib-manifests/all.json` 里 slug `modern-ui` 的 **8 条 `loader:"quilt"` 构件行**（本轮现算，as-of 2026-09-24；窗口终点见 frontmatter `mcVersionsByPlatform`）。这 8 条的**文件名 0 条带 `quilt` 字样**（形如 `ModernUI-Fabric-1.20.1-3.12.0.1-universal.jar`）⇒ 实况是 **Quilt 按同 MC 版本的 Fabric 构件加载**，上面「操作步骤 1」说的 Fabric 坐标对 Quilt 同样适用。⚠️ **Quilt 专属 maven 仓库 URL / artifact 坐标未核实**：本仓只核到构件文件名，没核到 Gradle 声明串 ⇒ **禁止**照本文默写 `maven { url }` / `modImplementation` 一行。要坐实：`query_upstream_releases`（`modrinth`，slug=`modern-ui`）列 quilt 构件清单，或拿到实际 jar 后 `ingest_loader_api` 逐签名核。

## 常见错误

- 只 `compileOnly` 却当硬依赖用 → 运行时 `NoClassDefFoundError`
- 期待 26.x 自动跟进 → 以 Releases 为准，官方侧重 LTS，必要时评估社区维护分支（如 mVUS）
- 忽略与 Sodium/Iris 的兼容性 → 渲染异常/黑屏，逐版本验证
- 把文本引擎当「模组内功能」写死配置 → 引擎是全局的，尊重用户配置

## 自检清单

- 只装 Modern UI（不装依赖它的模组）时游戏正常，中文/emoji 渲染明显改善
- 装了你的模组后，中文界面无乱码/错位，字体回退正常
- `runServer` 无 Modern UI 类加载
- 目标 MC 版本在 Releases 上有对应构建，构建无 API 报错

## 参考

- 官方：https://github.com/BloCamLimb/ModernUI-MC ；Modrinth：https://modrinth.com/mod/modern-ui
- 社区：`search_community_docs` → `authored/lib-modern-ui`
- 相关 Skill：`mc-gui`、`mc-renderer`、`mc-config`
- 不确定时：打开 ModernUI-MC README + Releases，未核对前不写死任何类名/方法签名
