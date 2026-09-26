---
name: mc-yacl
description: YACL 配置库集成。触发词：YACL、YetAnotherConfigLib、配置屏、Builder 配置、isxander
platforms: [fabric, forge, neoforge, quilt]
mcVersions: ["1.19-26.3"]
mcVersionsByPlatform: "fabric=1.19-26.3; forge=1.19.4-1.20.2; neoforge=1.20-26.3; quilt=1.19-1.20.4"
communityDocId: authored/lib-yacl
modrinthSlug: yacl
---

> 数据读取日期：2026-09-14（源：Modrinth project/yacl 版本表 limit=100；本轮 release 上界 fabric=26.2 / forge=1.20.1 / neoforge=26.2）
> **构件面复测 + 上游现读（as-of 2026-09-25，第 47 轮；源 = `mcp-server/data/lib-manifests/all.json` 重抓后的完整面 49 slug / 3,003 行，探针 `node temp/ralph-20260922/_v47-B-ceilings.mjs` → `logs/r47-B-ceilings.log`；上游现读 `logs/r47-B-yacl-upstream.json`）**：`yacl` 该 slug 现 **83** 行，逐 loader 的 **release 上界 = fabric 26.3 / neoforge 26.3 / forge 1.20.2 / quilt 1.20.4**（口径同门 `assert-lib-session-resolve-parity.mjs` 判据④ = `versionType==="release"` **且** `gameVersion` 形如 `^\d+(\.\d+)*$` 的最大值）。⇒ **本档旧写的 `neoforge` 终点 26.2 与「缺 `fabric` 键」都是低报**：现面有 **2 行** gameVersion 恰为 `26.3` 的 release（`3.9.7+26.3-fabric` / `3.9.7+26.3-neoforge`），并由 2026-09-25 上游现读独立证实（该页 **3 行** `26.3` release，另含 2026-07-19 的 `3.9.6+26.3-fabric`）⇒ 旧句「**26.3 仅 snapshot 构建**」被证伪。
> ⚠️ **成因不是「翻页截断把它藏了」（本轮实测推翻该说法）**：重抓前的旧面（`all.json.bak`，48 slug / 2,870 行、mtime 2026-09-16）里 yacl 反而有 **85 行**（比现面 83 行多 2 行），但 `26.3` 那个**点分** gameVersion **0 行**——当时该 slug 只有 `26.3-snapshot-1/-4/-5/-6/-7` 这些快照形态 ⇒ 真相是 **MC 26.3 在旧面抓取之后才转正**（上游现读最新一行 `3.9.7+26.3` 发布时刻 `2026-09-20T23:11Z`，晚旧面 mtime 四天）。⇒ 「窗口终点 = release 上界」这类结论受**快照新鲜度**支配，低报未必是生产者的采集缺陷，重抓要按周期做。
> ⚠️ **两条口径限制（不得互证）**：① 上游现读**只读第 1 页（100 版，日期跨度 2025-03-23 → 2026-09-20）**，因此它能**证实新行**（26.3 release）、**不能反证旧行**——该页 `loaders` 含 forge 的只有 1 行（`3.6.6+1.20.1-forge`），而构件面有 forge 1.20.2 一行，那是分页缺失不是快照错；quilt 在该页 **0 行**同理。② 上界不按「有构件」取：fabric 有 `26.3-snapshot-1` 等 **8 个**长得像快照/rc/pre 却被标 `release` 的非点分 gameVersion（`1.21.5-pre2` · `22w42a` · `25w31a/32a/33a` · `26.1-snapshot-2` · `26.2-snapshot-2` · `26.3-snapshot-1`），已按口径剔除；**下界一律不按构件面取**（每版本只留 primary 一个构件 ⇒ 面能证「上界到此」，证不了「下界从此开始」），故四端下界沿用正文既有值。
> 复核：`node temp/ralph-20260922/_v47-B-ceilings.mjs`（只读，打印基准目录）＋ `curl.exe --proxy http://127.0.0.1:7897 "https://api.modrinth.com/v2/project/yacl/version?limit=100"`

# YACL 配置库集成

YACL（Yet Another Config Lib）是新项目配置库首选之一（截至 2026-09-04，Modrinth slug `yacl` 下载量 1.188 亿）。**逐端窗口不同**（构建面 = `mcp-server/data/lib-manifests/all.json` 快照（as-of 2026-09-25 现扫，重抓后的完整面 49 slug / 3,003 行；旧值 48 / 2,870 属重抓前的首页截断面）：Fabric 1.19→**26.3**、Forge 1.19.4→1.20.2、NeoForge 1.20→**26.3**、**Quilt 1.19→1.20.4，13 条构件行、release 上界 1.20.4**）⇒ 「F/Forge/Neo/Quilt，1.19-26.3」对 Quilt 与 Forge 都是高估，生效值看 frontmatter `mcVersionsByPlatform`。⚠️ **两套口径不得互证**：`community_knowledge/authored/lib-yacl.md:52` 的「逐端构建数 …quilt 63」是 2026-09-02 Modrinth **全量发布数**口径，本快照的 13 是 **gameVersion×loader 构件行**口径。**「26.3 仅 snapshot 构建」那句已作废**（2026-09-25 实测：构件面 2 行 + 上游现读 3 行 `version_type=release` 的 26.3 件，见上方「构件面复测」注）。「快照无该版本行」只证本仓快照没抓到，**不证上游没有**（要核上游用 `query_upstream_releases`）。Builder 式 API，界面贴近原版风格，因 Cloth Config 冷冻而生。版本与 API 以官方 README 为准。

