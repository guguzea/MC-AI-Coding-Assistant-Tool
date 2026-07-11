---
name: mc-gui
description: Minecraft Forge GUI/Container 开发。创建自定义 Container、IGuiHandler、GuiScreen。触发词：Screen、Container、ContainerType、IGuiHandler、GuiScreen、openContainer
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# GUI/Container 开发（Forge 1.13.2）

## Decision: 是否需要 Container

```
IF 交互时需要持久数据存储（机器进度、箱子物品）
  → 使用 Container + ContainerType + GuiScreen

IF 只是显示 UI（无数据）
  → 直接使用 GuiScreen（无需 Container）

IF 需要物品栏槽位（多格容器）
  → Container（slot 管理 + transferStackInSlot）
```

## 完整示例：方块交互打开 GUI

### 1. 注册 ContainerType

```java
public static ContainerType<MyContainer> MY_CONTAINER;

public static void register() {
    MY_CONTAINER = IForgeContainerType.create((windowId, inv, data) -> {
        BlockPos pos = data.readBlockPos();
        TileEntity te = inv.player.getEntityWorld().getTileEntity(pos);
        if (te instanceof MyTileEntity) {
            return new MyContainer(windowId, inv, (MyTileEntity) te);
        }
        return null;
    });
    MY_CONTAINER.setRegistryName(new ResourceLocation(MOD_ID, "my_container"));
}
```

### 2. 实现 Container

```java
public class MyContainer extends Container {
    private final MyTileEntity tileEntity;

    public MyContainer(int windowId, PlayerInventory inv, MyTileEntity te) {
        super(ModContainers.MY_CONTAINER, windowId);
        this.tileEntity = te;

        // 添加槽位（示例：3 行 9 列容器 = 27 格）
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 9; col++) {
                this.addSlot(new Slot(inv, col + row * 9, 8 + col * 18, 18 + row * 18));
            }
        }
    }

    @Override
    public ItemStack transferStackInSlot(PlayerEntity player, int index) {
        ItemStack stack = ItemStack.EMPTY;
        Slot slot = this.inventorySlots.get(index);
        if (slot != null && slot.getHasStack()) {
            ItemStack stack1 = slot.getStack();
            stack = stack1.copy();
            // 从容器 → 玩家物品栏
            if (index < 27) {
                if (!this.mergeItemStack(stack1, 27, 36, false)) {
                    return ItemStack.EMPTY;
                }
            } else {
                if (!this.mergeItemStack(stack1, 0, 27, false)) {
                    return ItemStack.EMPTY;
                }
            }
        }
        return stack;
    }

    @Override
    public boolean canInteractWith(PlayerEntity player) {
        return tileEntity.isUsableByPlayer(player);
    }
}
```

### 3. IGuiHandler

```java
public static void register() {
    NetworkRegistry.INSTANCE.registerGuiHandler(MOD_ID, new IGuiHandler() {
        @Override
        public Container createServerGui(int id, PlayerInventory inv, PacketBuffer data) {
            BlockPos pos = data.readBlockPos();
            TileEntity te = inv.player.getEntityWorld().getTileEntity(pos);
            if (te instanceof MyTileEntity) {
                return new MyContainer(id, inv, (MyTileEntity) te);
            }
            return null;
        }

        @Override
        public Object getClientGuiElement(int id, PlayerInventory inv, PacketBuffer data) {
            BlockPos pos = data.readBlockPos();
            TileEntity te = inv.player.getEntityWorld().getTileEntity(pos);
            if (te instanceof MyTileEntity) {
                return new MyGuiScreen(new MyContainer(id, inv, (MyTileEntity) te));
            }
            return null;
        }
    });
}
```

### 4. GuiScreen

```java
public class MyGuiScreen extends GuiScreen {
    private final MyContainer container;

    public MyGuiScreen(MyContainer container) {
        this.container = container;
    }

    @Override
    public void init() {
        super.init();
    }

    @Override
    public void render(int mouseX, int mouseY, float partialTicks) {
        this.renderBackground();
        super.render(mouseX, mouseY, partialTicks);
    }

    @Override
    protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY) {
        this.drawDefaultBackground();
    }
}
```

### 5. 打开 GUI

```java
@Override
public boolean onBlockActivated(World world, BlockPos pos, BlockState state,
                              PlayerEntity player, Direction side,
                              float hitX, float hitY, float hitZ) {
    if (!world.isRemote) {
        player.openContainer(MOD_ID, MY_GUI_ID, buf -> buf.writeBlockPos(pos));
    }
    return true;
}
```

## 常见错误

- ❌ `openContainer` 在客户端调用 → 必须在服务端执行
- ❌ `transferStackInSlot` 返回空导致物品丢失 → 完整实现转移逻辑
- ❌ `canInteractWith` 始终返回 true → 添加距离检查

## 参考资料

- 详细示例：参见 `10-gui.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | ContainerType 需要注册 |
| `mc-item` | 物品栏槽位中的 ItemStack 交互 |
| `mc-block` | 方块中实现 onBlockActivated 打开 GUI |
