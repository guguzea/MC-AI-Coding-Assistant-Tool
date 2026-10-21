# Quilt / QSL 已核实表（差异层）

> ⚠️ **整体降级声明（2026-09 maven 复核）**：`org.quiltmc:qsl` 的 maven `<release>` 为 **`10.0.0-alpha.5+1.21.1`**（`qsl/maven-metadata.xml` lastUpdated 2025-09-21）；1.21 线只有 4 个 alpha 构件（`10.0.0-alpha.1+1.21` 1 个、`10.0.0-alpha.2/3/5+1.21.1` 3 个），**1.21.1 无任何可用 QSL/QFAPI 正式版构件**。旧表述的 `11.0.0-alpha.3+0.102.0-1.21` 在 **maven** 清单里 0 命中（**勿当 maven 坐标写**），但**在 Modrinth 上是真版本** —— 实测 `query_upstream_releases source=modrinth slug=qsl` 得 `total=143`、`latest=11.0.0-alpha.3+0.102.0-1.21` ⇒ **两通道口径不同，此前标「虚构」有误**；「止、只含 qsl_base + crash_info 模块」无发布记录佐证，已删；「QSL 2025-12 停更」原引 `https://quiltmc.org/en/faq/`（现返回 **404**）→ `// TODO(未核实)`，不再作为依据。本表全部 QSL 条目原为 **QSL 源码仓库考据（main 分支 `871ca7abf109`）**——**构件复核**：`10.0.0-alpha.5+1.21.1` 的 `qsl_base` / `registry` / `lifecycle_events` 模块 jar 已下载并 `javap`（本机 `F:\MC_GAME\_oracle-jars\qsl\`），下表各符号（含 RegistryEvents / RegistryMonitor / ServerLifecycleEvents / ClientLifecycleEvents 全族与 `startingServer` / `exitServer` / `readyClient` 回调名）**在 alpha 构件中逐字在场** ⇒ 考据升级为**构件实证**。唯一保留的限制：**该线只有 alpha、没有正式版**——是否依赖 alpha 由用户拍板；默认路径仍是 Vanilla Registry.register 与同版 Fabric API。

- **抓取日**：
- **源**：`data/quilt_<ver>/quilt-docs/<ver>/processed/qsl-readme.md`（QSL README）+ wiki 概念页 `qsl-qfapi`（该 wiki 为 SPA，入库正文可能只有导航壳，**方法名以 README 图表为准**）
- ⚠️ **F115（实测；用户裁定路线 A 同步）**：上面这个「源」目录就是**语料侧副本**——`data/quilt_1.21.1/quilt-docs/1.21.1/processed/qsl-verified.md` 由 `scripts/index-qsl-verified.mjs` 从本文件机械复制（emitCopy，0 手改）。此前副本曾滞留本文件 `:3` 已撤回的旧断言（「QSL 已于 2025-12 停更」/ `11.0.0-alpha.3+0.102.0-1.21`），检索命中会把它当正文端出；**已按路线 A 用生成器全量刷新**：6 档 processed 与各自源稿逐字节一致。⚠️ 措辞更正（勿再读成「横幅已消失」）：该页 **仍含**「QSL 已于 2025-12 停更」与 `11.0.0-alpha.3` 字样（语料受「上游原样」保护、不改写），但同句已带 `// TODO(未核实)` 撤回标记、不作依据 ⇒ 只当背景。语料按「上游原样」原则不改写——本文件是唯一编辑真值，data 侧副本只准由生成器刷新；新增断言先改这里再跑生成器。
- **禁止**编 `QuiltRegistry.register()`。
- **02–10 仍读** `fabric/<同一 MC 版本>`。本表不是完整模组教程。本计划不写 Quilt 26.x。

## 入口（已核实口径）

| API | 说明 |
|-----|------|
| `net.fabricmc.api.ModInitializer#onInitialize()` | `quilt.mod.json` → `entrypoints.main`（quilt-loader 自带 Fabric 兼容接口，`@Deprecated`）。⚠️ 旧行的 `org.quiltmc.loader.api.entrypoint.ModInitializer` 在 quilt-loader 0.31.0-beta.4 **已删除**（javap 实测）；QSL 替代 = `org.quiltmc.qsl.base.api.entrypoint.ModInitializer#onInitialize(ModContainer)`（构件 `org.quiltmc.qsl.core:qsl_base`，javap 实测；本档 maven 有构件 10.0.0-alpha.5+1.21.1） |

