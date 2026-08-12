---
name: mc-player-ability-lib
description: PlayerAbilityLib（PAL）玩家能力库。触发词：PAL、PlayerAbilityLib、玩家能力、飞行能力、缩放、ability、兼容修正、Ladysnake
platforms: [fabric, quilt]
mcVersions: ["1.20-26.1"]
communityDocId: authored/lib-player-ability-lib
mappings: hint
---

# PlayerAbilityLib（Fabric/Quilt）

Ladysnake 玩家能力库（42 万下载，F/Quilt 服务端，1.20-26.1）：给玩家注册飞行、缩放等"能力型"状态，并带兼容修正，可与同类模组共存不打架。服务端注册能力、客户端经网络/属性同步表现；常依赖 CCA 做玩家数据挂载（依赖链：PAL → CCA，见 `mc-cca`）。**Forge/NeoForge 不可用**（Ladysnake 系无 Forge 构建）。

## Decision Flow

```
Decision: 玩家能力用不用 PAL
→ 纯数值增强（速度、攻击力等）→ 原版 Attribute
→ 简单标记/开关（1.20.5+）→ 原版 Attachment 或直接 CCA
→ 飞行/缩放/鞘翅等"能力"，要注册+兼容修正 → PAL
→ platform = forge / neoforge → 本 skill 不适用（无 Forge 构建）
→ 已选 PAL：
   ├─ 依赖：PAL 常依赖 CCA，按官方 README 声明两者（版本对齐，混搭会类冲突）
   ├─ 服务端注册：模组初始化阶段注册你的能力（继承/实现能力基类，覆写"是否可用/能否飞行"等判定）
   ├─ 客户端表现：经网络/属性同步（PAL 负责能力判定，表现层自己画），判定逻辑放服务端
   └─ 版本：1.20-26.1 内与 MC 对齐；更高版本以 GitHub Releases 为准
```

## 核心 API 速查

- 顶层 API 包：`io.github.ladysnake`；入口 `io.github.ladysnake.pal.Pal`（1.20/fabric 反编译核对）
- 注册自定义能力、能力基类名与方法签名：短文未列，**以官方 README + 示例 mod 为准**（禁止臆造）
- 能力判定逻辑由你实现（按物品/状态/权限等生效条件），放服务端
- 兼容修正：需要与 Pehkui（缩放）、鞘翅/飞行类模组共存时，用 PAL 的兼容修正能力，别自己判断加载顺序

## 软/硬依赖

- 坐标/maven：Ladysnake 系仓库与坐标照官方 README 抄，`modImplementation` 声明 PAL 与其依赖的 CCA
- `fabric.mod.json`：`depends` 写 PAL 和 CCA（modId 以官方为准）；软依赖用门闩（见 `authored/soft-deps-modlist`）
- 版本核对：PAL + CCA 版本与 MC 对齐，混搭会类冲突

## 官方文档

- 仓库：https://github.com/Ladysnake/PlayerAbilityLib （当前 README + 示例）

## communityDocId 引用

- `authored/lib-player-ability-lib`：完整要点（选型、集成伪代码、自检清单），经 MCP `search_community_docs` 读取

## 常见错误

- 漏声明 CCA 依赖：运行时 `NoClassDefFoundError` 或同步异常
- 把客户端表现逻辑写进服务端能力类：专用服崩溃（客户端门闩缺失）
- 版本超出 1.20-26.1 硬用：无对应构建，以 Releases 为准
- 与缩放/飞行类模组直接写死互斥：用 PAL 兼容修正，别自己判断加载顺序
- 只 `compileOnly` 却当硬依赖：玩家未装时崩溃
- Forge/NeoForge 项目引入本 skill：PAL 无 Forge 构建，勿用（换原版 Attribute / 各自平台的等价方案）

## 自检

- 服务端只装你的 mod + PAL + CCA 时能力生效
- 客户端观察飞行/缩放表现与服务器判定一致
- 与 Pehkui / 鞘翅类模组同装不冲突
- `runClient` 无服务端能力类误加载

未核对签名不写死：能力注册入口/基类以官方 README 示例为准。
