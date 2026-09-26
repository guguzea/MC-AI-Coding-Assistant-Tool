---
name: mc-terrablender
description: TerraBlender 群系 region API。往现有世界生成里加自定义生物群系、配置 Surface Rule、与 BOP/BYG 共存。触发词：TerraBlender、terrablender、region、生物群系、biome、SurfaceRule、群系模组
platforms: [fabric, forge, neoforge]
mcVersions: ["1.18.1-26.2"]
mcVersionsByPlatform: "fabric=1.18.2-1.20.4; forge=1.18.1-1.20.4; neoforge=1.20.4-1.20.4"
communityDocId: authored/lib-terrablender
modrinthSlug: terrablender
mappings: "库按各 loader 预重映射，无需特殊配置；Fabric ≤1.21.x 为 yarn、26.x 为 mojmap"
---

> 数据读取日期：2026-09-14（源：Modrinth project/terrablender 版本表 limit=100；本轮 release 上界 fabric=近100内无 / forge=近100内无 / neoforge=近100内无 ⇒ 本文件 mcVersions 上界 26.2 高于 release 上界，仅 beta/alpha 支撑）
> 复核：curl.exe --ssl-no-revoke -sS "https://api.modrinth.com/v2/project/terrablender/version?limit=100" 后按 game_versions + loaders + version_type 取上界
> release/beta 口径收口（2026-09-24，构件面 = `mcp-server/data/lib-manifests/all.json` 快照 as-of 2026-09-16）：
> - 三端窗口终点 = 各 loader 在**该快照**里的 release 上界 `1.20.4`（fabric 5 条 release 行 / forge 6 条 / neoforge 1 条；`gameVersion` 聚合，**不是** `versionNumber`——后者是库自身版本）。下界 = 该 loader 最早的 release 构件版本（fabric 1.18.2 / forge 1.18.1）。`neoforge=1.20.4-1.20.4` 是退化窗口（快照里该 loader 只有 1 条 release 构件），不是笔误。
> - 上面 `:11` 那句「fabric/forge/neoforge 近100内无 release」是 2026-09-14 现拉 Modrinth `limit=100` 的口径，与本仓快照口径不一致；本轮窗口按**快照**落，`:11` 本身未复核 ⇒ 该句标 `未核实`（见第 17 轮报告 §未做清单）。
> - quilt：本仓快照里 TerraBlender 的 quilt 构件**只有 1 条且是 beta（1.20.1）**，0 条 release ⇒ quilt **不写进** `mcVersionsByPlatform`。真正把 quilt 排除在外的是 `:4` 的 `platforms: [fabric, forge, neoforge]` 白名单（把该映射置空的效果是「不收窄、union `mcVersions` 对所有 loader 生效」，那**不是**排除），**禁止按 Quilt 生成**；上游是否有 quilt 正式版未核（`query_upstream_releases` 的 modrinth 摘要不回 `version_type`，证不了 release/beta）。

# TerraBlender 群系集成（操作指引）

