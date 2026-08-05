---
id: authored/machine-be-gui-working
title: 机器方块：BE、GUI、库存与 WORKING 状态
tags: [blockentity, menu, screen, itemstackhandler, machine, forge, ticker, capability]
summary: 机器全链路；进度必须用 ContainerData；WORKING 仅在 ticker 对比后 setBlock；对外物流需 ITEM_HANDLER Capability。
mcHint: 1.20.1+
sourceKind: authored
---

# 机器方块：BE、GUI、库存与 WORKING 状态

自写短文。关联：

- GUI 进度同步：`authored/menu-screen-sync`（**必读**，勿只看本文「打开 GUI」）  
- BE 存盘 / ticker：`authored/blockentity-persist-ticker`  
- 漏斗 / 管道：`authored/itemhandler-capability`  
- 多面模型：`authored/multi-face-block-models`  

深读工程化叙事（禁转载，仅浏览）：https://www.mcmod.cn/post/6071.html  

API 以 `search_forge_docs` / `query_api` 为准。

## 总览链路

```
方块(EntityBlock) + BlockEntityType
    → BE：NBT 库存 / 进度 / 状态判断
    → getCapability(ITEM_HANDLER) → 漏斗与管道
    → 右键：服务端 NetworkHooks.openScreen
    → Menu + addDataSlots(ContainerData) → 进度条等 int 同步
    → 客户端 Screen（只画；读 Menu 数据槽，不每 tick 抠 BE）
    → BooleanProperty WORKING ← 仅服务端 ticker 内「变了才 setBlock」
```

## BlockEntity 基础

- Block = 类型与状态属性；BE = 该坐标的动态数据与 tick。  
- 注册 `BlockEntityType`，方块 `newBlockEntity` 返回实例。  
- **BE 默认不 tick**：方块 `getTicker` 里接入；生产逻辑 **仅服务端**（`isClientSide` 则 `return null`）。

### 持久化

| 写入 NBT | 不要写 |
|----------|--------|
| 库存、加工进度、需跨存档的开关 | 可重算 cache、纯客户端动画 |

改数据后 `setChanged()`。

## 库存：ItemStackHandler

```java
private static final int INPUT_SLOT = 0;
private static final int OUTPUT_SLOT = 1;

private final ItemStackHandler itemHandler = new ItemStackHandler(2) {
    @Override protected void onContentsChanged(int slot) { setChanged(); }
    @Override public boolean isItemValid(int slot, @NotNull ItemStack stack) {
        return slot == INPUT_SLOT;
    }
};
```

- Menu 可用 `getItemHandler()`。  
- **对外物流必须再暴露 Capability**（见 `authored/itemhandler-capability`），否则漏斗/管道不工作。  
- 破坏掉落：拷到 `SimpleContainer` 再 `dropContents`；`onRemove` 仅在方块类型真变时掉落（WORKING 翻转不掉落）。

## 打开 GUI（只是第一步）

- `MenuProvider` + 服务端 `NetworkHooks.openScreen`。  
- Screen 仅客户端注册（`Dist.CLIENT`）。

### 进度条 / 烧炼时间（生产级必做）

❌ **反模式**：Screen 每帧 `be.getProgress()` 或客户端直接读 BE 字段画进度条。  

✅ **正确**：BE 侧用 `ContainerData`（或等价）暴露 int；Menu 构造里 **`addDataSlots(data)`**；Screen 只读 Menu/数据槽。  

细节与双构造器、`SimpleContainerData` 占位：→ **`authored/menu-screen-sync`**。

## WORKING（或 LIT）写回

资源系统读的是 **BlockState**，不是 BE 私有 boolean。

### Ticker 末尾推荐写法

```java
public void tick() {
    // …库存 / 配方 / 进度（仅服务端）…

    boolean should = shouldBeWorking();
    BlockState state = level.getBlockState(worldPosition);
    if (state.hasProperty(WORKING) && state.getValue(WORKING) != should) {
        level.setBlock(worldPosition, state.setValue(WORKING, should), 3);
    }
}
```

要点：

1. **每个服务端 tick 判断一次**（或逻辑末尾一次），不要在「每次槽位变化」里无条件狂发 `setBlock`。  
2. **仅当与当前 BlockState 不同**才 `setBlock`（避免 20 次/秒空更新与刷包）。  
3. flag `3`：常见邻接通知 + 客户端同步（位含义以当前版本为准）。  
4. `shouldBeWorking()` 集中条件（原料、能量、红石…），便于扩展。  
5. `blockstates`：`facing` × `working`；通常 2 个模型 + `y` 旋转。

## 自检（照着写少崩溃）

- [ ] 漏斗能进/出（Capability 已挂）  
- [ ] GUI 进度与服务器一致（`addDataSlots`）  
- [ ] Screen 未直接每 tick 读 BE 进度  
- [ ] WORKING 切换不卡顿、不掉库存  
- [ ] 存档重进库存与进度仍在  
- [ ] `runServer` 可启动  

## 不清楚时

打开上述关联短文与外链原文；方法签名用 `query_api` / `search_forge_docs`，**不要臆造 API**。
