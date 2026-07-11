---
name: gui
description: Minecraft Forge GUI/Container 开发（Forge 1.13.2）。Container、IGuiHandler、GuiScreen。触发词：Screen、Container、IGuiHandler、GuiScreen、openContainer
---

# GUI/Container 开发（Forge 1.13.2）

## 完整示例

```java
// Container
public class MyContainer extends Container {
    public MyContainer(int windowId, PlayerInventory inv, MyTileEntity te) {
        super(ModContainers.MY_CONTAINER, windowId);
        // 添加槽位...
    }
}

// IGuiHandler
NetworkRegistry.INSTANCE.registerGuiHandler(MOD_ID, new IGuiHandler() {
    @Override
    public Container createServerGui(int id, PlayerInventory inv, PacketBuffer data) {
        return new MyContainer(id, inv, te);
    }

    @Override
    public Object getClientGuiElement(int id, PlayerInventory inv, PacketBuffer data) {
        return new MyGuiScreen(new MyContainer(id, inv, te));
    }
});

// 打开 GUI
player.openContainer(MOD_ID, GUI_ID, buf -> buf.writeBlockPos(pos));
```

## 常见错误

- ❌ `openContainer` 在客户端调用
- ❌ `transferStackInSlot` 返回空

## 参考资料

- 详细示例：参见 `10-gui.mdc`
