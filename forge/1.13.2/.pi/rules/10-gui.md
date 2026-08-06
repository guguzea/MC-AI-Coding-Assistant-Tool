---
description: 10 — GUI / Container 开发
---

# 10 — GUI / Container 开发

> 适用版本：Forge 1.13.2

---

## 约束

### GUI 系统概述

Forge 1.13.2 使用基于 `Container` 和 `IGuiHandler` 的 GUI 系统：

```
Player interacts
      │
      ▼
Block#onBlockActivated (Server) ──► openGui ──► IGuiHandler
                                                       │
                                                       ▼
                                              Container + GuiScreen pair
```

### Container 注册

- `Container` 需要在服务端构造
- `ContainerType` 需要通过 `RegistryEvent.Register<Container>` 注册

### Dist 约束

- GUI 打开逻辑在**服务端**执行
- GUI 渲染在**客户端**执行
- 使用 `DistExecutor` 或 `FMLEnvironment.dist` 判断物理端

---

## Decision Flow

### Decision: Container/GUI 类型选择

```
IF 交互时需要持久数据存储（机器进度、箱子物品）
  → 使用 Container + ContainerType + GuiScreen

IF 只是显示 UI（无数据）
  → 直接使用 GuiScreen（无需 Container）

IF 需要物品栏槽位（多格容器）
  → Container（slot 管理 + transferStackInSlot）
```

---

## 示例：Container 注册

```java
// containers/ModContainers.java
public class ModContainers {
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
}
```

```java
// containers/MyContainer.java
public class MyContainer extends Container {
    private final MyTileEntity tileEntity;

    public MyContainer(int windowId, PlayerInventory inv, MyTileEntity te) {
        super(ModContainers.MY_CONTAINER, windowId);
        this.tileEntity = te;

        // 添加槽位
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
                // 从玩家物品栏 → 容器
                if (!this.mergeItemStack(stack1, 0, 27, false)) {
                    return ItemStack.EMPTY;
                }
            }

            if (stack1.getCount() == 0) {
                slot.putStack(ItemStack.EMPTY);
            } else {
                slot.onSlotChanged();
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

## 示例：IGuiHandler

```java
// gui/ModGuis.java
public class ModGuis {
    public static final int MY_GUI = 0;

    public static void register() {
        NetworkRegistry.INSTANCE.registerGuiHandler(ExampleMod.MOD_ID, new IGuiHandler() {
            @Override
            public Container createServerGui(int id, PlayerInventory inv, PacketBuffer data) {
                if (id == MY_GUI) {
                    BlockPos pos = data.readBlockPos();
                    TileEntity te = inv.player.getEntityWorld().getTileEntity(pos);
                    if (te instanceof MyTileEntity) {
                        return new MyContainer(id, inv, (MyTileEntity) te);
                    }
                }
                return null;
            }

            @Override
            public Object getClientGuiElement(int id, PlayerInventory inv, PacketBuffer data) {
                if (id == MY_GUI) {
                    BlockPos pos = data.readBlockPos();
                    TileEntity te = inv.player.getEntityWorld().getTileEntity(pos);
                    if (te instanceof MyTileEntity) {
                        return new MyGuiScreen(new MyContainer(id, inv, (MyTileEntity) te));
                    }
                }
                return null;
            }
        });
    }
}
```

## 示例：GuiScreen

```java
// gui/client/MyGuiScreen.java
public class MyGuiScreen extends GuiScreen {
    private final MyContainer container;
    private int containerWidth;
    private int containerHeight;

    public MyGuiScreen(MyContainer container) {
        this.container = container;
    }

    @Override
    public void init() {
        super.init();
        this.containerWidth = this.width / 2 - 80;
        this.containerHeight = this.height / 2 - 50;
    }

    @Override
    public void render(int mouseX, int mouseY, float partialTicks) {
        this.renderBackground();
        super.render(mouseX, mouseY, partialTicks);
        this.drawString(this.font, "My GUI", this.containerWidth + 60, this.containerHeight, 0xFFFFFF);
    }

    @Override
    protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY) {
        this.drawDefaultBackground();
    }

    @Override
    public boolean doesGuiPauseGame() {
        return true;
    }
}
```

## 示例：打开 GUI

```java
// 方块中右键打开 GUI
@Override
public boolean onBlockActivated(World world, BlockPos pos, BlockState state,
                              PlayerEntity player, Direction side,
                              float hitX, float hitY, float hitZ) {
    if (!world.isRemote) {
        player.openContainer(
            ExampleMod.MOD_ID,
            MY_GUI,
            buf -> buf.writeBlockPos(pos)
        );
    }
    return true;
}
```

---

## 常见错误

- ❌ 在服务端以外的物理端调用 `openContainer` → 必须在服务端执行
- ❌ `transferStackInSlot` 返回空导致物品丢失 → 始终实现完整的转移逻辑
- ❌ 在 `GuiScreen` 中修改服务端数据 → 使用网络包同步
- ❌ Container 的 `canInteractWith` 始终返回 true → 添加距离检查
