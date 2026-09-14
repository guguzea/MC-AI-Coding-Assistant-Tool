---
name: mc-owo
description: owo-lib 配置与 GUI（owo-config、owo-ui）。触发词：owo、owo-lib、owo-config、owo-ui、wispforest、注解式配置、自动配置界面
platforms: [fabric, neoforge, quilt]
mcVersions: ["1.17-26.2"]
communityDocId: authored/lib-owo
---

> 数据读取日期：2026-09-14（源：Modrinth project/owo-lib limit=100：release 上界 fabric=26.2 / quilt=26.2（0.13.1+26.2，2026-08-19），neoforge=1.21.10（0.12.28+1.21.10，2025-11-22）；声明 forge 的构建 0 个）
> 复核：curl.exe --ssl-no-revoke -sS "https://api.modrinth.com/v2/project/owo-lib/version?limit=100" 后按 game_versions + loaders + version_type 重取上界（本轮 limit=100 覆盖不到低界时改定向 game_versions 查询）

# owo-lib（owo-config / owo-ui）集成

⚠️ **owo-lib 不支持纯 Forge**（Modrinth 113 个构建里 forge loader 零命中）。按 loader 的兼容窗口并不相同：
- **Fabric / Quilt：1.17-26.2**（最新 release `0.13.1+26.2`，2026-08-19）
- **NeoForge：1.21.1-1.21.10**（最新 release `0.12.28+1.21.10`，2025-11-22；1.21.11 与 26.x **没有 NeoForge 构建**）

（Modrinth 实读 2026-09-13。frontmatter 的 `1.17-26.2` 取三 loader **并集**，NeoForge 工程一律以上面的 Neo 窗口为准。）Forge 用户请直接用 Cloth / YACL / ForgeConfigSpec，本 skill 的 Forge 分支没有可用方案。

## Decision: 用不用 owo-config

```
IF loader == forge → 停止。owo-lib 无 Forge 构建
  → 改用 Cloth / YACL / ForgeConfigSpec（Forge）或 ModConfigSpec（Neo ≥1.20.4）（见 mc-config 选型）
IF loader == fabric | quilt → 用 owo-lib：Fabric / Quilt 坐标
  → fabric.mod.json / quilt.mod.json 的 depends / suggests 写 owo-lib
IF loader == neoforge → 用 owo-lib：NeoForge 坐标
  → neoforge.mods.toml 的 depends 写 owo-lib；软依赖用 ModList.isLoaded("owo-lib") 门闩
IF 版本不在 Fabric/Quilt 1.17-26.2 或 NeoForge 1.21.1-1.21.10 内 → YACL（1.19+）/ Cloth（1.14+）
IF 只想要手工 Builder 界面 → YACL / Cloth
→ 已选 owo-config：
   ├─ 注解式配置 + 自动 GUI + 配置同步一体（owo-lib 组件，可拆分构件，以文档为准）
   ├─ 同步：服务端为权威，客户端只读下发值
   └─ 同库 owo-ui 可做声明式界面；网络层可共用
```

## 依赖与类加载隔离

- 坐标与仓库以 https://docs.wispforest.io/ 添加依赖章节为准，`compileOnly` + 开发 `runtimeOnly`
- 确认项目不是纯 Forge：构建脚本里没有 Forge-only artifact 混用
- owo 家族组件互相独立可用，按需引入；配置持有由库管理序列化，业务代码只读配置对象
- Screen 生成只在客户端；`runServer` 不加载 GUI 类

## 集成要点（伪代码级）

```java
// 注解/类名以官方文档为准：owo-config 用注解标注配置字段（键、范围、默认值）
// 典型流程：定义注解式配置接口 → 初始化 → 库自动生成配置 Screen
// 打开界面：客户端门闩内把库生成的 Screen 交给 setScreen(...)
// 同步：标记字段由服务端权威下发，客户端触发同步请求
```

## 官方文档

- https://docs.wispforest.io/（owo-config / owo-ui / 网络章节）

## 常见错误

- 纯 Forge 项目直接引入 owo-lib → 构建 / 运行失败（无 Forge artifact）
- 抄 Fabric 教程到 NeoForge 但 artifact 混用 → 依赖解析失败
- 同步方向搞反 → 客户端改动被服务端覆盖或静默失效
- 期待最新已发布版本以上 → 以官方发布为准，勿假定滚动跟进；NeoForge 线明显落后（Fabric/Quilt 已到 26.2，Neo 仍停在 1.21.10）

## 相关

- 短文：`authored/lib-owo`、`authored/lib-cloth-config`、`authored/lib-yacl`、`authored/lib-traps-2026`（陷阱 2：owo 不支持 Forge）
- Skill：`mc-config`（选型）、`mc-gui`
- MCP：`generate_config`、`check_dependencies`、`search_community_docs`
