---
name: mc-caelus
description: Caelus API 鞘翅飞行抽象库（TheIllusiveC4），把鞘翅飞行抽象为实体属性。触发词：Caelus、caelus、鞘翅、Elytra、飞行属性、飞行能力、TheIllusiveC4、elytra flight
platforms: [fabric, forge, neoforge]
mcVersions: ["1.13.2-1.21.5"]
communityDocId: authored/lib-caelus
---

# Caelus API 鞘翅飞行抽象（操作指引）

给 AI 的操作指引：需要把「鞘翅飞行能力」从「鞘翅这件物品」中解耦、抽象成实体属性时，用 Caelus。详细信息用 `search_community_docs` 查 `authored/lib-caelus`，API 细节以 [官方仓库](https://github.com/TheIllusiveC4/Caelus) 当前 README 为准。

## 定位

- 能力：把鞘翅飞行抽象为**实体属性**，让自定义装备/饰品赋予鞘翅式滑翔（与 Curios / Trinkets 类槽位配合）、让特定实体具备飞行能力而不绑定原版鞘翅物品、查询/控制实体当前能否鞘翅飞行做能力门闩
- 生态：TheIllusiveC4（Curios 作者）维护，Fabric / Forge / NeoForge 三端构建（690 万下载）
- 版本 / loader 边界：三端同窗口 **1.13.2-1.21.5**；**26.x 新版号未跟进，1.21.5+ / 26.x 项目没有对应构建**

## Decision Flow

```
Decision: 要不要用 Caelus
→ 目标版本 > 1.21.5（如 1.21.5+ / 26.x）→ 不用（未跟进新版号，无构建）
→ 需要自定义鞘翅式飞行 / 查询飞行能力，且版本 ≤ 1.21.5 → Caelus
→ 只用原版鞘翅，无自定义需求 → 不引库，直接原版机制
→ 已选 Caelus：
   ├─ 版本：1.13.2-1.21.5 内与 MC 对齐（文件页为准）
   ├─ 平台：三端（F/Forge/Neo）同版本窗口，按端选构建（artifact 名如 caelus-fabric / caelus-forge / caelus-neoforge，别混用）
   └─ 集成：用其 API 给实体/装备挂飞行能力，属性/状态在服务端
```

## 接入检查顺序

1. `build.gradle`：官方 README 的 maven 仓库（`https://maven.theillusivec4.top/`，以 README 为准）与坐标照抄；Fabric 走 Loom `modImplementation`，Forge/Neo 对应配置
2. `fabric.mod.json` / `mods.toml` / `neoforge.mods.toml`：`depends` 写 `caelus`；软依赖门闩见 `authored/soft-deps-modlist`
3. 版本核对：**26.x 无构建**，1.21.5 之后的项目直接放弃此库

## 核心 API 速查

类名/包名以官方 README 为准（核对记录：1.13.2/forge 顶层包 `top.theillusivec4.caelus`），下面只列能力与流程：

- **能力查询**：问库「该实体当前能否鞘翅飞行」→ 用结果做门闩/交互分支（服务端逻辑）
- **赋予能力**：给实体/装备挂飞行属性（库提供注册入口），飞行逻辑由库接管；能力赋予时机：实体生成/装备变更时挂，别每 tick 重复注册
- **与饰品槽配合**：饰品槽回调里把 Caelus 能力挂到玩家身上（Fabric 配 Trinkets，Forge 配 Curios）
- 端边界：飞行状态与属性计算放服务端，客户端只做表现（粒子/音效/动画）

## 常见错误

- **给 1.21.5+ / 26.x 项目声明 caelus 依赖** → 无构建/启动崩溃（未跟进新版号）
- 把能力查询写进客户端，服务端逻辑不生效
- 只 `compileOnly` 却硬依赖 → 未装 Caelus 时 `NoClassDefFoundError`
- 每 tick 重复注册/撤销能力 → 性能浪费与状态闪烁
- 与其它飞行模组叠加时未做能力门闩 → 双重飞行/冲突（能力判断以 Caelus 查询结果为准）

## 参考

- 官方：https://github.com/TheIllusiveC4/Caelus
- 社区：`search_community_docs` → `authored/lib-caelus`；相关：`authored/lib-curios`、`authored/lib-trinkets`、`authored/library-catalog-2026`
- 相关 Skill：`mc-item`、`mc-entity`、`mc-curios`、`mc-trinkets`
- 不确定时：打开官方 README + 示例 mod（作者另维护 Curios，其仓库也有配合用法），未核对前不写死任何类名/方法签名
