---
id: authored/lib-player-ability-lib
title: PlayerAbilityLib (PAL) 玩家能力库要点
tags: [playerabilitylib, pal, ability, ladysnake, fabric, quilt, server]
summary: Ladysnake 玩家能力库（42 万，F/Quilt 服务端，1.20-26.1）：飞行/缩放等玩家能力的注册与兼容修正；常依赖 CCA。服务端注册能力，客户端经网络/属性同步表现。
mcHint: 1.20-26.1
minecraftVersions: "1.20-26.1"
sourceKind: authored
modIds: [playerabilitylib]
loaders: [fabric, quilt]
modrinthSlug: pal
role: api
skillId: mc-player-ability-lib
---

# PlayerAbilityLib (PAL) 玩家能力库要点

自写短文。版本与 API 细节以 [PlayerAbilityLib](https://github.com/Ladysnake/PlayerAbilityLib) 当前 README 与示例为准。

## 何时用 / 何时不用

用：Fabric/Quilt 模组要给玩家加**能力型**状态（典型如飞行、缩放），且要与其他同类模组共存不打架（兼容修正）。42 万下载，F/Quilt **服务端**，1.20-26.1（全览 §二.7）。Ladysnake 出品，常依赖 CCA 做玩家数据挂载。

不用（重要）：

- 纯数值属性（速度、攻击力等）→ 原版属性（Attribute）就够
- 简单标记/开关 → 原版 1.20.5+ Attachment 或直接 CCA 更轻
- 客户端渲染相关能力 → PAL 是服务端库，客户端表现靠网络/属性同步
- 非 Fabric/Quilt 平台 → 不可用

## Decision Flow

```
Decision: 玩家能力用不用 PAL
→ 纯数值增强 → 原版 Attribute
→ 简单开关标记 → CCA 或原版 Attachment
→ 飞行/缩放/鞘翅等"能力"，要注册+兼容修正 → PAL
→ 已选 PAL：
   ├─ 依赖：PAL 常依赖 CCA，按官方 README 声明两者（版本对齐）
   ├─ 服务端注册：在初始化时注册你的能力（覆写判定逻辑）
   ├─ 客户端表现：经网络/属性同步（PAL 负责能力判定，表现层自己画）
   └─ 版本：1.20-26.1 内与 MC 对齐；26.1 之后以 Releases 为准
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：官方 README 的 maven 仓库（ladsnake 系）与坐标，`modImplementation` 声明
2. `fabric.mod.json`：`depends` 写 PAL 与其依赖的 CCA；软依赖时用门闩（`authored/soft-deps-modlist`）
3. 版本核对：PAL + CCA 版本与 MC 对齐，混搭会类冲突

## 集成要点（伪代码级）

```java
// 服务端：注册自定义能力（继承/实现能力基类，覆写"是否可用/能否飞行"等判定）
// 注册时机：模组初始化阶段（以 README 示例为准）
// 判定逻辑：能力生效条件由你实现（如按物品/状态/权限）
// 客户端：收到同步后应用表现（飞行状态、缩放值等），渲染逻辑自写
// 类名与方法签名以官方 README + 示例 mod 为准
```

- 能力判定放服务端，客户端只做表现，避免作弊/不同步
- 需要与 Pehkui（缩放）、鞘翅/飞行类模组共存时，用 PAL 的兼容修正能力

## 常见坑

- 漏声明 CCA 依赖 → 运行时 `NoClassDefFoundError` 或同步异常
- 把客户端表现逻辑写进服务端能力类 → 专用服崩溃（客户端门闩缺失）
- 版本超出 1.20-26.1 硬用 → 无对应构建，以 Releases 为准
- 与缩放/飞行类模组直接写死互斥 → 用 PAL 兼容修正，别自己判断加载顺序
- 只 `compileOnly` 却当硬依赖 → 玩家未装时崩溃

## 自检清单

- 服务端只装你的 mod + PAL + CCA 时能力生效
- 客户端观察飞行/缩放表现与服务器判定一致
- 与 Pehkui / 鞘翅类模组同装不冲突
- `runClient` 无服务端能力类误加载

## 交叉引用

- MCP：`check_dependencies`、`search_community_docs`
- Skill：`mc-player-ability-lib`；相关：`mc-cca`、`mc-entity`、`mc-networking`
- 全览：§二.7 数据附加（PAL）；Ladysnake 生态见 `lib-cca`、`lib-impersonate`；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://github.com/Ladysnake/PlayerAbilityLib
- 不清楚时：打开 PAL README + 示例 mod；`search_fabric_docs` 查能力/属性相关页；AGENT_USAGE.md 规则先行

## 核对（2026-08 反编译验证）

- 已对以下版本反编译核对（VineFlower + catalog verifiedApi）：
  - 1.20/fabric：顶层 API 包 `io.github.ladysnake`，入口 io.github.ladysnake.pal.Pal
- 版本/包名详情见 `mcp-server/src/diagnostics/library-catalog.ts` 对应条目；细节仍以官方文档为准。
