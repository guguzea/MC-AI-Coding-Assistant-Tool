---
name: mc-gui
description: Minecraft Forge GUI/菜单开发。创建自定义 Container、Screen、IInventory 数据同步。触发词：Screen、Container、IContainer、ContainerScreen、transferStackInSlot
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# GUI/菜单开发（Forge 1.14.4）

## Decision: 是否需要 Container

```
IF 交互时需要持久数据存储（机器进度、箱子物品）
  → 使用 Container + IInventory + ContainerScreen

IF 只是显示 UI（无数据）
  → 直接使用 Screen（无需 Container）

IF 需要物品栏槽位（多格容器）
  → Container（slot 管理 + transferStackInSlot）
```

## 完整示例：方块交互打开 GUI

### 1. TileEntity 实现 IInventory

```java
public class MyBE extends TileEntity implements IInventory {
    private ItemStack[] inventory = new ItemStack[9];

    @Override
    public int getSizeInventory() { return 9; }

    @Override
    public ItemStack getStackInSlot(int index) {
        return inventory[index];
    }

    @Override
    public ItemStack decrStackSize(int index, int count) {
        ItemStack stack = getStackInSlot(index);
        if (!stack.isEmpty()) {
            if (stack.getCount() <= count) {
                setInventorySlotContents(index, ItemStack.EMPTY);
            } else {
                stack.shrink(count);
            }
        }
        return stack;
    }

    @Override
    public void setInventorySlotContents(int index, ItemStack stack) {
        inventory[index] = stack;
        markDirty();
    }

    @Override
    public boolean isEmpty() {
        for (ItemStack stack : inventory) {
            if (!stack.isEmpty()) return false;
        }
        return true;
    }
}
```

### 2. 实现 Container

```java
public class MyContainer extends Container {
    private final IInventory tileInventory;

    public MyContainer(int windowId, PlayerInventory playerInv, IInventory tileInv) {
        super(null, windowId);
        this.tileInventory = tileInv;
        // 添加槽位
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 9; col++) {
                this.addSlot(new Slot(tileInv, col + row * 9, 8 + col * 18, 18 + row * 18));
            }
        }
        // 玩家物品栏
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 9; col++) {
                this.addSlot(new Slot(playerInv, col + row * 9, 8 + col * 18, 84 + row * 18));
            }
        }
    }

    // Shift-点击转移物品
    @Override
    public ItemStack transferStackInSlot(PlayerEntity player, int index) {
        ItemStack stack = ItemStack.EMPTY;
        Slot slot = this.inventorySlots.get(index);

        if (slot != null && slot.getHasStack()) {
            ItemStack stack1 = slot.getStack();
            stack = stack1.copy();

            if (index < 9) {  // 从 TileEntity 到玩家
                if (!mergeItemStack(stack1, 9, 36, true)) {
                    return ItemStack.EMPTY;
                }
                slot.onSlotChange(stack1, stack);
            } else {  // 从玩家到 TileEntity
                if (!mergeItemStack(stack1, 0, 9, false)) {
                    return ItemStack.EMPTY;
                }
            }

            if (stack1.isEmpty()) {
                slot.putStack(ItemStack.EMPTY);
            } else {
                slot.onSlotChanged();
            }
        }
        return stack;
    }

    @Override
    public boolean canInteractWith(PlayerEntity player) {
        return tileInventory.isUsableByPlayer(player);
    }
}
```

### 3. 注册 ContainerType

```java
public static final ContainerType<MyContainer> MY_CONTAINER =
    IForgeContainerType.create((windowId, inv, extraData) -> {
        IWorld world = inv.player.world;
        BlockPos pos = extraData.readBlockPos();
        TileEntity tile = world.getTileEntity(pos);
        if (tile instanceof MyBE) {
            return new MyContainer(windowId, inv, (IInventory) tile);
        }
        return null;
    });

@SubscribeEvent
public static void onContainerRegistry(final RegistryEvent.Register<IContainer>> event) {
    event.getRegistry().register(
        MY_CONTAINER.setRegistryName(new ResourceLocation(MOD_ID, "my_container"))
    );
}
```

### 4. 方块绑定

```java
public class MyBlock extends Block {
    @Override
    public boolean onBlockActivated(World world, BlockPos pos, BlockState state,
            PlayerEntity player, Hand hand, RayTraceResult hit) {
        if (!world.isRemote) {
            TileEntity tile = world.getTileEntity(pos);
            if (tile instanceof MyBE) {
                NetworkHooks.openGui((ServerPlayerEntity) player, tile);
            }
        }
        return true;
    }
}
```

### 5. 客户端 Screen 注册

```java
@Mod.EventBusSubscriber(modid = MOD_ID, value = Dist.CLIENT, bus = Mod.EventBusSubscriber.Bus.MOD)
public class ClientSetup {
    @SubscribeEvent
    public static void init(FMLClientSetupEvent event) {
        ScreenManager.registerFactory(
            ModContainers.MY_CONTAINER, MyScreen::new
        );
    }
}
```

### 6. Screen 类（CLIENT ONLY）

```java
public class MyScreen extends ContainerScreen<MyContainer> {
    public MyScreen(MyContainer container, PlayerInventory playerInv, ITextComponent title) {
        super(container, playerInv, title);
    }

    @Override
    protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY) {
        // blit 在 this.guiLeft / this.guiTop 位置绘制背景 PNG
        this.blit(this.guiLeft, this.guiTop, 0, 0, this.xSize, this.ySize);
    }
}
```

## 常见错误

- ❌ `Container` vs `AbstractContainerMenu`：1.14.4 用 `Container`
- ❌ `IInventory` vs `Container`：1.14.4 用 `IInventory`
- ❌ `IContainer` vs `ContainerType`：注意正确的类名
- ❌ `transferStackInSlot` 返回空导致物品丢失 → 始终实现完整的转移逻辑
- ❌ `canInteractWith` 返回 false → GUI 无法打开

## 参考资料

- 详细示例：参见 `10-gui.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | ContainerType 需要 RegistryEvent 注册 |
| `mc-item` | 物品栏槽位中的 ItemStack 交互 |
| `mc-capability` | TileEntity 可附加 Capability 管理自定义数据 |
