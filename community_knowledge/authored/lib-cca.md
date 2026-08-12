---
id: authored/lib-cca
title: Cardinal Components API (CCA) 数据附加要点
tags: [cca, cardinal-components, data-attachment, fabric, quilt, ladysnake]
summary: Fabric/Quilt 给实体/方块/区块/世界挂数据的标准方案（1420 万，1.18-26.2），ASM 生成扩展。Ladysnake 生态基石（Impersonate/PAL 依赖）。1.20.5+ 部分场景可被原版 Data Component/Attachment 替代。
mcHint: 1.18-26.2
minecraftVersions: "1.18-26.2"
sourceKind: authored
modIds: [cardinal-components]
loaders: [fabric, quilt]
modrinthSlug: cardinal-components-api
role: api
skillId: mc-cca
---

# Cardinal Components API (CCA) 数据附加要点

自写短文。版本与 API 细节以 [Cardinal Components API](https://github.com/Ladysnake/cardinal-components-api) 当前 README 与示例为准。

## 何时用 / 何时不用

用：Fabric/Quilt 模组要给**实体 / 方块 / 区块 / 世界**挂自定义数据（1420 万下载，1.18-26.2，全览 §二.7）。模块化设计（entity / block / chunk / world 各模块），ASM 生成扩展点，是 Ladysnake 生态（Impersonate、PlayerAbilityLib）的基石。

不用（重要）：

- **物品数据**（1.20.5+）→ 直接用原版 **Data Components**，别用 CCA（全览 §二.7 生态位变化）
- 1.20.5+ 的实体/方块/区块/世界数据 → 先评估原版 **Attachment** 机制够不够（见 Decision Flow）
- 单机小量状态、无多模组互操作需求 → 原版字段/简单序列化更轻

## Decision Flow

```
Decision: 挂数据用 CCA 还是原版机制
→ 物品数据（1.20.5+）→ 原版 Data Components（不要 CCA）
→ 实体/方块/区块/世界数据（<1.20.5）→ CCA
→ 同上（1.20.5+）→ 评估原版 Attachment：
   ├─ 只存简单值、单模组自用 → 原版 Attachment 优先
   ├─ 需要自动同步/序列化约定/多模组扩展 → CCA（成熟约定，官方文档为准）
   └─ 要与其他 Ladysnake 库（Impersonate/PAL）互操作 → CCA
→ 目标 MC ≤ 1.18 或 > 26.2 → 以官方 Releases 为准，勿硬选
→ 已选 CCA：
   ├─ 选模块：entity / block / chunk / world（按挂载目标）
   ├─ 实现组件接口 + 默认实现，注册进组件集合
   └─ 同步：声明需要同步的组件，由 CCA 生成同步器（ASM 生成扩展，勿手写）
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：官方 README 的 maven 仓库（ladsnake 系）与坐标，`modImplementation` 声明；只引需要的子模块（如 `cardinal-components-entity`）
2. `fabric.mod.json`：`depends` 写 CCA（模组 id 以官方为准）；软依赖时用门闩（`authored/soft-deps-modlist`）
3. 版本核对：1.18-26.2 内与 MC 对齐；子模块版本要一致，避免混合版本

## 集成要点（伪代码级）

```java
// 定义组件接口（你的数据形状）→ 提供默认实现
// 组件接口需提供容器/挂载目标的访问方式（以 README 示例为准）
// 注册：在初始化时把组件注册进组件注册表（键 + 提供者）
// 同步：需要跨端同步的组件按官方同步机制声明（序列化 + 同步器）
// 访问：通过组件键从实体/方块/区块/世界对象取数据
```

- 组件实现放哪侧要明确：纯服务端数据用默认同步即可，客户端渲染数据才需双向
- 接口与实现分离（API 接口 + 默认实现类），便于他人覆写

## 常见坑

- 用 CCA 存物品数据（1.20.5+）→ 与 Data Components 重复，改原版机制
- 未声明同步组件 → 客户端读不到服务端写入的值（数据"不同步"）
- 子模块版本混搭 → 运行时类冲突/NoSuchMethodError，统一版本
- 组件在客户端/服务端两侧实现不一致 → 同步失败或崩溃，保持两侧一致
- 1.21.2+ / 26.x 用旧教程 API → 版本跨度大，以当前 README 为准

## 自检清单

- 服务端写入的数据，客户端按预期读到（同步组件已声明）
- 存档重进后数据保留（持久化路径正确）
- 只装你的 mod（CCA 为软依赖时）不崩溃
- 26.x 构建用当前 README 的注册方式无 API 报错

## 交叉引用

- MCP：`check_dependencies`、`search_community_docs`
- Skill：`mc-cca`；相关：`mc-networking`、`mc-entity`
- 全览：§二.7 数据附加、§四 Fabric 推荐路线（CCA）；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://github.com/Ladysnake/cardinal-components-api ；生态：Impersonate（`lib-impersonate`）、PlayerAbilityLib（`lib-player-ability-lib`）
- 不清楚时：打开 CCA README + 官方示例；`search_fabric_docs` 查 Data Components / Attachment 页面；AGENT_USAGE.md 规则先行
