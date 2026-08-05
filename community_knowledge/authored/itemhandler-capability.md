---
id: authored/itemhandler-capability
title: 机器对外暴露 IItemHandler（Capability）
tags: [capability, itemhandler, lazyoptional, hopper, pipe, forge, machine]
summary: Menu 用 getItemHandler 不够；漏斗/管道需 ForgeCapabilities.ITEM_HANDLER + LazyOptional；分面输入输出；invalidateCaps。
mcHint: 1.20.1+
sourceKind: authored
---

# 机器对外暴露 IItemHandler（Capability）

自写短文。玩家/实体挂载见平台 `mc-capability` skill；本文专指 **BlockEntity 给漏斗与管道**。

API 细节以 `search_forge_docs` / `query_api` 为准。工程化上下文可外链查阅：https://www.mcmod.cn/post/6071.html（禁转载，正文未写完 Capability 章时仍以官方为准）。

## 为什么只要 `getItemHandler()` 不够

| 调用方 | 通常怎么取库存 |
|--------|----------------|
| 自己的 Menu | 直接 `be.getItemHandler()`（同模组） |
| 原版漏斗、管道、物流模组 | `be.getCapability(ForgeCapabilities.ITEM_HANDLER, direction)` |

只写 public getter、不覆盖 `getCapability` → 玩家会报「漏斗塞不进去 / 管道抽不出」，机器「看起来不工作」。

## 最小暴露（全方向同一 handler）

```java
private final ItemStackHandler itemHandler = new ItemStackHandler(2) { /* … */ };
private LazyOptional<IItemHandler> lazyHandler = LazyOptional.of(() -> itemHandler);

@Override
public <T> LazyOptional<T> getCapability(Capability<T> cap, @Nullable Direction side) {
    if (cap == ForgeCapabilities.ITEM_HANDLER) {
        return lazyHandler.cast();
    }
    return super.getCapability(cap, side);
}

@Override
public void invalidateCaps() {
    super.invalidateCaps();
    lazyHandler.invalidate();
}

@Override
public void reviveCaps() {
    super.reviveCaps();
    lazyHandler = LazyOptional.of(() -> itemHandler);
}
```

- **永远**返回 `LazyOptional`，不要返回 null。  
- 区块卸载 / BE 移除时 `invalidate`，避免外部持有失效引用。  
- `isItemValid` 仍约束「哪些槽能手动/自动插入」。

## 分面输入 / 输出（生产常用）

漏斗从上方进、从下方抽时，应对不同 `Direction` 暴露不同视图，例如：

- 上方 / 侧面：只暴露输入槽（或 `RangedWrapper` / 自定义 `IItemHandlerModifiable`）  
- 下方：只暴露输出槽  

否则漏斗可能从输出槽再塞回去，或抽走未加工原料。

朝向方块时：用 `BlockState` 的 `FACING` 把「机器正面」映射到世界方向，再决定该面是输入还是输出。

## 与 Menu、WORKING 的关系

- Capability **不替代** GUI 槽位；Menu 继续绑同一 `ItemStackHandler`（或同一底层库存）。  
- 自动插入改变库存 → `onContentsChanged` → `setChanged()`；WORKING 仍在 **服务端 ticker** 里按「仅变化才 `setBlock`」更新（见 `authored/machine-be-gui-working`）。  
- 不要在客户端 `getCapability` 里改库存。

## 反模式

- ❌ Screen / 客户端每 tick `getCapability` 改进度条（进度用 `ContainerData`，见 `authored/menu-screen-sync`）  
- ❌ 只 `implementation` 了 handler 却忘了 `getCapability`  
- ❌ invalidate 后不 revive，区块重载后管道永久失效  
- ❌ 所有面同一可插满 handler，导致物流死循环

## 自检

- 漏斗对准输入面能进料、对准输出面能出料。  
- 卸掉管道模组后机器 GUI 仍正常。  
- `runServer` 无客户端类问题。

## 不清楚时

1. `search_forge_docs`：Capability / Item Handler  
2. 平台 skill：`mc-capability`  
3. 社区外链 stub：`links/mcmod-6071-forge-engineering`（打开原文，**勿整页拷贝**）
