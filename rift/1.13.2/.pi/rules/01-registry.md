---
description: 01 — 注册（已核实）
---

# 01 — 注册（已核实）

Listener 须 **public 无参构造**；在 `riftmod.json` 的 `listeners` 列出类名。
禁止编造 Fabric `Registry.register` 当 Rift 入口。完整表：`knowledge/common/listeners.md`。

## 逐步：方块 + 物品

1. 类实现 `BlockAdder` + `ItemAdder`（可同一类）。
2. `registerBlocks()` 里构造 1.13 `Block`（MCP/Yarn 以该版源码为准，禁止 1.20 `DeferredRegister`）。
3. `registerItems()` 里注册对应 `Item` / `ItemBlock`。
4. 资源放 `resources/assets/<id>`（wiki）。

```
Decision
→ 方块 → BlockAdder.registerBlocks()
→ 物品 → ItemAdder.registerItems()
→ TE → TileEntityTypeAdder.registerTileEntityTypes()
→ 实体类型 → EntityTypeAdder.registerEntityTypes()
→ 其它 *Adder → 只使用 listeners.md 已打开方法
```
