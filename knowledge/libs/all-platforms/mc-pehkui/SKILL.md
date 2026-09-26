---
name: mc-pehkui
description: Pehkui 实体缩放 API。按 20+ 缩放类型分别控制实体尺寸（身高/宽度/视距/命中盒），平滑过渡动画。触发词：Pehkui、pehkui、缩放、scale、resize、实体尺寸
platforms: [fabric, forge, neoforge, quilt]
mcVersions: ["1.14.4-1.21.1"]
mcVersionsByPlatform: "fabric=1.14.4-1.21.1; quilt=1.14.4-1.21.1; forge=1.14.4-1.20.1; neoforge=1.20.1-1.21.1"
communityDocId: authored/lib-pehkui
modrinthSlug: pehkui
mappings: "库按各 loader 预重映射；Fabric ≤1.21.x 为 yarn、Forge 为 MCP，经依赖坐标自动匹配"
---

> 数据读取日期：2026-09-14（源：Modrinth project/pehkui 版本表 limit=100；本轮 release 上界 fabric=1.21.1 / forge=1.20.1 / neoforge=1.21.1 / quilt=1.21.1）
> **构件面复测（as-of 2026-09-25，源 = `mcp-server/data/lib-manifests/all.json` 重抓后的完整面 49 slug / 3003 行；探针 `node temp/ralph-20260922/_v45-ceilings.mjs` → `temp/ralph-20260922/logs/r45-ceilings.log`，逐 loader 明细见 `logs/r45-loaderlegs.log`）：`pehkui` 该 slug 现 83 行，逐 loader 的 release 上界 = fabric 1.21.1 / **forge 1.20.1** / neoforge 1.21.1 / quilt 1.21.1，与上面 09-14 直读逐字相同 ⇒ 翻页重抓没有挪动本库任何窗口终点。**唯一真正的过称在 Forge 侧**：union 上界 1.21.1 由 fabric/neoforge/quilt 撑起，Forge 工程按 union 会拿到 1.21 与 1.21.1，而构件面 Forge 的 release 只到 1.20.1（10 行，无 beta）⇒ 本轮补 `mcVersionsByPlatform` 把 Forge 收到 1.20.1。**
> ⚠️ **取上界时必须剔除「被标成 release 的非点分版本 id」**：本 slug 有 **26 行** `versionType=release` 却长着快照 / rc / pre 的 id（`21w14a` · `21w18a` · `21w20a` · `21w41a` · `21w42a` · `22w11a` · `22w12a` · `22w14a` · `22w17a` · `22w19a` · `22w43a` · `23w14a` · `1.19-pre3` · `1.19.1-rc1` · `1.20-pre4` · `1.20-pre6` · `1.21-rc1`），按字典序或按前导数字取最大值会把 `23w14a` 排到 1.21.1 **之上**并给出一个假上界。本行与门 `assert-lib-session-resolve-parity.mjs` 判据④ 同口径 = `versionType==="release"` **且** `gameVersion` 形如 `^\d+(\.\d+)*$` 的最大值。
> **下界一律不按构件面取**：该面每版本只留 primary 一个构件（`scripts/build-lib-manifest.mjs:209`），同版本兄弟加载器的件会被丢 —— 例如 Forge 行最早 1.16.5，而 Pehkui 历史上发过 `Pehkui-2.5.2+1.14.4-1.18.jar` 这类跨 1.14.4-1.18 的单件 ⇒ 构件面能证「上界到此」，证不了「下界从此开始」。故 `fabric`/`quilt`/`forge` 下界沿用正文既有的 1.14.4，`neoforge` 取 1.20.1（该加载器本身 1.20.2 才从 Forge 分叉，1.20.1 以下不存在可点的 NeoForge 工程）。
> **判据④ 要求的越界构件披露（fabric）**：fabric 窗口终点 1.21.1 之上还有 beta 构件至 21w03a，无 release 支撑（该 loader 的非 release 行 = `1.16.4` · `20w51a` · `21w03a` · `21w08b` · `21w10a`，全部 0 条同版本 release 兜底 ⇒ 不得据此给 fabric 生成 1.21.2+ 或快照工程的依赖坐标）。⚠️ 这条「越界」是**比较器口径**造成的：门与本仓探针都按前导数字取 tuple（`21w03a` → `[21]`，排在 `[1,21,1]` 之上），而按 Minecraft 实际时间线 `21w03a` 是 1.17 之前的快照尾巴、**并不比 1.21.1 新**。两种读法都要知道，禁止拿它当「fabric 已跟到 21w」。
> 复核：curl.exe --ssl-no-revoke -sS "https://api.modrinth.com/v2/project/pehkui/version?limit=100" 后按 game_versions + loaders + version_type 取上界

