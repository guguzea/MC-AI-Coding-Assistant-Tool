---
name: mc-yacl
description: YACL 配置库集成。触发词：YACL、YetAnotherConfigLib、配置屏、Builder 配置、isxander
platforms: [fabric, forge, neoforge]
mcVersions: ["1.19+"]
communityDocId: authored/lib-yacl
---

# YACL 配置库集成

YACL（Yet Another Config Lib）是新项目配置库首选之一（下载量以 Modrinth 页面为准；F/Forge/Neo/Quilt，1.19-26.3）。Builder 式 API，界面贴近原版风格，因 Cloth Config 冷冻而生。版本与 API 以官方 README 为准。

## Decision: 要不要用 YACL

```
IF 单平台 Forge 且仅服务端配置 → ForgeConfigSpec，不引 YACL
IF 单平台 NeoForge（≥1.20.4，含 26.x）且仅服务端配置 → ModConfigSpec，不引 YACL
IF MC 版本不在 1.19-26.3 → 回退 Cloth（1.14-26.2）
IF 新项目 / 长期维护需要 GUI 配置屏 → YACL 优先（或评估 Fzzy 的自动 GUI + 同步）
→ 已选 YACL：
   ├─ 四端都有构建，按目标加载器选 artifact（坐标以官方 README 为准）
   ├─ Fabric 用 Mod Menu 软依赖挂按钮；Forge/Neo 自建按钮
   └─ 版本在 1.19-26.3 内与 MC 对齐（Modrinth 文件页）
```

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
