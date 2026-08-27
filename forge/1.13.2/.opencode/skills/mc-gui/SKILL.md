---
name: mc-gui
description: Minecraft Forge GUI/Container。IInteractionObject、NetworkHooks.openGui、GuiContainer、IGuiHandler。触发词：GuiContainer、IGuiHandler、NetworkHooks、ExtensionPoint.GUIFACTORY
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# GUI/Container 开发（Forge 1.13.2）

本档 **没有** `ContainerType` / `IForgeContainerType`。**没有** `player.openContainer(modid, id, PacketBuffer)`。客户端工厂是 `ExtensionPoint.GUIFACTORY`。名字是 `EntityPlayer` / `InventoryPlayer`，不是 `PlayerEntity`。

## Decision: 是否需要 Container

```
IF 交互时需要持久数据 / 槽位
  → Container + IInteractionObject + GuiContainer
  → 服务端 NetworkHooks.openGui(EntityPlayerMP, IInteractionObject, pos)

IF 只是显示 UI（无数据）
  → GuiScreen + 自己发包（见 06）
```

## 打开 GUI（已核 NetworkHooks）

```java
if (!world.isRemote && player instanceof EntityPlayerMP) {
    NetworkHooks.openGui((EntityPlayerMP) player, (IInteractionObject) te, pos);
}
```

`IInteractionObject`：`createContainer(InventoryPlayer, EntityPlayer)` + `getGuiID()`。

客户端：`ModLoadingContext.registerExtensionPoint(ExtensionPoint.GUIFACTORY, ...)` 返回 `GuiContainer`。

旧 `IGuiHandler` 仍是 `getServerGuiElement(int, EntityPlayer, World, int, int, int)`。不要编 `createServerGui(..., PacketBuffer)`。

容器屏继承 **`GuiContainer`**，实现 `drawGuiContainerBackgroundLayer`。不要把该方法写在裸 `GuiScreen` 上。

详见 `10-gui.mdc`。
