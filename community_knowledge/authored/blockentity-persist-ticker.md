---
id: authored/blockentity-persist-ticker
title: BlockEntity 持久化与 Ticker 接入
tags: [blockentity, nbt, ticker, setchanged, forge]
summary: BE 与方块分工；saveAdditional/load 写什么；setChanged；getTicker 接入；教学计数器 vs 生产逻辑。
mcHint: 1.20.1+
sourceKind: authored
---

# BlockEntity 持久化与 Ticker 接入

自写短文。机器库存/WORKING 见 `authored/machine-be-gui-working`。

## Block vs BlockEntity

| | Block | BlockEntity |
|--|-------|-------------|
| 角色 | 类型与行为模板、状态属性 | 某一坐标上的实例数据与 tick |
| 例子 | 是否可朝向、硬度 | 炉内物品、进度、自定义 NBT |

不是所有方块都需要 BE；只有要**动态数据**或**每 tick 逻辑**时才加。

## 注册与绑定

1. `DeferredRegister` 注册 `BlockEntityType`。  
2. `BlockEntityType.Builder.of(构造引用, 合法方块…).build(null)`。  
3. 方块 `newBlockEntity(pos, state)` 返回新实例。  
4. 类型与方块必须匹配，否则 ticker/菜单会找不到。

## 持久化

覆盖 `saveAdditional` / `load`（名称以映射为准）：

- 读写同一 NBT 键。  
- 调用 `super`。  
- 修改后 `setChanged()`，否则可能不写盘。

**应保存**：库存、进度、需要跨存档的配置。  
**勿保存**：可重算缓存、仅客户端渲染临时量。

调试：右键发聊天消息打印字段，或看存盘后重进是否保持。

## Ticker：为何要写在方块上

BE **默认不 tick**。在方块：

```java
@Nullable
@Override
public <T extends BlockEntity> BlockEntityTicker<T> getTicker(Level level, BlockState state, BlockEntityType<T> type) {
    if (level.isClientSide()) return null; // 生产逻辑建议
    return type == ModBlockEntities.MY_BE.get()
        ? (lvl, pos, st, be) -> ((MyBlockEntity) be).tick()
        : null;
}
```

- 教学阶段用 `progress++` 验证存读可以双端都跑；  
- 一旦 tick 改库存 / `setBlock` / 配方，**必须服务端**（见机器短文）。

## 常见坑

- 忘了 `EntityBlock` / `newBlockEntity` → 世界中无 BE。  
- 忘了 ticker → 逻辑永不跑。  
- 改了字段不 `setChanged` → 重启丢失。  
- 客户端也 `setBlock` → 不同步或回弹。

## 自检

- 放置后 `level.getBlockEntity(pos)` 非 null。  
- 改数据、关游戏、重进数据仍在。  
- 专用服行为与单人逻辑侧一致。

## 不清楚时

- 机器 / WORKING：`authored/machine-be-gui-working`  
- 对外物流：`authored/itemhandler-capability`  
- 原文工程化（禁转载，仅浏览）：https://www.mcmod.cn/post/6071.html  
- API：`search_forge_docs` / `query_api`（BlockEntity、saveAdditional、getTicker）