给 AI 的操作指引：把自定义生物群系兼容式混入现有世界生成（1.18+ 地形系统标准方案）。详细信息用 `search_community_docs` 查 `authored/lib-terrablender`，API 细节以[官方仓库](https://github.com/Glitchfiend/TerraBlender)当前 README 与 wiki 为准。

## 何时用 / 何时不用

- 用：往主世界/下界/末地加新群系、自定义地表、要与其它群系模组共存
- 不用：只改单个群系内的结构/装饰（原版数据包即可）；完全自建维度（原版维度方案更直接）；MC < 1.18.1

## Decision Flow

```
Decision: 要不要用 TerraBlender
→ MC < 1.18.1 → 不用（窗口外）
→ 自建独立维度/完全掌控地形 → 原版维度方案
→ 在现有世界加群系、与其它群系模组共存 → TerraBlender
→ 已选：
   ├─ 平台分支：fabric / forge / neoforge 各装对应构建（**Quilt 在本快照只有 1 条 beta 构件、1.20.1，无 release** ⇒ 不要按「有 Quilt 构建」推荐给 Quilt 用户；构建面 = `mcp-server/data/lib-manifests/all.json` 快照（as-of 2026-09-16，本轮 2026-09-24 现算；第 44 轮 2026-09-25 覆盖构件面后，三端**越界 beta 上界由 26.2 改读 26.3**，release 上界仍 1.20.4 未变）。「快照无该版本行」只证本仓快照没抓到，**不证上游没有**（要核上游用 `query_upstream_releases`）。越界构件逐 loader 披露（不是「三端」一句糊过去）：
   │     · fabric：release 窗口终点 1.20.4；1.20.5→26.3 全是 beta 构件、无 release 支撑 ⇒ 26.3 侧只有 beta，Fabric 高版本用户按 beta 自担风险
   │     · forge：release 窗口终点 1.20.4；1.20.6→26.3 全是 beta 构件、无 release 支撑 ⇒ 26.3 侧只有 beta，Forge 高版本用户按 beta 自担风险
   │     · neoforge：release 窗口终点 1.20.4（该 loader 快照里只有 1 条 release 构件）；1.20.5→26.3 全是 beta 构件、无 release 支撑 ⇒ 26.3 侧只有 beta
   ├─ region：把群系声明进 region（主/下界/末地），权重可调
   ├─ 地表：配 Surface Rule，禁止手写 BiomeProvider
   └─ 版本：1.18.1-26.2 内与 MC 对齐（Modrinth 文件页为准）
```

## 操作步骤

1. 依赖声明：`build.gradle` 照官方 README 抄 maven 仓库与坐标（Fabric 用 `modImplementation`，Forge/Neo 用对应配置）；`fabric.mod.json` / `mods.toml` 的 `depends` 写 `terrablender`；软依赖门闩做法见 `authored/soft-deps-modlist`
2. 注册 region：启动阶段把你的群系声明进一个 region（主世界/下界/末地对应），指定权重；region 是「在哪生成」的容器，群系是「生成什么」，两者分开管理
3. 绑定群系：自定义群系挂到 region 的群系提供器，附生成条件与权重
4. 配地表：注册 Surface Rule（顶层/下层方块、噪声），加到该 region 的规则列表；规则顺序敏感，错了会被别的模组覆盖
5. 数据包侧：群系 JSON 与生物群系标签照常放 `data/<modid>/worldgen/...`；资源/数据包路径写错会导致客户端或服务端拿不到群系数据
6. 兼容验证：与 BOP/BYG/Regions Unexplored 同装时，确认各方 TerraBlender 版本兼容，region 之间靠权重协商，冲突以日志为准

## 软 / 硬依赖

- 硬依赖：运行时必须有 TerraBlender；只 `compileOnly` 却当硬依赖用 → 未装时 `NoClassDefFoundError`
- 与其它群系模组是「共存」关系，不是依赖关系；先小权重（如 1）验证，别一上来 99 把原版群系挤没

## 常见错误

- 不声明 region 直接改 BiomeProvider → 与其它模组冲突 / 世界生成异常
- Surface Rule 顺序或优先级不对 → 地表被覆盖或地形异常
- 群系 ID / 数据包路径与 modId 不一致 → 群系不生成或加载失败
- 权重配得极端 → 原版群系几乎不出现
- 版本不核对就抄旧坐标 → 1.21.x 及更早与 26.x 的地形 API 差异大（MC 版本线没有「1.26」）

## 自检清单

- 依赖版本与文件页一致；未装 TerraBlender（软依赖场景）进档不崩
- 新群系实际生成，地表方块层符合预期；原版群系仍在
- 服务端与客户端加载无 worldgen 异常；`runServer` 无相关报错

## 参考

- 官方：https://github.com/Glitchfiend/TerraBlender
- 社区：`search_community_docs` → `authored/lib-terrablender`
- 相关 Skill：`mc-worldgen`、`mc-datapack`
- 不确定时：打开官方 README + wiki（含示例群系与 region 配置），未核对前不写死任何类名/方法签名
