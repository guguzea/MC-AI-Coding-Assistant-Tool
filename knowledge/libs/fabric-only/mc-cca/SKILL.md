---
name: mc-cca
description: Cardinal Components API（CCA）数据附加。触发词：CCA、Cardinal Components、数据附加、data attachment、component、Ladysnake
platforms: [fabric, quilt]
mcVersions: ["1.18-26.2"]
communityDocId: authored/lib-cca
mappings: hint
---

# Cardinal Components API（Fabric/Quilt）

给实体/方块/区块/世界挂自定义数据的标准方案（1.18-26.2）。模块化（entity/block/chunk/world），ASM 生成扩展，Ladysnake 生态基石（Impersonate 等依赖它；PAL 仅 modImplementation，CCA 非硬依赖，见 `mc-player-ability-lib`）。无 Forge 版。

## Decision Flow

```
Decision: 挂数据用 CCA 还是原版机制
→ 物品数据（1.20.5+）→ 原版 Data Components，不要用 CCA
→ 实体/方块/区块/世界数据（< 1.20.5）→ CCA
→ 同上（1.20.5+）→ 评估数据挂载（无「原版 Attachment」）：
   ├─ 物品 → Data Components（见上行）
   ├─ 实体/方块/区块/世界 → FAPI Attachment 或 NeoForge Attachment，不是原版机制
   ├─ 需自动同步/序列化约定/多模组扩展 / Ladysnake 互操作 → CCA（成熟约定）
   └─ platform = forge / neoforge → 本 skill 不适用，走 NeoForge Attachment 等
→ platform = forge / neoforge → 本 skill 不适用（无 Forge 构建）
→ 已选 CCA：
   ├─ 按挂载目标选模块（entity / block / chunk / world）
   ├─ 组件接口 + 默认实现，注册进组件集合（键 + 提供者）
   └─ 同步：声明需同步的组件，同步器由 CCA 生成（ASM），勿手写
```

## 软/硬依赖

- 坐标/maven：Ladysnake 系仓库与坐标照官方 README 抄，`modImplementation`；只引需要的子模块
- `fabric.mod.json`：`depends` 写 CCA（modId 以官方为准）；软依赖用门闩（见 `authored/soft-deps-modlist`）
- 子模块版本必须一致，混搭会类冲突
- 端侧：纯服务端数据用默认同步；客户端渲染数据才需双向

## 官方文档

- 仓库：https://github.com/Ladysnake/cardinal-components-api （当前 README + 示例）

## communityDocId 引用

- `authored/lib-cca`：完整要点（含 1.20.5+ 生态位变化、集成流程、自检清单），经 MCP `search_community_docs` 读取

## 常见错误

- 用 CCA 存物品数据（1.20.5+）：与 Data Components 重复，改原版机制
- 未声明同步组件：客户端读不到服务端写入的值
- 子模块版本混搭：运行时 NoSuchMethodError
- 两侧组件实现不一致：同步失败或崩溃
- 1.21.2+ / 26.x 照抄旧教程 API：版本跨度大，以当前 README 为准

## 自检

- 服务端写入的数据客户端能读到；存档重进数据保留
- 软依赖时只装你的 mod 不崩溃；26.x 注册方式无 API 报错

未核对签名不写死：组件接口/注册入口以官方 README 示例为准。
