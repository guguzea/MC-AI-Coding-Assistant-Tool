---
id: authored/lib-geckolib
title: GeckoLib 3D 动画集成要点
tags: [geckolib, animation, blockbench, renderer, fabric, forge, neoforge, quilt]
summary: 3D 骨骼动画引擎（6270 万下载，F/Forge/Neo/Quilt 1.12.2-26.2），Blockbench 建模、客户端必需/服务端可选；玩家动作类需求对比 playerAnimator。
mcHint: 1.12.2-26.2
minecraftVersions: "1.12.2-26.2"
sourceKind: authored
modIds: [geckolib]
loaders: [fabric, forge, neoforge, quilt]
modrinthSlug: geckolib
role: api
skillId: mc-geckolib
---

# GeckoLib 3D 动画集成要点

自写短文。版本矩阵、依赖坐标与注解名以 [GeckoLib 官方文档](https://docs.geckolib.com/) 当前版本为准，禁止照抄过期 Gist 或旧教程。

## 何时用 / 何时不用

用：实体、方块实体、物品需要 3D 骨骼动画。GeckoLib 是事实标准（6270 万下载，CF 3.87 亿；F/Forge/Neo/Quilt 1.12.2-26.2），30+ 缓动、并发动画、声音/粒子/事件关键帧，模型用 Blockbench 的 Geo Modeler 制作，Naturalist、Friends & Foes、Mowzie's Mobs 等"会动的生物"几乎都用它。客户端必需、服务端可选。

不用 / 换方案：

- 玩家第一/第三人称动作动画（战斗动作、挥砍）→ **playerAnimator**（2480 万下载，1.16.4-1.21.7，配套 bendy-lib 弯曲增强）。注意它已停在 1.21.7，更高 MC 版本需重新评估
- 纯客户端后处理着色器 → Satin API（Fabric）
- 只有简单旋转/缩放 → 原版模型 + 插值可能更轻

## Decision Flow

```
Decision: 动画方案
→ 玩家动作动画（MC ≤ 1.21.7）→ playerAnimator（+ bendy-lib）
→ 生物/方块实体/物品 3D 骨骼动画 → GeckoLib：
   ├─ 版本矩阵：1.12.2-26.2，先查 Modrinth/CurseForge 文件页对应 MC 版本的构建
   ├─ 依赖：官方文档 Installation 页的仓库与坐标（以文档为准）
   ├─ 资源：Blockbench 导出 geo/ 模型 + animations/ 动画 + 纹理，路径与注册名一致
   └─ 端隔离：渲染代码只在客户端；服务端只需实体数据/逻辑
```

## Gradle / 声明文件检查顺序

1. 版本矩阵：1.12.2 与 26.2 的 GeckoLib artifact 不同，先在文件页确认该 MC 版本有没有构建
2. `build.gradle`：官方文档 Installation 页的仓库与坐标（不同版本段写法不同，照文档抄）
3. `mods.toml`（26.x 为 `neoforge.mods.toml`）/ `fabric.mod.json`：`depends` 写 geckolib
4. 用 `check_dependencies` / `diagnose_gradle` 过一遍版本与坐标问题

## 集成要点（伪代码级）

```java
// 实体侧（common 可放）：实现 GeckoLib 的动画持有接口 / 继承官方推荐基类（类名以官方为准）
// 渲染侧（仅客户端）：渲染器继承官方 Geo 渲染基类，注册到客户端渲染事件/实体渲染器注册表
// 资源路径：assets/<modid>/geo/<模型>.geo.json、assets/<modid>/animations/<动画>.animation.json、纹理在 assets/<modid>/textures/...
// 动画触发：代码按名称播放（playAnimation 一类方法以官方为准），声音/粒子等关键帧事件在 Blockbench 里打点
```

- 服务端可选不是"服务端不装"，而是服务端逻辑不依赖渲染类，实体注册本身仍需要 GeckoLib
- 动画名、geo 文件名、实体注册名三者对齐，错一个就不播放

## 常见坑

- 服务端引用客户端渲染类 → 专用服崩溃（渲染器放 `Dist.CLIENT` 侧）
- 版本错配：用 1.20.1 的注解/基类写 26.x → `NoClassDefFoundError` 或方法不存在
- 资源路径错误：geo/animation 文件没进 jar，或文件名与注册名不一致
- 抄旧 Gist（注解名、入口类随版本变过多次）
- playerAnimator 当 GeckoLib 用（或反之），接口体系完全不同

## 自检清单

- 专用服务器能启动且不加载渲染类
- 客户端实体显示模型、动画播放、声音/粒子关键帧触发
- `audit_resources` 检查模型纹理引用无孤儿、路径正确
- 换 MC 版本构建时重新核对版本矩阵与依赖坐标

## 交叉引用

- MCP：`check_dependencies`、`diagnose_gradle`、`audit_resources`、`crash_analyze`
- Skill：`mc-geckolib`、`mc-entity`、`mc-renderer`
- 全览：§二.2 动画库、§四；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://docs.geckolib.com/ 、GitHub：https://github.com/bernie-g/geckolib
- 不清楚时：打开官方文档该版本的 Getting Started / Entity 教程；AGENT_USAGE.md 规则先行
## 核对

- MC 1.20.1 + Fabric（geckolib-fabric-1.20.1-4.8.4.jar，2026-08 反编译核对：194 个 java 文件，顶层包 software.bernie.geckolib）
- 细节仍以官方为准：https://docs.geckolib.com/
