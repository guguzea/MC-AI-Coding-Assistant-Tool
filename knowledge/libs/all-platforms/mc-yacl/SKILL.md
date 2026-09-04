---
name: mc-yacl
description: YACL 配置库集成。触发词：YACL、YetAnotherConfigLib、配置屏、Builder 配置、isxander
platforms: [fabric, forge, neoforge]
mcVersions: ["1.19-26.2"]
communityDocId: authored/lib-yacl
---

# YACL 配置库集成

YACL（Yet Another Config Lib）是新项目配置库首选之一（截至 2026-09-04，Modrinth slug `yacl` 下载量 1.188 亿；F/Forge/Neo/Quilt，1.19-26.2；26.3 目前仅 snapshot 构建）。Builder 式 API，界面贴近原版风格，因 Cloth Config 冷冻而生。版本与 API 以官方 README 为准。

## Decision: 要不要用 YACL

```
IF 单平台 Forge 且仅服务端配置 → ForgeConfigSpec，不引 YACL
IF 单平台 NeoForge（≥1.20.4，含 26.x）且仅服务端配置 → ModConfigSpec，不引 YACL
IF MC 版本不在 1.19-26.2 → 回退 Cloth（1.14-26.2）
IF 新项目 / 长期维护需要 GUI 配置屏 → YACL 优先（或评估 Fzzy 的自动 GUI + 同步）
→ 已选 YACL：
   ├─ 四端都有构建，按目标加载器选 artifact（坐标以官方 README 为准）
   ├─ Fabric 用 Mod Menu 软依赖挂按钮；Forge/Neo 自建按钮
   └─ 版本在 1.19-26.2 内与 MC 对齐（Modrinth 文件页）
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
