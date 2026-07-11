---
name: mc-gui
description: Minecraft Forge GUI/Container 开发（Forge 1.13.2）。创建 Container、IGuiHandler。
---

# GUI/Container 开发（Forge 1.13.2）

## 快速开始

```java
public class MyContainer extends Container {
    public MyContainer(int windowId, PlayerInventory inv, MyTileEntity te) {
        super(ModContainers.MY_CONTAINER, windowId);
        // 添加槽位...
    }
}
```

## 参考资料

- 详细示例：参见 `10-gui.mdc`
