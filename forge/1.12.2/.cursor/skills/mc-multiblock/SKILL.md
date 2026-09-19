---
name: mc-multiblock
description: 多方块结构模式。触发词：multiblock、master、slave
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# mc-multiblock（1.12.2）

> 一手来源：原语类名 `TileEntity` / `BlockPos` / `World` 经 `query_api`（version=1.12.2）核实存在（MCP 命名）。多方块无平台 API——这是**模式技能**，只用已核实的原语描述。

## Decision Flow

```
→ 多方块 = 控制器（TileEntity 系）+ 结构校验 + formed 状态
→ 结构探测 → 用 BlockPos/World 逐格扫描已核实原语（具体扫描方法签名先核实再写）
→ 状态同步/拆形 → 客户端/服务端分离规则见 08-client-server.mdc
→ 注册与生命周期 → mc-registry、01-registry.mdc
```

## 本档口径（已核实）

- 原语：`TileEntity`（1.12.2 MCP 名——1.13+ 改名 BlockEntity）、`BlockPos`、`World`（query_api found）。
- 多方块框架（如 MIT 的 MultiBlock API 类库）不在本仓依赖面内——自研控制器时只用已核实原语。

## 反模式

- 把 1.13+ 的 BlockEntity 名写进 1.12.2（本版是 TileEntity）。
- 每帧全量扫描结构（性能面见 09-anti-patterns.mdc；结构变更时才重扫）。

## 下一步

- 原语核实：`query_api`（version=1.12.2）；方块实体规则：`02-block.mdc`；反模式库：`forge/1.12.2/knowledge/antipatterns/`。