## 注册

| 做法 | 说明 |
|------|------|
| Vanilla `Registry.register(Registries.*, id, value)` | 简单 Item/Block/BlockEntity **可用**（不是 FAPI 专属） |
| `org.quiltmc.qsl.registry.api.event.RegistryEvents#getEntryAddEvent(Registry)` | 低层：条目添加后回调。源码 [RegistryEvents.java @ 1.21 `871ca7abf109`](https://github.com/QuiltMC/quilt-standard-libraries/blob/871ca7abf109239601eab2f96a23eb64317e0045/library/core/registry/src/main/java/org/quiltmc/qsl/registry/api/event/RegistryEvents.java)。回调 `EntryAdded#onAdded(RegistryEntryContext)`。字段 `DYNAMIC_REGISTRY_SETUP` / `DYNAMIC_REGISTRY_LOADED` |
| `org.quiltmc.qsl.registry.api.event.RegistryMonitor#create(Registry)` | 高层监视：`filter` / `forAll` / `forUpcoming`。源码 [RegistryMonitor.java @ 1.21 `871ca7abf109`](https://github.com/QuiltMC/quilt-standard-libraries/blob/871ca7abf109239601eab2f96a23eb64317e0045/library/core/registry/src/main/java/org/quiltmc/qsl/registry/api/event/RegistryMonitor.java) |
| 禁止 | `QuiltRegistry.register()`；`net.fabricmc.fabric.api.event.registry` / `FabricRegistryBuilder` 当 QSL |

## 生命周期（已打开源码）

| API | 说明 |
|-----|------|
| `org.quiltmc.qsl.lifecycle.api.event.ServerLifecycleEvents` | 字段 `STARTING` / `READY` / `STOPPING` / `STOPPED`。回调 `startingServer` / `readyServer` / `stoppingServer` / `exitServer`。[ServerLifecycleEvents.java @ `871ca7abf109`](https://github.com/QuiltMC/quilt-standard-libraries/blob/871ca7abf109239601eab2f96a23eb64317e0045/library/core/lifecycle_events/src/main/java/org/quiltmc/qsl/lifecycle/api/event/ServerLifecycleEvents.java) |
| `org.quiltmc.qsl.lifecycle.api.client.event.ClientLifecycleEvents` | `@ClientOnly`。字段 `READY` / `STOPPING` / `STOPPED`（无 STARTING）。回调 `readyClient` / `stoppingClient` / `stoppedClient`。[ClientLifecycleEvents.java @ `871ca7abf109`](https://github.com/QuiltMC/quilt-standard-libraries/blob/871ca7abf109239601eab2f96a23eb64317e0045/library/core/lifecycle_events/src/main/java/org/quiltmc/qsl/lifecycle/api/client/event/ClientLifecycleEvents.java) |

> **构件复核（本页全部 QSL 符号）**：上两表的类 / 字段 / 回调名在 `10.0.0-alpha.5+1.21.1` 的 `registry` / `lifecycle_events` 模块 jar 中逐字在场（`RegistryEvents#getEntryAddEvent`、`RegistryMonitor#create`、`ServerLifecycleEvents` 四字段 + `$Starting#startingServer` / `$Stopped#exitServer`、`ClientLifecycleEvents` 三字段 + `$Ready#readyClient`）；本机留档 `F:\MC_GAME\_oracle-jars\qsl\`。「无正式版」的限制见顶部声明。

## README 标明 QSL 有、不要用 FAPI 名顶上的能力（无方法签名则只作方向）

Core：Event API（含 Phases、Events as Entrypoints）、Networking API、Lifecycle（Client/Server tick 等；README 写明若干 ❌ 相对 FAPI）。
Resource Loader：mod resources、built-in resource pack API 等。

QFAPI：有 QSL 替代的 FAPI **弃用**；item groups 等 README/wiki 写明仍可能走 QFAPI。

不清楚方法名 → 停。不要把 Fabric Registry 教程改名交差。
