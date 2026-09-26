---
name: mc-geckolib
description: GeckoLib 3D 骨骼动画。触发词：GeckoLib、gecko、动画、GeoModel、Blockbench、骨骼动画、实体动画、playerAnimator
platforms: [fabric, forge, neoforge, quilt]
mcVersions: ["1.12.2+"]
mcVersionsByPlatform: "fabric=1.16.5+; neoforge=1.20+; quilt=1.18.2-1.20.1"
communityDocId: authored/lib-geckolib
modrinthSlug: geckolib
mappings: hint
---

# GeckoLib 3D 动画集成

GeckoLib 是实体 / 方块实体 / 物品 3D 骨骼动画的事实标准（6270 万下载）。**四端不是同一窗口**（构建面 = `mcp-server/data/lib-manifests/all.json` 快照（as-of 2026-09-16，本轮 2026-09-24 现算）：Forge 1.12.2→26.2、Fabric 1.16.5→26.2、NeoForge 1.20→26.2、**Quilt 只到 1.20.1，6 条构件行** ⇒ 「1.12.2-26.2」对 Quilt 是高估），生效值看 frontmatter `mcVersionsByPlatform`；「快照无该版本行」只证本仓快照没抓到，**不证上游没有**（要核上游用 `query_upstream_releases`）。模型用 Blockbench 的 Geo Modeler 制作。版本矩阵与注解名以官方文档为准，禁止照抄过期 Gist。

## Decision: 动画方案

```
IF 玩家第一/第三人称动作动画（战斗动作、挥砍）
  → playerAnimator（1.16.4-1.21.7，配套 bendy-lib；已停在 1.21.7，更高版本需重新评估）
IF 生物 / 方块实体 / 物品 3D 骨骼动画 → GeckoLib：
   ├─ 版本矩阵：1.12.2-26.2，先查文件页确认目标 MC 版本有构建
   ├─ 依赖：官方文档 Installation 页的仓库与坐标（照文档抄，不同版本段写法不同）
   ├─ 资源：Blockbench 导出 geo/ 模型 + animations/ 动画 + 纹理
   └─ 端隔离：渲染只在客户端，服务端只要实体逻辑
IF 纯客户端后处理着色器 → Satin API（仅 Fabric）
IF 只有简单旋转 / 缩放 → 原版模型 + 插值更轻
```

## 依赖与类加载隔离

- `mods.toml`（26.x 为 neoforge.mods.toml）/ `fabric.mod.json`：`depends` 写 geckolib
- 客户端必需、服务端可选不是"服务端不装"：实体注册本身仍需要 GeckoLib，只是服务端逻辑不依赖渲染类
- 渲染器继承官方 Geo 渲染基类，注册到客户端渲染事件 / 实体渲染器注册表；渲染类只放客户端

> **Quilt 侧安装口径（2026-09-24 补）**：`platforms` 含 `quilt` 的依据是本仓快照 `mcp-server/data/lib-manifests/all.json` 里 slug `geckolib` 的 **6 条 `loader:"quilt"` 构件行**（本轮现算，as-of 2026-09-24，全部 `versionType:"release"`；窗口见 frontmatter `mcVersionsByPlatform`）。与其余库不同：这 6 条里 **5 条文件名带 `-quilt-`**（例 `geckolib-quilt-1.18-3.0.46.jar`）⇒ GeckoLib **发过 Quilt 专属构件**，别拿 Fabric jar 顶替。⚠️ 但**仓库 URL 与 Gradle 坐标串仍未核实**（本仓只核到构件文件名）⇒ 禁止照本文默写 `maven { url }` / `modImplementation`。坐实入口：`query_upstream_releases`（`modrinth`，slug=`geckolib`）或 `ingest_loader_api`（自备该档 jar）。

## 集成要点

- 实体侧（common 可放）：实现动画持有接口 / 继承官方推荐基类（类名以官方为准）
- 资源路径：`assets/<modid>/geo/<模型>.geo.json`、`assets/<modid>/animations/<动画>.animation.json`、纹理在 textures/ 下
- 动画触发：代码按名称播放（方法名以官方为准），声音 / 粒子等关键帧事件在 Blockbench 里打点
- 动画名、geo 文件名、实体注册名三者对齐，错一个就不播放

## 官方文档

- https://github.com/bernie-g/geckolib/wiki （Getting Started / Entity 教程）
- GitHub：https://github.com/bernie-g/geckolib

## 常见错误

- 服务端引用客户端渲染类 → 专用服崩溃
- 版本错配：用 1.20.1 的注解 / 基类写 26.x → NoClassDefFoundError 或方法不存在
- geo / animation 文件没进 jar，或文件名与注册名不一致
- 抄旧 Gist（注解名、入口类随版本变过多次）
- playerAnimator 当 GeckoLib 用（或反之），接口体系完全不同

## 相关

- 短文：`authored/lib-geckolib`、`authored/library-integration`
- Skill：`mc-entity`、`mc-renderer`
- MCP：`check_dependencies`、`diagnose_gradle`、`audit_resources`、`crash_analyze`
