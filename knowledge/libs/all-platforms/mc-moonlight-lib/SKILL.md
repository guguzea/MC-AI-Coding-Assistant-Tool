---
name: mc-moonlight-lib
description: Moonlight Lib（原 Selene）动态注册/资源库（MehVahdJukaar），动态注册、BlockSetAPI、村民 AI、流体系统。触发词：Moonlight、Moonlight Lib、Selene、MehVahdJukaar、动态注册、BlockSetAPI、Block Set、村民 AI、Supplementaries、Sawmill
platforms: [fabric, forge, neoforge]
mcVersions: ["1.16.5-1.21.1"]
communityDocId: authored/lib-moonlight
modrinthSlug: moonlight
---

> 数据读取日期：2026-09-14（源：Modrinth project/moonlight limit=100：release 上界 1.21.1（1.21.1-3.6.4，2026-09-10，fabric+neoforge），Forge 线 release 止 1.20.1（1.20-2.16.35，2026-09-07）；26.1.2 只有 4.0.x **beta**（4.0.2，2026-09-07）＝预发布，不是 release）
> 复核：curl.exe --ssl-no-revoke -sS "https://api.modrinth.com/v2/project/moonlight/version?limit=100" 后按 game_versions + loaders + version_type 重取上界（本轮 limit=100 覆盖不到低界时改定向 game_versions 查询）

# Moonlight Lib（原 Selene）集成（操作指引）

给 AI 的操作指引：目标 MC 版本 ≤ 1.21.1（release 窗口；26.1.2 只有 beta，见「定位」）且需要动态注册、BlockSetAPI、村民 AI、流体系统之一时，用 Moonlight Lib（曾用名 Selene）。详细信息用 `search_community_docs` 查 `authored/lib-moonlight`，API 细节以 [官方仓库](https://github.com/MehVahdJukaar/Moonlight) 当前 README 为准。

## 定位

- 能力：**动态注册**（运行时注册/动态资源，减少静态样板）、**BlockSetAPI**（把新方块接入原版方块族，楼梯/台阶/墙/栅栏/门等成套变体免手写）、**村民 AI**（给村民职业加自定义 AI 行为/任务）、**流体系统**（流体渲染与行为封装）
- 生态：MehVahdJukaar 出品，Supplementaries、Sawmill 等模组依赖，生态成熟（3690 万下载）
- 版本 / loader 边界（release 口径）：整体窗口 **1.16.5-1.21.1**（1.16.5 / 1.18 只有 Forge 构建，Fabric 有 release 的最低实测档是 1.19.2）
- **Forge 线 release 至少到 1.20.4**（A-43 更正 2026-09-19：原写「止于 1.20.1」与仓内 manifest 实证矛盾——`mcp-server/data/lib-manifests/all.json` 含 `moonlight-1.20.4-2.9.9-forge.jar`）；Fabric / NeoForge release 止于 **1.21.1** ⇒ 这两线 **1.21.4 / 1.21.10 / 1.21.11 零构建**（Forge 完整上界以 manifest 复核为准）
- **26.x 不是「无构建」，而是只有 beta**：`26.1.2-4.0.0 / 4.0.1 / 4.0.2`（**beta**，2026-09-07，Fabric+Neo 两路，无 Forge）。未 release ⇒ 不并入 mcVersions，也不按稳定支持写进兼容表
- 依据：Modrinth 实读 2026-09-13（逐版 `game_versions` + `loaders` 查询）

## Decision Flow

```
Decision: 要不要用 Moonlight Lib
→ 目标版本 > 1.21.1（如 1.21.4 / 1.21.11）→ 不用（release 无构建），自研或换方案
→ 目标 26.1.2 → 只有 4.0.x beta（Fabric/Neo，无 Forge）；用户没明确接受预发布就按未核实处理
→ 目标 ≤ 1.21.1 且需要 动态注册/BlockSet/村民 AI/流体 中 ≥1 项 → Moonlight
→ 只要注册抽象，不需要上述能力 → Architectury（见 mc-architectury）或 Balm（见 mc-balm）
→ 已选 Moonlight：
   ├─ 版本：1.16.5-1.21.1 内与 MC 对齐（文件页为准，先确认目标版本有对应构建，这是硬门槛）
   ├─ BlockSet：声明你要的方块族 → 库自动生成成套变体与模型，别手写变体注册
   └─ 村民 AI：通过其注册入口挂任务，别直接改原版 GoalSelector
```

## 接入检查顺序

1. `build.gradle`：官方 README 的 maven 仓库与坐标照抄；Fabric 用 Loom `modImplementation`，Forge/Neo 对应配置
2. `fabric.mod.json` / `mods.toml` / `neoforge.mods.toml`：`depends` 写 `moonlight`；软依赖门闩见 `authored/soft-deps-modlist`
3. 从旧项目升级：留意曾用名 Selene 的坐标/包名差异，以当前 README 为准

## 核心 API 速查

类名/包名以官方 README 为准（核对记录：1.20.1/fabric 顶层包 `net.mehvahdjukaar.moonlight`），下面只列能力与流程：

- **动态注册**：用其注册入口登记方块/物品（比手写 DeferredRegister 样板少）
- **BlockSetAPI**：把新方块声明进目标方块族（如原版石头族），库补全楼梯/台阶/墙等变体与模型；生成的内容也要补语言文件与掉落物，别漏
- **村民 AI**：给职业注册额外 AI 任务（寻路/交互），只在服务端逻辑生效，渲染/音效归客户端
- **流体系统**：用其流体工具注册与渲染，别手写渲染管线；动态资源名守 modId 命名规则

## 常见错误

- **在 1.21.4+ 项目里声明 moonlight 依赖** → 找不到构建或启动崩溃（最常见）；Forge 工程高于 1.20.1 同样没有构建；26.1.2 只有未 release 的 4.0.x beta
- 用了 BlockSet 却没给变体补掉落物/合成 → 方块获取不到
- 把村民 AI 逻辑写进客户端类 → 专用服异常
- 只 `compileOnly` 却硬依赖 → 未装 Moonlight 时 `NoClassDefFoundError`
- 混用新旧坐标（Selene vs Moonlight）→ 依赖解析失败

## 参考

- 官方：https://github.com/MehVahdJukaar/Moonlight
- 社区：`search_community_docs` → `authored/lib-moonlight`；相关：`authored/library-catalog-2026`、`authored/soft-deps-modlist`
- 相关 Skill：`mc-block`、`mc-villager`、`mc-fluid`、`mc-model`、`mc-architectury`
- 不确定时：打开官方 README + 示例 mod（Supplementaries 源码是现成范例），未核对前不写死任何类名/方法签名
