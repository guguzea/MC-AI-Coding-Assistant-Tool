---
name: mc-gui
description: Minecraft Forge GUI/菜单开发。创建 Container、Slot、IInteractionObject、GuiHandler。触发词：Screen、Container、Slot、GuiHandler、IInteractionObject
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# GUI/菜单开发（Forge 1.12.2）

## Decision: 是否需要 Container

```
IF 交互时需要持久数据存储（机器进度、箱子物品）
  → 使用 Container + IGuiHandler

IF 只是显示 UI（无数据）
  → 直接使用 GuiScreen（无需 Container）

IF 需要物品栏槽位（多格容器）
  → Container（slot 管理 + transferStackInSlot）
```

## 完整示例：方块交互打开 GUI

### 1. 创建 Container

```java
public class MyContainer extends Container {
    private final IInventory tile;

    public MyContainer(IInventory playerInv, IInventory tileInv) {
        this.tile = tileInv;

        // 玩家物品栏
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 9; col++) {
                this.addSlot(new Slot(playerInv, col + row * 9 + 9, 8 + col * 18, 84 + row * 18));
            }
        }

        // 玩家快捷栏
        for (int col = 0; col < 9; col++) {
            this.addSlot(new Slot(playerInv, col, 8 + col * 18, 142));
        }

        // 方块物品栏
        for (int row = 0; row < 3; row++) {
            for (int col = 0; col < 3; col++) {
                this.addSlot(new Slot(tileInv, col + row * 3, 62 + col * 18, 17 + row * 18));
            }
        }
    }

    @Override
    public ItemStack transferStackInSlot(PlayerEntity player, int index) {
        // Shift-click 逻辑
        return ItemStack.EMPTY;
    }

    @Override
    public boolean canInteractWith(PlayerEntity player) {
        return tile.isUsableByPlayer(player);
    }
}
```

### 2. 注册 GuiHandler

```java
public class GuiHandler implements IGuiHandler {
    @Override
    public Object getServerGuiElement(int ID, EntityPlayer player, World world, int x, int y, int z) {
        TileEntity tile = world.getTileEntity(new BlockPos(x, y, z));
        if (tile instanceof MyTileEntity) {
            return new MyContainer(player.inventory, (IInventory) tile);
        }
        return null;
    }

    @Override
    public Object getClientGuiElement(int ID, EntityPlayer player, World world, int x, int y, int z) {
        TileEntity tile = world.getTileEntity(new BlockPos(x, y, z));
        if (tile instanceof MyTileEntity) {
            return new MyGui(new MyContainer(player.inventory, (IInventory) tile), player.inventory);
        }
        return null;
    }
}
```

### 3. 在 FMLInitializationEvent 中注册

```java
@Mod.EventHandler
public void init(FMLInitializationEvent event) {
    NetworkRegistry.INSTANCE.registerGuiHandler(MOD_ID, new GuiHandler());
}
```

### 4. 方块打开 GUI

```java
@Override
public boolean onBlockActivated(World world, BlockPos pos, IBlockState state,
                                EntityPlayer player, EnumHand hand,
                                EnumFacing facing, float hitX, float hitY, float hitZ) {
    if (!world.isRemote) {
        player.openGui(MOD_ID, 0, world, pos.getX(), pos.getY(), pos.getZ());
    }
    return true;
}
```

### 5. GuiScreen（客户端）

```java
@SideOnly(Side.CLIENT)
public class MyGui extends GuiScreen {
    private final Container container;
    private final IInventory playerInventory;

    public MyGui(Container container, IInventory playerInventory) {
        this.container = container;
        this.playerInventory = playerInventory;
    }

    @Override
    public void drawScreen(int mouseX, int mouseY, float partialTicks) {
        this.drawDefaultBackground();
        super.drawScreen(mouseX, mouseY, partialTicks);
        this.renderHoveredToolTip(mouseX, mouseY);
    }

    @Override
    protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY) {
        drawRect(x, y, x + 176, y + 166, 0xFF000000);
    }
}
```

## 常见错误

- ❌ `GuiHandler` 在服务端调用 → 只在客户端有效果
- ❌ `transferStackInSlot` 返回空导致物品丢失 → 始终实现完整的转移逻辑
- ❌ `canInteractWith` 始终返回 true → 添加距离检查

## 参考资料

- 详细示例：参见 `10-gui.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-registry` | GUI 元素注册 |
| `mc-item` | 物品栏槽位中的 ItemStack 交互 |
| `mc-capability` | Container 可附加 Capability 管理自定义数据 |