# Pehkui 实体缩放（操作指引）

给 AI 的操作指引：改变实体（含玩家）尺寸，按缩放类型分别控制并支持平滑过渡。详细信息用 `search_community_docs` 查 `authored/lib-pehkui`，API 细节以 [官方仓库](https://github.com/Virtuoel/Pehkui) 当前 README 与示例为准。

## 何时用 / 何时不用

- 用：需要按类型分控实体尺寸（身高、宽度、视距、命中盒、经验掉落等 20+ 种），或需要平滑过渡动画；目标 MC ≤ 1.21.1
- 不用：目标 MC > 1.21.1（**版本窗口已停**，以 GitHub Releases 为准，评估原版缩放机制如 1.20.5+ 的 scale attribute 或其它方案）；只做简单固定倍率缩放（原版机制够用）

## Decision Flow

```
Decision: 用不用 Pehkui
→ 目标 MC > 1.21.1 → 无新构建，评估原版缩放机制或其他库
→ 简单固定倍率 → 原版实体缩放属性/机制够用
→ 需要分类型缩放 + 平滑过渡 → Pehkui
→ 已选：
   ├─ 平台分支：fabric / forge / neoforge 各装对应构建（Quilt 另有构建，按短文 loaders）
   ├─ 缩放类型：身高/宽度/视距/命中盒/掉落物等按需组合，不是整体一缩了事
   ├─ 过渡：平滑插值动画（时长/缓动参数以 README 为准，不会自动补间）
   └─ 版本：1.14.4-1.21.1 内与 MC 对齐（GitHub Releases / Modrinth 文件页）；**Forge 工程收到 1.20.1**（构件面 Forge release 上界，见顶部「构件面复测」），1.21 / 1.21.1 的 Forge 侧无 release 构件
```

## 操作步骤

1. 依赖声明：`build.gradle` 照官方 README 配 maven 仓库与坐标（Fabric Loom 用 `modImplementation`，Forge/Neo 照 README 抄）
2. 声明依赖：`fabric.mod.json` / `mods.toml`（26.x 为 `neoforge.mods.toml`）的 `depends` / `suggests` 写 `pehkui`；软依赖门闩见 `authored/soft-deps-modlist`
3. 取缩放 API：按类型设置缩放值（身高/宽度/视距等分开设）；类名、包名与方法签名以官方 README + 示例为准，勿照抄旧版本教程
4. 平滑过渡：设置动画目标与时长/缓动，库负责插值
5. 重置：把对应缩放类型恢复到 1.0 或调取消入口
6. 触发位置：触发逻辑放服务端，客户端与服务端行为由库同步

## 软 / 硬依赖

- 可硬可软：按需声明 `depends`（硬）或 `suggests` + 门闩（软）；未装时不能直接引用 Pehkui 类
- 与同样改实体尺寸的 mod 叠加时缩放值可能互相覆盖，先查冲突面

## 常见错误

- 在 1.21.2+ 找 Pehkui 构建 → 版本窗口停在 1.21.1，以 GitHub Releases 为准
- 只缩了模型没缩命中盒/视距 → 没配对应缩放类型，「看得见打不着」
- 只设终值没有动画 → 平滑过渡需要显式动画入口，不会自动补间
- 缩放类型与玩法需求不匹配 → 外观与交互错位

## 自检清单

- 缩放后外观与命中盒/视距匹配，交互正常
- 平滑过渡动画符合预期（时长/缓动生效）
- 取消缩放后实体恢复原尺寸
- `runServer` 日志无 Pehkui 相关报错

## 参考

- 官方：https://github.com/Virtuoel/Pehkui
- 社区：`search_community_docs` → `authored/lib-pehkui`
- 相关 Skill：`mc-entity`、`mc-renderer`、`mc-cca`
- 不确定时：打开 Pehkui README + 示例，未核对前不写死任何类名/方法签名