## Decision: 要不要用 YACL

```
IF 单平台 Forge 且仅服务端配置 → ForgeConfigSpec，不引 YACL
IF 单平台 NeoForge（≥1.20.4，含 26.x）且仅服务端配置 → ModConfigSpec，不引 YACL
IF MC 版本不在 1.19-26.3 → 回退 Cloth（1.14-26.2）
IF 新项目 / 长期维护需要 GUI 配置屏 → YACL 优先（或评估 Fzzy 的自动 GUI + 同步）
→ 已选 YACL：
   ├─ 四端都有构建，按目标加载器选 artifact（坐标以官方 README 为准）
   ├─ Fabric 用 Mod Menu 软依赖挂按钮；Forge/Neo 自建按钮
   └─ 版本在 1.19-26.3 内与 MC 对齐（Modrinth 文件页；**Forge 工程另按 1.19.4-1.20.2、Quilt 工程按 1.19-1.20.4 收窄**，见 frontmatter `mcVersionsByPlatform`）
```

### MCP：`generate_config` 的 YACL 骨架是 opt-in 的结构壳

- `generate_config` 在 fabric / quilt 上**默认仍吐 Cloth Config**；要 YACL 必须显式传 `library=yacl`（枚举只有 `cloth` / `yacl`，默认 `cloth`）。
- `library=yacl` 返回的骨架只含类声明、已核实成员名（`GsonConfigInstance` 的 `save()/load()/getPath()`、`ConfigInstance` 的 6 个成员）与依赖标识符；本仓库对 YACL **没有官方方法链语料**（`lib-api-summaries/yacl.json` 里 `YetAnotherConfigLib` 的 methods 是空数组），所以其余调用点一律是 `// TODO(未核实)`。
- **强制前置步骤**：选 YACL 的用户必须另外拿自己的 yacl jar 跑一次 `ingest_loader_api`（默认 dryRun，只写 `$MC_SKILL_CACHE/loader-api-summaries` overlay，禁写仓库 `data/`），再用 `query_loader_api` 逐签名核对，骨架才可能编译。跳过这步 → 只能停留在 TODO，禁止照本 skill 的伪代码补方法链。
- 包名前缀在本仓库两说（摘要记 `dev.isxander.yacl.*`，`library-catalog.ts` 的 1.20+ 条目记 `dev.isxander.yacl3`），ingest 后按实际 jar 定，别照抄。

## 软 / 硬依赖与类加载隔离

- 开发依赖：`compileOnly`，自测加 `runtimeOnly`（坐标以 README 为准）
- `fabric.mod.json`：`depends`（硬）/ `suggests`（软）写 yacl；Mod Menu 入口单独软依赖（modId `modmenu`）
- `mods.toml`（26.x 为 neoforge.mods.toml）：硬依赖写 depends，软依赖用 `ModList.get().isLoaded("yacl")` 门闩
- Screen 构建只在客户端：Forge/Neo 用 `Dist.CLIENT` 门闩；Fabric/Quilt 用 client 源集 + `@Environment(EnvType.CLIENT)` / Loom split sources；未装 YACL 时模组正常进游戏

> **Quilt 侧安装口径（2026-09-24 补）**：`platforms` 含 `quilt` 的依据是本仓快照 `mcp-server/data/lib-manifests/all.json` 里 slug `yacl` 的 **13 条 `loader:"quilt"` 构件行**（本轮现算，as-of 2026-09-24；release 上界 1.20.4，生效窗口见 frontmatter `mcVersionsByPlatform`）。13 条的**文件名 0 条带 `quilt` 字样**（形如 `YetAnotherConfigLib-1.7.1.jar`，即与 Fabric 侧同名构件）⇒ 实况是 **Quilt 按同 MC 版本的 Fabric 构件加载**。⚠️ **Quilt 专属仓库 URL / Gradle 坐标串未核实**（本仓只核到构件文件名）。另按根 `AGENTS.md` 的硬约束：YACL 的**方法名与注解不在本 Skill 取证能力内**——要用 `generate_config --library=yacl` 出的骨架，必须先对自己实际引入的 yacl jar 跑一次 `ingest_loader_api`，否则骨架里的调用一律是 `// TODO(未核实)`。

## 集成要点（伪代码级）

```java
// 类名以官方为准：YetAnotherConfigLib 包内 Builder 风格入口
// buildScreen(holder) → 分组/条目 → 保存回调写回你的配置持有类 → 返回 Screen
// Screen 交给 setScreen(...) 或 Mod Menu 配置入口回调
// 配置持有：自己管理 POJO + 序列化，YACL 只做界面桥
// 校验逻辑放保存回调，别塞进条目构造
```

## 官方文档

- https://github.com/isXander/YetAnotherConfigLib （README + 示例 mod）

## 常见错误

- Screen 类被公共 / 服务端代码引用 → 专用服崩溃（Forge/Neo：`Dist.CLIENT` 门闩；Fabric/Quilt：client 源集 + `@Environment(EnvType.CLIENT)`）
- 只 compileOnly 却当硬依赖用，未装时 NoClassDefFoundError
- 版本低于 1.19 却期待 YACL 构建 → 无构建，换 Cloth
- 手写配置路径与库冲突，或 ForgeConfigSpec + YACL 双份配置

## 相关

- 短文：`authored/lib-yacl`、`authored/lib-cloth-config`、`authored/library-integration`
- Skill：`mc-config`（选型总纲）、`mc-gui`
- MCP：`generate_config`、`check_dependencies`、`search_community_docs`
