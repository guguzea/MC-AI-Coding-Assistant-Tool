---
id: authored/menu-screen-sync
title: Menu / Screen 与 ContainerData 同步
tags: [menu, screen, containerdata, gui, networkhooks, forge]
summary: Menu 与 Screen 职责；双构造器与 FriendlyByteBuf；ContainerData；槽位分区与 quickMoveStack；stillValid；ClientSetup 注册。
mcHint: 1.20.1+
sourceKind: authored
---

# Menu / Screen 与 ContainerData 同步

自写短文。机器总览见 `authored/machine-be-gui-working`。

## 职责分离

| 类型 | 运行位置 | 职责 |
|------|----------|------|
| `AbstractContainerMenu` | 逻辑侧（服+客各有） | 槽位、点击、与 BE 绑定、数据槽同步 |
| `AbstractContainerScreen` | **仅客户端** | 贴图、标签、tooltip；必须依附 Menu |

把 Screen 放进服务端会加载的类 → 缺 `net.minecraft.client.*` 直接崩。

## 打开链路

1. 注册 `MenuType`（常 `IForgeMenuType.create` / 项目封装的 `registerMenuType`）。  
2. BE 实现 `MenuProvider`：`createMenu(id, playerInv, player)`。  
3. 服务端 `NetworkHooks.openScreen(serverPlayer, provider, pos)`（或等价），把额外数据写入缓冲。  
4. 客户端 `MenuScreens.register(type, Screen::new)`（`FMLClientSetupEvent` + `Dist.CLIENT`）。

## 双构造器模式（方块菜菜单）

- **服务端**：`Menu(id, inv, be, data)` — 直接持有 BE 与真实 `ContainerData`。  
- **客户端**：`Menu(id, inv, FriendlyByteBuf buf)` — 从 buf `readBlockPos()` 取 BE，数据槽可用 `SimpleContainerData(n)` 占位再由同步填充。

工厂交给 `MenuType` 注册，保证网络打开时能构造客户端 Menu。

## ContainerData

- 不是「第二个库存」，而是 **一组 int 的读写桥**（进度、烧炼时间、能量等）。  
- 在 Menu 构造里 **`addDataSlots(data)`** 后才参与同步；只定义接口不 add → 客户端永远是默认值。  
- 只同步 GUI 需要显示且会变的值；大结构仍用库存同步。

### 反模式（进度条）

```text
❌ Screen.render / tick 里：machineBe.getProgress()
✅ Screen 读 Menu 已同步的 data 槽（或 Menu 提供的 getter，其背后是 ContainerData）
```

客户端每 tick 抠 BE：轻则不同步，重则错误线程假设与多余访问。烧炼进度、能量条一律走数据槽。

服务端 Menu 持有「连到 BE 字段」的 `ContainerData`；客户端打开时常用 `SimpleContainerData(n)` 占位，由原版菜单同步填充。

## 槽位与 quickMoveStack

- 机器槽：`SlotItemHandler(handler, index, x, y)`，坐标对齐 GUI 贴图。  
- 玩家背包：通常 27 格（索引从 9 起）+ 快捷栏 0–8；全部进同一 `slots` 列表。  
- `quickMoveStack`：按 index 分区（机器 / 背包 / 快捷栏）调用 `moveItemStackTo`。  
  - Shift 从背包 → 多只进输入槽；  
  - Shift 从输出 → 优先快捷栏再背包。  
- 用常量 `TE_SLOT_COUNT` 推导区间，避免魔法数字。

## stillValid

检查：方块仍在、玩家距离足够（可考虑触及距离属性）。返回 false 会关闭界面。

## Screen 绘制

- 贴图：`textures/gui/container/….png`（路径按项目约定）。  
- `imageWidth` / `imageHeight` 与贴图一致。  
- `renderBg`：`GuiGraphics.blit`；`render`：背景遮罩 → `super` → `renderTooltip`。  
- `init` 里可调 `titleLabelX/Y`、`inventoryLabelX/Y`。

## 自检

- 专用服启动成功。  
- 双端打开 GUI 进度条一致。  
- Shift 点击不会把物品塞进输出槽（若 `isItemValid` 禁止）。

## 不清楚时

- 机器总览：`authored/machine-be-gui-working`  
- 原文工程化（禁转载，仅浏览）：https://www.mcmod.cn/post/6071.html  
- API：`search_forge_docs` / `query_api`（Menu、ContainerData、AbstractContainerScreen）
