---
name: mc-server-translations
description: Server Translations API 服务端翻译库（NucleoidMC），服务端按玩家语言渲染可翻译文本。触发词：Server Translations、Server Translations API、服务端翻译、服务端 i18n、Nucleoid、可翻译文本、translatable、Server I18n
platforms: [fabric, forge, neoforge]
mcVersions: []
communityDocId: authored/lib-server-translations
---

# Server Translations API 服务端翻译（操作指引）

给 AI 的操作指引：服务端要向不同语言玩家发送「按各自语言渲染」的可翻译文本（聊天、命令输出、GUI、书等）时，用 Server Translations API。详细信息用 `search_community_docs` 查 `authored/lib-server-translations`，版本、maven 坐标与 API 细节以 [官方仓库](https://github.com/NucleoidMC/server-translations-api) 当前 README 为准。

## 定位

- 能力：把原版 `translatable` 组件在**服务端**解析成玩家自己的语言，而不是统一英文或硬编码单一语言
- 生态：NucleoidMC 出品，Fabric / Forge / NeoForge 三端有构建；**Modrinth 页面已下架**，分发走 maven.nucleoid.xyz；替代品 Server I18n API（Nucleoid 生态）
- 版本 / loader 边界：三端（F/Forge/Neo），**版本以 GitHub Releases 为准**（短文未标注版本区间）；禁止引用已下架的 Modrinth 文件页/下载页

## Decision Flow

```
Decision: 服务端文本要不要按玩家语言渲染
→ 客户端必然装有你的 mod / 无多语言需求 → 原版 translatable component（客户端自行翻译）
→ 只需要服务端发送固定文本 → 普通 Component 就够，不引库
→ 想用占位符生态 → Text Placeholder API（见 mc-text-placeholder）
→ 需要服务端按玩家语言渲染 → Server Translations API
   ├─ 分发：Modrinth 页面已下架，禁止引用其文件页/下载页；build.gradle 配 maven.nucleoid.xyz 仓库 + 坐标（以 README 为准）
   ├─ 平台分支：Fabric / Forge / NeoForge 均有构建（以 GitHub Releases 为准）
   └─ 替代品：Server I18n API（Nucleoid 生态）也可考虑，按维护状态与需求取舍
```

## 接入检查顺序

1. `build.gradle`：maven.nucleoid.xyz 仓库 + 依赖坐标，照 README 抄（compileOnly / runtimeOnly 或 Loom 的 modImplementation）
2. `fabric.mod.json` / `mods.toml`（26.x 为 `neoforge.mods.toml`）：`depends` / `suggests` 声明（软依赖门闩见 `authored/soft-deps-modlist`）
3. 版本核对：**不看 Modrinth（已下架）**，以 GitHub Releases / maven.nucleoid.xyz 上的版本为准

## 核心 API 速查

类名、包名与方法签名以官方 README + 示例为准（暂未反编译核对，catalog 无 verifiedApi；勿照抄旧版本教程），下面只列能力与流程：

- **文本传递**：把可翻译文本以 translatable 组件（key + 参数）形式交给库，**不要把已拼好的字符串交给库**；服务端按玩家语言渲染后再发送
- **渲染/发送流程**：构建组件（key + 参数）→ 交给库的渲染/发送入口 → 各玩家收到自己语言的文本
- **语言资源**：确认翻译 key 有对应语言文件，缺语言时回退行为以库文档为准
- 端边界：服务端渲染逻辑与客户端 UI 解耦，客户端只显示收到的文本

## 常见错误

- 按「Modrinth 依赖解析 / 文件页」方式装 → 页面已下架，改用 maven.nucleoid.xyz + 坐标
- 以为库会翻译「已发送的字符串」 → 文本必须以组件形式传递
- 只 `compileOnly` 却当硬依赖用 → 玩家未装时 `NoClassDefFoundError`
- 语言文件只放客户端 → 服务端渲染时可能缺对应语言（回退规则以库文档为准）

## 参考

- 官方：https://github.com/NucleoidMC/server-translations-api ；替代品 Server I18n API 见 Nucleoid 生态（以官方仓库说明为准）
- 社区：`search_community_docs` → `authored/lib-server-translations`；相关：`authored/library-catalog-2026`、`authored/soft-deps-modlist`
- 相关 Skill：`mc-command`、`mc-networking`、`mc-config`、`mc-text-placeholder`
- 不确定时：打开 Server Translations API README + 示例；`search_fabric_docs` 查文本/服务端相关页；未核对前不写死任何类名/方法签名
